import { ApiError } from './ApiError';

export class InvalidCredentialsApiError extends ApiError {
  constructor() {
    super(
      401,
      'unauthorizedRequestError',
      'inputs are invalid',
      'email password combination is not correct',
    );
  }
}
