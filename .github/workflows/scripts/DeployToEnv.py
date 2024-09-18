import paramiko
import sys
import io
key=sys.argv[2]
hostname=sys.argv[1]
pkey = paramiko.RSAKey.from_private_key(io.StringIO(key))
print(hostname)
ssh_client =paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(hostname=hostname,port='22',username='ubuntu',pkey=pkey)
command = """sudo systemctl stop esmorga.service
cd /opt/esmorga-backend/
git reset --hard HEAD
git clean -df
git pull
echo "APP_PORT=3000" > .env
echo "MONGODB_URI=mongodb://localhost:27017/esmorga" >> .env
echo "NODE_ENV=LOCAL" >> .env
echo "JWT_SECRET=j1u5RDS8Ga4hzDcS1vGULNPHYMGjMfjINLarWJM9UIjAVPxgFUgA1tMc/OT4NItCzGqU/cGlkjg4l6kgqcNEcQ" >> .env
echo "ACCESS_TOKEN_TTL=600" >> .env
echo "MAX_PAIR_OF_TOKEN=5" >> .env
echo "DNS_NAME=https://qa.esmorga.org" >> .env
echo "APP_LINK=https://www.google.com" >> .env
echo "EMAIL_USER=esmorgamailservice@gmail.com" >> .env
echo "EMAIL_PASS=\"piop hszr qkww uexk\"" >> .env
npm ci
sudo systemctl start esmorga.service"""
stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)
ssh_client.close()