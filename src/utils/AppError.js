export class AppError extends Error {
  constructor(statusCode = 500, reason = "Unknown Error", data = null, errorCode = "U001") {
    super(reason);
    this.statusCode = statusCode;
    this.reason = reason;
    this.data = data;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}