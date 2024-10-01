import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';

export class update_user_status_to_active1726575490719
  implements MigrationInterface
{
  public async up(db: Db): Promise<any> {
    const result = await db.collection('users').updateMany(
      {
        $or: [{ status: { $ne: 'ACTIVE' } }, { status: { $exists: false } }],
      },
      { $set: { status: 'ACTIVE' } },
    );

    return result;
  }

  public async down(db: Db): Promise<any> {
    const result = await db.collection('users').updateMany(
      {
        $or: [
          { status: { $ne: 'UNVERIFIED' } },
          { status: { $exists: false } },
        ],
      },
      { $set: { status: 'UNVERIFIED' } },
    );

    return result;
  }
}
