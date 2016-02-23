# -*- coding: utf-8 -*-

from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = [

    # Admin
    url(
        r'^admin/', 
        include(admin.site.urls)
    ),

    # Captcha for human validation
    url(
        r'^captcha/', 
        include('captcha.urls')
    ),

    # API end points
    url(
        r'^api/', 
        include('main.urls')
    ),

    # Front-end page
    url(
        r'^', 
        TemplateView.as_view(template_name='index.html')
    ),
]
