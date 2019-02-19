from curate.models import (
    Author,
    Article,
    Commentary,
    KeyFigure,
    UserProfile,
)

def create_model_instances():
    lebel = Author.objects.create(
        first_name='Etienne',
        last_name='LeBel',
        position_title='Independent Meta-Scientist',
        affiliations='KU Leuven',
    )
    campbell = Author.objects.create(
        first_name='Lorne',
        last_name='Campbell',
        position_title='Professor of Psychology',
        affiliations='Western University',
    )

    reconsidering = Article.objects.create(
        year=2019,
        doi="10.31234/osf.io/ncp27",
        title='Reconsidering the "best practices" for testing the predictive validity of ideal standards: A critique of Eastwick, Finkel, and Simpson',
        author_list='GJO Fletcher, N Overall, & L Campbell',
        preprint_url='https://psyarxiv.com/ncp27/',
        preprint_downloads=73,
        research_area='SOCIAL_SCIENCE',
        article_type='COMMENTARY',
        competing_interests='None to declare.',
        abstract="A recent article by Eastwick, Finkel, and Simpson (2018) advanced recommendations on what constitutes “best practices” for testing the predictive validity of ideal partner preference-matching. We critique their article, suggesting flaws in some of the central recommendations and setting out our conclusions that substantively differ from those offered by Eastwick et al. In contrast to these authors, we argue that a) correlations between ideal standards and perceptions of partner characteristics can be informative and relevant to the Ideal Standards Model (ISM); b) the evidence shows that the direct-matching measure for measuring ideal-perception consistency is a valid measure; c) employing the correction for normative desirability of the pattern matrix approach has pitfalls that researchers should take into account; and, d) some important methodological and statistical issues qualify their interpretations of the research findings. We conclude that research testing the ISM has provided a solid springboard for advances in this domain",
    )

    brief_guide = Article.objects.create(
        in_press=True,
        author_list='EP LeBel, W Vanpaemel, I Cheung, & L Campbell',
        title='A brief guide to evaluate replications',
        journal='Meta-Psychology',
        competing_interests='None to declare',
        article_type='CONCEPTUAL',
        preprint_downloads=230,
        preprint_url='https://osf.io/paxyn/',
        funding_sources='European Commission (Marie-Curie grant, Project ID: 793669: EP LeBel, W Vanpaemel)',
        keywords='transparency reproducibility direct replication replicability evaluating replications',
        peer_review_editor='R Carlsson',
        peer_reviewers='MB Nuijten, U Schimmack',
        peer_review_url='https://osf.io/dsn72/',
        abstract='The importance of replication is becoming increasingly appreciated, however, considerably less consensus exists about how to evaluate the design and results of replications. We make concrete recommendations on how to evaluate replications with more nuance than what is typically done currently in the literature. We highlight six study characteristics that are crucial for evaluating replications: replication method similarity, replication differences, investigator independence, method/data transparency, analytic result reproducibility, and auxiliary hypotheses’ plausibility evidence. We also recommend a more nuanced approach to statistically interpret replication results at the individual-study and meta-analytic levels, and propose clearer language to communicate replication results.',
    )

    brief_guide.authors.add(lebel)
    brief_guide.authors.add(campbell)

    reg_rep = Article.objects.create(
        title="Registered Replication Report of Finkel, Rusbult, Kumashiro, & Hannon's (2002) Study 1",
        author_list="I Cheung, L Campbell, EP LeBel, ... , & JC Yong",
        year=2016,
        journal="Perspectives on Psychological Science",
        doi="10.1177/1745691616664694",
        abstract="Finkel, Rusbult, Kumashiro, and Hannon (2002, Study 1) demonstrated a causal link between subjective commitment to a relationship and how people responded to hypothetical betrayals of that relationship. Participants primed to think about their commitment to their partner (high commitment) reacted to the betrayals with reduced exit and neglect responses relative to those primed to think about their independence from their partner (low commitment). The priming manipulation did not affect constructive voice and loyalty responses. Although other studies have demonstrated a correlation between subjective commitment and responses to betrayal, this study provides the only experimental evidence that inducing changes to subjective commitment can causally affect forgiveness responses. This Registered Replication Report (RRR) meta-analytically combines the results of 16 new direct replications of the original study, all of which followed a standardized, vetted, and preregistered protocol. The results showed little effect of the priming manipulation on the forgiveness outcome measures, but it also did not observe an effect of priming on subjective commitment, so the manipulation did not work as it had in the original study. We discuss possible explanations for the discrepancy between the findings from this RRR and the original study.",
        competing_interests="None to declare",
        funding_sources="None to declare",
        peer_review_editor="DJ Simons",
        peer_reviewers="EJ Finkel",
        pdf_url="https://journals.sagepub.com/doi/pdf/10.1177/1745691616664694",
        pdf_downloads=1000,
        html_url="https://journals.sagepub.com/doi/10.1177/1745691616664694",
        original_study="Finkel, Rusbult, Kumashiro, & Hannon's (2002) Study 1",
        research_area="SOCIAL_SCIENCE",
        in_press=False,
        prereg_protocol_url="https://osf.io/2h6tf/",
        prereg_protocol_type="REGISTERED_REPORT",
        reporting_standards_type="BASIC_4_AT_SUBMISSION",
        public_study_materials_url="https://osf.io/knfy4/",
        public_data_url="https://osf.io/3nz7j/",
        public_code_url="https://osf.io/3nz7j/",
        keywords="commitment rejection relationships analytic reproducibility replication preregistration",
        article_type="REPLICATION",
    )

    brief_guide.authors.add(lebel)
    brief_guide.authors.add(campbell)

    kf1 = KeyFigure.objects.create(
        article=reg_rep,
        figure_number=1,
        image_url="https://etiennelebel.com/logos/figures/ccl2016-figure-1.png",
        is_figure=True,
        is_table=False,
    )

    kf2 = KeyFigure.objects.create(
        article=reg_rep,
        figure_number=2,
        image_url="https://etiennelebel.com/logos/figures/ccl2016-figure-2.png",
        is_figure=True,
        is_table=False,
    )

    kf3 = KeyFigure.objects.create(
        article=reg_rep,
        figure_number=3,
        image_url="https://etiennelebel.com/logos/figures/ccl2016-figure-3.png",
        is_figure=True,
        is_table=False,
    )

    kf4 = KeyFigure.objects.create(
        article=reg_rep,
        figure_number=4,
        image_url="https://etiennelebel.com/logos/figures/ccl2016-figure-4.png",
        is_figure=True,
        is_table=False,
    )

    kf5 = KeyFigure.objects.create(
        article=reg_rep,
        figure_number=5,
        image_url="https://etiennelebel.com/logos/figures/ccl2016-figure-5.png",
        is_figure=True,
        is_table=False,
    )

    finkel_commentary = Commentary.objects.create(
        article=reg_rep,
        authors_year="Eli J. Finkel (2016)",
        commentary_url="https://static1.squarespace.com/static/56c0eeaa7c65e465b5050feb/t/5804396dbe6594564b28c24b/1476671855511/2016_Finkel_PPS.pdf",
    )

def destroy_model_instances():
    KeyFigure.objects.all().delete()
    Commentary.objects.all().delete()
    Article.objects.all().delete()
    Author.objects.all().delete()
