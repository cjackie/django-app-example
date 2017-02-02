## What is it
saerch and dispaly ETF(Exchange-Traded Fund).

## Pre-requisites
- python 2.7.0+
- django 1.10.0+
- BeautifulSoup 4.5.3+
instructions in Ubuntu
```shell
sudo apt-get python-pip
sudo pip install django
sudo pip install beautifulsoup4
```

## Installation
```shell
cd [path_to_store]
git clone https://github.com/cjackie/django-app-example.git
```
configure static directions if needed, by changing ```STATIC_ROOT``` in the ```setting.py```. Then run
```shell
python manage.py collectstatic  
```
database related
```shell
python manage.py makemigrations
python manage.py migrate
```

## Run Local Development Site
```shell
cd [to django-app-example]
cd mysite
python manage.py runserver
```
then open up a browser and go to http://127.0.0.1:8000/eft/search


## dummy user
```
useranme: test
password: test
```
