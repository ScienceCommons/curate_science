from django import forms
from dal import autocomplete
from curate.models import (
    Article,
    Author,
)
#from dal import autocomplete

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
    # commentary_of = forms.ModelMultipleChoiceField(
    #     queryset=Article.objects.all(),
    #     widget=autocomplete.ModelSelect2Multiple(
    #         url='article-autocomplete',
    #         attrs={
    #             'data-placeholder': '...',
    #         }
    #     ),
    #     to_field_name='to_article',
    #     required=False
    # )
    class Meta:
        model = Article
        fields = '__all__'
