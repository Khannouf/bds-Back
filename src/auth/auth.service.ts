import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { loginDto } from './dto/loginDto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { resetPassDto } from './dto/resetPassDto';
import { resetPassConfirmDto } from './dto/resetPassConfirmDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async login(LoginDto: loginDto) {
    const { email, password } = LoginDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) return { type: 'fail' };
    const match = await bcrypt.compare(password, user.password);
    if (!match) return { type: 'fail' };
    const payload = {
      sub: user.id,
      prenom: user.firstName,
      nom: user.lastName,
      email: user.email,
      classe: user.classe,
      fiiere: user.filiere,
      role: user.roles,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '2h',
      secret: this.configService.get('SECRET_KEY'),
    });
    return {
      token: token,
      type: 'success',
      user: {
        sub: user.id,
        prenom: user.firstName,
        nom: user.lastName,
        email: user.email,
        classe: user.classe,
        fiiere: user.filiere,
        role: user.roles,
      },
    };
  }

  async resetPassword(ResetPassDto: resetPassDto) {
    const { email } = ResetPassDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException("l'utilisateur n'a pas été trouvé");
    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    //envoyer url d'un front qui va mener vers une véritabme interface
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.mailerService.sendResetPassword(email, url, code);
    return { data: 'la reinitialisation du mdp vous a été envoyé' };
  }

  //fonction à mettre pour le reset du password en demandant l'email, le nouveau mdp et le code envoyé par mail
  async resetPasswordConfirmation(ResetPassConfirmDto: resetPassConfirmDto) {
    const { email, password, code } = ResetPassConfirmDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    const match = speakeasy.totp.verify({
      secret: this.configService.get('OTP_CODE'),
      token: code,
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    if (!match) throw new UnauthorizedException('Code Invalid ou expiré');
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prismaService.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return { data: 'Password updated' };
  }
}
