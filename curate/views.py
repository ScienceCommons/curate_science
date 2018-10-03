from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.contrib.auth.decorators import login_required
from curate.forms import ArticleForm

def index(request):
    return render(request, 'index.html')

@require_http_methods(["GET",])
def view_article(request):
    pass

@login_required
@require_http_methods(["GET", "POST"])
def create_article(request):
    if request.method=="POST":
        form = ArticleForm(request.POST, request.FILES)
        if form.is_valid():
            article = form.save()
            return redirect(reverse('view-article'), pk=article.id)
    else:
        form = ArticleForm()
    return render(request, "curate/new-edit-article-page.html", {'form': form})
