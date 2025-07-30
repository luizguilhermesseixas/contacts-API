import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export function generateTokens(
  jwtService: JwtService,
  payload: Record<string, any>,
  accessOptions?: JwtSignOptions,
  refreshOptions?: JwtSignOptions,
): { accessToken: string; refreshToken: string } {
  const defaultAccessOptions: JwtSignOptions = {
    secret: process.env.JWT_SECRET || 'access_secret_key',
    expiresIn: '1h',
    ...accessOptions,
  };

  const defaultRefreshOptions: JwtSignOptions = {
    secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
    expiresIn: '7d',
    ...refreshOptions,
  };

  const accessToken = jwtService.sign(payload, defaultAccessOptions);
  const refreshToken = jwtService.sign(payload, defaultRefreshOptions);

  return { accessToken, refreshToken };
}
