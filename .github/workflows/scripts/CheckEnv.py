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


#dontAddVars=['AUTO_SSH_PRIVATE_KEY','SSHRSA','PAT']
#dontTouch=['WhenPR.yml','DeployToProd.yml','WhenMainChanges.yml','WhenReleaseChanges.yml']
steps_need_vars=['./.github/actions/runComponentTests','./.github/actions/runService','./.github/actions/runUnitTests']
dontAddVars=[]
dontTouch=[]
token = sys.argv[-1]
owner = "Esmorga-Backend"  
repo = "esmorga-backend"  
urls= {}
urls[f"https://api.github.com/repos/{owner}/{repo}/actions/variables"]="variables"
urls[f"https://api.github.com/repos/{owner}/{repo}/actions/secrets"]="secrets"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github+json",
    "User-Agent": "Python-script"
}


failed_vars=[]
envs_to_create = {}
dir = '.github/workflows/'


def run_app():
    process = subprocess.run(['/usr/local/bin/npm','run','start'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out = process.stderr.splitlines()
    for line in out:
        if line[:12]==' - property ':
            failed_vars.append(line[12:].split('has')[0][:-1])


def get_env():
    req = urllib.request.Request(f"https://api.github.com/repos/{owner}/{repo}/environments", headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read().decode()
            add_querys_for_envs_to_urls(json.loads(data))

    except urllib.error.HTTPError as e:
        print(f"Error al hacer la solicitud: {e.code} {e.reason}")
        print(e.read().decode())

def add_querys_for_envs_to_urls(values):
    for value in values['environments']:

        urls[f"https://api.github.com/repos/{owner}/{repo}/environments/{value['name']}/variables"]="variables"
        urls[f"https://api.github.com/repos/{owner}/{repo}/environments/{value['name']}/secrets"]="secrets"


def add_envs_to_create_from_urls():
    for url in urls:
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req) as response:
                data = response.read().decode()
                values = json.loads(data)
                for v in values[urls[url]]:
                    envs_to_create[v['name']]=urls[url]


        except urllib.error.HTTPError as e:
            print(f"Error al hacer la solicitud: {e.code} {e.reason}")
            print(e.read().decode())


def get_yml_files_in_dir():
    files=[]
    yml_files = [f for f in os.listdir(dir) if f.endswith('.yml')]
    for yml_file in yml_files:
        if yml_file not in dontTouch:
            files.append(yml_file)
    return files

def process_yml_files(yml_file,change):
    with open(dir+yml_file, 'r') as file:
        data = yaml.load(file)
        data_orig=yaml.load(file)
        jobs=get_all_jobs_with_steps(data)
        data,change=check_steps_needs_inside_each_job(jobs,data,change)
        if data!=data_orig:
            with open(dir+yml_file, 'w') as file:
                yaml.dump(data, file)
            
    return change
        
def get_all_jobs_with_steps(data):
    jobs=[]
    for job in data['jobs']:
        if 'steps' in data['jobs'][job] :
            jobs.append(job)
    return jobs

def check_steps_needs_inside_each_job(jobs,data,change):
    step_n=0
    for job in jobs:
        while step_n < len(data['jobs'][job]['steps']):
            data,change=check_create_env_steps(data,change,job,step_n)
            data,change=check_steps_need_vars(data,change,job,step_n)
            step_n=step_n+1
    return data,change

def check_create_env_steps(data,change,job,step_n):
    if 'name' in data['jobs'][job]['steps'][step_n] and data['jobs'][job]['steps'][step_n]['name'] =='Create .env' :
        run=''
        for var in failed_vars:
            if var in envs_to_create:
                if envs_to_create[var] == 'variables':
                    run=run+'echo "'+var+'=${{vars.'+var+'}}" >> .env \n'
                else:
                    run=run+'echo "'+var+'=${{'+envs_to_create[var]+'.'+var+'}}" >> .env \n'
        if run!=data['jobs'][job]['steps'][step_n]['run']:
            data['jobs'][job]['steps'][step_n]['run']=run
            change=1

    return data,change

def check_steps_need_vars(data,change,job,step_n):
    if 'uses' in data['jobs'][job]['steps'][step_n] and data['jobs'][job]['steps'][step_n]['uses'] in steps_need_vars:
        if 'env' not in data['jobs'][job]['steps'][step_n]:
            data['jobs'][job]['steps'][step_n]['env']=dict()

        for var in failed_vars:
            if var not in data['jobs'][job]['steps'][step_n]['env'] and var in envs_to_create:
                if envs_to_create[var] == 'variables':
                    data['jobs'][job]['steps'][step_n]['env'][var]='${{vars.'+var+'}}'
                else:
                    data['jobs'][job]['steps'][step_n]['env'][var]='${{'+envs_to_create[var]+'.'+var+'}}'
                change=1
            
    return data,change                       
                                        

def main():
    change=0
    run_app()
    get_env()
    add_envs_to_create_from_urls()
    files=get_yml_files_in_dir()
    for file in files:
        change=process_yml_files(file,change)
    if change!=0:

        sys.exit(1)

main()