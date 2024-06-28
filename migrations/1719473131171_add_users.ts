import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import { createHash } from 'crypto';

function hash(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

const CURRENT_DATE = new Date();
const USERS = [
  {
    name: 'Paquita',
    lastName: 'Salas',
    email: 'esmorga.test.04@yopmail.com',
    password: hash('Password!4'),
    role: 'ADMIN',
    createdAt: CURRENT_DATE,
  },
  {
    name: 'Mia',
    lastName: 'Thermopolis',
    email: 'esmorga.test.05@yopmail.com',
    password: hash('Password!5'),
    role: 'ADMIN',
    createdAt: CURRENT_DATE,
  },
  {
    name: 'Phoebe',
    lastName: 'Buffay',
    email: 'esmorga.test.06@yopmail.com',
    password: hash('Password!6'),
    role: 'USER',
    createdAt: CURRENT_DATE,
  },
];

export class add_users1719473131171 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    await db.collection('users').insertMany(USERS);
  }

  public async down(db: Db): Promise<any> {
    await db.collection('users').deleteMany({
      email: { $in: USERS.map((user) => user.email) },
    });
  }
}
