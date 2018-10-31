Curate Science
==============
[![Build Status](https://travis-ci.org/ScienceCommons/curate_science.svg?branch=master)](https://travis-ci.org/ScienceCommons/curate_science)

*Food Labels for Science*

This repository contains the (open-source) code base of **[Curate Science](http://CurateScience.org)**, a web platform for the research community to _label_, _link_, and _organize_ the transparency and replications of published scientific findings. **Science requires transparency**, however, no platform currently exists to ensure that published scientific articles comply with the relevant transparency standards. Curate Science aims to solve this problem by allowing researchers to label, link, and organize the transparency **and** replications of published findings. In other words, we're developing <i>food labels for scientific articles</i>. 

Akin to the harmonization of communication standards (e.g., TCP/IP) in the 1970s (which paved the way for the Internet), we are developing harmonized “suites” of transparency (and replication) standards for different kinds of empirical research. This has immense potential to accelerate scientific progress by revolutionizing the conduct and validity of meta-analyses, but also by expediting systemic/institutional reforms for various research stakeholders. For example, it will allow journals, universities, and funders to ensure that their articles, employees, and grantees, respectively, comply with the appropriate transparency standards. 

Curate Science is part of an ambitious future vision that seeks to transform how science is organized and evaluated (for full details of our approach, see [our white paper](https://etiennelebel.com/documents/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf)).

![alt text](https://github.com/ScienceCommons/curate_science/blob/master/static/curate/img/carousel-png1.png)


## Contributing

### Application Structure

Curate Science is a web application written in Python 3 using the [Django](https://www.djangoproject.com/) framework 2.1. with PostgreSQL 9.6, running on Google App Engine. The master branch is continuously deployed to production with Travis CI. The application features a REST API for interacting with the curated data programmatically.

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
2. Install Python >= 3.6
3. Install PostgreSQL >= 9.4 (command may be sql or psql depending on install method)
4. Create a .env file and set the environment variables `DB_USER`, `DB_PASS`, and `SECRET_KEY`

```sql

CREATE DATABASE curate;
CREATE USER [DB_USER] WITH PASSWORD '[DB_PASS]';
GRANT ALL PRIVILEGES ON DATABASE curate TO [DB_USER];
ALTER USER [DB_USER] CREATEDB;

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
