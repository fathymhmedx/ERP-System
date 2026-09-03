import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

interface PostgresError extends Error {
  code?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = this.getStatusCode(exception);

    response.status(statusCode).json({
      success: false,
      statusCode,
      message: this.getMessage(exception),
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(this.isDevelopment() &&
        exception instanceof Error && {
          stack: exception.stack,
        }),
    });
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (this.isPostgresConflict(exception)) {
      return HttpStatus.CONFLICT;
    }

    if (this.isPostgresCheckViolation(exception)) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return exceptionResponse;
      }

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        return (exceptionResponse as { message: string | string[] }).message;
      }
    }

    if (this.isPostgresConflict(exception)) {
      if (exception.code === '23505') {
        return 'A record with the same unique value already exists';
      }

      if (exception.code === '23P01') {
        return 'The requested operation conflicts with existing data';
      }
    }

    if (this.isPostgresCheckViolation(exception)) {
      return 'The provided value violates a database constraint';
    }

    if (this.isDevelopment() && exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private isPostgresConflict(exception: unknown): exception is PostgresError {
    if (!(exception instanceof Error)) {
      return false;
    }

    if (!('code' in exception)) {
      return false;
    }

    return exception.code === '23505' || exception.code === '23P01';
  }

  private isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }
  private isPostgresCheckViolation(
    exception: unknown,
  ): exception is PostgresError {
    if (!(exception instanceof Error)) {
      return false;
    }

    if (!('code' in exception)) {
      return false;
    }

    return exception.code === '23514';
  }
}
