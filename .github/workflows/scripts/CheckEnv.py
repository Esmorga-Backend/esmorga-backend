import urllib.request
import json
import sys
import os
import subprocess
try:
    from ruamel.yaml import YAML
    yaml = YAML()
except:
    print("fail to load ruamel.yaml")
change=0


#dontAddVars=['AUTO_SSH_PRIVATE_KEY','SSHRSA','PAT']
#dontTouch=['WhenPR.yml','DeployToProd.yml','WhenMainChanges.yml','WhenReleaseChanges.yml']

dontAddVars=[]
dontTouch=[]
token = sys.argv[-1]
owner = "Esmorga-Backend"  
repo = "esmorga-backend"  
urls= {}
urls[f"https://api.github.com/repos/{owner}/{repo}/actions/variables"]="variables"
urls[f"https://api.github.com/repos/{owner}/{repo}/actions/secrets"]="secrets"

failed_vars=[]
envs_to_create = {}



process = subprocess.run(['/usr/local/bin/npm','run','start'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
out = process.stderr.splitlines()
print(out)
failed_vars=[]
for line in out:
    if line[:12]==' - property ':
        failed_vars.append(line[12:].split('has')[0][:-1])
print(failed_vars)


headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github+json",
    "User-Agent": "Python-script"
}


req = urllib.request.Request(f"https://api.github.com/repos/{owner}/{repo}/environments", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = response.read().decode()

        values = json.loads(data)
        for value in values['environments']:
            urls[f"https://api.github.com/repos/{owner}/{repo}/environments/{value['name']}/variables"]="variables"
            urls[f"https://api.github.com/repos/{owner}/{repo}/environments/{value['name']}/secrets"]="secrets"

except urllib.error.HTTPError as e:
    print(f"Error al hacer la solicitud: {e.code} {e.reason}")
    print(e.read().decode())

for url in urls:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read().decode()
            values = json.loads(data)
            for v in values[urls[url]]:
                if os.getenv(v['name'])==None:
                    envs_to_create[v['name']]=urls[url]

    except urllib.error.HTTPError as e:
        print(f"Error al hacer la solicitud: {e.code} {e.reason}")
        print(e.read().decode())

dir = '.github/workflows/'
yml_files = [f for f in os.listdir(dir) if f.endswith('.yml')]
for yml_file in yml_files:
 if yml_file not in dontTouch:
    with open(dir+yml_file, 'r') as file:
        data = yaml.load(file)
        data_orig=yaml.load(file)
        for job in data['jobs']:
            if 'steps' in data['jobs'][job] and 'name' in data['jobs'][job]['steps'][0] and  data['jobs'][job]['steps'][0]['name'] =='Create .env' :
                run='|\n'
                for var in failed_vars:
                    run=run+'echo '+var+'=${{'+envs_to_create[var]+'.'+var+'}} >> .env \n'
                if run!=data['jobs'][job]['steps'][0]['run']:
                    print("original:"+data['jobs'][job]['steps'][0]['run'])
                    print("new:"+run)
                #     if var not in data['jobs'][job]['env'] and var not in dontAddVars and var in envs_to_create:
                #         change=1
                #         if envs_to_create[var] == 'variables':
                #             print("ADD "+var+'=${{vars.'+var+'}} to file'+yml_file)
                #             data['jobs'][job]['env'][var]='${{vars.'+var+'}}'
                #         else:
                #             print(var+'=${{'+envs_to_create[var]+'.'+var+'}}')
                #             data['jobs'][job]['env'][var]='${{'+envs_to_create[var]+'.'+var+'}}'
    if data!=data_orig:
        with open(dir+yml_file, 'w') as file:
            yaml.dump(data, file)

if change!=0:
    sys.exit(1) 

