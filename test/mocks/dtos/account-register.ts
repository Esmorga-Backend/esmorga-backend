import { AccountRegisterDto } from '../../../src/infrastructure/http/dtos';
import { NAME, LAST_NAME, EMAIL, PASSWORD } from '../common-data';

export const ACCOUNT_REGISTER: AccountRegisterDto = {
  name: NAME,
  lastName: LAST_NAME,
  password: PASSWORD,
  email: EMAIL,
};
