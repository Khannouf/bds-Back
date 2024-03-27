import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserClassEnum, UserFilEnum } from 'src/enums/user-role.enum';

export class UpdateUserDto {
  //import { CreateCategorieDto } from 'src/categorie/dto/create-categorie.dto';
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserClassEnum)
  classe: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserFilEnum)
  filiere: string;
}
