## Vulnerability Scanning Using OWASP ZAP

1. Explore the target application manually.
2. Run a full scan using OWASP ZAP scanner:

    ```
    docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
    -t https://192.168.1.6 -g gen.conf -r testreport.html
    ```
    _Note:_ $(pwd) is only supported on Linux and MacOS. On Windows, replace it with the full current working directory path.

3. Open `testreport.html` file to view the scan results.
4. Add more options and re-scan the target application:

    ```
    docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
    -t https://192.168.1.6 -g gen.conf -r testreport2.html -a -j -s -l INFO

    docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
    -t https://192.168.1.6 -g gen.conf -r testreport3.html -a -j -s -l INFO --hook=hook1.py

    docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
    -t https://192.168.1.6 -g gen.conf -r testreport4.html -a -j -s -l INFO --hook=hook2.py
    ```

    hook1.py
    ```py
    #  Specify the hooks location by using a command line flag --hook=my-hooks.py
    # https://www.zaproxy.org/docs/docker/scan-hooks/
    # https://github.com/zaproxy/community-scripts/tree/main/other/scan-hooks

    # Change the zap_ajax_spider target to hit admin path 
    # Change the crawl_depth to 2
    def zap_ajax_spider(zap, target, max_time):
        zap.ajaxSpider.set_option_max_crawl_depth(2)
        return zap, target + '/admin.html', max_time
    ```

    hook2.py
    ```py
    # Change the zap_ajax_spider target to hit home path 
    # Change the crawl_depth to 2
    def zap_ajax_spider(zap, target, max_time):
        zap.ajaxSpider.set_option_max_crawl_depth(2)
        return zap, target + '/home.html', max_time
    ```

5. Open and analyze the generated test reports.
