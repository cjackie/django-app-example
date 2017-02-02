from django.conf.urls import url

import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login$', views.login),
    url(r'^signup$', views.signup_view),
    url(r'^_signup$', views.signup),
    url(r'^logout$', views.logout),
    url(r'^history$', views.history, name='history'),
    url(r'^search$', views.search, name='search'),

    # ajax
    url(r'^api/search$', views._search, name='api_search'),
    url(r'^api/history$', views._history, name='api_history'),

    # download
    url(r'download/(?P<table>[0-9a-zA-Z]{,100})/(?P<symbol>[a-zA-Z]{,15})', views.download)
]