"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf.urls.static import static

from django.shortcuts import redirect

from . import settings
import eft

def redirect_to_eft(request):
    return redirect('/eft/')

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    
    url(r'^$', redirect_to_eft),
	url(r'^eft/', include('eft.urls'))
] + static(settings.STATIC_URL, 
	document_root=settings.STATIC_ROOT) # only for dev only..
