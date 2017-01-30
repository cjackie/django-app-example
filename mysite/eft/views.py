from django.shortcuts import render, redirect
from django.http import HttpResponse

import django.contrib.auth as auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from apps import EftConfig

def index(request):
	return render(request, 'index.html', {})

def signup_view(request):
	return render(request, 'signup.html', {})

def login(request):
	if 'POST' != request.method:
		return render(request, 'message.html',
				{'message': 'login failed1'}, status=400)

	if 'username' not in request.POST or 'password' not in request.POST:
		return render(request, 'message.html',
				{'message': 'login failed2'}, status=400)

	username = request.POST['username']
	password = request.POST['password']

	# TODO more careful username and password validation
	if username == '' or password == '':
		return render(request, 'message.html',
				{'message': 'login failed3'}, status=400)

	# validation
	user = auth.authenticate(username=username, password=password)
	if None == user:
		return render(request, 'message.html',
				{'message': 'login failed4'}, status=400)

	# login
	auth.login(request, user)

	# then redirect
	return redirect('search')

def signup(request):
	if 'POST' != request.method:
		return render(request, 'message.html',
				{'message': 'signup failed1'}, status=400)

	post_data = request.POST
	if 'username' not in post_data or 'password' not in post_data or \
		'email' not in post_data or 'first_name' not in post_data or \
		'last_name' not in post_data:
		return render(request, 'message.html',
				{'message': 'signup failed2'}, status=400)

	username = post_data['username']
	password = post_data['password']
	email = post_data['email']
	first_name = post_data['first_name']
	last_name = post_data['last_name']

	# TODO validate the input
	try:
		user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, 
			last_name=last_name)
		user.save()
	except Exception as e:
		return render(request, 'message.html',
				{'message': str(e)}, status=400)

	return render(request, 'message.html',
				{'message': 'register successfully'}, status=200)

def logout(request):
	auth.logout(request)
	return redirect('index')

@login_required
def search(request):
	return render(request, 'search.html')

@login_required
def history(request):
	return render(request, 'history.html')


