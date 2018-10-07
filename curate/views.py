from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.contrib.auth.decorators import login_required
from curate.forms import ArticleForm
from curate.models import(
    Article,
    ArticleAuthor,
)

def index(request):
    articles = Article.objects.order_by('updated')[:10]
    return render(request, 'index.html', {'articles': articles})

@require_http_methods(["GET",])
def view_article(request, pk):
    article = get_object_or_404(Article, id=pk)
    return render(request, "curate/view-article.html", {'article': article})

@login_required
@require_http_methods(["GET", "POST"])
def create_article(request):
    if request.method=="POST":
        form = ArticleForm(request.POST, request.FILES)
        if form.is_valid():
            article = form.save()
            for index, author in enumerate(form.cleaned_data['authors']):
                ArticleAuthor.objects.create(
                    article=article,
                    author=author,
                    order=index
                )
            article.save()
            return redirect(reverse('view-article', kwargs={'pk': article.id}))
    else:
        form = ArticleForm()
    return render(request, "curate/new-edit-article-page.html", {'form': form})
