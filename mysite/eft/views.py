from django.shortcuts import render
from django.http import HttpResponse

def index(request):
	return render(request, 'index.html', {})

def login(request):
	if 'POST' == request.method:
		return HttpResponse(status=404)

	if 'username' not in request.POST or password not in request.POST:
		return HttpResponse(status=404)

	username = request.POST['username']
	password = request.POST['password']
	# todo validation

	# then redirect
	return HttpResponse()

def get_etf_view(request):
	return Exception("not yet implemented.")