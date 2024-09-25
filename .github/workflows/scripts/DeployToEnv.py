import paramiko
import sys
import io
key=sys.argv[4]
service=sys.argv[2]
service_path=sys.argv[3]
hostname=sys.argv[1]
pkey = paramiko.RSAKey.from_private_key(io.StringIO(key))
print(hostname)
ssh_client =paramiko.SSHClient()

ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(hostname=hostname,port='22',username='ubuntu',pkey=pkey)
command = """sudo systemctl stop """+service+"""
cd """+service_path+"""
git reset --hard HEAD
git clean -df
git pull"""
stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)

ftp_client=ssh_client.open_sftp()
ftp_client.put('.env','.env')
ftp_client.close()

command = """
cp .env """+service_path+"""
cd """+service_path+"""
npm ci
sudo systemctl start  """+service
stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)
ssh_client.close()


