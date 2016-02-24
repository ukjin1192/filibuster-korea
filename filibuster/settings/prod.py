#!usr/bin/python
# -*- coding:utf-8 -*-

from base import *

# Debugging option
DEBUG = False
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS = [
    config.get('django', 'domain_url')
]
INTERNAL_IPS = (
    '127.0.0.1',
)

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config.get('django', 'project_name'),
        'USER': 'root',
        'PASSWORD': config.get('mysql:production', 'password'),
        'HOST': config.get('mysql:production', 'end_point'),
        'PORT': '3306',
        'DEFAULT-CHARACTER-SET': 'utf8',
    }
}

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': config.get('redis:production', 'end_point'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Firebase secret code
FIREBASE_USERNAME = config.get('firebase:production', 'username')
FIREBASE_REPO_URL = config.get('firebase:production', 'repo_url')
FIREBASE_API_SECRET = config.get('firebase:production', 'api_secret')

# Compressor settings
COMPRESS_ENABLED = not DEBUG
