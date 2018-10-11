from django.test import TestCase
from curate.test_setup import create_model_instances
from curate import models

class TestModelRelationships(TestCase):
    def setUp(self):
        create_model_instances()

    def test_article_authors(self):
        zhong = models.Author.objects.filter(
            first_name='Chen-Bo',
            last_name='Zhong',
        ).first()
        liljenquist = models.Author.objects.filter(
            first_name='Katie',
            last_name='Liljenquist',
        ).first()
        znl = models.Article.objects.filter(
            title='Washing away your sins: threatened morality and physical cleansing.',
        ).first()
        assert zhong in znl.authors.all()
        assert liljenquist in znl.authors.all()
        assert znl in zhong.articles.all()
        assert znl in liljenquist.articles.all()

    def test_has_many_studies(self):
        reuven_2013 = models.Article.objects.get(doi='10.1177/2167702613485565')
        znl = models.Article.objects.get(doi='10.1126/science.1130726')
        assert not reuven_2013.has_many_studies
        assert znl.has_many_studies

    def test_et_al(self):
        znl = models.Article.objects.get(doi='10.1126/science.1130726')
        reuven_2013 = models.Article.objects.get(doi='10.1177/2167702613485565')
        siev_2012 = models.Article.objects.get(doi='10.5209/rev_SJOP.2011.v14.n1.13')
        assert znl.et_al == 'Zhong & Liljenquist'
        assert reuven_2013.et_al == 'Reuven et al.'
        assert siev_2012.et_al == 'Siev'

    def test_study_number(self):
        earp_et_al = models.Article.objects.get(doi='10.1080/01973533.2013.856792')
        earp_study_3 = models.Study.objects.get(study_number=3, article=earp_et_al)
        assert str(earp_study_3) == "Earp et al. (2014) Study 3"

    def test_study_number_only_study(self):
        reuven_2013 = models.Article.objects.get(doi='10.1177/2167702613485565')
        reuven_study_1 = reuven_2013.studies.first()
        assert str(reuven_study_1) == "Reuven et al. (2013)"

    def test_author_str(self):
        a = models.Author.objects.get(first_name='Katie', last_name='Liljenquist')
        assert str(a) == 'Katie Liljenquist'

    def test_journal_str(self):
        j = models.Journal.objects.get(name='Science')
        assert str(j) == 'Science'

    def test_artilce_str(self):
        a = models.Article.objects.get(title="Washing away your sins: threatened morality and physical cleansing.")
        assert str(a) == "Zhong & Liljenquist (2006) Washing away your sins: threatened morality and physical cleansing."

    def test_replication_of(self):
        earp_et_al = models.Article.objects.get(doi='10.1080/01973533.2013.856792')
        earp_study_1 = models.Study.objects.get(article=earp_et_al, study_number='1')
        assert earp_study_1.is_replication
