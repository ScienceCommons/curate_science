from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.postgres.fields import JSONField

# Create your models here.

class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    email = models.EmailField()
    curation_contributions = JSONField(null=True)
    browsing_history = JSONField(null=True)
    tracked_content = JSONField(null=True)
    recommended_contet = JSONField(null=True)
    account_settings = JSONField(null=True)
    research_interests = JSONField(null=True)
    platform_invites = models.PositiveIntegerField(default=0)

class Author(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    orcid = models.CharField(max_length=255, null=True)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255)
    affiliations = JSONField(null=True)
    profile_urls = JSONField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    articles = models.ManyToManyField('Article', through='ArticleAuthor', related_name='authors')

class Journal(models.Model):
    name = models.CharField(max_length=255)
    issn = models.CharField(max_length=255, null=True)

class Article(models.Model):
    ORIGINAL = 'ORIGINAL'
    REPLICATION = 'REPLICATION'
    REPRODUCIBILITY = 'REPRODUCIBILITY'
    META_ANALYSIS = 'META_ANALYSIS'
    META_RESEARCH = 'META_RESEARCH'
    COMMENTARY = 'COMMENTARY'

    doi = models.CharField(max_length=255, null=True)
    journal = models.ForeignKey(Journal, on_delete=models.PROTECT, null=True)
    publication_year = models.PositiveIntegerField(null=True)
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
    commentary_of = models.ForeignKey('self', on_delete=models.PROTECT, null=True)
    reproducibility_of = models.ForeignKey('self', on_delete=models.PROTECT, null=True)
    is_reproducibilty = models.BooleanField(default=False)
    is_robustness = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    authors = models.ManyToManyField('Author', through='ArticleAuthor', related_name='articles')

class RelatedArticle(models.Model):
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    related_article = models.ForeignKey(Article, on_delete=models.PROTECT)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order',)

class ArticleAuthor(models.Model):
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    author = models.ForeignKey(Author, on_delete=models.PROTECT)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order',)

# A study is reported by an Article, or can be unpublished.
class Study(models.Model):
    EXACT = 'EXACT'
    VERY_SIMILAR = 'VERY_SIMILAR'
    SIMILAR = 'SIMILAR'

    article = models.ForeignKey(Article, on_delete=models.PROTECT, null=True)
    effects = models.ManyToManyField('Effect')
    study_type = models.CharField(max_length=255)
    study_number = models.PositiveIntegerField()
    evidence_type = models.CharField(max_length=255, null=True)
    reporting_standards_type = models.CharField(max_length=255, null=True)
    collections = models.ManyToManyField('Collection')
    #these fields are only for a replication study
    is_replication = models.BooleanField(default=False)
    replication_of = models.ForeignKey('self', on_delete=models.PROTECT, null=True)
    method_similarity_type = models.CharField(max_length=255,null=True,choices=(
        (EXACT,'exact'),
        (VERY_SIMILAR,'very similar'),
        (SIMILAR,'similar'),p
    ))
    method_differences = JSONField(null=True)
    auxiliary_hypo_evidence = JSONField(null=True)
    rep_outcome_category = models.CharField(max_length=255,null=True)

class Collection(models.Model):
    studies = models.ManyToManyField(Study)
    name = models.CharField(max_length=255)
    verbal_summary = models.TextField()
    creator = models.ForeignKey(UserProfile, on_delete=models.PROTECT)
    last_modifier = models.ForeignKey(UserProfile, on_delete=models.PROTECT)

# A Study reports one or more Effects
# A ReplicationStudy attempts to replicate one or more of the effects reported by the original study
class Effect(models.Model):
    name = models.CharField(max_length=255)
    studies = models.ManyToManyField(Study)
    replication_studies = models.ManyToManyField(ReplicationStudy)

class Construct(models.Model):
    name = models.CharField(max_length=255)

class Hypothesis(models.Model):
    name = models.CharField(max_length=255)
    effect = models.ForeignKey(Effect, on_delete=models.PROTECT, null=True)
    is_positive_relationship = models.BooleanField()

class StatisticalResult(models.Model):
    estimate_value = models.FloatField()
    estimate_precision = models.FloatField()
    result_graph = models.ForeignKey(KeyFigure, on_delete=models.PROTECT, null=True)
    is_reproducible = models.BooleanField()
    is_robust = models.BooleanField()

class Method(models.Model):
    construct = models.ForeignKey(Construct, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    method_version = models.CharField(max_length=255, null=True)
    scoring_procedure = models.CharField(max_length=255, null=True)

class Experiment(models.Model):
    hypothesis = models.ForeignKey(Hypothesis, on_delete=models.PROTECT)

class Variable(models.Model):
    DEPENDENT='DEPENDENT'
    INDEPENDENT='INDEPENDENT'
    CONTROL='CONTROL'
    VARIABLE_TYPES=(
        (DEPENDENT,'DEPENDENT'),
        (INDEPENDENT,'INDEPENDENT'),
        (CONTROL,'CONTROL'),
    )
    hypothesis = models.ForeignKey(Hypothesis, on_delete=models.PROTECT)
    construct = models.ForeignKey(Construct, on_delete=models.PROTECT)
    method = models.ForeignKey(Method, on_delete=models.PROTECT)
    variable_type = models.CharField(max_length=255, choices=VARIABLE_TYPES)

class KeyFigure(models.Model):
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    study = models.ForeignKey(Study, on_delete=models.PROTECT, null=True)
    image_url = models.URLField(null=True)
    file_name = models.CharField(max_length=255,null=True)
    is_figure = models.BooleanField()
    is_table = models.BooleanField()

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
