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
}
