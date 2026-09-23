import { Db } from 'mongodb';


class remove_tokens_collection1759316286234 implements MongoDbMigration {
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

export default new remove_tokens_collection1759316286234()
