from django.test import TestCase
from curate import models

class TestModelRelationships(TestCase):
    def test_author_str(self):
        a = models.Author.objects.create(first_name='Katie', last_name='Liljenquist')
        assert str(a) == 'Katie Liljenquist'

    def test_article_str(self):
        a = models.Article.objects.create(
            title="Washing away your sins: threatened morality and physical cleansing.",
            author_list="Zhong & Liljenquist",
            year=2006,
        )
        assert str(a) == "Zhong & Liljenquist (2006) Washing away your sins: threatened morality and physical cleansing."
