# -*- coding: utf-8 -*-

from django.conf.urls import patterns, url


urlpatterns = patterns(
    'main.views',
    url(
        regex=r'^comments/create/$',
        view='create_comment'
    ),
    url(
        regex=r'^comments/list/$',
        view='get_comments'
    ),
    url(
        regex=r'^comments/spoken/$',
        view='get_random_spoken_comments'
    ),
)
