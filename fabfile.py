#!/bin/bash
import os
from boto3.session import Session
from ConfigParser import ConfigParser
from fabric.api import *

ROOT_DIR = os.path.dirname(__file__)

# Get sensitive configuration
config = ConfigParser()
config.read(ROOT_DIR + '/conf/sensitive/configuration.ini')

PROJECT_NAME = config.get('django', 'project_name')

# Deploy server information
if int(config.get('django', 'development_mode')) == 1:
    AWS_ACCESS_KEY_ID = config.get('aws', 'access_key_id')
    AWS_SECRET_ACCESS_KEY = config.get('aws', 'secret_access_key')

    env.hosts = []
    env.user = 'ubuntu'
    env.key_filename = ROOT_DIR + "/conf/sensitive/remote_server.pem"
    env.port = 22

    session = Session(aws_access_key_id=AWS_ACCESS_KEY_ID, 
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY, 
            region_name='ap-northeast-2')   # SEOUL REGION

    ec2 = session.resource('ec2')

    for instance in ec2.instances.all():
        if instance.key_name == 'ping-korea': 
            env.hosts.append(instance.public_dns_name)


def docker_onboot():
    local("sudo service nginx start")
    local("sudo service mysql start")
    local("sudo service redis-server start")
    local("sudo service rabbitmq-server start")


def run_uwsgi():
    local("sudo uwsgi --uid www-data --gid www-data --emperor /etc/uwsgi/vassals --master --die-on-term --daemonize=" + ROOT_DIR + "/logs/uwsgi.log")


def stop_uwsgi():
    with settings(warn_only=True):
        local("ps -ef | grep uwsgi | grep -v grep | awk '{print $2}' | xargs kill -15")


def run_shell():
    with lcd(ROOT_DIR):
        try:
            local("./manage.py shell_plus")
        except:
            local("./manage.py shell")


def run_dbshell():
    with lcd(ROOT_DIR):
        local("./manage.py dbshell")


def run_server():
    with lcd(ROOT_DIR):
        local("./manage.py runserver 0.0.0.0:8000")


def stop_server():
    local("sudo fuser -k 8000/tcp")


def update_staticfiles():
    with lcd(ROOT_DIR + "/" + PROJECT_NAME + "/static/css/"):
        local("sass styles.scss:styles.css")
    local("./manage.py collectstatic --noinput")
    local("./manage.py compress --force")


def deploy(*command):
    with cd(ROOT_DIR):
        sudo("git pull origin master")
    
    if 'SERVER_CODE_UPDATED' in command:
        with cd(ROOT_DIR):
            sudo("ps -ef | grep uwsgi | grep -v grep | awk '{print $2}' | xargs kill -15")
            sudo("uwsgi --uid www-data --gid www-data --emperor /etc/uwsgi/vassals --master --die-on-term --daemonize=" + ROOT_DIR + "/logs/uwsgi.log")
    
    if 'STATIC_FILES_UPDATED' in command:
        with cd(ROOT_DIR + "/" + PROJECT_NAME + "/static/css/"):
            sudo("sass styles.scss:styles.css")
        with cd(ROOT_DIR):
            sudo("./manage.py collectstatic --noinput")
            sudo("./manage.py compress --force")

    if 'NGINX_CONFIGURATION_UPDATED' in command:
        sudo("service nginx restart")
