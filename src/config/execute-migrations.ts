/* eslint-disable no-console */
import { exec } from 'child_process';
import * as util from 'util';

export async function executeMigrations() {
  const execPromise = util.promisify(exec);

  const scripts = {
    QA: 'npm run migrate:qa-up',
    LOCAL: 'npm run migrate:local-up',
    PROD: 'npm run migrate:prod-up',
  };
  const scriptToExecute = scripts[process.env.NODE_ENV];

  if (scriptToExecute) {
    try {
      const { stderr } = await execPromise(scriptToExecute);

      const stderrMigrationData = stderr
        .split('\n')
        .filter((line) => line.toLowerCase().includes('migration'));

      console.log(stderrMigrationData);
    } catch (error) {
      console.error('Error executing DB migrations - ', error);
    }
  }
}
