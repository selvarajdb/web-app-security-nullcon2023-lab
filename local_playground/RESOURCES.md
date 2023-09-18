
# Reference:
# https://shamsher-khan-404.medium.com/docker-images-for-penetration-testing-security-7362519985b8

```bash
#9 Graphql
docker run --platform linux/amd64 -p 6000:3000 -itd --rm carvesystems/vulnerable-graphql-api
## curl -X POST -H "Content-Type: application/json" -d '{"query": "{__schema {types {name}} }"}' http://127.0.0.1:6666/graphql
## curl -X POST -H "Content-Type: application/json" -d '{"query": "{__schema{types{name,fields{name,args{name,description,type{name,kind,ofType{name, kind}}}}}}}"}' http://127.0.0.1:6666/graphql
## curl -X POST -H "Content-Type: application/json" -d '{"query": "{__schema}"}' http://127.0.0.1:6666/graphql
## curl -X POST -H "Content-Type: application/json" -d '{"query": "{}"}' http://127.0.0.1:6666/graphql

#10 SQL Injection
docker run --platform linux/amd64 -p 6001:80 -p 6602:3306 -itd --rm acgpiano/sqli-labs
## http://127.0.0.1:6001/ > `Setup/reset Database for labs`

#11 OWASP Mutillidae II Web Pen-Test Practice Application
docker run --platform linux/amd64 -p 7001:80 -p 7002:3306 -itd --rm citizenstig/nowasp

#12 Archlinux with BlackArch and yay pre-installed for pentesters 
docker run --platform linux/amd64 -p 5900:5900 -itd --rm noncetonic/archlinux-pentest-lxde:1.0

#13 Metasploitable2 - An intentionally vulnerable Ubuntu Linux virtual machine
docker run --name container-name -it tleemcjr/metasploitable2:latest sh -c "/bin/services.sh && bash"
## https://docs.rapid7.com/metasploit/metasploitable-2-exploitability-guide

#14 Security_Ninjas_AppSec_Training
docker run --platform linux/amd64 --name container-name -p 8899:80 -itd --rm opendns/security-ninjas

#15 Heartbleed Vulnerability
docker run -d -p 8443:443 hmlio/vaas-cve-2014-0160
## https://127.0.0.1:8443/index.html
## https://hub.docker.com/r/hmlio/vaas-cve-2014-0160/
## https://github.com/hmlio/vaas-cve-2014-0160

#16 Shellshock Vulnerability
docker run -d -p 9090:80 hmlio/vaas-cve-2014-6271
## https://hub.docker.com/r/hmlio/vaas-cve-2014-6271/

#17
docker pull metasploitframework/metasploit-framework 
## https://hub.docker.com/r/metasploitframework/metasploit-framework
## https://www.offsec.com/metasploit-unleashed/wmap-web-scanner/
```