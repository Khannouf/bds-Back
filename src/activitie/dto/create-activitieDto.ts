import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateActivitieDto {
  //import { CreateCategorieDto } from 'src/categorie/dto/create-categorie.dto';
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  addresse: string;
  @ApiProperty()
  @IsNotEmpty()
  prix: string;
  @ApiProperty()
  @IsNotEmpty()
  dateDeb: Date;
  @ApiProperty()
  @IsNotEmpty()
  dateFin: Date;
  // @ApiProperty()
  // @IsNotEmpty()
  // creatorId: string;
}
