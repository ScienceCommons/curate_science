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
    path('api/', api.index, name='api-index'),
    # Author paths
    path('api/authors/', api.list_authors, name='api-list-authors'),
    path('api/authors/create/', api.create_author, name='api-create-author'),
    path('api/authors/<pk>/', api.view_author, name='api-view-author'),
    path('api/authors/<pk>/update', api.update_author, name='api-update-author'),
    # Article paths
    path('api/articles/', api.list_articles, name='api-list-articles'),
    path('api/articles/<pk>/', api.view_article, name='api-view-article'),
    # Collection paths
    path('api/collections/', api.list_collections, name='api-list-collections'),
    path('api/collections/<pk>/', api.view_collection, name='api-view-collection'),
    # Construct paths
    path('api/constructs/', api.list_constructs, name='api-list-constructs'),
    path('api/constructs/<pk>/', api.view_construct, name='api-view-construct'),
    # Effect paths
    path('api/effects/', api.list_effects, name='api-list-effects'),
    path('api/effects/<pk>/', api.view_effect, name='api-view-effect'),
    # Hypothesis paths
    path('api/hypotheses/', api.list_hypotheses, name='api-list-hypotheses'),
    path('api/hypotheses/<pk>/', api.view_hypothesis, name='api-view-hypothesis'),
    # Journal paths
    path('api/journals/', api.list_journals, name='api-list-journals'),
    path('api/journals/<pk>/', api.view_journal, name='api-view-journal'),
    # Key figure paths
    path('api/key_figures/', api.list_key_figures, name='api-list-key-figures'),
    # Method paths
    path('api/methods/', api.list_methods, name='api-list-methods'),
    # Statistical Result paths
    path('api/statistical_results/', api.list_statistical_results, name='api-list-statistical-results'),
    # Study paths
    path('api/studies/', api.list_studies, name='api-list-studies'),
    path('api/studies/<pk>/', api.view_study, name='api-view-study'),
    # Transparency paths
    path('api/transparencies/', api.list_transparencies, name='api-list-transparencies'),
]
