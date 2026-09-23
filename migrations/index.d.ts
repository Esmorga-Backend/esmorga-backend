import type { Db } from 'mongodb';
declare global {
    interface MongoDbMigration {
        up(db:Db): Promise<void>;
        down(db:Db): Promise<void>;
    }
}