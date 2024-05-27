/* eslint-disable no-console */
import { exec } from 'child_process';
import * as util from 'util';

export async function executeMigrations() {
  const execPromise = util.promisify(exec);

  const scripts = {
    PROD: 'npm run migrate:prod-up',
    QA: 'npm run migrate:qa-up',
    LOCAL: 'npm run migrate:local-up',
  };
  const scriptToExecute = scripts[process.env.NODE_ENV];

  const { stdout, stderr } = await execPromise(scriptToExecute);

  console.log(stdout);
  console.error(stderr);
}
