import { UserProfileDto } from '../../../src/infrastructure/dtos';
import { NAME, LAST_NAME, EMAIL } from '../common-data';

export const USER_PROFILE_MOCK: UserProfileDto = {
  uuid: '66697c9b1d6b9528c97ae2e5',
  name: NAME,
  lastName: LAST_NAME,
  email: EMAIL,
  role: 'USER',
  createdAt: new Date(),
};
