import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import { createHash } from 'crypto';

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

const collection = 'users';

const users = [
  {
    email: 'esmorga.test.01@yopmail.com',
    password: 'Password01',
    oldPassword: 'Password1',
  },
  {
    email: 'esmorga.test.02@yopmail.com',
    password: 'Password02',
    oldPassword: 'Password2',
  },
  {
    email: 'esmorga.test.03@yopmail.com',
    password: 'Password03',
    oldPassword: 'Password3',
  },
];

export class update_password_user_login_fow1718793301030
  implements MigrationInterface
{
  public async up(db: Db): Promise<any> {
    users.forEach((user) => {
      db.collection(collection).updateOne(
        { email: { $eq: user.email } },
        { $set: { password: hash(user.password) } },
      );
    });
  }

  public async down(db: Db): Promise<any> {
    users.forEach((user) => {
      db.collection(collection).updateOne(
        { email: { $eq: user.email } },
        { $set: { password: hash(user.oldPassword) } },
      );
    });
  }
}
