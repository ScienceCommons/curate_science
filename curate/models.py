from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.postgres.fields import JSONField

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
    name = models.CharField(max_length=255, unique=True)
    issn = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.name

class Article(models.Model):
    ORIGINAL = 'ORIGINAL'
    REPLICATION = 'REPLICATION'
    REPRODUCIBILITY = 'REPRODUCIBILITY'
    META_ANALYSIS = 'META_ANALYSIS'
    META_RESEARCH = 'META_RESEARCH'
    COMMENTARY = 'COMMENTARY'

    doi = models.CharField(max_length=255, null=True)
    journal = models.ForeignKey(Journal, on_delete=models.PROTECT, null=True)
    year = models.PositiveIntegerField(null=True)
    title = models.CharField(max_length=255)
    abstract = models.TextField(null=True)
    keywords = JSONField(null=True)
    article_type = models.CharField(max_length=255, choices=(
        (ORIGINAL, 'original'),
        (REPLICATION, 'replication'),
        (REPRODUCIBILITY, 'reanalysis - reproducibility'),
        (META_ANALYSIS, 'renalysis - meta-analysis'),
        (META_RESEARCH, 'renanalysis - meta-research'),
        (COMMENTARY, 'commentary'),
    ))
    reporting_standards_type = models.CharField(max_length=255, null=True)
    related_articles = models.ManyToManyField(
        'self',
        through='RelatedArticle',
        related_name='original_article',
        symmetrical=False,
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        unique_together=('title', 'year')

class RelatedArticle(models.Model):
    original_article = models.ForeignKey(
        Article,
        on_delete=models.PROTECT,
        related_name='from_article'
    )
    related_article = models.ForeignKey(
        Article,
        on_delete=models.PROTECT,
        related_name='to_article'
    )
    is_commentary = models.BooleanField(default=False)
    is_reproducibilty = models.BooleanField(default=False)
    is_robustness = models.BooleanField(default=False)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order',)

class ArticleAuthor(models.Model):
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    author = models.ForeignKey(Author, on_delete=models.PROTECT)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order',)

class Study(models.Model):
    """A set of controlled trials that may be reported by an Article, or may be unpublished"""
    EXACT = 'EXACT'
    VERY_SIMILAR = 'VERY_SIMILAR'
    SIMILAR = 'SIMILAR'
    article = models.ForeignKey(Article, on_delete=models.PROTECT, null=True)
    effects = models.ManyToManyField('Effect', related_name='studies')
    study_type = models.CharField(max_length=255, null=True)
    study_number = models.PositiveIntegerField()
    evidence_type = models.CharField(max_length=255, null=True)
    reporting_standards_type = models.CharField(max_length=255, null=True)
    #below fields are only for a replication study
    is_replication = models.BooleanField(default=False)
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

    class Meta:
        unique_together=('article', 'study_number',)

class Effect(models.Model):
    name = models.CharField(max_length=255, unique=True)

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
    hypothesis = models.ForeignKey(Hypothesis, on_delete=models.PROTECT)
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
    url = models.URLField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
