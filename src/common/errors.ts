abstract class DomainError extends Error {
    abstract readonly name: string;

    protected constructor(message: string) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends DomainError {
  readonly name = 'NotFoundError';

  constructor(resource = 'Resource') {
    super(`${resource} not found`);
  }
}

class BadRequestError extends DomainError {
  readonly name = 'BadRequestError';

  constructor(message = 'Bad request') {
    super(message);
  }
}

class UnauthorizedError extends DomainError {
  readonly name = 'UnauthorizedError';

  constructor(message = 'Unauthorized') {
    super(message);
  }
}

class ForbiddenError extends DomainError {
  readonly name = 'ForbiddenError';

  constructor(message = 'Access denied') {
    super(message);
  }
}

class AlreadyExistsError extends DomainError {
  readonly name = 'AlreadyExistsError';

  constructor(resource = 'Resource') {
    super(`${resource} already exists`);
  }
}

export { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError, AlreadyExistsError }