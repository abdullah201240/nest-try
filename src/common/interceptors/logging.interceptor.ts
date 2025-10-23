import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('HTTP');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, headers, ip } = request;
    const userAgent = headers['user-agent'] || 'N/A';
    const startTime = Date.now();

    // Log incoming request
    const requestLog = {
      type: 'REQUEST',
      method,
      url,
      ip,
      userAgent,
      body: this.sanitizeBody(body),
      headers: this.sanitizeHeaders(headers),
      timestamp: new Date().toISOString(),
    };

    this.logger.log(JSON.stringify(requestLog, null, 2));

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        const responseLog = {
          type: 'RESPONSE',
          method,
          url,
          statusCode: response.statusCode,
          responseTime: `${responseTime}ms`,
          response: this.sanitizeResponse(data),
          timestamp: new Date().toISOString(),
        };

        this.logger.log(JSON.stringify(responseLog, null, 2));
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const errorLog = {
          type: 'ERROR',
          method,
          url,
          statusCode: error.status || 500,
          responseTime: `${responseTime}ms`,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          timestamp: new Date().toISOString(),
        };

        this.logger.error(JSON.stringify(errorLog, null, 2), error.stack);
        throw error;
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'refreshToken', 'accessToken', 'token'];
    
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token',
    ];
    
    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }

  private sanitizeResponse(data: any): any {
    if (!data) return data;
    
    // If it's an array, sanitize each item
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeResponseObject(item));
    }
    
    return this.sanitizeResponseObject(data);
  }

  private sanitizeResponseObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    const sanitized = { ...obj };
    const sensitiveFields = ['password', 'refreshToken', 'accessToken', 'token'];
    
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }
}
