import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { registerDto } from 'src/user/dto/registerDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { User } from '@prisma/client';
import { EditToAdminDto } from './dto/edit-to-adminDto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async getAllUsers() {
    try {
      const users = await this.prismaService.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          classe: true,
          filiere: true,
          roles: true,
        },
      });
      return {data : users, type : "success"};
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUser(id: number, userDecorator: User) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userReturn } = user;
      if(userDecorator.id === id || userDecorator.roles === "admin"){
        return userReturn;
      }else{
        return "Vous n'avez pas accès a cette donnée"
      }
    } catch (e) {
      throw new Error(e);
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async register(registerDto: registerDto) {
    const { firstName, lastName, email, password, classe, filiere } =
      registerDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) throw new ConflictException("l'utilisateur existe déja");
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.prismaService.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          classe,
          filiere,
        },
      });

      //envoi email de confirmation
      await this.mailerService.sendSignupConfirmation(email)
      return {user: user, type: "success"}; 
    } catch (e) {
      return e;
      throw new Error('e');
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async edit(id: number, updateUserDto: UpdateUserDto, userDecorator: User) {
    try {
      await this.prismaService.user.findUnique({
        where: { id },
      });
    } catch (e) {
      return "le compte que vous souhaitez modifié n'existe pas";
    }
    try {      
      if(userDecorator.id == id || userDecorator.roles === "admin"){
        await this.prismaService.user.update({
          where: { id },
          data: updateUserDto,
        });
        return updateUserDto;
      }else{
        return "Vous n'avez pas les droits accès à acette donnée"
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async editToAdmin(id: number, editToAdminDto: EditToAdminDto) {
    await this.prismaService.user.update({
      where: { id },
      data: editToAdminDto,
    }).catch(() => {
      throw new NotFoundException("le compte que vous souhaitez passer en Administrateur n'existe pas")
    })
    return {data : editToAdminDto, type : "success"};
  }

  async delete(id: number) {
    try {
      await this.prismaService.user.findUnique({
        where: { id },
      });
    } catch (e) {
      return "le compte que vous souhaitez supprimé n'existe pas";
    }
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
      return 'le compte a bien été supprimé';
    } catch (e) {
      throw new Error(e);
    }
  }
}
