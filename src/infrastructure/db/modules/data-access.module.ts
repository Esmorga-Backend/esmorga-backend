import { ConfigurableModuleBuilder, DynamicModule } from '@nestjs/common';
export type SupportedDataStorage = 'mongodb' | 'none';
export type DataAccessModuleOptions = { db: SupportedDataStorage };

const { ConfigurableModuleClass } = new ConfigurableModuleBuilder<object>()
  .setExtras<{ db: SupportedDataStorage }>(
    {
      db: 'mongodb',
    },
    (definition, extras) => {
      const moduleRef = { module: null };
      return {
        ...definition,
        global: true,
        imports: [loadDbModule(extras.db, moduleRef)],
        exports: [moduleRef],
      };
    },
  )
  .build();

function loadDbModule(db: SupportedDataStorage, moduleRef: { module: any }) {
  return new Promise<DynamicModule>(async (resolve) => {
    let dbModuleClassLoader: () => Promise<any>;
    switch (db) {
      case 'none':
        dbModuleClassLoader = async () =>
          await import('./none/no-da.module').then(
            ({ NoDataAccessModule }) => NoDataAccessModule,
          );
        break;
      case 'mongodb':
        dbModuleClassLoader = async () =>
          await import('./mongo/mongo-da.module').then(
            ({ MongoDataAccessModule }) => MongoDataAccessModule,
          );
        break;
      default:
        throw new Error(`Unsupported db ${db}`);
    }
    const dbModuleClass = await dbModuleClassLoader();
    moduleRef.module = dbModuleClass;
    resolve({ module: dbModuleClass });
  });
}

export class DataAccessModule extends ConfigurableModuleClass {}
