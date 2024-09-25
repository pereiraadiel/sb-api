import { GenericError } from './generic.error';

export class UnauthorizedError extends GenericError {
  statusCode = 401;
  whereItOccurred: string;

  constructor(message: string, whereItOccurred: string) {
    super(message, whereItOccurred, 'Unauthorized Request');
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
