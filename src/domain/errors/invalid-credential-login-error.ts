import { ApiError } from './api-error';

export class InvalidCredentialsLoginApiError extends ApiError {
  constructor() {
    super(
      401,
      'unauthorizedRequestError',
      'inputs are invalid',
      'email password combination is not correct',
    );
  }
}
