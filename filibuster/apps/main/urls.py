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
        view='get_recent_comments'
    ),
    url(
        regex=r'^comments/search/$',
        view='get_searched_comments'
    ),
    url(
        regex=r'^comments/pick/$',
        view='get_picked_comments'
    ),
    url(
        regex=r'^comments/abusing/$',
        view='get_abusing_comments'
    ),
    url(
        regex=r'^comments/delete/$',
        view='delete_comments'
    ),
)
