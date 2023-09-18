export IP_ADDRESS="127.0.0.1"
echo ${IP_ADDRESS}

open http://${IP_ADDRESS}:1234/  # API (CRUD)
open http://${IP_ADDRESS}:2222/  # Misconfiguration
open http://${IP_ADDRESS}:3001/#/    # Juice Shop
open http://${IP_ADDRESS}:3333/  # RCE
open http://${IP_ADDRESS}:4280/login.php # DVWA
open http://${IP_ADDRESS}:4444/  # SSRF
open http://${IP_ADDRESS}:5555/  # XSS
open http://${IP_ADDRESS}:6001/  # SQLi
open http://${IP_ADDRESS}:8899/  # Security Ninja
open http://${IP_ADDRESS}:9090/  # Shellshock
open https://${IP_ADDRESS}:443/setup.jsp    # Security Shepherd
open https://${IP_ADDRESS}:4443/ # Heartbleed