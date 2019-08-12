from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from django.shortcuts import reverse
from django.contrib import auth
from invitations.models import Invitation
import json
from curate import models
from django.conf import settings
import os, shutil

class TestAPIViews(TestCase):
    def setUp(self):
        self.client = Client()
        admin_user = models.User.objects.create(email='admin@curatescience.org', first_name="Admin User")
        admin_user.set_password('password')
        admin_user.is_staff = True
        admin_user.save()

        user = models.User.objects.create(email='new_user@curatescience.org', first_name="New User")
        user.set_password('password1')
        user.save()

        user2 = models.User.objects.create(email='new_user_2@curatescience.org', first_name="New User")
        user2.set_password('password2')
        user2.save()

        directory = settings.MEDIA_ROOT + '/key_figures/'
        if not os.path.exists(directory):
            os.makedirs(directory)

    def tearDown(self):
        folder = settings.MEDIA_ROOT + '/key_figures/'
        for the_file in os.listdir(folder):
            file_path = os.path.join(folder, the_file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                    #elif os.path.isdir(file_path): shutil.rmtree(file_path)
            except Exception as e:
                print(e)

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

    def test_only_live_articles_are_listed(self):
        self.client = Client()
        url = reverse('api-list-articles')

        live_article = models.Article.objects.create(title='live', is_live=True)
        not_live_article = models.Article.objects.create(title='not live', is_live=False)

        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        article_ids = [article['id'] for article in d]

        self.assertTrue(live_article.id in article_ids)
        self.assertTrue(not_live_article.id not in article_ids)

    def list_articles_for_author(self):
        self.client = Client()
        a = Author.objects.first()
        article_count = len(a.articles.all())
        url = reverse('api-list-articles-for-author', kwargs={'slug': a.slug})
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
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "doi": "001",
            "year": 2018,
            "journal": "Science",
            "title": "api test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "author_list": "LeBel et al",
        })
        a = models.Article.objects.get(doi="001")
        assert a.title == "api test article"

    def test_non_admin_user_create_article_linked_to_author(self):
        self.client.login(email='new_user@curatescience.org', password='password1')
        u = User.objects.get(email='new_user@curatescience.org')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "doi": "004",
            "year": 2019,
            "journal": "Science",
            "title": "api test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "author_list": "LeBel et al",
            "authors": [u.author.id]
        })
        article = models.Article.objects.get(doi="004")
        assert str(article.authors.first()) == 'New User'

    # def test_non_admin_author_can_only_update_own_articles(self):
    #     self.client.login(email='new_user@curatescience.org', password='password1')
    #     u = User.objects.get(email='new_user@curatescience.org')
    #     author = models.Author.objects.create(user=u, name='New User')
    #     article = models.Article.objects.first()
    #     url = reverse('api-update-article', kwargs={'pk': article.id})
    #     r = self.client.patch(url, {
    #         "title": "api test article updated",
    #     }, content_type="application/json")
    #     assert r.status_code == 403

    def test_create_invalid_article_400(self):
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "journal": "Science",
            "title": "api test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [models.Author.objects.first().id,]
        })
        assert r.status_code == 400

    def test_article_year_can_be_in_press(self):
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "doi": "000",
            "year": "",
            "in_press": True,
            "author_list": "LeBel et al",
            "journal": "Science",
            "title": "api test article",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "authors": [models.Author.objects.first().id,]
        })
        a = models.Article.objects.get(doi="000")
        assert str(a) == "LeBel et al (In Press) api test article"

    def test_anonymous_user_cannot_create_article_with_api(self):
        self.client=Client()
        url = reverse('api-create-article')
        r = self.client.post(
            url,
            {
                "doi": "002",
                "year": 2018,
                "journal": "Science",
                "title": "api test article 2",
                "article_type": "ORIGINAL",
                "research_area": "SOCIAL_SCIENCE",
                "authors": [models.Author.objects.first().id,]
            },
            content_type="application/json"
        )

        assert r.status_code == 403

    def test_authorized_user_can_get_article_create_form(self):
        self.client.login(email='new_user@curatescience.org', password='password1')
        url = reverse('api-create-article')
        r = self.client.get(url)
        assert r.status_code == 200

    def test_admin_can_create_article_nested(self):
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "key_figures": [],
            "commentaries": [
                {
                    "authors_year": "Tester (2016)",
                    "commentary_url": "https://curatescience.org/"
                }
            ],
            "authors": [1],
            "doi": "doi test nested create",
            "journal": "",
            "author_list": "Beavis and Butthead",
            "year": 2019,
            "in_press": False,
            "title": "title test nested create",
            "article_type": "ORIGINAL",
            "number_of_reps": 0,
            "research_area": "SOCIAL_SCIENCE"
        })
        assert r.status_code == 201

    # Update Articles
    def test_authenticated_user_can_edit_article_with_api(self):
        self.client.login(email='new_user@curatescience.org', password='password1')
        article=models.Article.objects.first()
        user = User.objects.get(email='new_user@curatescience.org')
        article.authors.add(user.author)
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(
            url, {
                "id": article.id,
                "html_url": "http://www.curatescience.org/"
            },
            content_type="application/json")
        assert r.status_code == 200

    def test_authenticated_user_can_edit_article_empty_doi(self):
        self.client.login(email='new_user@curatescience.org', password='password1')
        article=models.Article.objects.first()
        user = User.objects.get(email='new_user@curatescience.org')
        article.authors.add(user.author)
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(
            url, {
                "id": article.id,
                "doi": "",
                "html_url": "http://www.curatescience.org/"
            },
            content_type="application/json")
        d = json.loads(r.content.decode('utf-8'))
        updated_doi = d.get('doi')
        assert r.status_code == 200
        assert bool(updated_doi) == False

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
        self.client.login(email='new_user@curatescience.org', password='password1')
        url = reverse('api-update-article', kwargs={'pk': 99999})
        r = self.client.put(url, {"title": "_"})
        assert r.status_code == 404

    def test_admin_can_edit_article_nested(self):
        self.client.login(email='admin@curatescience.org', password='password')
        article=models.Article.objects.first()
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(
            url,
            {
                "id": article.id,
                "commentaries": [
                    {
                        "authors_year": "Test",
                        "commentary_url": "https://www.curatescience.org/",
                    }
                ]
            },
            content_type="application/json")
        assert r.status_code == 200
        assert article.commentaries.first().authors_year == "Test"

    def test_doi_validation_in_article_update(self):
        self.client.login(email='new_user@curatescience.org', password='password1')
        article=models.Article.objects.first()
        TEST_DOI = '500'
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(
            url, {
                "id": article.id,
                "doi": "http://dx.doi.org/%s" % TEST_DOI
            },
            content_type="application/json")
        d = json.loads(r.content.decode('utf-8'))
        updated_doi = d.get('doi')
        assert updated_doi == TEST_DOI

    def test_doi_validation_in_article_update_doi_unchanged(self):
        self.client.login(email='new_user@curatescience.org', password='password1')
        article=models.Article.objects.first()
        TEST_DOI = '500'

        # First update to test DOI
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(
            url, {
                "id": article.id,
                "doi": TEST_DOI
            },
            content_type="application/json")

        # Second update with same DOI
        url = reverse('api-update-article', kwargs={'pk': article.id})
        r = self.client.patch(
            url, {
                "id": article.id,
                "doi": TEST_DOI
            },
            content_type="application/json")
        assert r.status_code == 200
        d = json.loads(r.content.decode('utf-8'))
        updated_doi = d.get('doi')
        assert updated_doi == TEST_DOI

    # Delete Articles
    def test_anon_cannot_delete_article_api(self):
        self.client=Client()
        article=models.Article.objects.first()
        url = reverse('api-delete-article', kwargs={'pk': article.id})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_user_can_delete_article_if_only_author(self):
        new_user = User.objects.get(email='new_user@curatescience.org')
        self.client.login(email=new_user.email, password='password1')
        new_article = models.Article.objects.create(doi="75643527", year = 1999, title = "New Article")
        new_article.authors.add(new_user.author)
        url = reverse('api-delete-article', kwargs={'pk': new_article.id})
        r = self.client.delete(url)
        assert r.status_code == 200

    def test_user_cannot_delete_multi_author_article(self):
        new_user = User.objects.get(email='new_user@curatescience.org')
        new_user_2 = User.objects.get(email='new_user_2@curatescience.org')
        self.client.login(email=new_user.email, password='password1')
        new_article = models.Article.objects.create(doi="71564527", year = 2000, title = "New Article 2")
        new_article.authors.add(new_user.author)
        new_article.authors.add(new_user_2.author)
        url = reverse('api-delete-article', kwargs={'pk': new_article.id})
        r = self.client.delete(url)
        assert r.status_code == 405

    def test_admin_can_delete_article_api(self):
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-article')
        r = self.client.post(url, {
            "doi": "003",
            "year": 2017,
            "journal": "Science",
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
        self.client.login(email='admin@curatescience.org', password='password')
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
        author = models.Author.objects.filter(name='Etienne LeBel').first()
        url = reverse('api-view-author', kwargs={'slug': author.slug})
        r = self.client.get(url)
        assert r.status_code == 200
        assert "LeBel" in r.content.decode('utf-8')

    def test_invalid_author_id_404(self):
        self.client = Client()
        url = reverse('api-view-author', kwargs={'slug': 'foo'})
        r = self.client.get(url)
        assert r.status_code == 404

    # Create Authors
    def test_anon_cannot_create_author_api(self):
        self.client=Client()
        url = reverse('api-create-author')
        r = self.client.post(
            url,
            {
                'name':'test',
            },
            content_type="application/json"
        )

        assert r.status_code == 403

    def test_user_with_author_cannot_create_another(self):
        self.client.login(email='new_user_2@curatescience.org', password='password2')
        url = reverse('api-create-author')
        r = self.client.post(url, {
            "name": "John Doe",
        })
        assert r.status_code == 403

    def test_associated_user_can_update_author_api(self):
        self.client=Client()
        user = User.objects.get(email='new_user@curatescience.org')
        self.client.login(email=user.email, password='password1')
        url = reverse('api-update-author', kwargs={'slug': user.author.slug})
        r = self.client.patch(
            url, {
                "name": 'Jimmy'
            },
            content_type="application/json")
        assert r.status_code == 200

    def test_other_user_cannot_update_author_api(self):
        self.client=Client()
        self.client.login(email='new_user_2@curatescience.org', password='password2')
        author=models.Author.objects.first()
        url = reverse('api-update-author', kwargs={'slug': author.slug})
        r = self.client.patch(url, {
            "id": author.id,
            "name": "test"
        })
        assert r.status_code == 401

    def test_superuser_create_author(self):
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-author')
        r = self.client.post(url, {
            "name": "Jill Tester",
        })
        a = models.Author.objects.get(name = "Jill Tester")
        assert a.name == "Jill Tester"
        assert a.user is None

    def test_admin_user_can_get_author_create_form(self):
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-author')
        r = self.client.get(url)
        assert r.status_code == 200

    # Update Authors
    def test_anon_cannot_edit_author_api(self):
        self.client=Client()
        author=models.Author.objects.first()
        url = reverse('api-update-author', kwargs={'slug': author.slug})
        r = self.client.patch(url, {
            "id": author.id,
            "name": "test"
        })
        assert r.status_code == 403

    def test_authorized_user_can_patch_author(self):
        self.client.login(email='admin@curatescience.org', password='password')
        author=models.Author.objects.first()
        url = reverse('api-update-author', kwargs={'slug': author.slug})
        r = self.client.patch(
            url, {
                "name": 'Jimmy'
            },
            content_type="application/json")
        assert r.status_code == 200

    def test_authorized_user_can_put_author(self):
        self.client.login(email='admin@curatescience.org', password='password')
        author=models.Author.objects.first()
        url = reverse('api-update-author', kwargs={'slug': author.slug})
        r = self.client.put(
            url, {
                "name": 'Chen-Bo Zhong',
            },
            content_type="application/json")
        author=models.Author.objects.first()
        assert r.status_code == 200
        assert str(author) == 'Chen-Bo Zhong'

    # Delete Authors
    def test_anon_cannot_delete_author_api(self):
        self.client=Client()
        author=models.Author.objects.first()
        url = reverse('api-delete-author', kwargs={'slug': author.slug})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_user_cannot_delete_author_api(self):
        self.client.login(email='new_user@curatescience.org', password='password1')
        author=models.Author.objects.first()
        url = reverse('api-delete-author', kwargs={'slug': author.slug})
        r = self.client.delete(url)
        assert r.status_code == 403

    def test_admin_can_delete_author_api(self):
        self.client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-author')
        r = self.client.post(url, {
            "name": "John Tester",
        })
        author = models.Author.objects.get(name="John Tester")
        url = reverse('api-delete-author', kwargs={'slug': author.slug})
        r = self.client.delete(url)
        assert auth.get_user(self.client).is_authenticated
        assert auth.get_user(self.client).is_staff
        assert r.status_code == 200
        assert len(models.Author.objects.filter(id=author.id)) == 0

    def test_authorized_user_can_create_key_figure(self):
        client = APIClient()
        client.login(email='new_user@curatescience.org', password='password1')
        article = models.Article.objects.first()
        url = reverse('api-create-key-figure', kwargs={'article_pk': article.id})
        f = open('curate/fixtures/image.jpg', mode='rb')
        res = client.put(url, {'file': f})

        assert len(article.key_figures.all()) == 1
        kf = article.key_figures.first()
        assert kf.image is not None
        assert kf.thumbnail is not None
        assert kf.width == 319
        assert kf.height == 400

    def test_unauthorized_cannot_create_key_figure(self):
        client = APIClient()
        article = models.Article.objects.first()
        url = reverse('api-create-key-figure', kwargs={'article_pk': article.id})
        f = open('curate/fixtures/image.jpg', mode='rb')
        res = client.put(url, {'file': f})
        assert res.status_code == 403

    def test_admin_can_delete_key_figure(self):
        client = APIClient()
        client.login(email='admin@curatescience.org', password='password')
        article = models.Article.objects.first()
        url = reverse('api-create-key-figure', kwargs={'article_pk': article.id})
        f = open('curate/fixtures/image.jpg', mode='rb')
        res = client.put(url, {'file': f})
        kf = article.key_figures.first()

        url = reverse('api-delete-key-figure', kwargs={'pk': kf.id})
        r = client.delete(url)
        assert r.status_code == 200
        assert len(article.key_figures.all()) == 0

    def test_non_admin_cannot_delete_key_figure(self):
        client = APIClient()
        client.login(email='new_user@curatescience.org', password='password1')
        article = models.Article.objects.first()
        url = reverse('api-create-key-figure', kwargs={'article_pk': article.id})
        f = open('curate/fixtures/image.jpg', mode='rb')
        res = client.put(url, {'file': f})
        kf = article.key_figures.first()

        url = reverse('api-delete-key-figure', kwargs={'pk': kf.id})
        r = client.delete(url)
        assert r.status_code == 403

    def test_create_invitation(self):
        client = APIClient()
        client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-invitation')
        res = client.post(url, {
            "email": "test.user@example.com",
            "author": {
                "name": "Test User"
            }
        }, format="json")
        print(res.content.decode('utf-8'))
        assert res.status_code == 201
        i = Invitation.objects.get(email="test.user@example.com")
        assert i.author.slug == "test-user"

    def test_cannot_invite_duplicate_email(self):
        client = APIClient()
        client.force_authenticate(user = User.objects.get(email="admin@curatescience.org"))
        email = 'fake_email@address.com'
        u = User.objects.create(email=email, first_name='Fake User')
        user_with_same_email = User.objects.filter(email=email).first()
        assert user_with_same_email is not None
        url = reverse('api-create-invitation')
        res = client.post(url, {
            "email": email,
            "author": {
                "name": "Fake User"
            }
        }, format="json")
        print(res.content.decode('utf-8'))
        print(res.status_code)
        assert res.status_code == 400

    def test_link_article(self):
        client = APIClient()
        client.login(email='admin@curatescience.org', password='password')
        url = reverse('api-create-article')
        r = client.post(url, {
            "doi": "005",
            "year": 2019,
            "journal": "Science",
            "title": "api test article 005",
            "article_type": "ORIGINAL",
            "research_area": "SOCIAL_SCIENCE",
            "author_list": "LeBel et al",
            "commentaries": [],
            "authors": [],
        }, format='json')
        print(r.content.decode('utf-8'))
        self.assertEqual(r.status_code, 201)
        article = models.Article.objects.get(doi="005")
        author = models.Author.objects.first()
        url = reverse('api-link-articles-to-author', kwargs={'slug': author.slug})
        r2 = client.post(url, [
            {
                "article": article.id,
                "linked": True,
            },
        ], format='json')
        self.assertEqual(r2.status_code, 200)
        assert article in author.articles.all()
        r3 = client.post(url, [
            {
                "article": article.id,
                "linked": False,
            },
        ], format='json')
        assert article not in author.articles.all()

        r4 = client.post(url, [
            {
                "article": 12345,
                "linked": True,
            },
        ], format='json')
        self.assertEqual(r4.status_code, 400)


    # def test_article_search(self):
    #     self.client.login(email='new_user@curatescience.org', password='password1')
    #     url = reverse('api-search-articles') + "?q=A"
    #     r = self.client.get(url)
    #     d = json.loads(r.content.decode('utf-8'))
    #     assert r.status_code == 200
    #     assert d[0].get('title') == "A brief guide to evaluate replications"

    # def test_article_search_pagination(self):
    #     self.client.login(email='new_user@curatescience.org', password='password1')
    #     url = reverse('api-search-articles') + "?q=LeBel&page_size=2"
    #     r = self.client.get(url)
    #     d = json.loads(r.content.decode('utf-8'))
    #     assert r.status_code == 200
    #     assert len(d) == 2

    def test_api_ordering_by_created(self):
        new_article = models.Article.objects.create(title='new article')

        url = '{base_url}?ordering=created'.format(base_url=reverse('api-list-articles'))
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))

        assert d[0]['id'] == new_article.id

        created = d[0]['created']
        for article in d[1:]:
            assert article['created'] <= created
            created = article['created']

    def test_api_ordering_by_impact(self):
        article_impact_100 = models.Article.objects.create(title='100 views', pdf_views=100)
        article_impact_10 = models.Article.objects.create(title='10 views', pdf_views=10)
        article_impact_5000 = models.Article.objects.create(title='5000 views', pdf_views=5000)

        url = '{base_url}?ordering=impact'.format(base_url=reverse('api-list-articles'))
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        article_ids = [article['id'] for article in d]

        assert (
            article_ids.index(article_impact_10.id) >
            article_ids.index(article_impact_100.id) >
            article_ids.index(article_impact_5000.id)
        )

    def test_api_list_filtering(self):
        new_article = models.Article.objects.create(title='new article')

        def get_filtered_article_ids(filters):
            filter_query = '&'.join([f'transparency={filter}' for filter in filters])
            base_url = reverse('api-list-articles')
            url = f'{base_url}?{filter_query}'
            r = self.client.get(url)
            d = json.loads(r.content.decode('utf-8'))
            return [article['id'] for article in d]

        # Open code
        assert new_article.id not in get_filtered_article_ids(['open_code'])

        new_article.public_code_url = 'http://example.com'
        new_article.save()

        assert new_article.id in get_filtered_article_ids(['open_code'])

        # Open data
        assert new_article.id not in get_filtered_article_ids(['open_data'])

        new_article.public_data_url = 'http://example.com'
        new_article.save()

        assert new_article.id in get_filtered_article_ids(['open_data'])

        # Open materials
        assert new_article.id not in get_filtered_article_ids(['open_materials'])

        new_article.public_study_materials_url = 'http://example.com'
        new_article.save()

        assert new_article.id in get_filtered_article_ids(['open_materials'])

        # Reporting standards
        assert new_article.id not in get_filtered_article_ids(['reporting_standards'])

        new_article.reporting_standards_type = models.Article.BASIC_4_AT_SUBMISSION
        new_article.save()

        assert new_article.id in get_filtered_article_ids(['reporting_standards'])

        # Combined filter
        open_code_data_article = models.Article.objects.create(
            title='open code & data', public_code_url='code.com', public_data_url='data.net'
        )

        assert open_code_data_article.id in get_filtered_article_ids(['open_code'])
        assert open_code_data_article.id in get_filtered_article_ids(['open_code', 'open_data'])
        assert open_code_data_article.id not in get_filtered_article_ids(['open_code', 'open_data', 'open_materials'])

    def test_prereg_filtering(self):
        def get_filtered_article_ids(filters):
            filter_query = '&'.join([f'transparency={filter}' for filter in filters])
            base_url = reverse('api-list-articles')
            url = f'{base_url}?{filter_query}'
            r = self.client.get(url)
            d = json.loads(r.content.decode('utf-8'))
            return [article['id'] for article in d]

        new_article = models.Article.objects.create(title='article')

        # Registered design analysis
        assert new_article.id not in get_filtered_article_ids(['registered_design_analysis'])

        new_article.prereg_protocol_type = models.Article.PREREG_STUDY_DESIGN_ANALYSIS
        new_article.save()

        assert new_article.id in get_filtered_article_ids(['registered_design_analysis'])

        # Multiple values should combine like OR
        assert new_article.id in get_filtered_article_ids(['registered_design_analysis', 'registered_report'])

        # Registered report
        assert new_article.id not in get_filtered_article_ids(['registered_report'])

        new_article.prereg_protocol_type = models.Article.REGISTERED_REPORT
        new_article.save()

        assert new_article.id in get_filtered_article_ids(['registered_report'])

    def test_api_list_pagination(self):
        # Create 11 new articles
        models.Article.objects.bulk_create([models.Article(title=f'Article {i}') for i in range(11)])

        # First page should return `page_size` articles
        base_url = reverse('api-list-articles')
        page_size = 10
        url = f'{base_url}?page_size={page_size}'
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        assert len(d) == page_size

        # Last page should have the remainder of the articles (e.g. 2 if page_size=10, number_of_articles=12)
        number_of_articles = models.Article.objects.count()
        last_page = (number_of_articles // page_size) + 1
        url += f'&page={last_page}'
        r = self.client.get(url)
        d = json.loads(r.content.decode('utf-8'))
        assert len(d) == number_of_articles % page_size

        # Requests for invalid pages should return a 404
        url += f'&page={last_page + 1}'
        r = self.client.get(url)
        assert r.status_code == 404

    def test_api_list_content_filtering(self):
        new_article = models.Article.objects.create(title='article')

        def get_filtered_article_ids(filters):
            base_url = reverse('api-list-articles')
            query_string = '&content='.join(filters)
            url = f'{base_url}?content={query_string}'
            r = self.client.get(url)
            d = json.loads(r.content.decode('utf-8'))
            return [article['id'] for article in d]

        # Original
        self.assertTrue(new_article.id not in get_filtered_article_ids([models.Article.ORIGINAL]))
        new_article.article_type = models.Article.ORIGINAL
        new_article.save()
        self.assertTrue(new_article.id in get_filtered_article_ids([models.Article.ORIGINAL]))

        # Replication
        self.assertTrue(new_article.id not in get_filtered_article_ids([models.Article.REPLICATION]))
        new_article.article_type = models.Article.REPLICATION
        new_article.save()
        self.assertTrue(new_article.id in get_filtered_article_ids([models.Article.REPLICATION]))

        # Reproducibility
        self.assertTrue(new_article.id not in get_filtered_article_ids([models.Article.REPRODUCIBILITY]))
        new_article.article_type = models.Article.REPRODUCIBILITY
        new_article.save()
        self.assertTrue(new_article.id in get_filtered_article_ids([models.Article.REPRODUCIBILITY]))

        # Meta-analysis
        self.assertTrue(new_article.id not in get_filtered_article_ids([models.Article.META_ANALYSIS]))
        new_article.article_type = models.Article.META_ANALYSIS
        new_article.save()
        self.assertTrue(new_article.id in get_filtered_article_ids([models.Article.META_ANALYSIS]))

        # Invalid filter
        number_of_articles = models.Article.objects.count()
        self.assertEqual(number_of_articles, len(get_filtered_article_ids('nonsense')))

        # Multiple filters
        new_article.article_type = models.Article.REPRODUCIBILITY
        new_article.save()
        self.assertTrue(
            new_article.id in get_filtered_article_ids([models.Article.META_ANALYSIS, models.Article.REPRODUCIBILITY])
        )
        self.assertTrue(
            new_article.id not in get_filtered_article_ids([models.Article.META_ANALYSIS, models.Article.REPLICATION])
        )

    def test_api_search_article_title(self):
        self.client = Client()
        url = reverse('api-search-articles-and-authors')
        article = models.Article.objects.create(title='Test Search Article')
        r = self.client.get(f'{url}?q=test')
        d = json.loads(r.content.decode('utf-8'))
        article_ids = [article['id'] for article in d['articles']]
        self.assertTrue(article.id in article_ids)

    def test_api_search_article_author_list(self):
        self.client = Client()
        url = reverse('api-search-articles-and-authors')
        article = models.Article.objects.create(title='Article', author_list='Matt, John')
        r = self.client.get(f'{url}?q=matt')
        d = json.loads(r.content.decode('utf-8'))
        article_ids = [article['id'] for article in d['articles']]
        self.assertTrue(article.id in article_ids)

    def test_api_search_article_author(self):
        self.client = Client()
        url = reverse('api-search-articles-and-authors')
        author = models.Author.objects.create(name='Charles Dickens', is_activated=True)
        article = models.Article.objects.create(title='Article')
        article.authors.add(author)
        r = self.client.get(f'{url}?q=dickens')
        d = json.loads(r.content.decode('utf-8'))
        article_ids = [article['id'] for article in d['articles']]
        self.assertTrue(article.id in article_ids)

    def test_api_search_author_name(self):
        self.client = Client()
        url = reverse('api-search-articles-and-authors')
        author = models.Author.objects.create(name='Nick Bus', is_activated=True)
        r = self.client.get(f'{url}?q=bus')
        d = json.loads(r.content.decode('utf-8'))
        author_ids = [author['id'] for author in d['authors']]
        self.assertTrue(author.id in author_ids)

    def test_api_search_author_affiliations(self):
        self.client = Client()
        url = reverse('api-search-articles-and-authors')
        author = models.Author.objects.create(name='Nick', affiliations='UCC', is_activated=True)
        r = self.client.get(f'{url}?q=UCC')
        d = json.loads(r.content.decode('utf-8'))
        author_ids = [author['id'] for author in d['authors']]
        self.assertTrue(author.id in author_ids)

    def test_api_returns_only_live_articles(self):
        live_article = models.Article.objects.create(title='Live Article', author_list='Matt, John', is_live=True)
        not_live_article = models.Article.objects.create(title='Test Article', author_list='Matt, John', is_live=False)

        url = reverse('api-search-articles-and-authors')
        r = self.client.get(f'{url}?q=matt')
        d = json.loads(r.content.decode('utf-8'))

        article_ids = [article['id'] for article in d['articles']]
        self.assertTrue(live_article.id in article_ids)
        self.assertTrue(not_live_article.id not in article_ids)

    def test_api_returns_only_activated_authors(self):
        activated_author = models.Author.objects.create(name='Nick Bus', is_activated=True)
        not_activated_author = models.Author.objects.create(name='Nick Not Active', is_activated=False)

        url = reverse('api-search-articles-and-authors')
        r = self.client.get(f'{url}?q=nick')
        d = json.loads(r.content.decode('utf-8'))

        author_ids = [author['id'] for author in d['authors']]
        self.assertTrue(activated_author.id in author_ids)
        self.assertTrue(not_activated_author.id not in author_ids)
