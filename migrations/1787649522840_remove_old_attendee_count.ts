import { AnyBulkWriteOperation, Db, Document } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';

export class remove_old_attendee_count_1787649522840 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db.collection('events').updateMany({}, { $unset: { currentAttendeeCount: "" } });
  }

  public async down(db: Db): Promise<void | never> {
    const events = await db
      .collection('events')
      .find({}, { projection: { _id: 1 } })
      .toArray();
    const operations: AnyBulkWriteOperation<Document>[] = await Promise.all(
      events.map(async (event) => {
        const participantsDoc = await db
          .collection('eventparticipants')
          .findOne({ eventId: event._id.toString() });
        const currentAttendeeCount = participantsDoc?.participants?.length ?? 0;
        return {
          updateOne: {
            filter: { _id: event._id },
            update: { $set: { currentAttendeeCount } },
          },
        };
      }),
    );
    if (operations.length > 0) {
      await db.collection('events').bulkWrite(operations);
    }
  }
}
