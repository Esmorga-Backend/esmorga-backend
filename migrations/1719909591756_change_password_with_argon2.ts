import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import * as argon2 from 'argon2';
import { createHash } from 'crypto';

const collection = 'users';

async function encodeValue(value: string) {
  return await argon2.hash(value);
}

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

const USERS_TO_UPDATE = [
  {
    email: 'esmorga.test.04@yopmail.com',
    password: 'Password!4',
    encodedPassword: '',
  },
  {
    email: 'esmorga.test.05@yopmail.com',
    password: 'Password!5',
    encodedPassword: '',
  },
  {
    email: 'esmorga.test.06@yopmail.com',
    password: 'Password!6',
    encodedPassword: '',
  },
];

export class change_password_with_argon21719909591756
  implements MigrationInterface
{
  public async up(db: Db): Promise<any> {
    USERS_TO_UPDATE[0].encodedPassword = await encodeValue(
      USERS_TO_UPDATE[0].password,
    );

    USERS_TO_UPDATE[1].encodedPassword = await encodeValue(
      USERS_TO_UPDATE[1].password,
    );

    USERS_TO_UPDATE[2].encodedPassword = await encodeValue(
      USERS_TO_UPDATE[2].password,
    );

    const promises = USERS_TO_UPDATE.map((user) => {
      return db
        .collection(collection)
        .updateOne(
          { email: { $eq: user.email } },
          { $set: { password: user.encodedPassword } },
        );
    });

    await Promise.all(promises);
  }

  public async down(db: Db): Promise<any> {
    const promises = USERS_TO_UPDATE.map((user) => {
      return db
        .collection(collection)
        .updateOne(
          { email: { $eq: user.email } },
          { $set: { password: hash(user.password) } },
        );
    });

    await Promise.all(promises);
  }
}
