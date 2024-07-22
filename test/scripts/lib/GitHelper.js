const { exec } = require('child_process');
class GitHelper {
  branchName = '';
  constructor() {
    this.seekBranchName();
  }

  getBranchName() {
    return this.branchName;
  }
  seekBranchName() {
    if ('GITHUB_HEAD_REF' in process.env) {
      this.branchName = process.env.GITHUB_HEAD_REF;
    } else {
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
    while (this.branchName == '') {
      console.log('+++\n\n ' + this.branchName);
    }
  }
  fixedBranchName() {
    this.branchName = new Promise((resolve, reject) => {
      exec(
        'last_commit=$(git log -1 --format="%H"); branches=$(git branch -r --contains $last_commit); branch_name=$(echo "$branches" | grep -v "HEAD" | head -n 1 | sed "s|origin/||"); echo $branch_name',
        (err, stdout, stderr) => {
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
        },
      );
    });
  }
}
module.exports = GitHelper;
