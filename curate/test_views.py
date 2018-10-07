from django.test import TestCase
from django.test import Client
from django.shortcuts import reverse
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
from curate.test_setup import create_model_instances

class TestListViews(TestCase):
    def setUp(self):
        create_model_instances()
        self.client = Client()
        admin_user = User.objects.create(username='admin')
        admin_user.set_password('password')
        admin_user.save()

        anon_user = User.objects.create(username='new_user')
        anon_user.set_password('password1')
        anon_user.save()

    def test_authenticated_user_can_create_article(self):
        self.client.login(username='admin', password='password')
        url = reverse('create-article')
        r = self.client.post(url, {
            "doi": "abc",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [1,]
        })
        print(r.status_code)
        a = Article.objects.get(doi="abc")
        assert a.title == "test article"
