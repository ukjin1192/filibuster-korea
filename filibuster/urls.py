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
        r'^menu/$', 
        TemplateView.as_view(template_name='menu.html')
    ),
    url(
        r'^praise/$', 
        TemplateView.as_view(template_name='praise.html')
    ),
    url(
        r'^records/$', 
        TemplateView.as_view(template_name='records.html')
    ),
    url(
        r'^story/$', 
        TemplateView.as_view(template_name='category.html')
    ),
    url(
        r'^foreign_case/$', 
        TemplateView.as_view(template_name='category.html')
    ),
    url(
        r'^quotation/$', 
        TemplateView.as_view(template_name='category.html')
    ),
    url(
        r'^resident_abroad/$', 
        TemplateView.as_view(template_name='category.html')
    ),
    url(
        r'^letter/$', 
        TemplateView.as_view(template_name='category.html')
    ),
    url(
        r'^law_book/$', 
        TemplateView.as_view(template_name='category.html')
    ),
    url(
        r'^civil_complaint/$', 
        TemplateView.as_view(template_name='category.html')
    ),
    url(
        r'^search/$', 
        TemplateView.as_view(template_name='search.html')
    ),
    url(
        r'^$', 
        TemplateView.as_view(template_name='landing.html')
    ),
]
