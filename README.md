Curate Science
==============
[![Build Status](https://travis-ci.org/ScienceCommons/curate_science.svg?branch=master)](https://travis-ci.org/ScienceCommons/curate_science)

*Transparent and Credible Evidence.*

Code base of **[Curate Science](https://CurateScience.org)**, a unified curation system and platform to verify that research is **transparent and credible**. A central problem in academic research is determining whether a paper's reported evidence can be trusted. In science, evidence is only considered trustworthy/credible if it is transparently reported and has survived scrutiny from peers via follow-up replications/re-analyses. No platform, however, currently exists to verify (and track) the transparency and credibility of research. 

Curate Science aims to solve this holy grail problem of academic research, by allowing researchers, journals, universities, funders, teachers, journalists, and the general public to ensure:
1.  *Transparency*: Ensure that research meets minimum transparency standards appropriate to the article type and methodologies used.
2.  *Credibility*: Ensure that follow-up scrutiny is linked to its parent paper, including critical commentaries, reproducibility/robustness re-analyses, and new sample replications.

Having a unified/systematic way to distinguish *credible evidence* (from untrustworthy evidence) will substantially accelerate the development of cumulative scientific knowledge and applied innovations across the natural and social sciences. The implications for human welfare are large. (See a [list](https://etiennelebel.com/logos/value-created-for-stakeholders.png) of value/benefits our system will create for different research stakeholders.)

For more details about our platform, see:
1.	[Falsifiability-informed framework](https://etiennelebel.com/documents/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf) that guides the design and implementation of our platform/tools.
2.	[Upcoming features and platform roadmap](https://github.com/ScienceCommons/curate_science/issues/52).
3.  [Browse our curated content](https://curatescience.org/app/), which features one of the world’s largest collection of transparently-reported replications and original research articles (including > 3,000 social science replications and > 400 original research articles).


![alt text](https://user-images.githubusercontent.com/4512335/70174268-8c257700-16a2-11ea-90a2-13ce1dbc9439.png)

*Figure 1*: Basic layout of Curate Science’s article card displaying information about an article’s 
transparency and credibility (i.e., follow-up commentaries, re-analyses, and replications).

![alt text](https://user-images.githubusercontent.com/4512335/70171251-554c6280-169c-11ea-843f-d98b2a9f3ae4.png)

*Figure 2*: Curate Science credibility curation system: An article’s transparency and credibility is verified over time across different contexts within the scholarly ecosystem. 

## Contributing

### Application Structure

Curate Science is a web application written in Python 3 using the [Django](https://www.djangoproject.com/) framework 2.1. with PostgreSQL 9.6, running on Google App Engine Standard Environment. The master branch is continuously deployed to production with Travis CI. The application features a REST API for interacting with the curated data programmatically.

* Entity models are in `curate/models.py` ([current entity-relationship diagram (v0.3.0)](https://etiennelebel.com/logos/curatescience_datamodel_v0.3.0.png) (entities to-be-added in blue))
* REST API view controllers use [Django REST Framework](http://django-rest-framework.org/) and are in `views/api.py`
* REST API model serializers are in `curate/serializers.py`
* HTML view controllers are in `curate/views.py`
* HTML templates use the Django template engine and are in `templates/`
* URL routes are in `curate_science/urls.py`
* JS, CSS, and image files go in `static/curate/`
* Application configurations are in `curate_science/settings.py`

### Useful Documentation

### Back-end

* GCP [documentation](https://cloud.google.com/appengine/docs/python/)
* Django [documentation](https://docs.djangoproject.com/en/2.1/)

### Front-end

* React-Router [documentation](https://reacttraining.com/react-router/web/guides/quick-start)
* Material UI (React component library) [documentation](https://material-ui.com/)

### Setup

To set up the app locally:

1. Clone this repository
2. Install Python >= 3.6
3. Install PostgreSQL >= 9.4 (command may be sql or psql depending on install method)
4. Create a .env file and set the environment variables `DB_USER`, `DB_PASS`, and `SECRET_KEY`
5. Create a superuser to access Django admin: `python manage.py createsuperuser` and follow prompts

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

### Starting Local Server for Development

Ensure Postgres is running.

```bash

python manage.py runserver_plus
# In a new terminal (to compile JS bundle(s) and HTML)
yarn start
```

App should be running at `localhost:8000`.
Django admin should be available at `localhost:8000/admin`.


### DB migration instructions:
For staging:  `export GOOGLE_CLOUD_PROJECT=curate-science-staging-2`

For production: `export GOOGLE_CLOUD_PROJECT=curate`

Then run `python manage.py migrate`

Then don’t forget to reset the env var: `export GOOGLE_CLOUD_PROJECT=`

(DB_NAME is set conditionally, based on the value of GOOGLE_CLOUD_PROJECT, [here]( https://github.com/ScienceCommons/curate_science/blob/177da9bba83b0eea75086749d883acd2c9c39b48/curate_science/settings.py#L31))

(for a more detailed set of instructions on how to setup a local instance of the app, see [here](https://github.com/ScienceCommons/curate_science/issues/76))

## Core UI Regression Tests

1. Create a new article
2. Save a new article
  - All fields can successfully save information
  - Canceling unsaved information prompts warning dialog
3. Edit an article
  - All fields can successfully be edited
4. Link an existing article to an author page
  - Link that same article to a (different) co-author's page (admin only)
5. Create a new author page (admin only)
6. Invite/create a new user (admin only)
7. Delete an article (admin only)
