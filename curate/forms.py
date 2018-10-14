from django import forms
from dal import autocomplete
from datetime import datetime
from django.forms import inlineformset_factory
from curate.models import (
    Article,
    Author,
    Effect,
    KeyFigure,
    Study,
    Transparency,
    VariableRelationship,
)

class ArticleForm(forms.ModelForm):
    authors = forms.ModelMultipleChoiceField(
        queryset= Author.objects.all().order_by('last_name'),
        widget=autocomplete.ModelSelect2Multiple(
            url='author-autocomplete',
            attrs={
                'data-placeholder': '...',
            }
        ),
    )
    commentary_of = forms.ModelMultipleChoiceField(
        queryset=Article.objects.all(),
        widget=autocomplete.ModelSelect2Multiple(
            url='article-autocomplete',
            attrs={
                'data-placeholder': '...',
            }
        ),
        required=False
    )
    reproducibility_of = forms.ModelMultipleChoiceField(
        queryset=Article.objects.all(),
        widget=autocomplete.ModelSelect2Multiple(
            url='article-autocomplete',
            attrs={
                'data-placeholder': '...',
            }
        ),
        required=False
    )
    robustness_of = forms.ModelMultipleChoiceField(
        queryset=Article.objects.all(),
        widget=autocomplete.ModelSelect2Multiple(
            url='article-autocomplete',
            attrs={
                'data-placeholder': '...',
            }
        ),
        required=False
    )
    class Meta:
        model = Article
        fields = '__all__'

class TransparencyForm(forms.ModelForm):
    class Meta:
        model = Transparency
        fields = '__all__'

class StudyForm(forms.ModelForm):
    effects = forms.ModelMultipleChoiceField(
        queryset=Effect.objects.all(),
        widget=autocomplete.ModelSelect2Multiple(
            url='effect-autocomplete',
            attrs={
                'data-placeholder': '...',
            }
        ),
        required=False
    )
    class Meta:
        model = Study
        fields = '__all__'

class KeyFigureForm(forms.ModelForm):
    class Meta:
        model = KeyFigure
        fields = '__all__'

class VariableRelationshipForm(forms.ModelForm):
    class Meta:
        model = VariableRelationship
        fields = '__all__'

TransparencyFormSet = inlineformset_factory(
    Article,
    Transparency,
    form=TransparencyForm,
    extra=0,
    can_delete=True
)

StudyFormSet = inlineformset_factory(
    Article,
    Study,
    form=StudyForm,
    extra=0,
    can_delete=True
)

KeyFigureFormSet = inlineformset_factory(
    Article,
    KeyFigure,
    form=KeyFigureForm,
    extra=0,
    can_delete=True
)

# VariableRelationshipFormSet = inlineformset_factory(
#     Study,
#     VariableRelationship,
#     form=VariableRelationshipForm,
#     extra=1,
#     can_delete=True
# )
