import { Db } from 'mongodb';

import * as argon2 from 'argon2';

const collection = 'users';

const user = {
  name: 'Test',
  lastName: 'Qa',
  email: 'auto.esmorga.test@esmorga.canarte.org',
  password: 'SuperSecret1!',
  role: 'USER',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function encodeValue(value: string) {
  return await argon2.hash(value);
}
class add_e2e_esmorga_mail_user1751549010877 implements MongoDbMigration {
  public async up(db: Db): Promise<any> {
    user.password = await encodeValue(user.password);
    if (await db.collection(collection).findOne(user) != null)
      await db.collection(collection).insertOne(user);
  }

  public async down(db: Db): Promise<any> {
    await db.collection(collection).deleteOne({
      email: { $eq: user.email },
    });
  }
}

export default new add_e2e_esmorga_mail_user1751549010877()