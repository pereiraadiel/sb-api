export class GenericError extends Error {
  statusCode = 420;
  whereItOccurred: string;
  completeError?: Error;

  constructor(message: string, whereItOccurred: string, name?: string) {
    super(message);
    this.whereItOccurred = whereItOccurred;
    this.name = name || 'Unexpected Error';
  }

  addCompleteError(error: Error) {
    this.completeError = error;
    return this;
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
