import { GenericError } from './generic.error';

export class NotFoundError extends GenericError {
  statusCode = 404;
  whereItOccurred: string;

  constructor(message: string, whereItOccurred: string) {
    super(message, whereItOccurred, 'Not Found');
  }

  toResponse() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    };
  }

  toLog() {
    return {
      name: this.name,
      message: this.message,
      whereItOccurred: this.whereItOccurred,
      completeError: this.completeError,
    };
  }
}
