export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401); }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') { super(message, 404); }
}

