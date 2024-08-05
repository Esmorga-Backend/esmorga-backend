import { ApiError } from './api-error';

export class NotAccepteableEventApiError extends ApiError {
  constructor() {
    super(406, 'notAcceptable', 'not Acceptable', 'cannot join past events');
  }
}
