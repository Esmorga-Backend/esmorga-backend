import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';

export class remove_tokens_collection1759316286234
  implements MigrationInterface
{
  public async up(db: Db): Promise<void | never> {
    const collections = await db.listCollections({ name: 'tokens' }).toArray();
    if (collections.length > 0) {
      await db.collection('tokens').drop();
    }
  }

  public async down(db: Db): Promise<void | never> {
    await db.createCollection('tokens');
  }
}
