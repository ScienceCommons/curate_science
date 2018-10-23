from django.test import TestCase
from django.test import Client
from django.shortcuts import reverse
from django.contrib import auth
from unittest import skip
from curate.models import (
    Author,
    Article,
    ArticleAuthor,
    Collection,
    Construct,
    Effect,
    Hypothesis,
    Journal,
    KeyFigure,
    Method,
    RelatedArticle,
    StatisticalResult,
    Study,
    Transparency,
    User,
    UserProfile,
    VariableRelationship,
)
from curate.test_setup import create_model_instances, destroy_model_instances

class TestViews(TestCase):
    def setUp(self):
        create_model_instances()
        self.client = Client()
        admin_user = User.objects.create(username='admin')
        admin_user.set_password('password')
        admin_user.is_admin = True
        admin_user.save()

        anon_user = User.objects.create(username='new_user')
        anon_user.set_password('password1')
        anon_user.save()

    def tearDown(self):
        destroy_model_instances()

    def test_authenticated_user_can_create_article(self):
        self.client.login(username='admin', password='password')
        url = reverse('create-article')
        r = self.client.post(url, {
            "doi": "abc123",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 1",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 0,
            'transparency-INITIAL_FORMS': 0,
            'transparency-TOTAL_FORMS': 0,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 0,
        })

        a = Article.objects.filter(doi="abc123").first()
        assert auth.get_user(self.client).is_authenticated
        assert r.status_code == 302
        assert a.title == "test article 1"

    def test_can_create_article_with_study(self):
        self.client.login(username='admin', password='password')
        url = reverse('create-article')
        r = self.client.post(url,{
            "doi": "abc1234",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 2",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 0,
            'transparency-INITIAL_FORMS': 0,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 0,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 1,
            'study-0-study_number': '1a',
            'study-0-effects': [Effect.objects.first().id],

        })
        a = Article.objects.filter(doi="abc1234").first()
        assert auth.get_user(self.client).is_authenticated
        assert r.status_code == 302
        assert a.title == "test article 2"
        assert len(a.studies.all()) == 1
        assert len(a.studies.first().effects.all()) == 1
