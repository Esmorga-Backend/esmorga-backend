import { ApiError } from './api-error';

export class BadEventIdApiError extends ApiError {
  constructor() {
    super(400, 'badRequestError', 'eventId', 'eventId invalid');
  }
}
