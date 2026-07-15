import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersRepository } from '../users/users.repository';
import { RolesRepository } from '../roles/roles.repository';
import { UserMapper } from '../users/mappers/user.mapper';

import {
  LoginDto,
  LoginResponseDto,
  SignupDto,
  SignupResponseDto,
} from './dto';

import { AUTH_CONSTANTS } from './constants/auth.constants';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { SYSTEM_ROLES } from 'src/common/constants/system-roles.constants';

@Injectable()
export class AuthService {
  constructor(
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

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
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

    return {
      user: UserMapper.toResponseDto(user),
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(),
    };
  }

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(): string {
    return 'sklmdksmfkmdsfkmdskm';
  }
}
