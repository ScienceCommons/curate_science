from django.db import models
from django.db.models.signals import pre_save
from django.shortcuts import reverse
from django.contrib.auth.models import User, Group
from django.contrib.postgres.fields import JSONField
from autoslug import AutoSlugField
import re
import os
from io import BytesIO
from django.db import models
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage as storage
from PIL import Image
from django.conf import settings
from invitations.models import Invitation
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

# Creation flows
#
# 1. User signs up on their own
# 2. Admin invites user
# 3. Admin creates author page then invites the user

# Auto-fill User's username with e-mail on save
@receiver(pre_save, sender=User)
def fill_username_with_email(sender, instance, **kwargs):
    instance.username = instance.email

 # When a User is created, find an Author with matching e-mail and link if exists
@receiver(post_save, sender=User)
def link_user_to_author(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'author'):
        invite = Invitation.objects.filter(email=instance.email).first()
        if invite and hasattr(invite, 'author'):
            invite.author.user = instance
            invite.author.save()
        else:
            Author.objects.create(user=instance, name=instance.first_name)

def populate_slug(instance):
    return ' '.join(
        [x for x in [instance.first_name, instance.middle_name, instance.last_name]
         if x is not None]
    )

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, null=True)
    orcid = models.CharField(max_length=255, null=True, blank=True)
    position_title = models.CharField(max_length=255, null=True, blank=True)
    affiliations = models.CharField(max_length=255, null=True, blank=True)
    profile_urls = JSONField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    articles = models.ManyToManyField('Article', related_name='authors', blank=True)
    curation_contributions = JSONField(null=True, blank=True)
    browsing_history = JSONField(null=True, blank=True)
    tracked_content = JSONField(null=True, blank=True)
    recommended_content = JSONField(null=True, blank=True)
    account_settings = JSONField(null=True, blank=True)
    research_interests = JSONField(null=True, blank=True)
    invite = models.OneToOneField(Invitation, on_delete=models.DO_NOTHING, null=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    slug = AutoSlugField(
        populate_from = 'name',
        unique=True,
        editable=True,
        null=True,
    )
    is_activated = models.BooleanField(default=False)

    def __str__(self):
        return self.name if self.name else "Unnamed Author"

class Article(models.Model):
    """A written work with one or more Authors, reporting the results of a scientific Study."""
    ORIGINAL = 'ORIGINAL'
    CONCEPTUAL = 'CONCEPTUAL'
    REPLICATION = 'REPLICATION'
    REPRODUCIBILITY = 'REPRODUCIBILITY'
    META_ANALYSIS = 'META_ANALYSIS'
    META_RESEARCH = 'META_RESEARCH'
    ORIGINAL_META_RESEARCH = 'ORIGINAL_META_RESEARCH'
    COMMENTARY = 'COMMENTARY'

    BASIC_4_7_RETROACTIVE = 'BASIC_4_7_RETROACTIVE'
    BASIC_4_AT_SUBMISSION = 'BASIC_4_AT_SUBMISSION'
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
            (BASIC_4_7_RETROACTIVE, "Basic 4/Basic 7 (retroactive)"),
            (BASIC_4_AT_SUBMISSION, "Basic-4 (at submission; PSCI, 2014)"),
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

    PROPRIETARY = 'PROP'
    ETHICAL = 'ETHI'
    nontransparency_reason_choices = (
        (PROPRIETARY, 'Proprietary/IP'),
        (ETHICAL, 'Ethical reasons'),
    )

    doi = models.CharField(max_length=255, null=True, blank=True, unique=True)
    journal = models.CharField(max_length=255, null=True, blank=True)
    author_list = models.CharField(max_length=255, null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    in_press = models.BooleanField(default=False)
    title = models.CharField(max_length=255)
    abstract = models.TextField(null=True, blank=True, max_length=4000)
    keywords = models.CharField(max_length=255, null=True, blank=True)
    article_type = models.CharField(
        max_length=255,
        choices=(
            (ORIGINAL, 'original'),
            (CONCEPTUAL, 'conceptual'),
            (REPLICATION, 'replication'),
            (REPRODUCIBILITY, 'reanalysis - reproducibility'),
            (META_ANALYSIS, 'reanalysis - meta-analysis'),
            (META_RESEARCH, 'reanalysis - meta-research'),
            (ORIGINAL_META_RESEARCH, 'original - meta-research'),
            (COMMENTARY, 'commentary'),
        ),
        default='original'
    )
    reporting_standards_type = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        choices=standards_choices,
        default=BASIC_4_7_RETROACTIVE,
    )
    number_of_reps = models.PositiveIntegerField(default=0)
    original_study = models.CharField(max_length=255, null=True, blank=True)
    target_effects = models.CharField(max_length=255, null=True, blank=True)
    original_article_url = models.URLField(null=True, blank=True, max_length=1000)
    prereg_protocol_type = models.CharField(max_length=255, choices=prereg_choices, null=True, blank=True)
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
    author_contributions = models.TextField(null=True, blank=True)
    competing_interests = models.TextField(null=True, blank=True)
    funding_sources = models.TextField(max_length=4000, null=True, blank=True)
    peer_review_editor = models.CharField(max_length=255, null=True, blank=True)
    peer_reviewers = models.CharField(max_length=255, null=True, blank=True)
    peer_review_url = models.URLField(null=True, blank=True, max_length=1000)
    is_live = models.BooleanField(default=True)

    under_peer_review = models.BooleanField(default=False)

    reproducibility_original_study = models.CharField(max_length=255, null=True, blank=True)
    reproducibility_original_study_url = models.URLField(null=True, blank=True, max_length=1000)

    commentary_target = models.CharField(max_length=255, null=True, blank=True)
    commentary_target_url = models.URLField(null=True, blank=True, max_length=1000)

    excluded_data = models.TextField(null=True, blank=True)
    excluded_data_all_details_reported = models.BooleanField(default=False)

    conditions = models.TextField(null=True, blank=True)
    conditions_all_details_reported = models.BooleanField(default=False)

    outcomes = models.TextField(null=True, blank=True)
    outcomes_all_details_reported = models.BooleanField(default=False)

    sample_size = models.TextField(null=True, blank=True)
    sample_size_all_details_reported = models.BooleanField(default=False)

    analyses = models.TextField(null=True, blank=True)
    analyses_all_details_reported = models.BooleanField(default=False)

    unreported_studies = models.TextField(null=True, blank=True)
    unreported_studies_all_details_reported = models.BooleanField(default=False)

    other_disclosures = models.TextField(null=True, blank=True)
    other_disclosures_all_details_reported = models.BooleanField(default=False)
    disclosure_date = models.DateField(null=True, blank=True, auto_now_add=True)

    materials_nontransparency_reason = models.CharField(
        max_length=4,
        choices=nontransparency_reason_choices,
        null=True,
        blank=True
    )
    data_nontransparency_reason = models.CharField(
        max_length=4,
        choices=nontransparency_reason_choices,
        null=True,
        blank=True
    )

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        year = self.year or "In Press"
        return f"{self.author_list} ({year}) {self.title}"

    def get_absolute_url(self):
        return reverse('view-article', args=[str(self.id)])

    class Meta:
        unique_together=('title', 'year')

    def _check_basic_7_fields(self):
        BASIC_7_FIELDS = [
            ('excluded_data', 'excluded_data_all_details_reported'),
            ('conditions', 'conditions_all_details_reported'),
            ('outcomes', 'outcomes_all_details_reported'),
            ('sample_size', 'sample_size_all_details_reported'),
            ('analyses', 'analyses_all_details_reported'),
            ('unreported_studies', 'unreported_studies_all_details_reported'),
            ('other_disclosures', 'other_disclosures_all_details_reported'),
        ]

        def check_field_pair(field_pair):
            # If either field is truthy (non-empty text field or True boolean) we return True
            (text_field, bool_field) = field_pair
            if getattr(self, text_field):
                return True
            return getattr(self, bool_field) is True
        return [check_field_pair(field_pair) for field_pair in BASIC_7_FIELDS]

    @property
    def is_basic_4_retroactive(self):
        if self.reporting_standards_type != self.BASIC_4_7_RETROACTIVE:
            return False

        fields_done = self._check_basic_7_fields()
        return all(fields_done[:4]) and not all(fields_done)

    @property
    def is_basic_7_retroactive(self):
        if self.reporting_standards_type != self.BASIC_4_7_RETROACTIVE:
            return False

        fields_done = self._check_basic_7_fields()
        return all(fields_done)


class TransparencyURL(models.Model):
    DATA = 'DATA'
    CODE = 'CODE'
    MATERIALS = 'MATERIALS'
    PREREG = 'PREREGISTRATION'

    transparency_type_choices = (
        (DATA, 'Data'),
        (CODE, 'Code'),
        (MATERIALS, 'Materials'),
        (PREREG, 'Preregistration'),
    )

    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='transparency_urls',
        null=True,
        blank=True
    )
    transparency_type = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        choices=transparency_type_choices
    )
    protected_access = models.BooleanField(default=False)
    url = models.URLField(blank=True, max_length=1000)

    def __str__(self):
        protected_string = ' - PROTECTED' if self.protected_access else ''
        return f'{self.transparency_type}: {self.url}{protected_string}'


class MediaCoverage(models.Model):
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='media_coverage',
    )
    media_source_name = models.CharField(max_length=255)
    url = models.URLField(null=True, blank=True, max_length=1000)

    def __str__(self):
        url = self.url or 'No URL'
        return f'{self.media_source_name} ({url})'


class Video(models.Model):
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='videos',
    )
    url = models.URLField(max_length=1000)

    def __str__(self):
        return self.url


class Presentation(models.Model):
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='presentations',
    )
    url = models.URLField(max_length=1000)

    def __str__(self):
        return self.url


class SupplementalMaterials(models.Model):
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='supplemental_materials',
    )
    url = models.URLField(max_length=1000)

    def __str__(self):
        return self.url


class KeyFigure(models.Model):
    article = models.ForeignKey(Article,
                                on_delete=models.CASCADE,
                                related_name='key_figures',
                                null=True,
                                blank=True)
    height = models.PositiveIntegerField(null=True)
    width = models.PositiveIntegerField(null=True)
    thumb_height = models.PositiveIntegerField(null=True)
    thumb_width = models.PositiveIntegerField(null=True)
    image = models.ImageField(
        upload_to='key_figures/',
        null=True,
        height_field='height',
        width_field='width',
    )
    thumbnail = models.ImageField(
        upload_to='key_figures/',
        null=True,
        height_field='thumb_height',
        width_field='thumb_width',
    )

    class Meta:
        ordering = ('id',)

    def save(self, *args, **kwargs):
        """
        Make and save the thumbnail for the photo here.
        """
        super(KeyFigure, self).save(*args, **kwargs)
        self.make_thumbnail()
        #if not self.make_thumbnail():
        #    raise Exception('File not one of supported image file types: JPEG, GIF, PNG')

    def make_thumbnail(self):
        fh = storage.open(self.image.name, 'rb')
        try:
            image = Image.open(fh)
        except:
            return False

        image.thumbnail(settings.THUMB_SIZE, Image.ANTIALIAS)

        # Path to save to, name, and extension
        thumb_name, thumb_extension = os.path.splitext(self.image.name)
        _, thumb_fname = os.path.split(thumb_name)
        thumb_extension = thumb_extension.lower()

        thumb_filename = thumb_fname + '_thumb' + thumb_extension

        if thumb_extension in ['.jpg', '.jpeg']:
            FTYPE = 'JPEG'
        elif thumb_extension == '.gif':
            FTYPE = 'GIF'
        elif thumb_extension == '.png':
            FTYPE = 'PNG'
        else:
            return False    # Unrecognized file type

        # Save thumbnail to in-memory file as StringIO
        temp_thumb = BytesIO()
        image.save(temp_thumb, FTYPE)
        temp_thumb.seek(0)

        fh.close()

        # Load a ContentFile into the thumbnail field so it gets saved
        self.thumbnail.save(thumb_filename, ContentFile(temp_thumb.read()), save=False)
        temp_thumb.close()

        return True

class Commentary(models.Model):
    article = models.ForeignKey(Article,
                                on_delete=models.CASCADE,
                                related_name='commentaries',
                                null=True,
                                blank=True)
    authors_year = models.CharField(max_length=255,null=True, blank=True)
    commentary_url = models.URLField(null=True, blank=True, max_length=1000)
