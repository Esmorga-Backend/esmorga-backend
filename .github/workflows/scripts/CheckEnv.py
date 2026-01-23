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


def fetch_github_items(url_base, item_type):
    items = []
    page = 1
    while True:
        url = f"{url_base}?per_page=100&page={page}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                new_items = data.get(item_type, [])
                if not new_items:
                    break
                items.extend(new_items)
                if len(new_items) < 100:
                    break
                page += 1
        except urllib.error.HTTPError as e:
            if e.code == 404:
                break
            print(f"Error fetching {item_type} from {url}: {e.code} {e.reason}")
            break
        except Exception as e:
            print(f"Error fetching {item_type} from {url}: {e}")
            break
    return items


def get_all_envs_and_vars():
    # 1. Repo variables/secrets
    repo_vars = fetch_github_items(f"https://api.github.com/repos/{owner}/{repo}/actions/variables", "variables")
    for v in repo_vars:
        if os.getenv(v['name']) == None:
            envs_to_create[v['name']] = "variables"
            
    repo_secrets = fetch_github_items(f"https://api.github.com/repos/{owner}/{repo}/actions/secrets", "secrets")
    for s in repo_secrets:
        if os.getenv(s['name']) == None:
            envs_to_create[s['name']] = "secrets"

    # 2. Org variables/secrets (if owner is an org)
    org_vars = fetch_github_items(f"https://api.github.com/orgs/{owner}/actions/variables", "variables")
    for v in org_vars:
        if v['name'] not in envs_to_create and os.getenv(v['name']) == None:
            envs_to_create[v['name']] = "variables"

    org_secrets = fetch_github_items(f"https://api.github.com/orgs/{owner}/actions/secrets", "secrets")
    for s in org_secrets:
        if s['name'] not in envs_to_create and os.getenv(s['name']) == None:
            envs_to_create[s['name']] = "secrets"

    # 3. Environment variables/secrets
    try:
        req = urllib.request.Request(f"https://api.github.com/repos/{owner}/{repo}/environments", headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            for env in data.get('environments', []):
                env_name = env['name']
                e_vars = fetch_github_items(f"https://api.github.com/repos/{owner}/{repo}/environments/{env_name}/variables", "variables")
                for v in e_vars:
                    if v['name'] not in envs_to_create and os.getenv(v['name']) == None:
                        envs_to_create[v['name']] = "variables"
                
                e_secrets = fetch_github_items(f"https://api.github.com/repos/{owner}/{repo}/environments/{env_name}/secrets", "secrets")
                for s in e_secrets:
                    if s['name'] not in envs_to_create and os.getenv(s['name']) == None:
                        envs_to_create[s['name']] = "secrets"
    except Exception as e:
        print(f"Note: Could not fetch environments or their variables: {e}")

    print(f"Total unique variables/secrets consolidated from GitHub: {len(envs_to_create)}")
    if len(envs_to_create) > 0:
        print(f"Variables found: {', '.join(list(envs_to_create.keys())[:10])} {'...' if len(envs_to_create) > 10 else ''}")


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
            else:
                print(f"Warning: {var} is missing from GitHub Variables/Secrets and local environment.")
        if run!=data['jobs'][job]['steps'][step_n]['run']:
            data['jobs'][job]['steps'][step_n]['run']=run
            change=1

    return data,change

def check_steps_need_vars(data,change,job,step_n):
    if 'uses' in data['jobs'][job]['steps'][step_n] and data['jobs'][job]['steps'][step_n]['uses'] in steps_need_vars:
        if 'env' not in data['jobs'][job]['steps'][step_n]:
            data['jobs'][job]['steps'][step_n]['env']=dict()

        for var in failed_vars:
            if var not in data['jobs'][job]['steps'][step_n]['env']:
                if var in envs_to_create:
                    if envs_to_create[var] == 'variables':
                        data['jobs'][job]['steps'][step_n]['env'][var]='${{vars.'+var+'}}'
                    else:
                        data['jobs'][job]['steps'][step_n]['env'][var]='${{'+envs_to_create[var]+'.'+var+'}}'
                    change=1
                else:
                    print(f"Warning: {var} is missing from GitHub Variables/Secrets and local environment.")
            
    return data,change                       
                                        

def main():
    change=0
    run_app()
    get_all_envs_and_vars()
    files=get_yml_files_in_dir()
    for file in files:
        change=process_yml_files(file,change)
    if change!=0:

        sys.exit(1)

main()