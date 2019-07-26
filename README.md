Curate Science
==============
[![Build Status](https://travis-ci.org/ScienceCommons/curate_science.svg?branch=master)](https://travis-ci.org/ScienceCommons/curate_science)

*Transparency Compliance for Science*

Code base of **[Curate Science](https://CurateScience.org)**, a next-generation *transparency compliance and accountability system* for scientific articles. A central problem in research is determining whether reported evidence can be trusted. In science, evidence can only be trusted if it is transparently reported and has survived scrutiny from peers via follow-up replications/re-analyses. No platform, however, currently exists to verify (and track) the transparency and replication of research. 

To solve this problem, we are developing curation tools that will allow researchers, journals, universities, and funders ensure that scientific articles (1) comply with the appropriate transparency standards and (2) are accountable to follow-up replication studies and re-analyses. This will create immense value for all research stakeholders (see [list](https://etiennelebel.com/logos/value-created-for-stakeholders.png)), which has large potential to accelerate scientific progress and applied innovations. 

For more details about the platform, see:
1.	[Falsifiability-informed framework](https://etiennelebel.com/documents/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf) that guides the design and implementation of our platform/tools.
2.	[Current functionalities/features](https://etiennelebel.com/documents/generalized-grant-proposal.pdf) being designed and developed.
3.	[Upcoming features and platform roadmap](https://github.com/ScienceCommons/curate_science/issues/52).

![alt text](https://etiennelebel.com/logos/carousel-png1_updated.png)

*Figure 1*: Basic layout of Curate Science’s article card displaying information about an article’s 
transparency and follow-up commentaries, replications, and re-analyses. 

![alt text](https://etiennelebel.com/logos/accountability-system-multistakeholder.png)

*Figure 2*: Curate Science transparency compliance and accountability system: An article’s transparency, result 
reproducibility, and effect replicability are curated/veriﬁed over time (findings that survive scrutiny are treated as credible proportional to the extent of scrutiny achieved over that time period). 

## Contributing

### Application Structure

Curate Science is a web application written in Python 3 using the [Django](https://www.djangoproject.com/) framework 2.1. with PostgreSQL 9.6, running on Google App Engine Standard Environment. The master branch is continuously deployed to production with Travis CI. The application features a REST API for interacting with the curated data programmatically.

* Entity models are in `curate/models.py` ([current entity-relationship diagram (v0.3.0)](https://etiennelebel.com/logos/curatescience_datamodel_v0.3.0.png) (entities to-be-added in blue))
* REST API view controllers use [Django REST Framework](http://django-rest-framework.org/) and are in `views_api.py`
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

### Core UI Regression Tests

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
