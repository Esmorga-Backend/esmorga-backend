import paramiko
import sys
import io
service=sys.argv[2]
service_path=sys.argv[3]
image_and_tag=sys.argv[4]
port=sys.argv[5]
hostname=sys.argv[1]
ssh_client =paramiko.SSHClient()

ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
if len(sys.argv)>6:
    key=sys.argv[6]
    pkey = paramiko.RSAKey.from_private_key(io.StringIO(key))
    ssh_client.connect(hostname=hostname,port='22',username='ubuntu',pkey=pkey)
else:
    ssh_client.connect(hostname=hostname,port='22',username='ubuntu')
command = """
docker pull """+image_and_tag+"""
sudo touch /var/www/html/"""+service+""".flag
sudo docker stop """+service+""" ; docker stop """+service+"""
"""

stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)

ftp_client=ssh_client.open_sftp()
ftp_client.put('.env','.env')

command = """
cp .env """+service_path+"""
cd """+service_path+"""
sudo docker run -d --restart unless-stopped --memory 100m --memory-swap 100m -p """port""":"""port""" --env-file .env --name """+service+""" """+image_and_tag+"""
sleep 10
sudo rm /var/www/html/"""+service+""".flag"""

stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)
ftp_client.close()
ssh_client.close()