import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';

export class remove_old_attendee_count_1787649522840 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
      await db.collection('events').updateMany({}, { $unset: { currentAttendeeCount: "" } });
  }

  public async down(db: Db): Promise<void | never> {
  }
}
