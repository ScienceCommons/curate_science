from curate.models import Article
from django.shortcuts import render

def index(request):
    articles = Article.objects.order_by('updated')[:10]
    return render(request, 'index.html', {'articles': articles})
