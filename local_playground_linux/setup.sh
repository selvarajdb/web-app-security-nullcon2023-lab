# To load nvm into current shell environment, source the script.
# `source your_script.sh` OR `. your_script.sh`

./teardown.sh

#1 Setup Security Shepherd | 80
docker run -d --platform linux/amd64 -p 80:8080 -p 443:8443 --name securityshepherd ismisepaul/securityshepherd

#2 CRUD API | 1234
docker-compose -f ./app/app2/docker-compose.yml up -d --build

#3 Local Misconfiguration | 2222
docker-compose -f ./app/misconfig/docker-compose.yml up -d --build

#4 Juice Shop | 3001
docker run -d --platform linux/amd64 -p 3001:3000 --name juiceshop bkimminich/juice-shop
##nvm use v18.16.1
#git clone https://github.com/juice-shop/juice-shop.git --depth 1
##cd juice-shop
##npm install
##npm start &
##cd ..

#5 Local RCE | 3333
docker-compose -f ./app/rce/docker-compose.yml up -d --build

#6 DVWA | 4280
docker run --platform linux/amd64 -d -p 4280:80 --name dvwa citizenstig/dvwa
##git clone https://github.com/digininja/DVWA.git
##docker-compose -f ./DVWA/compose.yml up -d --build

#7 Local SSRF | 4444
docker-compose -f ./app/ssrf/docker-compose.yml up -d --build

#9 SQL Injection | 6001, 6002
docker run --platform linux/amd64 -p 6001:80 -p 6602:3306 --name sqli -itd --rm acgpiano/sqli-labs
## http://127.0.0.1:6001/ > `Setup/reset Database for labs`

#10 Heartbleed Vulnerability | 4443
docker run -d --platform linux/amd64 -p 4443:443 --name heartbleed hmlio/vaas-cve-2014-0160
## https://127.0.0.1:4443/index.html
## https://hub.docker.com/r/hmlio/vaas-cve-2014-0160/
## https://github.com/hmlio/vaas-cve-2014-0160

#11 Shellshock Vulnerability | 9090
docker run -d --platform linux/amd64 -p 9090:80 --name shellshock hmlio/vaas-cve-2014-6271
## https://hub.docker.com/r/hmlio/vaas-cve-2014-6271/

#12 Security_Ninjas_AppSec_Training | 8899
docker run --platform linux/amd64 --name container-name -p 8899:80 --name securityninjas -itd --rm opendns/security-ninjas

#8 XSS Demo (Secure PoC) | 5555, 3000
## http://127.0.0.1:5555/
sudo chmod +x ./app/app1/init.sh
./app/app1/init.sh
