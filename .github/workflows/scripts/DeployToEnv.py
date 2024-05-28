import paramiko
import sys
try:
    import StringIO 
except ImportError:
    from io import StringIO 

hostname=sys.argv[1]
pkey = paramiko.RSAKey.from_private_key(StringIO.StringIO(sys.argv[2]))
print(hostname)
ssh_client =paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(hostname=hostname,port='22',username='ubuntu',pkey=pkey)
command = "sudo systemctl stop esmorga.service;cd /opt/esmorga-backend/; git reset --hard HEAD ; git clean -df; git pull ;sudo systemctl start esmorga.service"
stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)
ssh_client.close()