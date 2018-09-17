from django.test import TestCase
from curate import models

class TestModelRelationships(TestCase):
    def setUp(self):

        effect_1 = models.Effect.objects.create(
            name='Macbeth Effect #1',
        )
        effect_2 = models.Effect.objects.create(
            name='Macbeth Effect #2',
        )
        coll = models.Collection.objects.create(
            name='Macbeth Effect',
        )
        coll.effects.add(effect_1, effect_2)
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
            first_name='Jedediah',
            last_name='Siev'
        )
        gamez = models.Author.objects.create(
            first_name='Elena',
            last_name='Gámez',
        )
        fayard = models.Author.objects.create(
            first_name='Jennifer',
            last_name='Fayard',
        )
        reuven = models.Author.objects.create(
            first_name='Oma',
            last_name='Reuven',
        )
        science = models.Journal.objects.create(
            name='Science',
            issn='0036-8075'
        )
        znl = models.Article.objects.create(
            article_type=models.Article.ORIGINAL,
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
        models.ArticleAuthor.objects.create(
            article=znl,
            author=zhong,
            order=1,
        )
        models.ArticleAuthor.objects.create(
            article=znl,
            author=liljenquist,
            order=2,
        )
        znl_study_2 = models.Study.objects.create(
            article=znl,
            study_number=2,
        )
        znl_study_2.effects.add(effect_1)
        znl_study_3 = models.Study.objects.create(
            article=znl,
            study_number=3,
        )
        znl_study_3.effects.add(effect_1)
        znl_study_4 = models.Study.objects.create(
            article=znl,
            study_number=4,
        )
        znl_study_4.effects.add(effect_2)
        hypo_1 = models.Hypothesis.objects.create(
            name='''
            Moral purity threat (transcribe text) boosts need to
            cleanse oneself (cleaning products desirability)
            ''',
            effect=effect_1,
        )
        hypo_2 = models.Hypothesis.objects.create(
            name="""
            Moral purity threat (recall [un]ethical act) boosts need to
            cleanse oneself (product choice)
            """,
            effect=effect_1,
        )
        hypo_3 = models.Hypothesis.objects.create(
            name="""
            Physical cleansing (antiseptic wipe) reduced volunteerism (helping RA)
            """,
            effect=effect_2,
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
            name='transcribe text',
            construct=moral_purity_threat,
        )
        cleaning_desire = models.Method.objects.create(
            name='cleaning products desirability',
            construct=need_to_cleanse,
        )
        recall_act = models.Method.objects.create(
            name='recall [un]ethical act',
            construct=moral_purity_threat,
        )
        product_choice = models.Method.objects.create(
            name='product choice',
            construct=need_to_cleanse,
        )
        antiseptic_wipe = models.Method.objects.create(
            name='antiseptic wipe',
            construct=physical_cleansing,
        )
        helping_ra = models.Method.objects.create(
            name='helping RA',
            construct=volunteerism,
        )
        hypo_1_rel = models.VariableRelationship.objects.create(
            hypothesis=hypo_1,
            ind_var=transcribe_text,
            dep_var=cleaning_desire,
            relationship_type=models.VariableRelationship.POSITIVE
        )
        hypo_2_rel = models.VariableRelationship.objects.create(
            hypothesis=hypo_2,
            ind_var=recall_act,
            dep_var=product_choice,
            relationship_type=models.VariableRelationship.POSITIVE
        )
        hypo_3_rel = models.VariableRelationship.objects.create(
            hypothesis=hypo_3,
            ind_var=antiseptic_wipe,
            dep_var=helping_ra,
            relationship_type=models.VariableRelationship.NEGATIVE,
        )
        znl_result_1 = models.StatisticalResult.objects.create(
            study=znl_study_2,
            hypothesis=hypo_1,
            effect_size=0.45,
            alpha=0.05,
            lower_conf_lim=0.14,
            upper_conf_lim=0.76,
        )
        znl_result_2 = models.StatisticalResult.objects.create(
            study=znl_study_3,
            hypothesis=hypo_2,
            effect_size=0.38,
            alpha=0.05,
            lower_conf_lim=0.08,
            upper_conf_lim=0.68,
        )
        znl_result_3 = models.StatisticalResult.objects.create(
            study=znl_study_4,
            hypothesis=hypo_3,
            effect_size=0.33,
            lower_conf_lim=0.07,
            upper_conf_lim=0.59,
        )
        basic = models.Journal.objects.create(
            name='Basic and Applied Social Psychology',
            issn='0197-3533',
        )
        earp_et_al = models.Article.objects.create(
            doi='10.1080/01973533.2013.856792',
            journal=basic,
            year=2014,
            title='Out, Damned Spot: Can the “Macbeth Effect” Be Replicated?',
            abstract="""
            Zhong and Liljenquist (2006) reported evidence of a “Macbeth Effect” in social psychology: a threat to people's moral purity leads them to seek, literally, to cleanse themselves. In an attempt to build upon these findings, we conducted a series of direct replications of Study 2 from Z&L's seminal report. We used Z&L's original materials and methods, investigated samples that were more representative of the general population, investigated samples from different countries and cultures, and substantially increased the power of our statistical tests. Despite multiple good-faith efforts, however, we were unable to detect a “Macbeth Effect” in any of our experiments. We discuss these findings in the context of recent concerns about replicability in the field of experimental social psychology.
            """,
            article_type=models.Article.REPLICATION,
        )
        models.ArticleAuthor.objects.create(
            article=earp_et_al,
            author=earp,
            order=1,
        )
        earp_study_3 = models.Study.objects.create(
            article=earp_et_al,
            study_number=3,
        )
        earp_study_3.effects.add(effect_1)
        earp_study_2 = models.Study.objects.create(
            article=earp_et_al,
            study_number=2,
        )
        earp_study_2.effects.add(effect_1)
        earp_study_1 = models.Study.objects.create(
            article=earp_et_al,
            study_number=1,
        )
        earp_study_3.effects.add(effect_1)
        earp_result_3 = models.StatisticalResult.objects.create(
            study=earp_study_3,
            hypothesis=hypo_1,
            effect_size=-0.11,
            lower_conf_lim=-0.22,
            upper_conf_lim=0.0,
        )
        earp_result_2 = models.StatisticalResult.objects.create(
            study=earp_study_2,
            hypothesis=hypo_1,
            effect_size=-0.07,
            lower_conf_lim=-0.23,
            upper_conf_lim=0.09,
        )
        earp_result_1 = models.StatisticalResult.objects.create(
            study=earp_study_1,
            hypothesis=hypo_1,
            effect_size=0.0,
            lower_conf_lim=-0.16,
            upper_conf_lim=0.16,
        )
        siev_2012 = models.Article.objects.create(
            doi='10.5209/rev_SJOP.2011.v14.n1.13',
            title='Unpublished experimental results attempting to replicate Zhong & Liljenquist',
            abstract='Unpublished experimental results attempting to replicate Zhong & Liljenquist',
            year=2012,
        )
        models.ArticleAuthor.objects.create(
            article=siev_2012,
            author=siev,
            order=1
        )
        siev_study_2 = models.Study.objects.create(
            study_number=2,
            article=siev_2012,
        )
        siev_study_2.effects.add(effect_1)
        siev_result = models.StatisticalResult.objects.create(
            study=siev_study_2,
            hypothesis=hypo_1,
            effect_size=-0.09,
            lower_conf_lim=-0.25,
            upper_conf_lim=0.07,
        )
        span_psych = models.Journal.objects.create(
            name='The Spanish Journal of Psychology',
            issn='1138-7416',
        )
        gamez_2011 = models.Article.objects.create(
            doi='',
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
        models.ArticleAuthor.objects.create(
            article=gamez_2011,
            author=gamez,
            order=1,
        )
        gamez_study_2 = models.Study.objects.create(
            study_number=2,
            article=gamez_2011,
        )
        gamez_study_2.effects.add(effect_1)
        gamez_study_3 = models.Study.objects.create(
            study_number=3,
            article=gamez_2011,
        )
        gamez_study_3.effects.add(effect_1)
        gamez_study_4 = models.Study.objects.create(
            study_number=4,
            article=gamez_2011,
        )
        gamez_study_4.effects.add(effect_2)
        gamez_result_2 = models.StatisticalResult.objects.create(
            study=gamez_study_2,
            hypothesis=hypo_1,
            effect_size=0.04,
            lower_conf_lim=-0.29,
            upper_conf_lim=0.37,
        )
        gamez_result_3 = models.StatisticalResult.objects.create(
            study=gamez_study_3,
            hypothesis=hypo_2,
            effect_size=0.15,
            lower_conf_lim=-0.14,
            upper_conf_lim=0.44,
        )
        gamez_result_4 = models.StatisticalResult.objects.create(
            study=gamez_study_4,
            hypothesis=hypo_3,
            effect_size=0.19,
            lower_conf_lim=-0.17,
            upper_conf_lim=0.55,
        )
        jasnh = models.Journal.objects.create(
            name='Journal of Articles in Support of the Null Hypothesis',
            issn='1539-8714',
        )
        fayard_2009 = models.Article.objects.create(
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
        )
        models.ArticleAuthor.objects.create(
            article=fayard_2009,
            author=fayard,
            order=1
        )
        fayard_study_1 = models.Study.objects.create(
            article=fayard_2009,
            study_number=1,
        )
        fayard_study_1.effects.add(effect_1)
        fayard_study_2 = models.Study.objects.create(
            article=fayard_2009,
            study_number=2,
        )
        fayard_study_2.effects.add(effect_2)
        clin_psych = models.Journal.objects.create(
            name='Clinical Psychological Science',
            issn='2167-7026',
        )
        reuven_2013 = models.Article.objects.create(
            title="""
            The Effect of Physical Cleaning on Threatened Morality in Individuals with
            Obsessive-Compulsive Disorder
            """,
            year=2013,
            abstract="""
            """,
            journal=clin_psych,
            doi='10.1177/2167702613485565',
        )
        models.ArticleAuthor.objects.create(
            article=reuven_2013,
            author=reuven,
            order=1,
        )
        reuven_study_1 = models.Study.objects.create(
            study_number=1,
            article=reuven_2013,
        )
        reuven_study_1.effects.add(effect_2)
        reuven_result = models.StatisticalResult.objects.create(
            study=reuven_study_1,
            hypothesis=hypo_3,
            effect_size=0.39,
            lower_conf_lim=0.08,
            upper_conf_lim=0.7,
        )

    def testArticleAuthors(self):
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
