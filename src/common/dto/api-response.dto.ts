import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessResponse<T> {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({
    example: '2025-01-31T10:30:00.000Z',
    description: 'Timestamp of the response',
  })
  timestamp: string;
}

export class ApiErrorResponse {
  @ApiProperty({ example: false, description: 'Indicates the request failed' })
  success: boolean;

  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: '2025-01-31T10:30:00.000Z',
    description: 'Timestamp of the response',
  })
  timestamp: string;

  @ApiProperty({
    example: '/user/123',
    description: 'Request path that caused the error',
  })
  path: string;

  @ApiProperty({
    example: 'User not found',
    description: 'Error message',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  error: string | string[];
}
