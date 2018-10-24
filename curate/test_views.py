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

    def test_can_create_article_with_transparency(self):
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
            'transparency-TOTAL_FORMS': 2,
            'transparency-INITIAL_FORMS': 0,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 0,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'transparency-0-transparency_type': 'PREREG',
            'transparency-0-url': 'http://curatescience.org/',
            'transparency-1-transparency_type': 'CODE',
            'transparency-1-url': 'http://curatescience.org/',

        })
        a = Article.objects.filter(doi="abc1234").first()
        assert auth.get_user(self.client).is_authenticated
        assert r.status_code == 302
        assert a.title == "test article 2"
        assert len(a.transparencies.all()) == 2

    def test_can_edit_transparency_on_article(self):
        self.client.login(username='admin', password='password')
        url = reverse('create-article')
        r = self.client.post(url,{
            "doi": "abc12345",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 3",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 2,
            'transparency-INITIAL_FORMS': 0,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 0,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'transparency-0-transparency_type': 'PREREG',
            'transparency-0-url': 'http://curatescience.org/',
            'transparency-1-transparency_type': 'CODE',
            'transparency-1-url': 'http://curatescience.org/',

        })
        a = Article.objects.filter(doi="abc12345").first()
        assert r.status_code == 302
        assert a.title == "test article 3"
        assert len(a.transparencies.all()) == 2
        transparency_0 = a.transparencies.get(transparency_type='PREREG')
        transparency_1 = a.transparencies.get(transparency_type='CODE')
        update_url = reverse('update-article', kwargs={'pk': a.id})
        r2 = self.client.post(update_url,{
            "doi": "abc12345",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 3",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 3,
            'transparency-INITIAL_FORMS': 2,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 0,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'transparency-0-transparency_type': 'PREREG',
            'transparency-0-url': 'http://curatescience.org/',
            'transparency-0-id': transparency_0.id,
            'transparency-1-transparency_type': 'CODE',
            'transparency-1-url': 'http://curatescience.org/code/',
            'transparency-1-id': transparency_1.id,
        })
        a = Article.objects.filter(doi="abc12345").first()
        tr = a.transparencies.all()
        assert len(tr) == 2
        assert len(a.transparencies.filter(url='http://curatescience.org/code/')) == 1

    def test_can_remove_transparency_from_article(self):
        self.client.login(username='admin', password='password')
        url = reverse('create-article')
        r = self.client.post(url,{
            "doi": "abc123456",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 4",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 2,
            'transparency-INITIAL_FORMS': 0,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 0,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'transparency-0-transparency_type': 'PREREG',
            'transparency-0-url': 'http://curatescience.org/',
            'transparency-1-transparency_type': 'CODE',
            'transparency-1-url': 'http://curatescience.org/',

        })
        a = Article.objects.filter(doi="abc123456").first()
        assert r.status_code == 302
        assert a.title == "test article 4"
        assert len(a.transparencies.all()) == 2
        transparency_0 = a.transparencies.get(transparency_type='PREREG')
        transparency_1 = a.transparencies.get(transparency_type='CODE')
        update_url = reverse('update-article', kwargs={'pk': a.id})
        r2 = r = self.client.post(update_url,{
            "doi": "abc123456",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 4",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 2,
            'transparency-INITIAL_FORMS': 2,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 0,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'transparency-0-transparency_type': 'PREREG',
            'transparency-0-url': 'http://curatescience.org/',
            'transparency-0-id': transparency_0.id,
            'transparency-1-transparency_type': 'CODE',
            'transparency-1-url': 'http://curatescience.org/',
            'transparency-1-id': transparency_1.id,
            'transparency-1-DELETE': True,
        })
        a = Article.objects.get(doi="abc123456")
        assert len(a.transparencies.all()) == 1


    def test_can_create_article_with_key_figure(self):
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
            'keyfigure-TOTAL_FORMS': 1,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'keyfigure-0-figure_number': 1,
            'keyfigure-0-image_url': 'http://curatescience.org',
            'keyfigure-0-is_figure': True,

        })
        a = Article.objects.filter(doi="abc1234").first()
        assert auth.get_user(self.client).is_authenticated
        assert r.status_code == 302
        assert a.title == "test article 2"
        assert len(a.key_figures.all()) == 1

    def test_can_edit_key_figure_on_article(self):
        self.client.login(username='admin', password='password')
        url = reverse('create-article')
        r = self.client.post(url,{
            "doi": "abc12345",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 3",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 2,
            'transparency-INITIAL_FORMS': 0,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 1,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'keyfigure-0-figure_number': 1,
            'keyfigure-0-image_url': 'http://curatescience.org',
            'keyfigure-0-is_figure': True,
        })
        a = Article.objects.filter(doi="abc12345").first()
        assert r.status_code == 302
        assert a.title == "test article 3"
        assert len(a.key_figures.all()) == 1
        keyfigure_0 = a.key_figures.first()
        update_url = reverse('update-article', kwargs={'pk': a.id})
        r2 = self.client.post(update_url,{
            "doi": "abc12345",
            "year": 2018,
            "journal": Journal.objects.first().id,
            "title": "test article 3",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [Author.objects.first().id,],
            'transparency-TOTAL_FORMS': 2,
            'transparency-INITIAL_FORMS': 0,
            'keyfigure-INITIAL_FORMS': 0,
            'keyfigure-TOTAL_FORMS': 1,
            'study-INITIAL_FORMS': 0,
            'study-TOTAL_FORMS': 0,
            'keyfigure-0-figure_number': 1,
            'keyfigure-0-image_url': 'http://curatescience.org/figures/',
            'keyfigure-0-is_figure': True,
            'keyfigure-0-id': keyfigure_0.id,
        })
        a = Article.objects.filter(doi="abc12345").first()
        kf = a.key_figures.all()
        assert len(a.key_figures.filter(image_url='http://curatescience.org/figures/')) == 1
