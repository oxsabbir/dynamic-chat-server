class AppError extends Error {
  public statusCode: number;
  public cause: string;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.cause = message;
    this.status = `${statusCode.toString().startsWith("4") ? "fail" : "error"}`;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
