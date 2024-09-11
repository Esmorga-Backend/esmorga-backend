import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import * as argon2 from 'argon2';

const collection = 'users';

const user = {
  name: 'Test',
  lastName: 'Qa',
  email: 'auto.esmorga.test@1secmail.com',
  password: 'SuperSecret1!',
  role: 'USER',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function encodeValue(value: string) {
  return await argon2.hash(value);
}

export class add_e2e_user1726050364431 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    user.password = await encodeValue(user.password);

    await db.collection(collection).insertOne(user);
  }

  public async down(db: Db): Promise<any> {
    await db.collection(collection).deleteOne({
      email: { $eq: user.email },
    });
  }
}
