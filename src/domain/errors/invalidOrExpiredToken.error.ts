import { GenericError } from './generic.error';

export class InvalidOrExpiredTokenError extends GenericError {
  statusCode = 498;
  whereItOccurred: string;

  constructor(message: string, whereItOccurred: string) {
    super(message, whereItOccurred, 'Invalid or Expired Token');
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
