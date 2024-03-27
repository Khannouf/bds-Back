import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  uploadFile(@UploadedFile() file, @Res() res){
    console.log(file);
    
  }

  @Get('imgpath')
  seeUploadeadFile(@Param('imgpath') image, @Res() res){
    return res.sendFile(image, {root: './src/uploads'})
  }
}
