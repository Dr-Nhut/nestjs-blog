import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UserSignInDto } from './dtos/user-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() userSignInDto: UserSignInDto) {
    return this.authService.signIn(userSignInDto);
  }
}
