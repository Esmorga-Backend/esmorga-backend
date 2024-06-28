const { exec } = require('child_process');
class GitHelper {
  constructor() {}

  getBranchName() {
    return new Promise((resolve, reject) => {
      exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
        if (err) {
          reject(`Error executing git: ${err}`);
          return;
        }
        if (stderr) {
          reject(`Error in git: ${stderr}`);
          return;
        }
        const branchName = stdout.trim();
        resolve({ branchName });
      });
    });
  }
}

module.exports = GitHelper;
