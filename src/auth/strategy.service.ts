import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "src/prisma/prisma.service";

type Payload = {
  sub: number,
  prenom: string,
  nom: string,
  email: string,
  classe: string,
  fiiere: string,
};


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private readonly configService: ConfigService, private readonly prismaServica: PrismaService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("SECRET_KEY"),
      ignoreExpiration: false,
    });
  }
  
  async validate(payload: Payload){
    const user = await this.prismaServica.user.findUnique({ where: {email: payload.email}})
    if (!user) throw new UnauthorizedException("vous n'êtes pas autorisé à utiliser cette route")
    return user
  }
}