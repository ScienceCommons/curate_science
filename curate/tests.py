from django.test import TestCase
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
    UserProfile,
    VariableRelationship,
)

class TestModelRelationships(TestCase):
    def setUp(self):
        effect_1 = Effect.objects.create(
        name='Macbeth Effect #1',
        )
        effect_2 = Effect.objects.create(
            name='Macbeth Effect #2',
        )
        coll = Collection.objects.create(
            name='Macbeth Effect',
        )
        coll.effects.add(effect_1, effect_2)
        zhong = Author.objects.create(
            first_name='Chen-Bo',
            last_name='Zhong',
        )
        liljenquist = Author.objects.create(
            first_name='Katie',
            last_name='Liljenquist',
        )
        earp = Author.objects.create(
            first_name='Brian',
            middle_name='D.',
            last_name='Earp'
        )
        everett = Author.objects.create(
            first_name='Jim',
            middle_name='A. C.',
            last_name='Everett'
        )
        madva = Author.objects.create(
            first_name='Elizabeth',
            middle_name='N.',
            last_name='Madva'
        )
        hamlin = Author.objects.create(
            first_name='J.',
            middle_name='Kiley',
            last_name='Hamlin'
        )
        siev = Author.objects.create(
            first_name='Jedediah',
            last_name='Siev'
        )
        gamez = Author.objects.create(
            first_name='Elena',
            last_name='Gámez',
        )
        diaz = Author.objects.create(
            first_name='José',
            middle_name='M.',
            last_name='Diaz'
        )
        marrero = Author.objects.create(
            first_name='Hipólito',
            last_name='Marrero'
        )
        fayard = Author.objects.create(
            first_name='Jennifer',
            middle_name='V.',
            last_name='Fayard',
        )
        bassi = Author.objects.create(
            first_name='Amandeep',
            middle_name='K.',
            last_name='Bassi'
        )
        bernstein = Author.objects.create(
            first_name='Daniel',
            middle_name='M.',
            last_name='Bernstein'
        )
        roberts = Author.objects.create(
            first_name='Brent',
            middle_name='W.',
            last_name='Roberts'
        )
        reuven = Author.objects.create(
            first_name='Oma',
            last_name='Reuven',
        )
        liberman = Author.objects.create(
            first_name='Nira',
            last_name='Liberman'
        )
        dar = Author.objects.create(
            first_name='Reuven',
            last_name='Dar'
        )
        science = Journal.objects.create(
            name='Science',
            issn='0036-8075'
        )
        znl = Article.objects.create(
            article_type='ORIGINAL',
            journal=science,
            doi='10.1126/science.1130726',
            year=2006,
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
        ''',
        )
        ArticleAuthor.objects.create(
            article=znl,
            author=zhong,
            order=1,
        )
        ArticleAuthor.objects.create(
            article=znl,
            author=liljenquist,
            order=2,
        )
        znl_study_2 = Study.objects.create(
            article=znl,
            study_number=2,
        )
        znl_study_2.effects.add(effect_1)
        znl_study_3 = Study.objects.create(
            article=znl,
            study_number=3,
        )
        znl_study_3.effects.add(effect_1)
        znl_study_4 = Study.objects.create(
            article=znl,
            study_number=4,
        )
        znl_study_4.effects.add(effect_2)
        hypo_1 = Hypothesis.objects.create(
            name='''
        Moral purity threat (transcribe text) boosts need to
        cleanse oneself (cleaning products desirability)
        ''',
            effect=effect_1,
        )
        hypo_2 = Hypothesis.objects.create(
            name="""
        Moral purity threat (recall [un]ethical act) boosts need to
        cleanse oneself (product choice)
        """,
            effect=effect_1,
        )
        hypo_3 = Hypothesis.objects.create(
            name="""
        Physical cleansing (antiseptic wipe) reduced volunteerism (helping RA)
        """,
            effect=effect_2,
        )
        moral_purity_threat = Construct.objects.create(
            name='moral purity threat'
        )
        need_to_cleanse = Construct.objects.create(
            name='need to cleanse oneself'
        )
        physical_cleansing = Construct.objects.create(
            name='physical cleansing'
        )
        volunteerism = Construct.objects.create(
            name='volunteerism'
        )
        transcribe_text = Method.objects.create(
            name='transcribe text',
            construct=moral_purity_threat,
        )
        cleaning_desire = Method.objects.create(
            name='cleaning products desirability',
            construct=need_to_cleanse,
        )
        recall_act = Method.objects.create(
            name='recall [un]ethical act',
            construct=moral_purity_threat,
        )
        product_choice = Method.objects.create(
            name='product choice',
            construct=need_to_cleanse,
        )
        antiseptic_wipe = Method.objects.create(
            name='antiseptic wipe',
            construct=physical_cleansing,
        )
        helping_ra = Method.objects.create(
            name='helping RA',
            construct=volunteerism,
        )
        hypo_1_rel = VariableRelationship.objects.create(
            hypothesis=hypo_1,
            ind_var=transcribe_text,
            dep_var=cleaning_desire,
            relationship_type='POSITIVE'
        )
        hypo_2_rel = VariableRelationship.objects.create(
            hypothesis=hypo_2,
            ind_var=recall_act,
            dep_var=product_choice,
            relationship_type='POSITIVE'
        )
        hypo_3_rel = VariableRelationship.objects.create(
            hypothesis=hypo_3,
            ind_var=antiseptic_wipe,
            dep_var=helping_ra,
            relationship_type='NEGATIVE'
        )
        znl_result_1 = StatisticalResult.objects.create(
            study=znl_study_2,
            hypothesis=hypo_1,
            effect_size=0.45,
            alpha=0.05,
            lower_conf_lim=0.14,
            upper_conf_lim=0.76,
        )
        znl_result_2 = StatisticalResult.objects.create(
            study=znl_study_3,
            hypothesis=hypo_2,
            effect_size=0.38,
            alpha=0.05,
            lower_conf_lim=0.08,
            upper_conf_lim=0.68,
        )
        znl_result_3 = StatisticalResult.objects.create(
            study=znl_study_4,
            hypothesis=hypo_3,
            effect_size=0.33,
            lower_conf_lim=0.07,
            upper_conf_lim=0.59,
        )
        basic = Journal.objects.create(
            name='Basic and Applied Social Psychology',
            issn='0197-3533',
        )
        earp_et_al = Article.objects.create(
            doi='10.1080/01973533.2013.856792',
            article_type='REPLICATION',
            journal=basic,
            year=2014,
            title='Out, Damned Spot: Can the “Macbeth Effect” Be Replicated?',
            abstract="""
        Zhong and Liljenquist (2006) reported evidence of a “Macbeth Effect” in social psychology: a threat to people's moral purity leads them to seek, literally, to cleanse themselves. In an attempt to build upon these findings, we conducted a series of direct replications of Study 2 from Z&L's seminal report. We used Z&L's original materials and methods, investigated samples that were more representative of the general population, investigated samples from different countries and cultures, and substantially increased the power of our statistical tests. Despite multiple good-faith efforts, however, we were unable to detect a “Macbeth Effect” in any of our experiments. We discuss these findings in the context of recent concerns about replicability in the field of experimental social psychology.
        """,
        )
        ArticleAuthor.objects.create(
            article=earp_et_al,
            author=earp,
            order=1,
        )
        ArticleAuthor.objects.create(
            article=earp_et_al,
            author=everett,
            order=2,
        )
        ArticleAuthor.objects.create(
            article=earp_et_al,
            author=madva,
            order=3,
        )
        earp_study_3 = Study.objects.create(
            article=earp_et_al,
            study_number=3,
            replication_of=znl_study_2
        )
        earp_study_3.effects.add(effect_1)
        earp_study_2 = Study.objects.create(
            article=earp_et_al,
            study_number=2,
            replication_of=znl_study_2
        )
        earp_study_2.effects.add(effect_1)
        earp_study_1 = Study.objects.create(
            article=earp_et_al,
            study_number=1,
            replication_of=znl_study_2
        )
        earp_study_1.effects.add(effect_1)
        earp_result_3 = StatisticalResult.objects.create(
            study=earp_study_3,
            hypothesis=hypo_1,
            effect_size=-0.11,
            lower_conf_lim=-0.22,
            upper_conf_lim=0.0,
        )
        earp_result_2 = StatisticalResult.objects.create(
            study=earp_study_2,
            hypothesis=hypo_1,
            effect_size=-0.07,
            lower_conf_lim=-0.23,
            upper_conf_lim=0.09,
        )
        earp_result_1 = StatisticalResult.objects.create(
            study=earp_study_1,
            hypothesis=hypo_1,
            effect_size=0.0,
            lower_conf_lim=-0.16,
            upper_conf_lim=0.16,
        )
        siev_2012 = Article.objects.create(
            article_type='REPLICATION',
            doi='10.5209/rev_SJOP.2011.v14.n1.13',
            title='Unpublished experimental results attempting to replicate Zhong & Liljenquist',
            abstract='Unpublished experimental results attempting to replicate Zhong & Liljenquist',
            year=2012,
        )
        ArticleAuthor.objects.create(
            article=siev_2012,
            author=siev,
            order=1
        )
        siev_study_2 = Study.objects.create(
            study_number=2,
            article=siev_2012,
            replication_of=znl_study_2
        )
        siev_study_2.effects.add(effect_1)
        siev_result = StatisticalResult.objects.create(
            study=siev_study_2,
            hypothesis=hypo_1,
            effect_size=-0.09,
            lower_conf_lim=-0.25,
            upper_conf_lim=0.07,
        )
        span_psych = Journal.objects.create(
            name='The Spanish Journal of Psychology',
            issn='1138-7416',
        )
        gamez_2011 = Article.objects.create(
            doi='',
            article_type='REPLICATION',
            journal=span_psych,
            year=2011,
            title='The Uncertain Universality of the Macbeth Effect with a Spanish Sample',
            abstract="""
        Recently a psychological mechanism has been proposed between bodily purity
        and moral purity: the "Macbeth effect". The act of washing their hands seems
        to free individuals of their guilt. However, the universality of this
        psychological mechanism is an empirical question that should be studied.
        In four studies we replicated the original Zhong & Liljenquist's experiments
        with Spanish samples. We were unsuccessful in replicating the Zhong & Liljenquist's
        results that supported cleansing as a psychological mechanism for compensating
        guilty: results couldn't confirm an increased mental accessibility of
        cleansing-related concepts or even a greater desire for cleansing products,
        neither a greater likelihood of taking antiseptic wipes. In addition we
        didn't find that physical cleansing alleviates the upsetting consequences
        of unethical behaviour. Spanish samples showed sensibility to morality
        and helping behaviour but not with cleansing as a way to reduce their threatened
        morality.
        """,
        )
        ArticleAuthor.objects.create(
            article=gamez_2011,
            author=gamez,
            order=1,
        )
        ArticleAuthor.objects.create(
            article=gamez_2011,
            author=diaz,
            order=2,
        )
        ArticleAuthor.objects.create(
            article=gamez_2011,
            author=marrero,
            order=3,
        )
        gamez_study_2 = Study.objects.create(
            study_number=2,
            article=gamez_2011,
            replication_of=znl_study_2
        )
        gamez_study_2.effects.add(effect_1)
        gamez_study_3 = Study.objects.create(
            study_number=3,
            article=gamez_2011,
            replication_of=znl_study_3
        )
        gamez_study_3.effects.add(effect_1)
        gamez_study_4 = Study.objects.create(
            study_number=4,
            article=gamez_2011,
            replication_of=znl_study_4
        )
        gamez_study_4.effects.add(effect_2)
        gamez_result_2 = StatisticalResult.objects.create(
            study=gamez_study_2,
            hypothesis=hypo_1,
            effect_size=0.04,
            lower_conf_lim=-0.29,
            upper_conf_lim=0.37,
        )
        gamez_result_3 = StatisticalResult.objects.create(
            study=gamez_study_3,
            hypothesis=hypo_2,
            effect_size=0.15,
            lower_conf_lim=-0.14,
            upper_conf_lim=0.44,
        )
        gamez_result_4 = StatisticalResult.objects.create(
            study=gamez_study_4,
            hypothesis=hypo_3,
            effect_size=0.19,
            lower_conf_lim=-0.17,
            upper_conf_lim=0.55,
        )
        jasnh = Journal.objects.create(
            name='Journal of Articles in Support of the Null Hypothesis',
            issn='1539-8714',
        )
        fayard_2009 = Article.objects.create(
            title="""
        Is cleanliness next to godliness?
        Dispelling old wives’ tales:
        Failure to replicate Zhong and Liljenquist
        """,
            abstract="""
        """,
            journal=jasnh,
            year=2009,
            doi='10.1.1.214.2427',
            article_type='REPLICATION',
        )
        ArticleAuthor.objects.create(
            article=fayard_2009,
            author=fayard,
            order=1
        )
        ArticleAuthor.objects.create(
            article=fayard_2009,
            author=bassi,
            order=2
        )
        ArticleAuthor.objects.create(
            article=fayard_2009,
            author=bernstein,
            order=3
        )
        ArticleAuthor.objects.create(
            article=fayard_2009,
            author=roberts,
            order=4
        )
        fayard_study_1 = Study.objects.create(
            article=fayard_2009,
            study_number=1,
            replication_of=znl_study_3
        )
        fayard_study_1.effects.add(effect_1)
        fayard_study_2 = Study.objects.create(
            article=fayard_2009,
            study_number=2,
            replication_of=znl_study_4
        )
        fayard_study_2.effects.add(effect_2)
        clin_psych = Journal.objects.create(
            name='Clinical Psychological Science',
            issn='2167-7026',
        )
        reuven_2013 = Article.objects.create(
            title="""
        The Effect of Physical Cleaning on Threatened Morality in Individuals with
        Obsessive-Compulsive Disorder
        """,
            year=2013,
            abstract="""
        """,
            journal=clin_psych,
            doi='10.1177/2167702613485565',
            article_type='REPLICATION',
        )
        ArticleAuthor.objects.create(
            article=reuven_2013,
            author=reuven,
            order=1,
        )
        ArticleAuthor.objects.create(
            article=reuven_2013,
            author=liberman,
            order=2,
        )
        ArticleAuthor.objects.create(
            article=reuven_2013,
            author=dar,
            order=3,
        )
        reuven_study_1 = Study.objects.create(
            study_number=1,
            article=reuven_2013,
            replication_of=znl_study_4
        )
        reuven_study_1.effects.add(effect_2)
        reuven_result = StatisticalResult.objects.create(
            study=reuven_study_1,
            hypothesis=hypo_3,
            effect_size=0.39,
            lower_conf_lim=0.08,
            upper_conf_lim=0.7,
        )

    def test_article_authors(self):
        zhong = Author.objects.filter(
            first_name='Chen-Bo',
            last_name='Zhong',
        ).first()
        liljenquist = Author.objects.filter(
            first_name='Katie',
            last_name='Liljenquist',
        ).first()
        znl = Article.objects.filter(
            title='Washing away your sins: threatened morality and physical cleansing.',
        ).first()
        assert zhong in znl.authors.all()
        assert liljenquist in znl.authors.all()
        assert znl in zhong.articles.all()
        assert znl in liljenquist.articles.all()

    def test_has_many_studies(self):
        reuven_2013 = Article.objects.get(doi='10.1177/2167702613485565')
        znl = Article.objects.get(doi='10.1126/science.1130726')
        assert not reuven_2013.has_many_studies
        assert znl.has_many_studies

    def test_et_al(self):
        znl = Article.objects.get(doi='10.1126/science.1130726')
        reuven_2013 = Article.objects.get(doi='10.1177/2167702613485565')
        siev_2012 = Article.objects.get(doi='10.5209/rev_SJOP.2011.v14.n1.13')
        assert znl.et_al == 'Zhong & Liljenquist'
        assert reuven_2013.et_al == 'Reuven et al.'
        assert siev_2012.et_al == 'Siev'

    def test_study_number(self):
        earp_et_al = Article.objects.get(doi='10.1080/01973533.2013.856792')
        earp_study_3 = Study.objects.get(study_number=3, article=earp_et_al)
        assert str(earp_study_3) == "Earp et al. (2014) Study 3"

    def test_study_number_only_study(self):
        reuven_2013 = Article.objects.get(doi='10.1177/2167702613485565')
        reuven_study_1 = reuven_2013.study_set.first()
        assert str(reuven_study_1) == "Reuven et al. (2013)"
