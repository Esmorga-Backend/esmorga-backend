import urllib.request
import json
import sys
import os
#import yaml
from ruamel.yaml import YAML
yaml = YAML()


token = sys.argv[-1]
owner = "Esmorga-Backend"  
repo = "esmorga-backend"  
urls= {}
urls[f"https://api.github.com/repos/{owner}/{repo}/actions/variables"]="variables"
urls[f"https://api.github.com/repos/{owner}/{repo}/actions/secrets"]="secrets"

envs_to_create = {}


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
print(envs_to_create)
yml_files = [f for f in os.listdir(dir) if f.endswith('.yml')]
for yml_file in yml_files:
 if yml_file not in ['DeployToProd.yml','WhenMainChanges.yml','WhenPR.yml','WhenReleaseChanges.yml']:
    with open(dir+yml_file, 'r') as file:
#        data = yaml.safe_load(file)
#        data_orig=yaml.safe_load(file)
        data = yaml.load(file)
        data_orig=yaml.load(file)
        for job in data['jobs']:
            if 'env' in data['jobs'][job] :
                for var in envs_to_create:
                    if var not in data['jobs'][job]['env']:
                        if envs_to_create[var] == 'variables':
                            print("ADD "+var+'=${{vars.'+var+'}} to file'+yml_file)
                            data['jobs'][job]['env'][var]='${{vars.'+var+'}}'
#                    else:
#                        print(var+'=${{'+envs_to_create[var]+'.'+var+'}}')
    if data!=data_orig:
        with open(dir+yml_file, 'w') as file:
            yaml.dump(data, file)