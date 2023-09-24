FROM ubuntu:16.04
RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN apt-get update && apt-get install -y python-software-properties software-properties-common postgresql-9.3 postgresql-client-9.3 postgresql-contrib-9.3

RUN apt-get install software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update
RUN apt-get install python3.6 python3-setuptools python3.6-venv -y &&\
        rm /usr/bin/python3 &&\
        ln -s /usr/bin/python3.6 /usr/bin/python3

RUN apt-get install curl apt-utils -y
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3 get-pip.py --force-reinstall

COPY ./data/ /flask-jwt-auth
WORKDIR /flask-jwt-auth
RUN chown postgres:postgres /flask-jwt-auth
RUN chmod +x /flask-jwt-auth

RUN python3 -m venv py36-venv
RUN . py36-venv/bin/activate

RUN apt-get install python3-setuptools -y
RUN pip install -r requirements.txt
RUN pip install psycopg2-binary --upgrade
RUN pip install coverage --upgrade
RUN pip install --user --upgrade cffi
RUN pip install --user --upgrade bcrypt
RUN pip install --upgrade sqlalchemy
RUN pip install pyjwt==0.4.3
RUN pip install cryptography
RUN pip install -U flask-cors

USER postgres

RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" &&\
    createdb -O docker docker

RUN /etc/init.d/postgresql start &&\
    psql --command "create database flask_jwt_auth;" &&\
    psql --command "create database flask_jwt_auth_test;"
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.3/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/9.3/main/postgresql.conf

RUN export APP_SETTINGS="project.server.config.DevelopmentConfig"

RUN /etc/init.d/postgresql start &&\
    sleep 5 &&\
    python3 manage.py create_db
RUN /etc/init.d/postgresql start &&\
    sleep 5 &&\
    python3 manage.py db init
RUN /etc/init.d/postgresql start &&\
    sleep 5 &&\
    python3 manage.py db migrate

EXPOSE 5432

VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]
CMD ["/usr/lib/postgresql/9.3/bin/postgres", "-D", "/var/lib/postgresql/9.3/main", "-c", "config_file=/etc/postgresql/9.3/main/postgresql.conf"]
