import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

import { ApiResponse } from '../interfaces/api-response.interface';
import { SUCCESS_MESSAGE_KEY } from '../constants/metadata.constants';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    const message =
      this.reflector.getAllAndOverride<string>(SUCCESS_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'Request completed successfully';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
