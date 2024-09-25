import paramiko
import sys
import io
service=sys.argv[2]
service_path=sys.argv[3]
hostname=sys.argv[1]
print(hostname)
ssh_client =paramiko.SSHClient()

ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
if len(sys.argv)>4:
    key=sys.argv[4]
    pkey = paramiko.RSAKey.from_private_key(io.StringIO(key))
    ssh_client.connect(hostname=hostname,port='22',username='ubuntu',pkey=pkey)
else:
    ssh_client.connect(hostname=hostname,port='22',username='ubuntu')
command = """sudo systemctl stop """+service+"""
sleep 30
cd """+service_path+"""
#git reset --hard HEAD
#git clean -df
git checkout pipe/MOB-149
git fetch
git pull"""
print(command)
stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)

ftp_client=ssh_client.open_sftp()
ftp_client.put('.env','.env')

command = """
cp .env """+service_path+"""
cd """+service_path+"""
npm ci
sudo systemctl start  """+service
print(command)
stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)
ftp_client.close()
ssh_client.close()


