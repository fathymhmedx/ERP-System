import { Res } from '@nestjs/common';
import type { Response } from 'express';
import { Body, Controller, Patch, Post } from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshResponseDto,
  SignupDto,
} from './dto';
import { AuthService } from './auth.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/auth/auth-user.interface';
import { CookieService } from 'src/common/services/cookie.service';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}
  @Public()
  @Post('signup')
  @SuccessMessage('Account created successfully')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('login')
  @SuccessMessage('Logged in successfully')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    this.cookieService.setRefreshTokenCookie(response, result.refreshToken);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }
  @Public()
  @Post('refresh')
  @SuccessMessage('Token refreshed successfully')
  async refresh(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponseDto> {
    const result = await this.authService.refresh(refreshToken);

    this.cookieService.setRefreshTokenCookie(response, result.refreshToken);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Public()
  @Post('logout')
  @SuccessMessage('Logged out successfully')
  async logout(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(refreshToken);

    this.cookieService.clearRefreshTokenCookie(response);
  }

  @Post('logout-all')
  @SuccessMessage('Logged out from all devices successfully')
  async logoutAll(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logoutAll(user.id);

    this.cookieService.clearRefreshTokenCookie(response);
  }

  @Patch('change-password')
  @SuccessMessage('Password changed successfully')
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }
}
