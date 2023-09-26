
## Vulnerability Scanning Using OpenVAS

Download required files.

```bash
# Download the docker-compose file
curl -f -L https://greenbone.github.io/docs/latest/_static/docker-compose-22.4.yml -o docker-compose.yml

# Download setup and start script to the current working dir
curl -f -O https://greenbone.github.io/docs/latest/_static/setup-and-start-greenbone-community-edition.sh && chmod u+x setup-and-start-greenbone-community-edition.sh
```

Setup the environment.

```bash
# Download the Greenbone Community Containers
docker compose -f ./docker-compose.yml -p greenbone-community-edition up -d

# Start the Greenbone Community Containers
docker compose -f ./docker-compose.yml -p greenbone-community-edition \
    exec -u gvmd gvmd gvmd --user=admin --new-password=iAm_Str0ng

# Show log messages of all services from the running containers
docker compose -f ./docker-compose.yml -p greenbone-community-edition logs -f
```

Start OpenVAS.

```bash
# Run setup and start script
./setup-and-start-greenbone-community-edition.sh
```

__Note:__
Linux: `xdg-open "http://127.0.0.1:9392" 2>/dev/null >/dev/null &`
Mac: `open "http://127.0.0.1:9392"`
Windows: `start "http://127.0.0.1:9392"` (Other commands would have to be modified as well)
