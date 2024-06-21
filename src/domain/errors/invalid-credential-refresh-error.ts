import { ApiError } from './api-error';

export class InvalidCredentialsRefreshApiError extends ApiError {
  constructor() {
    super(401, 'unauthorizedRequestError', 'unauthorized', 'unauthorized');
  }
}
