import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class EditToAdminDto {
  //import { CreateCategorieDto } from 'src/categorie/dto/create-categorie.dto';
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  roles: string;
}
