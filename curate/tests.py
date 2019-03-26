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
