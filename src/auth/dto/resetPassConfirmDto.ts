import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class resetPassConfirmDto {
  //import { CreateCategorieDto } from 'src/categorie/dto/create-categorie.dto';
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  code: string;

}
