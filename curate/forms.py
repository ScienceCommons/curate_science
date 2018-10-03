from django import forms
from curate.models import (
    Article,
    Author,
)
#from dal import autocomplete

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = '__all__'
