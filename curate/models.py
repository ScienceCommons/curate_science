from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.postgres.fields import JSONField
import datetime

# Create your models here.

class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    email = models.EmailField(unique=True)
    curation_contributions = JSONField(null=True)
    browsing_history = JSONField(null=True)
    tracked_content = JSONField(null=True)
    recommended_contet = JSONField(null=True)
    account_settings = JSONField(null=True)
    research_interests = JSONField(null=True)
    platform_invites = models.PositiveIntegerField(default=0)

class Author(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.PROTECT, null=True)
    orcid = models.CharField(max_length=255, null=True)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255)
    affiliations = JSONField(null=True)
    profile_urls = JSONField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    articles = models.ManyToManyField('Article', through='ArticleAuthor', related_name='authors')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Journal(models.Model):
    """A periodical that publishes many Articles"""
    name = models.CharField(max_length=255, unique=True)
    issn = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.name

class Article(models.Model):
    """A written work with one or more Authors, reporting the results of a scientific Study."""
    ORIGINAL = 'ORIGINAL'
    REPLICATION = 'REPLICATION'
    REPRODUCIBILITY = 'REPRODUCIBILITY'
    META_ANALYSIS = 'META_ANALYSIS'
    META_RESEARCH = 'META_RESEARCH'
    COMMENTARY = 'COMMENTARY'

    BASIC_4_AT_SUBMISSION = 'BASIC_4_AT_SUBMISSION'
    BASIC_4_RETROACTIVE = 'BASIC_4_RETROACTIVE'
    CONSORT_SPI = 'CONSORT_SPI'
    CONSORT = 'CONSORT'
    JARS = 'JARS'
    STROBE = 'STROBE'
    ARRIVE = 'ARRIVE'
    NATURE_NEUROSCIENCE = 'NATURE_NEUROSCIENCE'
    MARS = 'MARS'
    PRISMA = 'PRISMA'
    PRISMA_P = 'PRISMA_P'

    SOCIAL_SCIENCE = 'SOCIAL_SCIENCE'
    MEDICAL_LIFE_SCIENCE = 'MEDICAL_LIFE_SCIENCE'

    doi = models.CharField(max_length=255, null=True, blank=True)
    journal = models.ForeignKey(Journal, on_delete=models.PROTECT, null=True, blank=True, related_name='articles')
    year = models.PositiveIntegerField(default=datetime.datetime.now().year)
    title = models.CharField(max_length=255)
    abstract = models.TextField(null=True, blank=True)
    keywords = JSONField(null=True, blank=True)
    article_type = models.CharField(max_length=255, choices=(
        (ORIGINAL, 'original'),
        (REPLICATION, 'replication'),
        (REPRODUCIBILITY, 'reanalysis - reproducibility'),
        (META_ANALYSIS, 'reanalysis - meta-analysis'),
        (META_RESEARCH, 'reanalysis - meta-research'),
        (COMMENTARY, 'commentary'),
    ))
    reporting_standards_type = models.CharField(
        max_length=255, null=True, blank=True, choices=(
        (BASIC_4_AT_SUBMISSION, "Basic-4 (at submission; PSCI, 2014)"),
        (BASIC_4_RETROACTIVE, "Basic-4 (retroactive; 2012)"),
        (CONSORT_SPI, "CONSORT-SPI (2018)"),
        (CONSORT, "CONSORT (2010)"),
        (JARS, "JARS (2018)"),
        (STROBE, "STROBE (2007)"),
        (ARRIVE, "ARRIVE (2010)"),
        (NATURE_NEUROSCIENCE, "Nature Neuroscience (2015)"),
        (MARS, "MARS (2018)"),
        (PRISMA, "PRISMA (2009)"),
        (PRISMA_P, "PRISMA-P (2015)")
    ))
    # commentary_of = models.ManyToManyField(
    #     'self',
    #     through='RelatedArticle',
    #     symmetrical=False,
    #     blank=True
    # )
    # commentary_of = models.ManyToManyField(
    #     'self',
    #     through='RelatedArticle',
    #     related_name='commentaries',
    #     blank=True,
    # )
    # reproducibility_of = models.ManyToManyField(
    #     'self',
    #     through='RelatedArticle',
    #     related_name='reproducibilities',
    #     blank=True,
    # )
    # robustness_of = models.ManyToManyField(
    #     'self',
    #     through='RelatedArticle',
    #     related_name='robustnesses',
    #     blank=True,
    # )
    pdf_url = models.URLField(null=True, blank=True)
    html_url = models.URLField(null=True, blank=True)
    preprint_url = models.URLField(null=True, blank=True)
    research_area = models.CharField(max_length=255,
                                     choices=(
                                         (SOCIAL_SCIENCE, 'Social Science'),
                                         (MEDICAL_LIFE_SCIENCE, 'Medical/Life Science'),
                                     ),
                                     default=SOCIAL_SCIENCE
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    @property
    def has_many_studies(self):
        return len(self.studies.all()) > 1

    @property
    def et_al(self):
        first_author = self.authors.first().last_name
        has_two_authors = self.authors.count() == 2
        has_many_authors = self.authors.count() > 2
        if has_two_authors:
            second_author = self.articleauthor_set.get(order=2).author.last_name
            et_al = f"{first_author} & {second_author}"
        elif has_many_authors:
            et_al = f"{first_author} et al."
        else:
            et_al = first_author
        return et_al
    def __str__(self):
        return f"{self.et_al} ({self.year}) {self.title}"

    class Meta:
        unique_together=('title', 'year')

class RelatedArticle(models.Model):
    original_article = models.ForeignKey(
        Article,
        on_delete=models.PROTECT,
        related_name='from_article',
    )
    related_article = models.ForeignKey(
        Article,
        on_delete=models.PROTECT,
        related_name='to_article',
    )
    is_commentary = models.BooleanField(default=False)
    is_reproducibilty = models.BooleanField(default=False)
    is_robustness = models.BooleanField(default=False)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order',)

class ArticleAuthor(models.Model):
    """Represents a many-to-many relationship between Authors and the Articles that they write"""
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.PROTECT)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order',)

class Study(models.Model):
    """A set of controlled trials that may be reported by an Article, or may be unpublished"""
    EXACT = 'EXACT'
    VERY_SIMILAR = 'VERY_SIMILAR'
    SIMILAR = 'SIMILAR'
    article = models.ForeignKey(Article, on_delete=models.PROTECT, null=True, related_name='studies')
    effects = models.ManyToManyField('Effect', related_name='studies')
    study_type = models.CharField(max_length=255, null=True)
    study_number = models.PositiveIntegerField()
    study_sub_number = models.CharField(max_length=2, null=True)
    evidence_type = models.CharField(max_length=255, null=True)
    reporting_standards_type = models.CharField(max_length=255, null=True)
    #below fields are only for a replication study
    replication_of = models.ForeignKey('self', on_delete=models.PROTECT, null=True)
    method_similarity_type = models.CharField(
        max_length=255,
        null=True,
        choices=(
            (EXACT,'exact'),
            (VERY_SIMILAR,'very similar'),
            (SIMILAR,'similar'),
        )
    )
    method_differences = JSONField(null=True)
    auxiliary_hypo_evidence = JSONField(null=True)
    rep_outcome_category = models.CharField(max_length=255,null=True)

    @property
    def is_replication(self):
        self.replication_of is not None

    def __str__(self):
        if self.article.has_many_studies:
            if self.study_sub_number:
                study_num = f" Study {self.study_number}{self.study_sub_number}"
            else:
                study_num = f" Study {self.study_number}"
        else:
            study_num = ""
        return(f"{self.article.et_al} ({self.article.year}){study_num}")

    class Meta:
        unique_together=('article', 'study_number',)

class Effect(models.Model):
    name = models.CharField(max_length=255, unique=True)
    constraints_on_generality = JSONField(null=True)

class Collection(models.Model):
    """A collection of distinct but conceptually related Effects"""
    name = models.CharField(max_length=255, unique=True)
    verbal_summary = models.TextField()
    creator = models.ForeignKey(
        UserProfile,
        on_delete=models.PROTECT,
        related_name='collections_created',
        null=True,
    )
    effects = models.ManyToManyField(Effect, related_name='collections')
    last_modifier = models.ForeignKey(
        UserProfile,
        on_delete=models.PROTECT,
        related_name='collections_last_modified',
        null=True,
    )

class Construct(models.Model):
    """A name for a social science concept that can can be theorized about"""
    name = models.CharField(max_length=255, unique=True)

class Hypothesis(models.Model):
    """
    A name for a proposed relationship between constructs that describes an effect
    """
    name = models.CharField(max_length=255, unique=True)
    effect = models.ForeignKey(Effect, on_delete=models.PROTECT)
    studies = models.ManyToManyField(
        Study,
        through='StatisticalResult',
        related_name='hypotheses',
    )

    def __str__(self):
        return self.name

class KeyFigure(models.Model):
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    study = models.ForeignKey(Study, on_delete=models.PROTECT, null=True)
    figure_number = models.PositiveIntegerField()
    image_url = models.URLField(null=True)
    file_name = models.CharField(max_length=255,null=True)
    is_figure = models.BooleanField()
    is_table = models.BooleanField()

    class Meta:
        unique_together=('article', 'figure_number',)

class StatisticalResult(models.Model):
    """
    A statistical result obtained by conducting a controlled trial
    as part of a study, to test a specific hypothesis.
    """
    study = models.ForeignKey(Study, on_delete=models.PROTECT)
    hypothesis = models.ForeignKey(Hypothesis, on_delete=models.PROTECT)
    effect_size = models.FloatField()
    alpha = models.FloatField(default=0.05)
    lower_conf_lim = models.FloatField()
    upper_conf_lim = models.FloatField()
    result_graph = models.ForeignKey(KeyFigure, on_delete=models.PROTECT, null=True)
    is_reproducible = models.BooleanField(default=False)
    is_robust = models.BooleanField(default=False)

    class Meta:
        unique_together=('study', 'hypothesis')

class Method(models.Model):
    """An empirical method of measuring a theoretical construct."""
    construct = models.ForeignKey(Construct, on_delete=models.PROTECT)
    name = models.CharField(max_length=255, unique=True)
    method_version = models.CharField(max_length=255, null=True)
    scoring_procedure = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.name

class VariableRelationship(models.Model):
    """
    A proposed hypothetical relationship between two or more variables
    as measured via specific methods.
    """
    POSITIVE='POSITIVE'
    NEGATIVE='NEGATIVE'
    NONLINEAR='NONLINEAR'
    REL_TYPES=(
        (POSITIVE, 'POSITIVE'),
        (NEGATIVE, 'NEGATIVE'),
        (NONLINEAR, 'NONLINEAR'),
    )
    relationship_type = models.CharField(max_length=255, choices=REL_TYPES)
    hypothesis = models.ForeignKey(Hypothesis, on_delete=models.PROTECT, related_name='variables')
    ind_var = models.ForeignKey(Method, on_delete=models.PROTECT, related_name='independent_rels')
    dep_var = models.ForeignKey(Method, on_delete=models.PROTECT, related_name='dependent_rels')

    class Meta:
        unique_together=('hypothesis', 'ind_var', 'dep_var',)

class Transparency(models.Model):
    PREREG = 'PREREG'
    MATERIALS = 'MATERIALS'
    DATA = 'DATA'
    CODE = 'CODE'
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    study = models.ForeignKey(Study, on_delete=models.PROTECT, null=True)
    transparency_type = models.CharField(max_length=255, choices=(
        (PREREG,'prereg'),
        (MATERIALS,'materials'),
        (DATA,'data'),
        (CODE,'code'),
    ))
    url = models.URLField(default="https://www.google.com/")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
