import { AccountLoginDto } from '../../../src/infrastructure/http/dtos';
import { EMAIL, PASSWORD } from '../common-data';

export const ACCOUNT_LOGIN_MOCK: AccountLoginDto = {
  email: EMAIL,
  password: PASSWORD,
};
