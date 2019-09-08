from django.test import TestCase
from django.contrib.auth.models import User
from invitations.models import Invitation
from curate.models import (
    Author,
    Article,
)

class TestModelRelationships(TestCase):
    def test_author_str(self):
        a = Author.objects.create(name="Katie Liljenquist")
        assert str(a) == 'Katie Liljenquist'

    def test_article_str(self):
        a = Article.objects.create(
            title="Washing away your sins: threatened morality and physical cleansing.",
            author_list="Zhong & Liljenquist",
            year=2006,
        )
        assert str(a) == "Zhong & Liljenquist (2006) Washing away your sins: threatened morality and physical cleansing."

class TestSignals(TestCase):
    def test_link_user_to_invited_author(self):
        a = Author.objects.create(name = "Test User")
        i = Invitation.objects.create(email="testuser@curatescience.org")
        a.invite = i
        a.save()
        u = User.objects.create(email="testuser@curatescience.org")
        assert u.author == a

    def test_create_author_for_new_user(self):
        u = User.objects.create(email="foobar@curatescience.org", first_name="Foo Bar")
        assert u.author.slug == "foo-bar"


class TestBasic47Properties(TestCase):
    def test_both_false_initially(self):
        article = Article.objects.create(title='basic')
        self.assertFalse(article.is_basic_4_retroactive)
        self.assertFalse(article.is_basic_7_retroactive)

    def test_is_basic_4_all_details_reported(self):
        article = Article.objects.create(title='basic')

        article.excluded_data_all_details_reported = True
        article.conditions_all_details_reported = True
        article.outcomes_all_details_reported = True
        article.sample_size_all_details_reported = True

        self.assertEqual(article.is_basic_4_retroactive, True)
        self.assertEqual(article.is_basic_7_retroactive, False)

    def test_is_basic_7_all_details_reported(self):
        article = Article.objects.create(title='basic')

        article.excluded_data_all_details_reported = True
        article.conditions_all_details_reported = True
        article.outcomes_all_details_reported = True
        article.sample_size_all_details_reported = True
        article.analyses_all_details_reported = True
        article.unreported_studies_all_details_reported = True
        article.other_disclosures_all_details_reported = True

        self.assertEqual(article.is_basic_4_retroactive, False)
        self.assertEqual(article.is_basic_7_retroactive, True)

    def test_is_basic_4_text_fields(self):
        article = Article.objects.create(title='basic')

        article.excluded_data = 'yes'
        article.conditions = 'yes'
        article.outcomes = 'yes'
        article.sample_size = 'yes'

        self.assertEqual(article.is_basic_4_retroactive, True)
        self.assertEqual(article.is_basic_7_retroactive, False)

    def test_is_basic_7_text_fields(self):
        article = Article.objects.create(title='basic')

        article.excluded_data = 'yes'
        article.conditions = 'yes'
        article.outcomes = 'yes'
        article.sample_size = 'yes'
        article.analyses = 'yes'
        article.unreported_studies = 'yes'
        article.other_disclosures = 'yes'

        self.assertEqual(article.is_basic_4_retroactive, False)
        self.assertEqual(article.is_basic_7_retroactive, True)

    def test_is_basic_47_failures(self):
        article = Article.objects.create(title='basic')

        article.excluded_data = 'yes'
        article.conditions = 'yes'

        self.assertEqual(article.is_basic_4_retroactive, False)
        self.assertEqual(article.is_basic_7_retroactive, False)

        article.outcomes_all_details_reported = True

        self.assertEqual(article.is_basic_4_retroactive, False)
        self.assertEqual(article.is_basic_7_retroactive, False)
