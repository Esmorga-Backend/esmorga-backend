import { ApiError } from './api-error';

export class BlockedUserApiError extends ApiError {
  constructor() {
    super(423, 'blockedUserError', 'user is blocked', 'user is blocked');
  }
}
