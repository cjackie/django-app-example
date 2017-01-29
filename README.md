## django
```shell
# create a project
django-admin startproject mysite
# mysite folder contains all configuration related stuff.


# start a app 
python manage.py startapp app
# a folder app/ is created. this contains all models, views, and related stuff.
#  the actual content of a website.



# to create db from models
python manage,py makeimgrations  # needed if models.py are modified.
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


# reactjs
```
# compile with babel
/home/chaojie/Repo/ProtoPad/node_modules/.bin/babel file.jsx > file.js
```