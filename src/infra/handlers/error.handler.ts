import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { GenericError } from '@/domain/errors/generic.error';

@Catch(GenericError)
export class ErrorHandler implements ExceptionFilter {
  catch(exception: GenericError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.toResponse();
    const exceptionLog = exception.toLog();
    const status = exceptionResponse.statusCode;
    const timestamp = new Date().toISOString();
    const path = request.url;

    // 💡 We're logging the error here
    console.error({ ...exceptionLog, timestamp, path, method: request.method });

    response.status(status).json({
      statusCode: status,
      name: exceptionResponse.name,
      message: exceptionResponse.message,
      timestamp,
      path,
    });
  }
}
