from django.contrib import admin

from models import EtfRecord, Holding, CountryWeights, SectorWeights

# Register your models here.
admin.site.register(EtfRecord)
admin.site.register(Holding)
admin.site.register(CountryWeights)
admin.site.register(SectorWeights)