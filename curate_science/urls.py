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
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.template import RequestContext
from rest_framework.documentation import include_docs_urls
from curate import views
import curate.views_api as api

urlpatterns = [
    path('', views.index),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('articles/create/', views.create_article, name='create-article'),
    path('articles/<pk>/', views.view_article, name='view-article'),
    path('articles/<pk>/update/', views.update_article, name='update-article'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [
    path('api/', api.index, name='api-index'),
    path('api/docs/', include_docs_urls(title="Curate Science API")),
    path('api/schema/', api.schema, name='api-schema'),
    # Author paths
    path('api/authors/', api.list_authors, name='api-list-authors'),
    path('api/authors/autocomplete/', api.AuthorAutocomplete.as_view(), name='author-autocomplete'),
    path('api/authors/create/', api.create_author, name='api-create-author'),
    path('api/authors/<pk>/', api.view_author, name='api-view-author'),
    path('api/authors/<pk>/update/', api.update_author, name='api-update-author'),
    path('api/authors/<pk>/delete/', api.delete_author, name='api-delete-author'),
    # Article paths
    path('api/articles/', api.list_articles, name='api-list-articles'),
    path('api/articles/autocomplete/', api.ArticleAutocomplete.as_view(), name='article-autocomplete'),
    path('api/articles/create/', api.create_article, name='api-create-article'),
    path('api/articles/search/', api.search_articles, name='api-search-articles'),
    path('api/articles/<pk>/', api.view_article, name='api-view-article'),
    path('api/articles/<pk>/update/', api.update_article, name='api-update-article'),
    path('api/articles/<pk>/delete/', api.delete_article, name='api-delete-article'),
    # Collection paths
    path('api/collections/', api.list_collections, name='api-list-collections'),
    path('api/collections/create/', api.create_collection, name='api-create-collection'),
    path('api/collections/<pk>/', api.view_collection, name='api-view-collection'),
    path('api/collections/<pk>/update/', api.update_collection, name='api-update-collection'),
    path('api/collections/<pk>/delete/', api.delete_collection, name='api-delete-collection'),
    # Construct paths
    path('api/constructs/', api.list_constructs, name='api-list-constructs'),
    path('api/constructs/create/', api.create_construct, name='api-create-construct'),
    path('api/constructs/<pk>/', api.view_construct, name='api-view-construct'),
    path('api/constructs/<pk>/update/', api.update_construct, name='api-update-construct'),
    path('api/constructs/<pk>/delete/', api.delete_construct, name='api-delete-construct'),
    # Effect paths
    path('api/effects/', api.list_effects, name='api-list-effects'),
    path('api/effects/autocomplete/', api.EffectAutocomplete.as_view(), name='effect-autocomplete'),
    path('api/effects/create/', api.create_effect, name='api-create-effect'),
    path('api/effects/<pk>/', api.view_effect, name='api-view-effect'),
    path('api/effects/<pk>/update/', api.update_effect, name='api-update-effect'),
    path('api/effects/<pk>/delete/', api.delete_effect, name='api-delete-effect'),
    # Hypothesis paths
    path('api/hypotheses/', api.list_hypotheses, name='api-list-hypotheses'),
    path('api/hypotheses/create/', api.create_hypothesis, name='api-create-hypothesis'),
    path('api/hypotheses/<pk>/', api.view_hypothesis, name='api-view-hypothesis'),
    path('api/hypotheses/<pk>/update/', api.update_hypothesis, name='api-update-hypothesis'),
    path('api/hypotheses/<pk>/delete/', api.delete_hypothesis, name='api-delete-hypothesis'),
    # Journal paths
    path('api/journals/', api.list_journals, name='api-list-journals'),
    path('api/journals/create/', api.create_journal, name='api-create-journal'),
    path('api/journals/<pk>/', api.view_journal, name='api-view-journal'),
    path('api/journals/<pk>/update/', api.update_journal, name='api-update-journal'),
    path('api/journals/<pk>/delete/', api.delete_journal, name='api-delete-journal'),
    # Key figure paths
    path('api/key_figures/', api.list_key_figures, name='api-list-key-figures'),
    path('api/key_figures/create/', api.create_key_figure, name='api-create-key-figure'),
    path('api/key_figures/<pk>/', api.view_key_figure, name='api-view-key-figure'),
    path('api/key_figures/<pk>/update/', api.update_key_figure, name='api-update-key-figure'),
    path('api/key_figures/<pk>/delete/', api.delete_key_figure, name='api-delete-key-figure'),
    # Method paths
    path('api/methods/', api.list_methods, name='api-list-methods'),
    path('api/methods/create/', api.create_method, name='api-create-method'),
    path('api/methods/<pk>/', api.view_method, name='api-view-method'),
    path('api/methods/<pk>/update/', api.update_method, name='api-update-method'),
    path('api/methods/<pk>/delete/', api.delete_method, name='api-delete-method'),
    # Statistical Result paths
    path('api/statistical_results/', api.list_statistical_results, name='api-list-statistical-results'),
    path('api/statistical_results/create/', api.create_statistical_result, name='api-create-statistical-result'),
    path('api/statistical_results/<pk>/', api.view_statistical_result, name='api-view-statistical-result'),
    path('api/statistical_results/<pk>/update/', api.update_statistical_result, name='api-update-statistical-result'),
    path('api/statistical_results/<pk>/delete/', api.delete_statistical_result, name='api-delete-statistical-result'),
    # Study paths
    path('api/studies/', api.list_studies, name='api-list-studies'),
    path('api/studies/create/', api.create_study, name='api-create-study'),
    path('api/studies/<pk>/', api.view_study, name='api-view-study'),
    path('api/studies/<pk>/update/', api.update_study, name='api-update-study'),
    path('api/studies/<pk>/delete/', api.delete_study, name='api-delete-study'),
    # Transparency paths
    path('api/transparencies/', api.list_transparencies, name='api-list-transparencies'),
    path('api/transparencies/create/', api.create_transparency, name='api-create-transparency'),
    path('api/transparencies/<pk>/', api.view_transparency, name='api-view-transparency'),
    path('api/transparencies/<pk>/update/', api.update_author, name='api-update-author'),
    path('api/transparencies/<pk>/delete/', api.delete_author, name='api-delete-author'),
]
