import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import {
  BaseSchema,
  SuccessSchema,
  ErrorSchema,
  ErrorConfig,
} from 'src/@types/decorator.types';

// Função helper para criar schema de sucesso com tipagem rigorosa
function createSuccessSchema(
  dataSchema: BaseSchema | { $ref: string },
  statusCode: string,
): SuccessSchema | { type: 'object'; properties: any; required: string[] } {
  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
        description: 'Indicates if the request was successful',
      },
      statusCode: {
        type: 'string',
        example: statusCode,
        description: 'HTTP status code',
      },
      data: '$ref' in dataSchema ? { allOf: [dataSchema] } : dataSchema,
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-31T10:30:00.000Z',
        description: 'Timestamp of the response',
      },
    },
    required: ['success', 'statusCode', 'data', 'timestamp'],
  };
}

// Função helper para criar schema de erro com tipagem rigorosa
function createErrorSchema(
  statusCode: string,
  exampleError: string,
): ErrorSchema {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      statusCode: {
        type: 'string',
        example: statusCode,
        description: '',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-31T10:30:00.000Z',
      },
      path: { type: 'string', example: '/user/123' },
      error: {
        oneOf: [
          { type: 'string', example: exampleError },
          { type: 'array', items: { type: 'string' } },
        ],
      },
    },
    required: ['success', 'statusCode', 'timestamp', 'path', 'error'],
  };
}

// Type guard para verificar se é um Type<T>
function isTypeConstructor<T>(value: unknown): value is Type<T> {
  return typeof value === 'function' && typeof value.name === 'string';
}

// Decorator principal para respostas de sucesso
export function ApiSuccessResponse<T>(
  dataType: Type<T> | 'object' | 'array',
  options?: Omit<ApiResponseOptions, 'schema' | 'type'>,
) {
  const statusCode = options?.status ?? '200';

  let dataSchema: BaseSchema | { $ref: string };

  if (dataType === 'object') {
    dataSchema = { type: 'object' };
  } else if (dataType === 'array') {
    dataSchema = { type: 'array', items: { type: 'object' } };
  } else if (isTypeConstructor(dataType)) {
    dataSchema = { $ref: `#/components/schemas/${dataType.name}` };
  } else {
    dataSchema = { type: 'object' };
  }

  return applyDecorators(
    ApiResponse({
      ...options,
      schema: createSuccessSchema(dataSchema, String(statusCode)),
    }),
  );
}

// Decorator para arrays com tipagem rigorosa
export function ApiSuccessArrayResponse<T>(
  dataType: Type<T>,
  options?: Omit<ApiResponseOptions, 'schema' | 'type'>,
) {
  const statusCode = options?.status ?? 200;

  if (!isTypeConstructor(dataType)) {
    throw new Error(
      'dataType must be a valid Type constructor for array responses',
    );
  }

  const dataSchema: BaseSchema = {
    type: 'array',
    items: { $ref: `#/components/schemas/${dataType.name}` },
  };

  return applyDecorators(
    ApiResponse({
      ...options,
      schema: createSuccessSchema(dataSchema, String(statusCode)),
    }),
  );
}

// Configurações de erro padronizadas com tipagem rigorosa
const ERROR_CONFIGS: Record<number, ErrorConfig> = {
  400: { description: 'Bad Request', example: 'Validation failed' },
  401: { description: 'Unauthorized', example: 'Unauthorized' },
  403: {
    description: 'Forbidden',
    example: 'You can only access your own profile',
  },
  404: { description: 'Not Found', example: 'User not found' },
  409: {
    description: 'Conflict',
    example: 'User with this email already exists',
  },
  500: {
    description: 'Internal Server Error',
    example: 'Internal server error',
  },
} as const;

// Decorator para todas as respostas de erro
export function ApiErrorResponses(
  customErrors?: Partial<Record<number, ErrorConfig>>,
) {
  const errorConfigs = { ...ERROR_CONFIGS, ...customErrors };

  const decorators = Object.entries(errorConfigs).map(([statusStr, config]) => {
    const status = parseInt(statusStr, 10);

    if (
      !config ||
      typeof config.description !== 'string' ||
      typeof config.example !== 'string'
    ) {
      throw new Error(`Invalid error config for status ${status}`);
    }

    return ApiResponse({
      status,
      description: config.description,
      schema: createErrorSchema(String(status), config.example),
    });
  });

  return applyDecorators(...decorators);
}

// Decorator específico para um erro
export function ApiErrorResponse(
  status: number,
  description: string,
  example: string,
) {
  if (
    typeof status !== 'number' ||
    typeof description !== 'string' ||
    typeof example !== 'string'
  ) {
    throw new Error('Invalid parameters for ApiErrorResponse');
  }

  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: createErrorSchema(String(status), example),
    }),
  );
}

// Decorators de conveniência para casos comuns com validação
export function ApiCreatedResponse<T>(
  dataType: Type<T>,
  description = 'Created successfully',
): ReturnType<typeof applyDecorators> {
  if (!isTypeConstructor(dataType)) {
    throw new Error('dataType must be a valid Type constructor');
  }

  return ApiSuccessResponse(dataType, { status: 201, description });
}

export function ApiOkResponse<T>(
  dataType: Type<T>,
  description = 'Retrieved successfully',
): ReturnType<typeof applyDecorators> {
  if (!isTypeConstructor(dataType)) {
    throw new Error('dataType must be a valid Type constructor');
  }

  return ApiSuccessResponse(dataType, { status: 200, description });
}

export function ApiOkArrayResponse<T>(
  dataType: Type<T>,
  description = 'Retrieved successfully',
): ReturnType<typeof applyDecorators> {
  if (!isTypeConstructor(dataType)) {
    throw new Error('dataType must be a valid Type constructor');
  }

  return ApiSuccessArrayResponse(dataType, { status: 200, description });
}

export function ApiDeletedResponse(
  description = 'Deleted successfully',
): ReturnType<typeof applyDecorators> {
  if (typeof description !== 'string') {
    throw new Error('description must be a string');
  }

  return ApiSuccessResponse('object', { status: 200, description });
}

// Tipos exportados para uso externo
export type { ErrorConfig, SuccessSchema, ErrorSchema };
