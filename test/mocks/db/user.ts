import * as argon2 from 'argon2';

export const PASSWORD_MOCK_DB = 'Password3';

const USER_MOCK_DB = {
  _id: '665f019c17331ebee550b2ff',
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
