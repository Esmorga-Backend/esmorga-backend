import { DynamicModule } from '@nestjs/common';

export class DataAccessModule {
  static async forRoot(db: 'mongodb' | 'none'): Promise<DynamicModule> {
    let dbModuleClassLoader: () => Promise<any>;
    switch (db) {
      case 'none':
        dbModuleClassLoader = async () =>
          await import('./none/no-da.module').then(
            ({ NoDataAccessModule }) => NoDataAccessModule,
          );
        break;
      case 'mongodb':
      default:
        dbModuleClassLoader = async () =>
          await import('./mongo/mondo-da.module').then(
            ({ MongoDataAccessModule }) => MongoDataAccessModule,
          );
    }
    const dbModuleClass = await dbModuleClassLoader();
    return {
      module: DataAccessModule,
      global: true,
      providers: [],
      imports: [dbModuleClass],
      exports: [dbModuleClass],
    };
  }
}
