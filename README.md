## Project goal

Crowd sourcing site for filibuster Korea speech


## Stack

#### Back-end

- <a href="http://nginx.org/" target="_blank">Nginx</a> : Web server
- <a href="https://uwsgi-docs.readthedocs.org/en/latest/" target="_blank">uWSGI</a> : Connect web server and application server
- <a href="http://www.django-rest-framework.org/" target="_blank">Django</a> : Application server
- <a href="https://www.mysql.com/" target="_blank">MySQL</a> :Relational DB
- <a href="http://www.redis.io/" target="_blank">Redis</a> : In-memory DB
- <a href="https://www.firebase.com/" target="_blank">Firebase</a> : External DB to support realtime feature
- <a href="http://www.fabfile.org/" target="_blank">Fabric</a> : Deploy tool

#### Front-end

- <a href="https://www.npmjs.com/" target="_blank">NPM</a> : Package management
- <a href="http://sass-lang.com/" target="_blank">SCSS</a> : Stylesheet
- <a href="http://getbootstrap.com/" target="_blank">Bootstrap</a> : Framework made by twitter

#### Django framework libraries

- <a href="https://github.com/mbi/django-simple-captcha" target="_blank">django-simple-captcha</a> : Human validation
- <a href="https://github.com/niwinz/django-redis" target="_blank">django-redis</a> : Connect redis with django framework
- <a href="https://github.com/django-debug-toolbar/django-debug-toolbar" target="_blank">django-debug-toolbar</a> : Query inspection and debugging tool
- <a href="https://github.com/darklow/django-suit" target="_blank">django-suit</a> : Custom admin interface

#### Deployment : <a href="https://aws.amazon.com/" target="_blank">Amazon Web Services</a>

- EC2 (OS: ubuntu 14.04 LTS)
	- Elastic Load Balancer (Load balancing)
	- Auto Scailing Group (Scaling)
- Route 53 (DNS)
- RDS (MySQL)
- ElastiCache (Redis)
- S3 (Storage)
- CloudFront (CDN)
