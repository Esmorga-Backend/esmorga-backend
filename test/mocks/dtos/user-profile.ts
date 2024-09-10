import { UserProfileDto } from '../../../src/infrastructure/dtos';
import { NAME, LAST_NAME, EMAIL } from '../common-data';
import { ACCOUNT_ROLES, ACCOUNT_STATUS } from '../../../src/domain/const';

export const USER_PROFILE_MOCK: UserProfileDto = {
  uuid: '66697c9b1d6b9528c97ae2e5',
  name: NAME,
  lastName: LAST_NAME,
  email: EMAIL,
  role: ACCOUNT_ROLES.USER,
  status: ACCOUNT_STATUS.ACTIVE,
  createdAt: new Date(),
};
