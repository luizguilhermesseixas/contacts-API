import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorResponse } from 'src/@types/error.types';
import { HttpExceptionResponse } from 'src/@types/http.types';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (this.isHttpExceptionResponse(errorResponse)) {
        message =
          errorResponse.message || errorResponse.error || exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
      );
    } else if (typeof exception === 'string') {
      message = exception;
    } else {
      this.logger.error('Unknown exception type:', exception);
    }

    const errorPayload: ErrorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    };

    response.status(status).json(errorPayload);
  }

  private isHttpExceptionResponse(obj: unknown): obj is HttpExceptionResponse {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      ('message' in obj || 'error' in obj || 'statusCode' in obj)
    );
  }
}
