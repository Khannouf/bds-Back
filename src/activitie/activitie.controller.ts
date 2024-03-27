import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateActivitieDto } from './dto/create-activitieDto';
import { ActivitieService } from './activitie.service';
import { Admin, UserDecorator } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterActivitieDto } from './dto/register-activitieDto';

@Controller('activitie')
export class ActivitieController {
  constructor(private readonly activitieService: ActivitieService) {}
  @Admin()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createActivitieDto: CreateActivitieDto,
    @UserDecorator() userDecorator,
    @UploadedFile() file,
  ) {
    return this.activitieService.create(createActivitieDto, userDecorator, file);
  }

  @Get()
  async getAllActivities(){
    return this.activitieService.getAllActivities();
  }

  @Get(':id')
  async getActivitie(@Param('id') id: number){
    return this.activitieService.getActivitie(+id)
  }

  @Admin()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  /*@UseInterceptors(FileInterceptor('image'))*/
  async updateActivitie(@Param('id') id: number, @Body() createActivitieDto: CreateActivitieDto/*, @UploadedFile() file*/){
    return this.activitieService.updateActivitie(+id, createActivitieDto/*, file*/)
  }

  @Admin()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteActivitie(@Param() registerActivitieDto: RegisterActivitieDto){
    return this.activitieService.deleteActivitie(registerActivitieDto)
  }
  

  @UseGuards(JwtAuthGuard)
  @Post('register')
  registerActivitie(@Body() registerActivitieDto: RegisterActivitieDto, @UserDecorator() userDecorator){
    return this.activitieService.registerActivitie(registerActivitieDto, userDecorator)
  }

  @UseGuards(JwtAuthGuard)
  @Post('register/already')
  alreadyRegister(@Body() registerActivitieDto: RegisterActivitieDto, @UserDecorator() userDecorator){
    return this.activitieService.alreadyRegister(registerActivitieDto, userDecorator)
  }

  @Admin()
  @UseGuards(JwtAuthGuard)
  @Get('participants/:id')
  allParticipants(@Param() registerActivitieDto: RegisterActivitieDto){    
    return this.activitieService.allParticipants(registerActivitieDto)
  }
}
