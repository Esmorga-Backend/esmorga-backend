import * as argon2 from 'argon2';
import { USER_MOCK_DB_ID } from './common';

export const PASSWORD_MOCK_DB = 'Password3';

const USER_MOCK_DB = {
  _id: USER_MOCK_DB_ID,
  name: 'Scottie',
  lastName: 'Pippen',
  email: 'esmorga.test.03@yopmail.com',
  password: PASSWORD_MOCK_DB,
  role: 'USER',
  createdAt: new Date(),
};

export async function getUserMockDb() {
  USER_MOCK_DB.password = await argon2.hash(USER_MOCK_DB.password);

  return USER_MOCK_DB;
}
