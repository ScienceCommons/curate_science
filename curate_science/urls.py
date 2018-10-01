"""curate_science URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from curate.views import index
import curate.views_api as api

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
]

urlpatterns += [
    path('api/authors/', api.list_authors, name='list-authors'),
    path('api/articles/', api.list_articles, name='list-articles'),
    path('api/collections/', api.list_collections, name='list-collections'),
    path('api/constructs/', api.list_constructs, name='list-constructs'),
    path('api/effects/', api.list_effects, name='list-effects'),
    path('api/hypotheses/', api.list_hypotheses, name='list-hypotheses'),
    path('api/journals/', api.list_journals, name='list-journals'),
    path('api/key_figures/', api.list_key_figures, name='list-key-figures'),
    path('api/methods/', api.list_methods, name='list-methods'),
    path('api/statistical_results/', api.list_statistical_results, name='list-statistical-results'),
    path('api/studies/', api.list_studies, name='list-studies'),
    path('api/transparencies/', api.list_transparencies, name='list-transparencies'),
]
