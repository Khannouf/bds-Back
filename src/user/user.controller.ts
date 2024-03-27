import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { registerDto } from 'src/user/dto/registerDto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Admin, UserDecorator } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EditToAdminDto } from './dto/edit-to-adminDto';

@Controller('user')
export class UserController {
  constructor( private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getUser(@Param('id') id: number, @UserDecorator() userDecorator) {   
    console.log(userDecorator);
    return this.userService.getUser(+id, userDecorator)
  }
  @Admin()
  @UseGuards(JwtAuthGuard)
  @Get("")
  getAll() {
    return this.userService.getAllUsers()
  }

  @Post("")
  register(@Body() RegisterDto: registerDto) {
    return this.userService.register(RegisterDto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  edit(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @UserDecorator() userDecorator) {
    return this.userService.edit(+id, updateUserDto, userDecorator)
  }

  @Admin()
  @UseGuards(JwtAuthGuard)
  @Patch("toAdmin/:id")
  editToAdmin(@Param('id') id: number, @Body() editToAdminDto: EditToAdminDto) {
    return this.userService.editToAdmin(+id, editToAdminDto)
  }

  @Admin()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  delete(@Param('id') id: number) {
    return this.userService.delete(+id)
  }
}
