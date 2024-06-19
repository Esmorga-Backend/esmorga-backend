import { createHash } from 'crypto';

export const PASSWORD = 'Password3';

export const USER_DB = {
  _id: '665f019c17331ebee550b2ff',
  name: 'Scottie',
  lastName: 'Pippen',
  email: 'esmorga.test.03@yopmail.com',
  password: createHash('sha256').update(PASSWORD).digest('hex'),
  role: 'USER',
  createdAt: new Date(),
};
