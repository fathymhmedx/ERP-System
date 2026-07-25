import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersRepository } from '../users/users.repository';
import { RolesRepository } from '../roles/roles.repository';
import { UserMapper } from '../users/mappers/user.mapper';

import {
  ChangePasswordDto,
  LoginDto,
  SignupDto,
  SignupResponseDto,
} from './dto';

import { AUTH_CONSTANTS } from './constants/auth.constants';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { SYSTEM_ROLES } from 'src/common/constants/system-roles.constants';
import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service';
import { LoginResult } from './interfaces/login-result.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<SignupResponseDto> {
    const { email, password } = signupDto;

    const emailExists = await this.usersRepository.exists({
      email,
    });

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    const defaultRole = await this.rolesRepository.findByName(
      SYSTEM_ROLES.EMPLOYEE,
    );

    if (!defaultRole) {
      throw new InternalServerErrorException('Default role not found');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS,
    );

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: defaultRole,
    });

    const savedUser = await this.usersRepository.save(user);

    return {
      user: UserMapper.toResponseDto(savedUser),
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResult> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account is inactive');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.usersRepository.updateLastLogin(user.id);

    const payload: JwtPayload = {
      sub: user.id,
      roleId: user.role.id,
    };

    const accessToken = this.generateAccessToken(payload);

    const { refreshToken } =
      await this.refreshTokensService.createSession(user);

    return {
      user: UserMapper.toResponseDto(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<LoginResult> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const { user, refreshToken: newRefreshToken } =
      await this.refreshTokensService.rotateSession(refreshToken);

    const payload: JwtPayload = {
      sub: user.id,
      roleId: user.role.id,
    };

    const accessToken = this.generateAccessToken(payload);

    return {
      user: UserMapper.toResponseDto(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout current user session.
   */
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const session =
      await this.refreshTokensService.validateSession(refreshToken);

    await this.refreshTokensService.revokeSession(session.id);
  }

  /**
   * Logout from all user sessions.
   */
  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokensService.revokeAllByUser(userId);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { newPassword, oldPassword } = changePasswordDto;
    const user = await this.usersRepository.findByIdWithPassword(userId);

    if (!user) throw new NotFoundException('User not found');

    const matched = await user.comparePassword(oldPassword);

    if (!matched) throw new UnauthorizedException('Old password is incorrect');

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS,
    );

    await this.usersRepository.updatePassword(userId, hashedPassword);
    await this.refreshTokensService.revokeAllByUser(userId);
  }

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
