import * as argon2 from 'argon2';
import { USER_ROLES } from '../../../src/domain/consts';

export const PASSWORD_MOCK_DB = 'Password3';

const USER_MOCK_DB = {
  _id: '665f019c17331ebee550b2ff',
  name: 'Scottie',
  lastName: 'Pippen',
  email: 'esmorga.test.03@yopmail.com',
  password: PASSWORD_MOCK_DB,
  role: USER_ROLES.USER,
  createdAt: new Date(),
};

const ADMIN_USER_MOCK_DB = {
  _id: '665f019c17331ebee550b2f5',
  name: 'Mike',
  lastName: 'Tyson',
  email: 'esmorga.test.04@yopmail.com',
  password: PASSWORD_MOCK_DB,
  role: USER_ROLES.ADMIN,
  createdAt: new Date(),
};

export async function getUserMockDb() {
  USER_MOCK_DB.password = await argon2.hash(USER_MOCK_DB.password);

  return USER_MOCK_DB;
}

export async function getAdminUserMockDb() {
  ADMIN_USER_MOCK_DB.password = await argon2.hash(ADMIN_USER_MOCK_DB.password);

  return ADMIN_USER_MOCK_DB;
}
