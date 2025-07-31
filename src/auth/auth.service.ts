/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { RedisService } from 'src/redis/redis.service';
import { generateTokens } from './utils/jwt.utils';
import { storeRefreshToken } from './utils/redis.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = generateTokens(this.jwtService, {
      sub: user.id,
      email: user.email,
    });

    await storeRefreshToken(
      this.redisService.getClient(),
      user.id,
      refreshToken,
    );

    return new AuthResponseDto(accessToken, refreshToken);
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });

    if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(this.jwtService, {
      sub: user.id,
      email: user.email,
    });

    await storeRefreshToken(
      this.redisService.getClient(),
      user.id,
      refreshToken,
    );

    return new AuthResponseDto(accessToken, refreshToken);
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Verifica a assinatura do refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
      });

      // Busca o token salvo no Redis
      const storedToken = await this.redisService
        .getClient()
        .get(`refresh:${payload.sub}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Gera novos tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        this.jwtService,
        {
          sub: payload.sub,
          email: payload.email,
        },
      );

      // Atualiza o refresh token no Redis
      await storeRefreshToken(
        this.redisService.getClient(),
        payload.sub as string,
        newRefreshToken,
      );

      return new AuthResponseDto(accessToken, newRefreshToken);
    } catch (e: unknown) {
      throw new UnauthorizedException(
        `Invalid or expired refresh token: ${JSON.stringify(e)}`,
      );
    }
  }
}
