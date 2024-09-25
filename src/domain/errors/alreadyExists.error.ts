import { GenericError } from './generic.error';

export class AlreadyExistsError extends GenericError {
  statusCode = 409;
  whereItOccurred: string;

  constructor(message: string, whereItOccurred: string) {
    super(message, whereItOccurred, 'Already Exists');
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
