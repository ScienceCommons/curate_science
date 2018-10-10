Curate Science
==============
[![Build Status](https://travis-ci.org/ScienceCommons/curate_science.svg?branch=master)](https://travis-ci.org/ScienceCommons/curate_science)

*Nutritional Labels for Science*

This repository contains the code of **[Curate Science](http://CurateScience.org)**, a community  platform to _curate_ and _track_ the transparency and replications of published scientific findings (for full details of our approach, see [our white paper](https://osf.io/preprints/psyarxiv/uwmr8)


## Contributing

### Application Structure

Curate Science is a web application written in Python 3 using the Django framework 2.1. with PostgreSQL 9.6, running on Google App Engine. The master branch is continuously deployed to production with Travis CI. The application features a REST API for interacting with the curated data programmatically.

* Entity models are in `curate/models.py`
* REST API view controllers use [Django REST Framework](http://django-rest-framework.org/) and are in `views_api.py`
* REST API model serializers are in `curate/serializers.py`
* HTML view controllers are in `curate/views.py`
* HTML templates use the Django template engine and are in `templates/`
* URL routes are in `curate_science/urls.py`
* JS, CSS, and image files go in `static/curate/`
* Application configurations are in `curate_science/settings.py`

### Setup

To set up the app locally:

1. Clone this repository
2. Install PostgreSQL >= 9.4
3. Create a .env file and set the environment variables `DB_USER`, `DB_PASS`, and `SECRET_KEY`.

```sql

CREATE DATABASE curate;
CREATE USER [DB_USER] WITH PASSWORD [DB_PASS];
GRANT ALL PRIVILEGES ON DATABASE curate TO [DB_USER];

```

```bash

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver_plus

```

### Running Tests

```bash

python manage.py test

```
