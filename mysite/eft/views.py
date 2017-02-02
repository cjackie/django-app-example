from django.shortcuts import render, redirect
from django.http import HttpResponse

import django.contrib.auth as auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from apps import EftConfig
from . import models as etf_models

import json
from parser import parse_by_symbol

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



### ajax apis #######
@login_required
def _history(request):
	if not request.is_ajax():
		return HttpResponse(json.dumps({'error': 'bad header'}), status=404,
								content_type='application/json')

	user = request.user
	response_data = {
		'records': [],
	}
	for record in etf_models.EtfRecord.objects.filter(user_id=user.id):
		r = {}
		r['symbol'] = record.symbol
		r['etf_name'] = record.etf_name
		r['fund_description'] = record.fund_description
		response_data['records'].append(r)
	return HttpResponse(json.dumps(response_data), status=200, content_type='application/json')

@login_required
def _search(request):
	'''
	data format example: {'symbol': 'DTS'}
	'''
	user = request.user
	if 'GET' != request.method or not request.is_ajax():
		return HttpResponse(json.dumps({'error': 'bad header'}), status=404,
								content_type='application/json')

	record = None
	try :
		# TODO validate the data, 
		symbol = request.GET['symbol']
		# getting from db if possible
		data = etf_models.EtfRecord.objects.filter(symbol=symbol)
		if (len(data) > 0):
			# no need to query again, it is in the db.
			record = data[0]
	except Exception as error:
		error_msg = {
			'error': str(error),
			'user_msg': 'Server encountered an error'
		}
		return HttpResponse(json.dumps(error_msg), content_type='application/json', status=400)

	try:
		if (None == record): 
			# need to parse from the website
			etf_data = parse_by_symbol(symbol)
			# save it to db
			record = etf_models.EtfRecord.objects.create(user=user, symbol=etf_data['symbol'], 
															etf_name=etf_data['etf_name'], 
															fund_description=etf_data['fund_description'])
			record.save()
			for holding in etf_data['top_10_holdings']:
				h = etf_models.Holding.objects.create(record=record, name=holding['name'], 
														weight=holding['weight'], shares=holding['shares'])
				h.save()
			for country_weight in etf_data['country_weights']:
				cw = etf_models.CountryWeights.objects.create(record=record, country=country_weight['country'],
																weight=country_weight['weight'])
				cw.save()
			for sector_weight in etf_data['sector_weights']:
				sw = etf_models.SectorWeights.objects.create(record=record, sector=sector_weight['sector'],
																weight=sector_weight['weight'])
				sw.save()
	except Exception as error:
		# undo possible changes to db
		data = etf_models.EtfRecord.objects.filter(symbol=symbol)
		if (len(data) > 0):
			record = data[0]
			record.delete()
		error_msg = {
			'error': str(error),
			'user_msg': 'invalid symbol'
		}
		# raise error # for debug
		return HttpResponse(json.dumps(error_msg), content_type='application/json', status=400)

	# construct response
	response_data = {}
	response_data['fund_description'] = record.fund_description
	response_data['etf_name'] = record.fund_description
	response_data['symbol'] = symbol

	top_10_holdings = []
	for h in record.holding_set.all():
		top_10_holdings.append({
			'name': h.name,
			'weight': h.weight,
			'shares': h.shares
		})

	country_weights = []
	for w in record.countryweights_set.all():
		country_weights.append({
			'country': w.country,
			'weight': w.weight
		})

	sector_weights = []
	for w in record.sectorweights_set.all():
		sector_weights.append({
			'sector': w.sector,
			'weight': w.weight
		})

	response_data['top_10_holdings'] = top_10_holdings
	response_data['country_weights'] = country_weights
	response_data['sector_weights'] = sector_weights

	return HttpResponse(json.dumps(response_data), status=200,
		content_type='application/json')

@login_required
def download(request, table, symbol):
	user = request.user
	records = etf_models.EtfRecord.objects.filter(symbol=symbol)
	if len(records) < 1:
		return HttpResponse(status=404)
	record = records[0]

	if 'top10holdings' == table:
		csv_data = 'name,weight,shares\n'
		for holding in record.holding_set.all():
			csv_data += '{0},{1},{2}\n'.format(holding.name, holding.weight, holding.shares)
		response = HttpResponse(csv_data)
		response['Content-Disposition'] = 'attachment;filename="holdings.csv"'
		return response
	elif 'countryweights' == table:
		csv_data = 'country,weight\n'
		for cw in record.countryweights_set.all():
			csv_data += '{0},{1}\n'.format(cw.country, str(cw.weight)+'%')
		response = HttpResponse(csv_data)
		response['Content-Disposition'] = 'attachment;filename="country weight.csv"'
		return response
	elif 'sectorweights' == table:
		csv_data = 'sector,weight\n'
		for sw in record.sectorweights_set.all():
			csv_data += '{0},{1}\n'.format(sw.sector, str(sw.weight)+'%')
		response = HttpResponse(csv_data)
		response['Content-Disposition'] = 'attachment;filename="sector weight.csv"'
		return response
	else:
		return HttpResponse(status=404)
