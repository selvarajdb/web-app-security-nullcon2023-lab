```bash
CONTAINER ID   IMAGE                           COMMAND                  CREATED              STATUS                     PORTS                                          NAMES
0f41e4a5754d   backend-server                  "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes               0.0.0.0:3000->3000/tcp                         xss_backend
fa192c14c83d   opendns/security-ninjas         "/bin/sh -c '/usr/sb…"   2 minutes ago   Up 2 minutes               0.0.0.0:8899->80/tcp                           securityninjas
dd60dc429ce6   hmlio/vaas-cve-2014-6271        "/usr/sbin/apache2ct…"   2 minutes ago   Up 2 minutes               0.0.0.0:9090->80/tcp                           shellshock
69ee62de2d17   hmlio/vaas-cve-2014-0160        "/usr/sbin/apache2ct…"   2 minutes ago   Up 2 minutes               0.0.0.0:4443->443/tcp                          heartbleed
18cb361c8c5b   acgpiano/sqli-labs              "/run.sh"                2 minutes ago   Up 2 minutes               0.0.0.0:6001->80/tcp, 0.0.0.0:6602->3306/tcp   sqli
49199a3b2414   ssrf/admin_server               "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes               21/tcp, 80/tcp, 1337/tcp                       ssrf_admin
19703df7276b   ssrf/non_admin_server           "ruby app.rb"            2 minutes ago   Up 2 minutes               4567/tcp                                       ssrf_ruby
ab6a8f4a4adc   ssrf/router                     "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes               0.0.0.0:4444->80/tcp                           ssrf_router
50018d6e95d8   ghcr.io/digininja/dvwa:latest   "docker-php-entrypoi…"   2 minutes ago   Up 2 minutes               0.0.0.0:4280->80/tcp                           dvwa_dvwa_1
45222a4e18e5   mariadb:10                      "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes               3306/tcp                                       dvwa_db_1
5b38650dffe0   rce/node_server                 "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes               0.0.0.0:3333->3000/tcp                         rce
fe3a7b661473   bkimminich/juice-shop           "/nodejs/bin/node /j…"   2 minutes ago   Up 2 minutes               0.0.0.0:3001->3000/tcp                         juiceshop
c0b834a0eaf6   misconfigured                   "docker-php-entrypoi…"   2 minutes ago   Up 2 minutes               0.0.0.0:2222->80/tcp                           misconfigured
e1a96da1953a   app2_my-apache-server           "httpd-foreground"       2 minutes ago   Up 2 minutes               0.0.0.0:1234->80/tcp                           crud_gui
e4677862b146   app2_spring-boot-app            "java -jar angular-s…"   2 minutes ago   Up 2 minutes (unhealthy)   0.0.0.0:8080->8080/tcp                         spring-boot-container
9fc40e1876db   postgres:latest                 "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes               0.0.0.0:5432->5432/tcp                         my-postgres-container
c26a78a35378   ismisepaul/securityshepherd     "catalina.sh run"        3 minutes ago   Up 2 minutes               0.0.0.0:8443->8443/tcp, 0.0.0.0:80->8080/tcp   securityshepherd
```