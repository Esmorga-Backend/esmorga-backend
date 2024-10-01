import * as argon2 from 'argon2';
import { USER_MOCK_DB_ID } from './common';
import { ACCOUNT_ROLES, ACCOUNT_STATUS } from '../../../src/domain/const';

export const PASSWORD_MOCK_DB = 'Password3';

export const EMAIL_MOCK_DB = 'esmorga.test.03@yopmail.com';

const USER_MOCK_DB = {
  _id: USER_MOCK_DB_ID,
  name: 'Scottie',
  lastName: 'Pippen',
  email: EMAIL_MOCK_DB,
  password: PASSWORD_MOCK_DB,
  role: ACCOUNT_ROLES.USER,
  status: ACCOUNT_STATUS.ACTIVE,
  createdAt: new Date(),
};

const ADMIN_USER_MOCK_DB = {
  _id: '665f019c17331ebee550b2f5',
  name: 'Mike',
  lastName: 'Tyson',
  email: 'esmorga.test.04@yopmail.com',
  password: PASSWORD_MOCK_DB,
  role: ACCOUNT_ROLES.ADMIN,
  status: ACCOUNT_STATUS.ACTIVE,
  createdAt: new Date(),
};

async function hashPassword(user) {
  return {
    ...user,
    password: await argon2.hash(user.password),
  };
}

export async function getUserMockDb() {
  return hashPassword(USER_MOCK_DB);
}

export async function getAdminUserMockDb() {
  return hashPassword(ADMIN_USER_MOCK_DB);
}
