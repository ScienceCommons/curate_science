from django.test import TestCase
from django.test import Client
from django.shortcuts import reverse
from django.contrib import auth
import json
from curate import models
from curate.test_setup import create_model_instances, destroy_model_instances

class TestAPIViews(TestCase):
    def setUp(self):
        create_model_instances()
        self.client = Client()
        admin_user = models.User.objects.create(username='admin')
        admin_user.set_password('password')
        admin_user.is_staff = True
        admin_user.save()

        user = models.User.objects.create(username='new_user')
        user.set_password('password1')
        user.save()

    def tearDown(self):
        destroy_model_instances()

    # Article tests
    # List Articles
    def test_anon_can_list_articles_api(self):
        self.client=Client()
        article_count = len(models.Article.objects.all())
        url = reverse('api-list-articles')
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        assert(len(d) == article_count)
        assert r.status_code == 200

    # View Articles
    def test_anonymous_user_can_view_article_api(self):
        self.client=Client()
        article = models.Article.objects.first()
        url = reverse('api-view-article', kwargs={'pk': article.id})
        r = self.client.get(url)
        assert r.status_code == 200
        assert "title" in r.content.decode('utf-8')

    def test_invalid_article_id_404(self):
        self.client = Client()
        url = reverse('api-view-article', kwargs={'pk': 99999})
        r = self.client.get(url)
        assert r.status_code == 404

    # Create Articles
    def test_authenticated_user_can_create_article_with_api(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "doi": "001",
            "year": 2018,
            "journal": models.Journal.objects.first().id,
            "title": "api test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [models.Author.objects.first().id,]
        })
        a = models.Article.objects.get(doi="001")
        assert a.title == "api test article"

    def test_create_invalid_article_400(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "journal": models.Journal.objects.first().id,
            "title": "api test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [models.Author.objects.first().id,]
        })
        assert r.status_code == 400

    def test_article_year_can_be_in_press(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "doi": "000",
            "year": "",
            "journal": models.Journal.objects.first().id,
            "title": "api test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [models.Author.objects.first().id,]
        })
        a = models.Article.objects.get(doi="000")
        assert a.publication_year == "In Press"

    def test_authenticated_user_can_create_article_with_replications(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-create-article')
        article_1 = models.Article.objects.first()
        article_2 = models.Article.objects.all()[1]
        r = self.client.post(url, {
            "doi": "002",
            "year": 2017,
            "journal": models.Journal.objects.first().id,
            "title": "api test article 2",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [models.Author.objects.first().id,],
            "commentary_of": [article_1.id, article_2.id]
        })
        a = models.Article.objects.get(doi="002")
        assert a.title == "api test article 2"
        assert article_1 in a.commentary_of
        assert article_2 in a.commentary_of

    def test_anonymous_user_cannot_create_article_with_api(self):
        self.client=Client()
        url = reverse('api-create-article')
        r = self.client.post(
            url,
            {
                "doi": "002",
                "year": 2018,
                "journal": models.Journal.objects.first().id,
                "title": "api test article 2",
                "article_type": "ORIGINAL",
                "research_area": "SOCIAL_SCIENCE",
                "authors": [models.Author.objects.first().id,]
            },
            content_type="application/json"
        )

        assert r.status_code == 403

    def test_authorized_user_can_get_article_create_form(self):
        self.client.login(username='new_user', password='password1')
        url = reverse('api-create-article')
        r = self.client.get(url)
        assert r.status_code == 200

    # Update Articles
    def test_authenticated_user_can_edit_article_with_api(self):
        self.client.login(username='new_user', password='password1')
        article=models.Article.objects.first()
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(
            url, {
                "id": article.id,
                "html_url": "http://www.curatescience.org/"
            },
            content_type="application/json")
        assert r.status_code == 200

    def test_anonymous_user_cannot_edit_article_api(self):
        self.client=Client()
        article=models.Article.objects.first()
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(url, {
            "id": article.id,
            "keywords": ["testing"]
        })
        assert r.status_code == 403

    def test_update_invalid_article_id_404(self):
        self.client=Client()
        self.client.login(username='new_user', password='password1')
        url = reverse('api-update-article', kwargs={'pk': 99999})
        r = self.client.put(url, {"title": "_"})
        assert r.status_code == 404

    # Delete Articles
    def test_anon_cannot_delete_article_api(self):
        self.client=Client()
        article=models.Article.objects.first()
        url = reverse('api-delete-article', kwargs={'pk': article.id})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_user_cannot_delete_article_api(self):
        self.client.login(username='new_user', password='password1')
        article=models.Article.objects.first()
        url = reverse('api-delete-article', kwargs={'pk': article.id})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_admin_can_delete_article_api(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "doi": "003",
            "year": 2017,
            "journal": models.Journal.objects.first().id,
            "title": "api test article 3",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [models.Author.objects.first().id,]
        })
        article = models.Article.objects.get(doi="003")
        url = reverse('api-delete-article', kwargs={'pk': article.id})
        r = self.client.delete(url)
        assert r.status_code == 200
        assert len(models.Article.objects.filter(id=article.id)) == 0

    def test_delete_invalid_article_404(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-delete-article', kwargs={'pk': 9999})
        r = self.client.delete(url)
        assert r.status_code == 404

    # Author tests
    # List Authors
    def test_anon_can_list_authors_api(self):
        self.client=Client()
        author_count = len(models.Author.objects.all())
        url = reverse('api-list-authors')
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        assert(len(d) == author_count)
        assert r.status_code == 200

    # View Authors
    def test_anon_can_view_author_api(self):
        self.client=Client()
        author = models.Author.objects.filter(last_name='Liljenquist').first()
        url = reverse('api-view-author', kwargs={'pk': author.id})
        r = self.client.get(url)
        assert r.status_code == 200
        assert "Liljenquist" in r.content.decode('utf-8')

    def test_invalid_author_id_404(self):
        self.client = Client()
        url = reverse('api-view-author', kwargs={'pk': 99999})
        r = self.client.get(url)
        assert r.status_code == 404

    # Create Authors
    def test_anon_cannot_create_author_api(self):
        self.client=Client()
        url = reverse('api-create-author')
        r = self.client.post(
            url,
            {
                "first_name": "test",
                "last_name": "test",
            },
            content_type="application/json"
        )

        assert r.status_code == 403

    def test_authorized_user_can_create_author_api(self):
        self.client.login(username='new_user', password='password1')
        url = reverse('api-create-author')
        r = self.client.post(url, {
            "first_name": "John",
            "last_name": "Tester"
        })
        a = models.Author.objects.get(last_name="Tester")
        assert a.first_name == "John"

    def test_author_create_invalid_400(self):
        self.client.login(username='new_user', password='password1')
        url = reverse('api-create-author')
        r = self.client.post(url, {
            "first_name": "John"
        })
        assert r.status_code == 400

    def test_authorized_user_can_get_author_create_form(self):
        self.client.login(username='new_user', password='password1')
        url = reverse('api-create-author')
        r = self.client.get(url)
        assert r.status_code == 200

    # Update Authors
    def test_anon_cannot_edit_author_api(self):
        self.client=Client()
        author=models.Author.objects.first()
        url = reverse('api-update-author', kwargs={'pk': author.id})
        r = self.client.patch(url, {
            "id": author.id,
            "last_name": "test"
        })
        assert r.status_code == 403

    def test_authorized_user_can_patch_author(self):
        self.client.login(username='new_user', password='password1')
        author=models.Author.objects.first()
        url = reverse('api-update-author', kwargs={'pk': author.id})
        r = self.client.patch(
            url, {
                "first_name": 'Jimmy'
            },
            content_type="application/json")
        assert r.status_code == 200

    def test_authorized_user_can_put_author(self):
        self.client.login(username='new_user', password='password1')
        author=models.Author.objects.first()
        url = reverse('api-update-author', kwargs={'pk': author.id})
        r = self.client.put(
            url, {
                "first_name": 'Chen-Bo',
                "last_name": 'Zhong'
            },
            content_type="application/json")
        author=models.Author.objects.first()
        assert r.status_code == 200
        assert author.first_name == 'Chen-Bo'

    # Delete Authors
    def test_anon_cannot_delete_author_api(self):
        self.client=Client()
        author=models.Author.objects.first()
        url = reverse('api-delete-author', kwargs={'pk': author.id})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_user_cannot_delete_author_api(self):
        self.client.login(username='new_user', password='password1')
        author=models.Author.objects.first()
        url = reverse('api-delete-author', kwargs={'pk': author.id})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_admin_can_delete_author_api(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-create-author')
        r = self.client.post(url, {
            "first_name": "John",
            "last_name": "Tester"
        })
        author = models.Author.objects.get(last_name="Tester")
        url = reverse('api-delete-author', kwargs={'pk': author.id})
        r = self.client.delete(url)
        assert auth.get_user(self.client).is_authenticated
        assert auth.get_user(self.client).is_staff
        assert r.status_code == 200
        assert len(models.Author.objects.filter(id=author.id)) == 0

    # List Studies
    def test_anon_can_list_studies(self):
        self.client = Client()
        url = reverse('api-list-studies')
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        assert r.status_code == 200
        assert len(d) == 13
        assert type(d[0].get('study_number')) == str

    # View Study
    def test_anon_can_view_study(self):
        self.client=Client()
        article = models.Article.objects.get(doi='10.1126/science.1130726')
        study = article.studies.first()
        url = reverse('api-view-study', kwargs={'pk': study.id})
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        assert r.status_code == 200
        assert d['study_number'] == '2'

    # Create Study
    def test_anon_cannot_create_study_api(self):
        self.client=Client()
        url = reverse('api-create-study')
        r = self.client.post(
            url,
            {
                "article": models.Article.objects.first().id,
                "study_number": "5"
            },
            content_type="application/json"
        )

        assert r.status_code == 403

    def test_authorized_user_can_create_study_api(self):
        self.client.login(username='new_user', password='password1')
        url = reverse('api-create-study')
        r = self.client.post(url, {
            "article": models.Article.objects.first().id,
            "study_number": "5"
        })
        a = models.Study.objects.get(
            article_id=models.Article.objects.first().id,
            study_number="5"
        )
        assert r.status_code==201
        assert a.study_number=="5"

    def test_study_create_invalid_400(self):
        self.client.login(username='new_user', password='password1')
        url = reverse('api-create-study')
        r = self.client.post(url, {
            "first_name": "John"
        })
        assert r.status_code == 400

    # Update Study
    def test_authenticated_user_can_patch_study(self):
        self.client.login(username='new_user', password='password1')
        study=models.Study.objects.first()
        url = reverse('api-update-study', kwargs={'pk': study.id})
        r = self.client.patch(
            url, {
                "id": study.id,
                "study_number": "2a"
            },
            content_type="application/json")
        assert r.status_code == 200

    def test_authenticated_user_can_put_study(self):
        self.client.login(username='new_user', password='password1')
        study=models.Study.objects.first()
        url = reverse('api-update-study', kwargs={'pk': study.id})
        r = self.client.put(
            url, {
                "id": study.id,
                "article": study.article_id,
                "study_number": "2a"
            },
            content_type="application/json")

        assert r.status_code == 200

    def test_authenticated_user_can_put_study(self):
        self.client.login(username='new_user', password='password1')
        study=models.Study.objects.first()
        url = reverse('api-update-study', kwargs={'pk': study.id})
        r = self.client.put(
            url, {
                "id": study.id,
                "study_number": "2a"
            },
            content_type="application/json")

        assert r.status_code == 400

    def test_anonymous_user_cannot_edit_study_api(self):
        self.client=Client()
        study=models.Study.objects.first()
        url = reverse('api-update-study', kwargs={'pk': study.id})
        r = self.client.patch(url, {
            "id": study.id,
            "study_number": "2"
        })
        assert r.status_code == 403

    def test_update_invalid_study_id_404(self):
        self.client=Client()
        self.client.login(username='new_user', password='password1')
        url = reverse('api-update-study', kwargs={'pk': 99999})
        r = self.client.put(url, {"study_number": ""})
        assert r.status_code == 404

    # Delete Study
    def test_anon_cannot_delete_study_api(self):
        self.client=Client()
        study=models.Study.objects.first()
        url = reverse('api-delete-study', kwargs={'pk': study.id})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_user_cannot_delete_study_api(self):
        self.client.login(username='new_user', password='password1')
        study=models.Study.objects.first()
        url = reverse('api-delete-study', kwargs={'pk': study.id})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_admin_can_delete_study_api(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-create-study')
        r = self.client.post(url, {
            "article": models.Article.objects.first().id,
            "study_number": "5"
        })
        study = models.Study.objects.get(article=models.Article.objects.first(), study_number='5')
        url = reverse('api-delete-study', kwargs={'pk': study.id})
        r = self.client.delete(url)
        assert auth.get_user(self.client).is_authenticated
        assert auth.get_user(self.client).is_staff
        assert r.status_code == 200
        assert len(models.Study.objects.filter(id=study.id)) == 0

    def test_delete_invalid_study_404(self):
        self.client.login(username='admin', password='password')
        url = reverse('api-delete-study', kwargs={'pk': 9999})
        r = self.client.delete(url)
        assert r.status_code == 404
