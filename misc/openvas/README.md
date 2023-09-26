# OpenVAS

## Tool Setup

* Download the required files.

    ```bash
    # Download the docker-compose file
    curl -f -L https://greenbone.github.io/docs/latest/_static/docker-compose-22.4.yml -o docker-compose.yml

    # Download setup and start script to the current working dir
    curl -f -O https://greenbone.github.io/docs/latest/_static/setup-and-start-greenbone-community-edition.sh && chmod u+x setup-and-start-greenbone-community-edition.sh
    ```

* Setup the environment.

    ```bash
    # Download the Greenbone Community Containers
    docker compose --build -f ./docker-compose.yml -p greenbone-community-edition up -d

    # Start the Greenbone Community Containers
    docker compose --build -f ./docker-compose.yml -p greenbone-community-edition \
        exec -u gvmd gvmd gvmd --user=admin --new-password=iAm_Str0ng
    ```

* Start OpenVAS.

    ```bash
    # Run setup and start script
    ./setup-and-start-greenbone-community-edition.sh

    # Show log messages of all services from the running containers
    docker compose -f ./docker-compose.yml -p greenbone-community-edition logs -f
    ```

    __Note:__
    Linux: `xdg-open "http://127.0.0.1:9392" 2>/dev/null >/dev/null &`
    Mac: `open "http://127.0.0.1:9392"`
    Windows: `start "http://127.0.0.1:9392"` (Other commands would have to be modified as well)

## Web Application Vulnerability Scanning

1. Go to http://127.0.0.1:9392/
2. Login using admin credentials.
3. Go to "Configuration" > "Port Lists", and add a new list.
    * Name: "`build.break.learn`"
    * Port Ranges: "`T:1234,2222,3001,3333,4280,4444,5555,6001,8899,9090,80,443,4443,3000,5000,7000`"
4. Go to "Configuration" > "Targets", and add a new target.
    * Name: "`Security Ninja`"
    * Hosts: [Enter the "host" value obtained from running the command `ngrok http 8899`]
    * Port List: "`build.break.learn`"
    * Alive Test: "`Consider Alive`"
5. Go to "Scans" > "Tasks", and add a new task.
    * Name: "`Security Ninja`"
    * Scan Targets: "`Security Ninja`"
6. Click on "Start" icon to execute the newly created task.