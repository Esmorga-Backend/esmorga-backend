import { ApiError } from './api-error';

export class InvalidTokenApiError extends ApiError {
  constructor() {
    super(401, 'unauthorizedRequestError', 'not authorized', 'token invalid');
  }
}
