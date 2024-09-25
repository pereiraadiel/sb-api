import { GenericError } from './generic.error';

export class BadRequestError extends GenericError {
  statusCode = 400;
  whereItOccurred: string;

  constructor(message: string, whereItOccurred: string) {
    super(message, whereItOccurred, 'Bad Request');
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
