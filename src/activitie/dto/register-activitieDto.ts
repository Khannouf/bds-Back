import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterActivitieDto {
  //import { CreateCategorieDto } from 'src/categorie/dto/create-categorie.dto';
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  // @ApiProperty()
  // @IsNotEmpty()
  // creatorId: string;
}
