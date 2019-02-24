from django.db import models
from django.shortcuts import reverse
from django.contrib.auth.models import User, Group
from django.contrib.postgres.fields import JSONField
from autoslug import AutoSlugField
import datetime

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, null=True)
    curation_contributions = JSONField(null=True, blank=True)
    browsing_history = JSONField(null=True, blank=True)
    tracked_content = JSONField(null=True, blank=True)
    recommended_content = JSONField(null=True, blank=True)
    account_settings = JSONField(null=True, blank=True)
    research_interests = JSONField(null=True, blank=True)

def populate_slug(instance):
    return ' '.join(
        [x for x in [instance.first_name, instance.middle_name, instance.last_name]
         if x is not None]
    )

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, null=True, blank=True)
    orcid = models.CharField(max_length=255, null=True, blank=True)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255)
    position_title = models.CharField(max_length=255, null=True, blank=True)
    affiliations = models.CharField(max_length=255, null=True, blank=True)
    profile_urls = JSONField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    articles = models.ManyToManyField('Article', related_name='authors', blank=True)
    slug = AutoSlugField(
        populate_from = populate_slug,
        unique=True,
        editable=True,
        null=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Article(models.Model):
    """A written work with one or more Authors, reporting the results of a scientific Study."""
    ORIGINAL = 'ORIGINAL'
    CONCEPTUAL = 'CONCEPTUAL'
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

    PREREG_STUDY_DESIGN_ANALYSIS = "PREREG_STUDY_DESIGN_ANALYSIS"
    PREREG_STUDY_DESIGN = "PREREG_STUDY_DESIGN"
    REGISTERED_REPORT = "REGISTERED_REPORT"

    prereg_choices = (
        (PREREG_STUDY_DESIGN_ANALYSIS, "Preregistered study design + analysis"),
        (PREREG_STUDY_DESIGN, "Preregistered study design"),
        (REGISTERED_REPORT, "Registered report"),
    )

    doi = models.CharField(max_length=255, null=True, blank=True, unique=True)
    journal = models.CharField(max_length=255, null=True, blank=True)
    author_list = models.CharField(max_length=255, null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    in_press = models.BooleanField(default=False)
    title = models.CharField(max_length=255)
    abstract = models.TextField(null=True, blank=True, max_length=4000)
    keywords = models.CharField(max_length=255, null=True, blank=True)
    article_type = models.CharField(max_length=255, choices=(
        (ORIGINAL, 'original'),
        (CONCEPTUAL, 'conceptual'),
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
    number_of_reps = models.PositiveIntegerField(default=0)
    original_study = models.CharField(max_length=255, null=True, blank=True)
    target_effects = models.CharField(max_length=255, null=True, blank=True)
    original_article_url = models.URLField(null=True, blank=True, max_length=1000)
    prereg_protocol_url = models.URLField(null=True, blank=True, max_length=1000)
    prereg_protocol_type = models.CharField(max_length=255, choices=prereg_choices, null=True, blank=True)
    public_study_materials_url = models.URLField(null=True, blank=True, max_length=1000)
    public_data_url = models.URLField(null=True, blank=True, max_length=1000)
    public_code_url = models.URLField(null=True, blank=True, max_length=1000)
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
    pdf_citations = models.PositiveIntegerField(default=0)
    pdf_downloads = models.PositiveIntegerField(default=0)
    pdf_views = models.PositiveIntegerField(default=0)
    html_views = models.PositiveIntegerField(default=0)
    preprint_downloads = models.PositiveIntegerField(default=0)
    preprint_views = models.PositiveIntegerField(default=0)
    author_contributions = models.CharField(max_length=255, null=True, blank=True)
    competing_interests = models.CharField(max_length=255, null=True, blank=True)
    funding_sources = models.CharField(max_length=255, null=True, blank=True)
    peer_review_editor = models.CharField(max_length=255, null=True, blank=True)
    peer_reviewers = models.CharField(max_length=255, null=True, blank=True)
    peer_review_url = models.URLField(null=True, blank=True, max_length=1000)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        year = self.year or "In Press"
        return f"{self.author_list} ({year}) {self.title}"

    def get_absolute_url(self):
        return reverse('view-article', args=[str(self.id)])

    class Meta:
        unique_together=('title', 'year')

class KeyFigure(models.Model):
    article = models.ForeignKey(Article,
                                on_delete=models.CASCADE,
                                related_name='key_figures',
                                null=True,
                                blank=True)
    height = models.PositiveIntegerField(default=0)
    width = models.PositiveIntegerField(default=0)
    thumb_height = models.PositiveIntegerField(default=0)
    thumb_width = models.PositiveIntegerField(default=0)
    image = models.ImageField(
        upload_to='key_figures/',
        null=True,
        height_field='height',
        width_field='width',
    )
    thumbnail = models.ImageField(
        upload_to='key_figure_thumbnails/',
        null=True,
        height_field='thumb_height',
        width_field='thumb_width',
    )

class Commentary(models.Model):
    article = models.ForeignKey(Article,
                                on_delete=models.CASCADE,
                                related_name='commentaries',
                                null=True,
                                blank=True)
    authors_year = models.CharField(max_length=255,null=True, blank=True)
    commentary_url = models.URLField(null=True, blank=True, max_length=1000)
