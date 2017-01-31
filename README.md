## What is it
saerch and dispaly ETF(Exchange-Traded Fund).

## Pre-requisites
- python 2.7.0+
- django 1.10.0+
instructions in Ubuntu
```shell
sudo apt-get python-pip
sudo apt-get django
```

## Installation
```shell
cd [path_to_store]
git clone https://github.com/cjackie/django-app-example.git
```

## Run Local Development Site
```shell
cd [to django-app-example]
cd mysite
python manage.py runserver
```

## Useful Commands
django
```shell
# create a project
django-admin startproject mysite
# mysite folder contains all configuration related stuff.


# start a app 
python manage.py startapp app
# a folder app/ is created. this contains all models, views, and related stuff.
#  the actual content of a website.


# to create db from models
python manage,py makemigrations  # needed if models.py are modified.
python manage.py migrate         # create db tables


# create super user
python manage.py createsuperuser
# user name and password to access /admin app.


# run server
python manage.py runserver
# or
python manage.py runserver 0.0.0.0:8000


# collecting static file
python manage.py collectstatic
# it saves static files in `STATICFILES_DIRS` into `STATIC_ROOT`
# then it is ready to be used.
```

reactjs
```
# compile with babel
/home/chaojie/Repo/ProtoPad/node_modules/.bin/babel file.jsx > file.js
```