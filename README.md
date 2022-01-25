Curate Scholar
==============
[![Build Status](https://travis-ci.org/ScienceCommons/curate_science.svg?branch=master)](https://travis-ci.org/ScienceCommons/curate_science)

*Set your scholarly works free*

Code base of Curate Science's flagship product *Curate Scholar* ([release notes](https://github.com/ScienceCommons/curate_science/releases/tag/v0.4.0)), an author page app that makes scholarly works 10x more user-friendly to access and consume (think Google Scholar substantially enhanced in 15 unique ways; see our [release 0.4.0 video](https://www.youtube.com/watch?v=abJStJvwFxc) for a demo of new features). 

Curate Scholar is part of  broader **[Curate Science](https://CurateScience.org)** platform, an integrated system and product suite of tools to curate the transparency and credibility of research (for a broad overview, see [this interactive diagram](https://etiennelebel.com/cs/cs-state-of-and-roadmap.html)).  For more details, see our [meta-scientific theoretical framework](https://etiennelebel.com/documents/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf) that guides the implementation of our integrated system.  See [below](https://github.com/ScienceCommons/curate_science#roadmap) for current features in development (1-year road map) and upcoming features (3-year road map (from 2018)).  

**[Curate Science](https://CurateScience.org)** is a nonprofit tech startup whose mission is to boost QUALITY in science by developing transparency apps for scientists. 

![alt text](https://user-images.githubusercontent.com/4512335/76235166-1c72db00-6201-11ea-9709-d2582b381ce3.png)


 

## Contributing

### Bug Bounty Program (_Fix an issue, earn cash!_)

Current value: **USD$500** (March 2020).  Total current escrow $1,000. (more coming soon.)

To identify talent to expand our team, we’re running a monthly bug bounty program. Current top-priority issues are worth a specific # of points to fix (see [issues under "Improved demoability" milestone](https://github.com/ScienceCommons/curate_science/issues?q=is%3Aopen+is%3Aissue+milestone%3A%22Improved+demoability%22)). Earn cash proportional to the points earned, shared among contributing programmers (at the end of the month). To incentivize both individual and communal productivity, a larger proportion of monthly escrow is unlocked for larger total points collectively earned by the team. For example, if dev#1 earns 270 points, and dev#2 earns 750 points, the total >1,000 points collectively earned unlocks a larger chunk of the total monthly escrow amount available (the maximum amount is unlocked if all issues are fixed).


### Application Structure

Curate Science is a web application written in Python 3 using the [Django](https://www.djangoproject.com/) framework 2.1. with PostgreSQL 9.6, running on Google App Engine Standard Environment. The master branch is continuously deployed to production with Travis CI. The application features a REST API for interacting with the curated data programmatically.

* Entity models are in `curate/models.py` ([entity-relationship diagram (v0.3.0)](https://etiennelebel.com/logos/curatescience_datamodel_v0.3.0.png))
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

_***For more detailed instructions on how to setup a local instance of the app, see [here](https://github.com/ScienceCommons/curate_science/issues/115) (see also [here](https://github.com/ScienceCommons/curate_science/issues/76)).***_

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

(For more realistic testing of performance, user-friendliness, and general feel/esthetic, please contact us at admin@curatescience.org to be granted access to a de-identified version of our production DB, which you can import into your local environment.)

For production: `export GOOGLE_CLOUD_PROJECT=curate`

Then run `python manage.py migrate`

Then don’t forget to reset the env var: `export GOOGLE_CLOUD_PROJECT=`

(DB_NAME is set conditionally, based on the value of GOOGLE_CLOUD_PROJECT, [here]( https://github.com/ScienceCommons/curate_science/blob/177da9bba83b0eea75086749d883acd2c9c39b48/curate_science/settings.py#L31))



## License
Curate Science source code is licensed under an open-source MIT license for all personal, educational, research, and other open source applications. A commercial license is required for all commercial applications. Please contact admin@curatescience.org for more information about our commercial license.

## Core Regression Tests

1. Core functionality
    1. Create a new article, add information to all fields, including uploading multiple figures simultaneously via drag-and-drop
    2. Save a new article
        * All fields can successfully save information
        * Canceling unsaved information prompts warning dialog
    3. Edit an article
        * All fields can successfully be edited, including deleting a key figure (admin only)
    4. Delete an article (admin only)
    5. Link an existing article to an author page (e.g., https://curate-science-staging-2.appspot.com/app/author/etienne-p-lebel)
    6. Link that same article to a (different) co-author's page (admin only)
    7. Ensure article page works (e.g., https://curate-science-staging-2.appspot.com/app/article/57)
    8. Ensure search/search results page works (e.g., https://curate-science-staging-2.appspot.com/app/search/?q=disgust)
    9. Ensure Browse/recent page works: https://curate-science-staging-2.appspot.com/app/recent
        * Ensure filtering and sorting works (e.g., show only "Replication" articles)
    10. Create a new author page (admin only)
    11. Invite/create a new user (admin only)
2. Full-screen mode functionality (e.g., author page with lots of embedabble full-screen PDF/HTML articles: https://curate-science-staging-2.appspot.com/app/author/etienne-p-lebel)
    1. PDF: Ensure a supported embeddable full-text PDF article activates full-screen icon *AND* is displayed in right-panel embed viewer (e.g., https://etiennelebel.com/documents/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf)
    2. HTML: Ensure a supported embeddable full-text HTML article activates full-screen icon *AND* is displayed in right-panel embed viewer (e.g., https://www.frontiersin.org/articles/10.3389/fpsyg.2017.01004/full)
3. Author page publication list external embedding
      * Ensure embedding `<script src="https://curate-science-staging-2.appspot.com/author-embed/etienne-p-lebel.js" async></script>` loads and displays relevant author page publication list, i.e., https://etiennelebel.com/author/etienne-p-lebel-EMBED-AUTHOR-PAGE-from-staging.html)

## Roadmap

1. Current focus (1-year road map)
   - Features and improvements in active development: See [issues under "Improved Demoability" milestone](https://github.com/ScienceCommons/curate_science/issues?q=is%3Aopen+is%3Aissue+milestone%3A%22Improved+demoability%22)
   - Next batch of features to be implemented: See [issues under "Public launch (author page)" milestone](https://github.com/ScienceCommons/curate_science/issues?q=is%3Aopen+is%3Aissue+milestone%3A%22Public+launch+%28author+page%29%22)
2. Upcoming features (3-year road map): See issue [#52](https://github.com/ScienceCommons/curate_science/issues/52)
