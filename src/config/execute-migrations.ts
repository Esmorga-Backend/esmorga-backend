/* eslint-disable no-console */
import mongoMigrate from 'migrate-mongo';

const defaultConfig: mongoMigrate.config.Config = {
  mongodb: {
    url: "mongodb://localhost:27017/",
    databaseName: "esmorga",
    options: {},
  },
  migrationsDir: "dist_migrations",
  changelogCollectionName: "migrations_changelog"
};
const configProd: mongoMigrate.config.Config = {
  mongodb: {
    url: "mongodb://localhost:27017/",
    databaseName: "prod-esmorga",
    options: {},
  },
  migrationsDir: "dist_migrations/prod",
  changelogCollectionName: "migrations_changelog"
};
const configs = {
  PROD: configProd,
}
function setMongoUrl(config: mongoMigrate.config.Config) {
  if (process.env.MIGRATE_MONGODB_URI?.length) {
    config.mongodb.url = process.env.MIGRATE_MONGODB_URI;
    return;
  }
  // default to app mongodb url without path
  if (!process.env.MONGODB_URI?.length) {
    throw new Error("Missing MONGODB_URI in env, unable to run migrations")
  }
  const mongoURL = new URL(process.env.MONGODB_URI);
  mongoURL.pathname = ""
  mongoURL.search = ""
  config.mongodb.url = mongoURL.toString();
}
export async function executeMigrations(info: (...data: any[]) => void = console.log.bind(console)) {
  const mongoMigrateConfig = configs[process.env.MIGRATION_ENV ?? process.env.NODE_ENV] ?? defaultConfig
  setMongoUrl(mongoMigrateConfig);
  const { database, config, up, down } = await mongoMigrate;
  config.set(mongoMigrateConfig);
  const { db, client } = await database.connect();
  if (process.env.MIGRATE_DOWN === 'true') {
    const migrated = await down(db, client);
    info("Reverted migrations:")
    migrated.forEach(fileName => info(' - ', fileName));
    return;
  }
  const migrated = await up(db, client);
  if (!migrated?.length) {
    info("No new migrations.")
  } else {
    info("Applied migrations:")
    migrated.forEach(fileName => info(' - ', fileName));
  }
}