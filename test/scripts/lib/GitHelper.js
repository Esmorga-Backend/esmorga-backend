const { exec } = require('child_process');
const fs = require('fs');

class GitHelper {
  branchName = '';
  constructor() {
    this.seekBranchName();
  }

  getBranchName() {
    return this.branchName;
  }
  seekBranchName() {
    this.branchName = new Promise((resolve, reject) => {
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
        resolve(branchName);
      });
    });
  }
  fixedBranchName() {
    try {
      const data = fs.readFileSync('.github/tmp/branch.txt', 'utf8');
      console.log(data);
      this.branchName = data;
    } catch (err) {
      console.error(err);
    }
  }
}
module.exports = GitHelper;
