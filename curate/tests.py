from django.test import TestCase
from curate import models

class TestModelRelationships(TestCase):
    def setUp(self):
        zhong = models.Author.objects.create(
            first_name='Chen-Bo',
            last_name='Zhong',
        )
        liljenquist = models.Author.objects.create(
            first_name='Katie',
            last_name='Liljenquist',
        )
        earp = models.Author.objects.create(
            first_name='Brian',
            last_name='Earp'
        )
        siev = models.Author.objects.create(

        )
        gamez = models.Author.objects.create(
            first_name='Elena',
            last_name='Gámez',
        )
        science = models.Journal.objects.create(
            name='Science',
            issn='0036-8075'
        )
        znl = models.Article.objects.create(
            article_type=models.Article.ORIGINAL,
            journal=science,
            doi='10.1126/science.1130726',
            publication_year=2006,
            title='Washing away your sins: threatened morality and physical cleansing.',
            abstract='''
            Physical cleansing has been a focal element in religious ceremonies
            for thousands of years. The prevalence of this practice suggests a
            psychological association between bodily purity and moral purity.
            In three studies, we explored what we call the "Macbeth effect"-that is,
            a threat to one's moral purity induces the need to cleanse oneself.
            This effect revealed itself through an increased mental accessibility of
            cleansing-related concepts, a greater desire for cleansing products,
            and a greater likelihood of taking antiseptic wipes.
            Furthermore, we showed that physical cleansing alleviates the upsetting
            consequences of unethical behavior and reduces threats to one's moral self-image.
            Daily hygiene routines such as washing hands, as simple and benign as they might seem,
            can deliver a powerful antidote to threatened morality, enabling people to
            truly wash away their sins.
            '''
        )
        znl_study_2 = models.Study.objects.create(
            article=znl,
            study_number=2,
        )
        znl_study_3 = models.Study.objects.create(
            article=znl,
            study_number=3,
        )
        znl_study_4 = models.Study.objects.create(
            article=znl,
            study_number=4,
        )
        effect_1 = models.Effect.objects.create(
            name='Macbeth Effect #1',
            studies = [
                znl_study_2,
                znl_study_3,
            ]
        )
        effect_2 = models.Effect.objects.create(
            name='Macbeth Effect #2',
            studies=[
                znl_study_4,
            ]
        )
        moral_purity_threat = models.Construct.objects.create(
            name='moral purity threat'
        )
        need_to_cleanse = models.Construct.objects.create(
            name='need to cleanse oneself'
        )
        physical_cleansing = models.Construct.objects.create(
            name='physical cleansing'
        )
        volunteerism = models.Construct.objects.create(
            name='volunteerism'
        )
        transcribe_text = models.Method.objects.create(
            name='transcribe text'
        )
        cleaning_desire = models.Method.objects.create(
            name='cleaning products desirability'
        )
        recall_act = models.Method.objects.create(
            name='recall [un]ethical act'
        )
        product_choice = models.Method.objects.create(
            name='product choice'
        )
        antiseptic_wipe = models.Method.objects.create(
            name='antiseptic wipe'
        )
        helping_ra = models.Method.objects.create(
            name='helping RA'
        )
        hypo_1 = models.Hypothesis.objects.create(
            name='''
            Moral purity threat (transcribe text) boosts need to
            cleanse oneself (cleaning products desirabinlity)
            ''',
            effect=effect_1,
        )
        hypo_1_ind = models.Variable.objects.create(
            hypothesis=hypo_1,
            construct=moral_purity_threat,
            method=transcribe_text,
        )
        hypo_1_dep = models.Variable.objects.create(
            hypothesis=hypo_1,
            construct=need_to_cleanse,
        )
        zhong.articles.add(zandl)
        zhong.save()
        liljenquist.articles.add(zandl)
        liljenquist.save()
