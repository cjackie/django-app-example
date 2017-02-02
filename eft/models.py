from django.db import models
from django.contrib.auth.models import User

class EtfRecord(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	symbol = models.CharField(max_length = 100)
	etf_name = models.CharField(max_length = 100) 
	fund_description = models.CharField(max_length = 4096)

class Holding(models.Model):
	record = models.ForeignKey(EtfRecord, on_delete=models.CASCADE)
	name = models.CharField(max_length=100)
	weight = models.FloatField()
	shares = models.IntegerField()

class CountryWeights(models.Model):
	record = models.ForeignKey(EtfRecord, on_delete=models.CASCADE)
	country = models.CharField(max_length=100)
	weight = models.FloatField()

class SectorWeights(models.Model):
	record = models.ForeignKey(EtfRecord, on_delete=models.CASCADE)
	sector = models.CharField(max_length=100)
	weight = models.FloatField()












