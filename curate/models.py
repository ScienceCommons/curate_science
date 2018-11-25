from django.db import models
from django.shortcuts import reverse
from django.contrib.auth.models import User, Group
from django.contrib.postgres.fields import JSONField
import datetime

# Create your models here.

class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    email = models.EmailField(unique=True)
    curation_contributions = JSONField(null=True, blank=True)
    browsing_history = JSONField(null=True, blank=True)
    tracked_content = JSONField(null=True, blank=True)
    recommended_content = JSONField(null=True, blank=True)
    account_settings = JSONField(null=True, blank=True)
    research_interests = JSONField(null=True, blank=True)
    platform_invites = models.PositiveIntegerField(default=0)

class Author(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.PROTECT, null=True, blank=True)
    orcid = models.CharField(max_length=255, null=True, blank=True)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255)
    affiliations = JSONField(null=True, blank=True)
    profile_urls = JSONField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    articles = models.ManyToManyField('Article', through='ArticleAuthor', related_name='authors', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Journal(models.Model):
    """A periodical that publishes many Articles"""
    name = models.CharField(max_length=255, unique=True)
    issn = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)

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
    standards_choices = (
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
            )

    doi = models.CharField(max_length=255, null=True, blank=True, unique=True)
    journal = models.ForeignKey(Journal, on_delete=models.PROTECT, null=True, blank=True, related_name='articles')
    year = models.PositiveIntegerField(null=True, blank=True)
    title = models.CharField(max_length=255)
    abstract = models.TextField(null=True, blank=True, max_length=4000)
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
        max_length=255,
        null=True,
        blank=True,
        choices=standards_choices
    )
    pdf_url = models.URLField(null=True, blank=True, max_length=1000)
    html_url = models.URLField(null=True, blank=True, max_length=1000)
    preprint_url = models.URLField(null=True, blank=True, max_length=1000)
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
    def publication_year(self):
        if self.year:
            return str(self.year)
        else:
            return "In Press"

    @property
    def has_many_studies(self):
        return len(self.studies.all()) > 1

    @property
    def et_al(self):
        n = self.authors.count()
        has_authors = n > 0
        if has_authors:
            first_author = self.authors.first().last_name
            has_two_authors = n == 2
            has_many_authors = self.authors.count() > 2
            if has_two_authors:
                second_author = self.articleauthor_set.get(order=2).author.last_name
                et_al = f"{first_author} & {second_author}"
            elif has_many_authors:
                et_al = f"{first_author} et al."
            else:
                et_al = first_author
            return et_al
        else:
            return "--"

    @property
    def commentary_of(self):
        queryset = Article.objects.filter(related_to_articles__is_commentary=True, related_to_articles__original_article=self)
        return queryset

    @property
    def reproducibility_of(self):
        queryset = Article.objects.filter(related_to_articles__is_reproducibility=True, related_to_articles__original_article=self)
        return queryset

    @property
    def robustness_of(self):
        queryset = Article.objects.filter(related_to_articles__is_robustness=True, related_to_articles__original_article=self)
        return queryset

    def __str__(self):
        return f"{self.et_al} ({self.year}) {self.title}"

    def get_absolute_url(self):
        return reverse('view-article', args=[str(self.id)])

    class Meta:
        unique_together=('title', 'year')

class RelatedArticle(models.Model):
    original_article = models.ForeignKey(
        Article,
        on_delete=models.PROTECT,
        related_name='related_articles',
    )
    related_article = models.ForeignKey(
        Article,
        on_delete=models.PROTECT,
        related_name='related_to_articles',
    )
    is_commentary = models.BooleanField(default=False)
    is_reproducibility = models.BooleanField(default=False)
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
    study_type = models.CharField(max_length=255, null=True, blank=True)
    study_number = models.CharField(max_length=2, null=True, blank=True)
    evidence_type = models.CharField(max_length=255, null=True, blank=True)
    reporting_standards_type = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        choices=Article.standards_choices
    )
    #below fields are only for a replication study
    replication_of = models.ForeignKey('self', on_delete=models.DO_NOTHING, null=True, blank=True)
    method_similarity_type = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        choices=(
            (EXACT,'exact'),
            (VERY_SIMILAR,'very similar'),
            (SIMILAR,'similar'),
        )
    )
    method_differences = JSONField(null=True, blank=True)
    auxiliary_hypo_evidence = JSONField(null=True, blank=True)
    rep_outcome_category = models.CharField(max_length=255,null=True, blank=True)
    ind_vars = models.ManyToManyField('Construct', related_name='studies_as_iv', blank=True)
    dep_vars = models.ManyToManyField('Construct', related_name='studies_as_dv', blank=True)
    ind_var_methods = models.ManyToManyField('Method', related_name='studies_as_iv_method', blank=True)
    dep_var_methods = models.ManyToManyField('Method', related_name='studies_as_dv_method', blank=True)


    @property
    def is_replication(self):
        return self.replication_of is not None

    def __str__(self):
        if self.article.has_many_studies:
            study_num = f" Study {self.study_number}"
        else:
            study_num = ""
        return(f"{self.article.et_al} ({self.article.year}){study_num}")

    class Meta:
        unique_together=('article','study_number')

class Effect(models.Model):
    name = models.CharField(max_length=255, unique=True)
    constraints_on_generality = JSONField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)

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

    def __str__(self):
        return self.name

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
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='key_figures')
    study = models.ForeignKey(Study, on_delete=models.CASCADE, null=True, blank=True)
    figure_number = models.PositiveIntegerField()
    image_url = models.URLField(null=True, blank=True)
    file_name = models.CharField(max_length=255,null=True, blank=True)
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
    construct = models.ForeignKey(Construct, on_delete=models.PROTECT, null=True)
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
    REPSTD = 'REPSTD'

    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='transparencies')
    study = models.ForeignKey(Study, on_delete=models.CASCADE, null=True, blank=True, related_name='transparencies')
    transparency_type = models.CharField(max_length=255, choices=(
        (PREREG,'prereg'),
        (MATERIALS,'materials'),
        (DATA,'data'),
        (CODE,'code'),
        (REPSTD,'repstd'),
    ))
    url = models.URLField(default="")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
