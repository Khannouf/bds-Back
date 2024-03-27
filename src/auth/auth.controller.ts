import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/loginDto';
import { resetPassDto } from './dto/resetPassDto';
import { resetPassConfirmDto } from './dto/resetPassConfirmDto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60 * 1000, limit: 5 } })
  @Post('login')
  login(@Body() LoginDto: loginDto) {
    return this.authService.login(LoginDto);
  }
  @Post('reset-password')
  resetPass(@Body() ResetPassDto: resetPassDto) {
    return this.authService.resetPassword(ResetPassDto);
  }

  @Post('reset-password-confirmation')
  resetPassConfirm(@Body() ResetPassConfirmDto: resetPassConfirmDto) {
    return this.authService.resetPasswordConfirmation(ResetPassConfirmDto);
  }
}
