from django.db import models
from django.contrib.auth.models import User

class EftRecord(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	# csv formatted string with columns: 'holidng 1, holding 2, ..., holding 10'
	top_10_holdings = models.CharField(max_length = 2048) 
	# csv formatted with columns: 'country, weight'
	country_weights = models.CharField(max_length = 4096)
	# csv formatted with columns: 'sector, weight'
	sector_weights = models.CharField(max_length = 4096)
	fund_description = models.CharField(max_length = 4096)





