FROM python:3.6.0
COPY . /app
WORKDIR /app
RUN apt-get update
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN apt-get install postgresql python-psycopg2 libpq-dev -y
RUN pip install psycopg2 --upgrade
RUN pip install --upgrade sqlalchemy

RUN pip install pyjwt==0.4.3
RUN pip install cryptography
RUN pip install -U flask-cors
RUN apt-get install python3-setuptools -y

EXPOSE 5000
ENTRYPOINT [ "python" ]
CMD [ "manage.py", "runserver" ]