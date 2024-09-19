import subprocess

process = subprocess.run(['/usr/local/bin/npm','run','start'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

out = process.stderr.splitlines()

failed_vars=[]
for line in out:
    if line[:12]==' - property ':
        failed_vars.append(line[12:].split('has')[0][:-1])
original=open('.github/actions/Deploy/original.yaml','r')
formed=open('.github/actions/Deploy/action.yaml','w')
values=''
for line in original.readlines():
    if line.find('.github/workflows/scripts/DeployToEnv.py')!=-1:
        for var in failed_vars:
            value=var+"=\"${{secrets."+var+"}}${{vars."+var+"}}\""
            line=line+" "+value
            values=values+" "+value
    formed.write(line)
print(values)