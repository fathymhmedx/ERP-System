import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { AuthService } from './auth.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('signup')
  @SuccessMessage('Account created successfully')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('login')
  @SuccessMessage('Logged in successfully')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
