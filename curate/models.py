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
    affiliations = models.JSONField(null=True)
    profile_urls = models.JSONField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    articles = models.ManyToManyField('Article', through='ArticleAuthor', related_name='authors')

class Journal(models.Model):
    name = models.CharField(max_length=255)
    issn = models.PositiveIntegerField()

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
    keywords = models.JSONField()
    article_type = models.CharField(max_length=255, choices=(
        (ORIGINAL, 'original'),
        (REPLICATION, 'replication'),
        (REPRODUCIBILITY, 'reanalysis - reproducibility'),
        (META_ANALYSIS, 'renalysis - meta-analysis'),
        (META_RESEARCH, 'renanalysis - meta-research'),
        (COMMENTARY, 'commentary'),
    ))
    reporting_standards_type = models.CharField(max_length=255, null=True)
    commentary_of = models.ForeignKey(self, on_delete=models.PROTECT, null=True)
    reproducibility_of = models.ForeignKey(self, on_delete=models.PROTECT, null=True)
    is_reproducibilty = models.BooleanField()
    is_robustness = models.BooleanField()
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

class Study(models.Model):
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    study_type = models.CharField(max_length=255)
    study_number = models.CharField(max_length=255)
    evidence_type = models.CharField(max_length=255, null=True)
    reporting_standards_type = models.CharField(max_length=255, null=True)

class Collection(models.Model):
    name = models.CharField(max_length=255)
    verbal_summary = models.TextField()
    creator = models.ForeignKey(UserProfile, on_delete=models.PROTECT)
    last_modifier = models.ForeignKey(UserProfile, on_delete=models.PROTECT)

class ReplicationStudy(models.Model):
    EXACT = 'EXACT'
    VERY_SIMILAR = 'VERY_SIMILAR'
    SIMILAR = 'SIMILAR'

    collection = models.ForeignKey(Collection, on_delete=models.PROTECT, null=True)
    study = models.ForeignKey(Study, on_delete=models.PROTECT)
    method_similarity_type = models.CharField(max_length=255,null=True,choices=(
        (EXACT,'exact'),
        (VERY_SIMILAR,'very similar'),
        (SIMILAR,'similar'),p
    ))
    method_differences = JSONField()
    auxiliary_hypo_evidence = JSONField()
    rep_outcome_category = models.CharField(max_length=255,null=True)

class Effect(models.Model):
    name = models.CharField(max_length=255)
    studies = models.ManyToManyField(Study)
    replication_studies = models.ManyToManyField(ReplicationStudy)

class Construct(models.Model):
    name = models.CharField(max_length=255)

class Hypothesis(models.Model):
    name = models.CharField(max_length=255)
    effect = models.ForeignKey(Effect, on_delete=models.PROTECT, null=True)

class StatisticalResult(models.Model):
    estimate_value = models.FloatField()
    estimate_precision = models.FloatField()
    result_graph = models.ForeignKey(KeyFigure, on_delete=models.PROTECT, null=True)
    is_reproducible = models.BooleanField()
    is_robust = models.BooleanField()

class Method(models.Model):
    name = models.CharField(max_length=255)
    method_version = models.CharField(max_length=255)
    scoring_procedure = models.CharField(max_length=255)

class HypothesisConstructMethod(models.Model):
    name = models.CharField(max_length=255)

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
