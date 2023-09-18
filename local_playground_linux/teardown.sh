# Setup Security Shepherd | 80
##docker-compose -f ./SecurityShepherd/docker-compose.yml down
# CRUD API | 1234
docker-compose -f ./app/app2/docker-compose.yml down
# Local Misconfiguration | 2222
docker-compose -f ./app/misconfig/docker-compose.yml down
# Juice Shop | 3001
## docker run -d -p 3001:3000 bkimminich/juice-shop
# Local RCE | 3333
docker-compose -f ./app/rce/docker-compose.yml down
# DVWA | 4280
##sudo docker-compose -f ./DVWA/compose.yml down
# Local SSRF | 4444
docker-compose -f ./app/ssrf/docker-compose.yml down
# XSS Demo | 4321
docker-compose -f ./app/app1/backend/docker-compose.yml down

docker stop `docker ps -aq`
docker rm `docker ps -aq`

echo 'y' | docker system prune
# sudo rm -r SecurityShepherd
# sudo rm -r DVWA
# sudo rm -r juice-shop
docker ps -a
