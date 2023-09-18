provider "aws" {
  region = "us-west-2"
}

# Create an EC2 instance
resource "aws_instance" "linux_playground" {
  ami           = "ami-04e35eeae7a7c5883"
  instance_type = "t2.small"
  key_name      = "linux_playground_key"
  security_groups = [aws_security_group.linux_playground_sg.name]

  # Specify the EBS root volume size (in GB)
  root_block_device {
    volume_size = 30
    delete_on_termination = true
  }

  provisioner "remote-exec" {
    connection {
          type        = "ssh"
          user        = "ec2-user"
          private_key = file("~/.ssh/ec2_build_break_learn")
          host        = aws_instance.linux_playground.public_ip
        }

    inline = [
      "sudo yum update -y",
      "sudo yum install -y docker git maven tmux",
      "sudo service docker start",
      "sudo usermod -aG docker $USER",
      "id ec2-user",
      # Install Docker Compose
      "sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "docker-compose --version",
      "id ec2-user",

##      # Setup Security Shepherd | 80
##      "git config --global user.name 'Riddhi S.'",
##      "git config --global user.email 'training@nullcon.goa'",
##      "cd ~",
##      "git clone https://github.com/OWASP/SecurityShepherd.git",
##      "cd SecurityShepherd/",
##      "mvn -Pdocker clean install -DskipTests",
##      "tmux new-session -d -s shepherd 'sudo docker-compose -f ~/SecurityShepherd/docker-compose.yml up -d --build'",

##      # Juice Shop | 3001
##      "tmux new-session -d -s juice_shop 'sudo docker run -d -p 3001:3000 bkimminich/juice-shop'",

##      # DVWA | 4280
##      "cd ~",
##      "git clone https://github.com/digininja/DVWA.git",
##      "cd DVWA/",
##      "tmux new-session -d -s dvwa 'sudo docker-compose -f ~/DVWA/compose.yml up -d --build'"

##      # XSS Demo App | 4321, 3000
##      # CRUD API Demo App | 1234, 8080
    ]
  }

  provisioner "file" {
    connection {
          type        = "ssh"
          user        = "ec2-user"
          private_key = file("~/.ssh/ec2_build_break_learn")
          host        = aws_instance.linux_playground.public_ip
        }

    source      = "./local_playground" 
    destination = "/home/ec2-user"
  }

  provisioner "remote-exec" {
    connection {
          type        = "ssh"
          user        = "ec2-user"  # Use the appropriate username for your AMI
          private_key = file("~/.ssh/ec2_build_break_learn")
          host        = aws_instance.linux_playground.public_ip
        }

    inline = [
##      # Start CRUD API Demo App
##      "cd /home/ec2-user/app/app2/",
##      "tmux new-session -d -s crud_api 'sudo docker-compose -f /home/ec2-user/app/app2/docker-compose.yml up --build'",
##
##      # Start XSS Demo App
##      "cd /home/ec2-user/app/app1/",
##      "tmux new-session -d -s xss_backend 'sudo docker-compose -f /home/ec2-user/app/app1/backend/docker-compose.yml up --build'",
##      "sudo chmod +x /home/ec2-user/app/app1/init.sh",
##      "tmux new-session -d -s xss_demo '/home/ec2-user/app/app1/init.sh'",
##
##      # Start misconfig, rce and ssrf demo apps
##      "tmux new-session -d -s misconfig 'sudo docker-compose -f /home/ec2-user/app/misconfig/docker-compose.yml up --build'",
##      "tmux new-session -d -s rce 'sudo docker-compose -f /home/ec2-user/app/rce/docker-compose.yml up --build'",
##      "tmux new-session -d -s ssrf 'sudo docker-compose -f /home/ec2-user/app/ssrf/docker-compose.yml up --build'",

        # Start vulnerable servers
        "cd /home/ec2-user/local_playground/",
        "chmod +x tmux_setup.sh",
        "chmod +x monitor.sh",
        "chmod +x setup.sh",
        "chmod +x teardown.sh",
        "./tmux_setup.sh"
    ]
  }
}

# Create a security group for the EC2 instance
resource "aws_security_group" "linux_playground_sg" {
  name_prefix = "linux_playground_sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Open to all incoming traffic (not recommended for production)
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Open to all incoming traffic (not recommended for production)
  }

  ingress {
    from_port   = 1234
    to_port     = 1234
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 2222
    to_port     = 2222
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3333
    to_port     = 3333
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 4280
    to_port     = 4280
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 4444
    to_port     = 4444
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5555
    to_port     = 5555
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Open SSH access to all (for demonstration purposes)
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create an AWS key pair
resource "aws_key_pair" "linux_playground_key" {
  key_name   = "linux_playground_key"
  public_key = file("~/.ssh/ec2_build_break_learn.pub")  # Replace with the path to your public key
}

# Output the public IP address of the instance
output "linux_playground_public_ip" {
  value = aws_instance.linux_playground.public_ip
}