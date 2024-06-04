import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import { createHash } from 'crypto';

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

const collection = 'users';

const emails = [
  'esmorga.test.01@yopmail.com',
  'esmorga.test.02@yopmail.com',
  'esmorga.test.03@yopmail.com',
];

const currentDate = new Date();

export class add_users_login_flow1717494910292 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const users = [
      {
        name: 'Magico Gonzalez',
        email: emails[0],
        password: hash('Password1'),
        role: 'ADMIN',
        createdAt: currentDate,
      },
      {
        name: 'Floyd Mayweather',
        email: emails[1],
        password: hash('Password2'),
        role: 'ADMIN',
        createdAt: currentDate,
      },
      {
        name: 'Scottie Pippen',
        email: emails[2],
        password: hash('Password3'),
        role: 'USER',
        createdAt: currentDate,
      },
    ];

    await db.collection(collection).insertMany(users);
  }

  public async down(db: Db): Promise<any> {
    await db.collection(collection).deleteMany({
      email: { $in: emails },
    });
  }
}
