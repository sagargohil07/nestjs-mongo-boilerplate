import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { InputSignIn, InputRegister } from './dto/input';
import { validateInput } from 'src/helpers/validation-helper';
import { authValidator } from 'src/validations/auth.validation';

@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: InputRegister) {
    validateInput(authValidator.registerValidation, body);
    return await this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: InputSignIn) {
    validateInput(authValidator.signInValidation, body);
    return await this.authService.signIn(body.email, body.password);
  }
}
