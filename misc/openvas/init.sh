# Download the docker-compose file
curl -f -L https://greenbone.github.io/docs/latest/_static/docker-compose-22.4.yml -o docker-compose.yml

# Download setup and start script to the current working dir
curl -f -O https://greenbone.github.io/docs/latest/_static/setup-and-start-greenbone-community-edition.sh && chmod u+x setup-and-start-greenbone-community-edition.sh

# Download the Greenbone Community Containers
docker compose -f ./docker-compose.yml -p greenbone-community-edition up -d

# Start the Greenbone Community Containers
docker compose -f ./docker-compose.yml -p greenbone-community-edition \
    exec -u gvmd gvmd gvmd --user=admin --new-password=iAm_Str0ng

# Run setup and start script
./setup-and-start-greenbone-community-edition.sh

# Show log messages of all services from the running containers
docker compose -f ./docker-compose.yml -p greenbone-community-edition logs -f
