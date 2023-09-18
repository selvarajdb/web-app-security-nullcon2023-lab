cd ./app/app1/backend/
docker-compose up -d --build

dig +short myip.opendns.com @resolver1.opendns.com
export SERVER_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)
echo $SERVER_IP

curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password321"}' http://localhost:3000/create-admin
while [ $? -ne 0 ]; do curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password321"}' http://localhost:3000/create-admin; done

cd ../frontend/
sudo python3 https_server.py
cd ../../