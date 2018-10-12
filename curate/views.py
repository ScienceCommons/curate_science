from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.contrib.auth.decorators import login_required
from curate.forms import ArticleForm
from curate.models import(
    Article,
    ArticleAuthor,
    RelatedArticle,
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
        post_data = request.POST.copy()
        if post_data.get('year') == "In Press":
            post_data.update({'year': 0})
        form = ArticleForm(post_data, request.FILES)
        if form.is_valid():
            article = form.save()
            for index, author in enumerate(form.cleaned_data['authors']):
                ArticleAuthor.objects.create(
                    article=article,
                    author=author,
                    order=index
                )
            for index, commentary_of in enumerate(form.cleaned_data['commentary_of']):
                RelatedArticle.objects.create(
                    original_article=article,
                    related_article=commentary_of,
                    is_commentary=True,
                    order=index
                )
            for index, reproducibility_of in enumerate(form.cleaned_data['reproducibility_of']):
                RelatedArticle.objects.create(
                    original_article=article,
                    related_article=reproducibility_of,
                    is_reproducibility=True,
                    order=index
                )
            for index, robustness_of in enumerate(form.cleaned_data['robustness_of']):
                RelatedArticle.objects.create(
                    original_article=article,
                    related_article=robustness_of,
                    is_robustness=True,
                    order=index
                )
            article.save()
            return redirect(reverse('view-article', kwargs={'pk': article.id}))
    else:
        form = ArticleForm()
    return render(request, "curate/new-edit-article-page.html", {'form': form})

@login_required
@require_http_methods(["GET", "POST"])
def update_article(request, pk):
    queryset = get_object_or_404(Article.objects.prefetch_related('authors'), id=pk)
    if request.method=="POST":
        form = ArticleForm(request.POST, request.FILES, instance=queryset)
        if form.is_valid():
            article = form.save()

            for index, author in enumerate(form.cleaned_data['authors']):
                aa, _ = ArticleAuthor.objects.update_or_create(
                    article=article,
                    author=author,
                    defaults={'order': index + 1}
                )
            for index, commentary_of in enumerate(form.cleaned_data['commentary_of']):
                co, _ = RelatedArticle.objects.update_or_create(
                    original_article=article,
                    related_article=commentary_of,
                    is_commentary=True,
                    defaults={'order': index + 1}
                )
            for index, reproducibility_of in enumerate(form.cleaned_data['reproducibility_of']):
                re, _ = RelatedArticle.objects.update_or_create(
                    original_article=article,
                    related_article=reproducibility_of,
                    is_reproducibility=True,
                    defaults={'order': index + 1}
                )
            for index, robustness_of in enumerate(form.cleaned_data['robustness_of']):
                ro, _ = RelatedArticle.objects.update_or_create(
                    original_article=article,
                    related_article=robustness_of,
                    is_robustness=True,
                    defaults={'order': index + 1}
                )
            for a in article.authors.all():
                if a not in form.cleaned_data['authors']:
                    article.articleauthor_set.filter(author=a).delete()
            for co in article.commentary_of:
                 if co not in form.cleaned_data['commentary_of']:
                     article.related_articles.filter(
                         related_article=co,
                         is_commentary=True
                     ).delete()
            for co in article.reproducibility_of:
                 if co not in form.cleaned_data['reproducibility_of']:
                     article.related_articles.filter(
                         related_article=co,
                         is_reproducibility=True
                     ).delete()
            for co in article.robustness_of:
                 if co not in form.cleaned_data['robustness_of']:
                     article.related_articles.filter(
                         related_article=co,
                         is_robustness=True
                     ).delete()
            article.save()
            return redirect(reverse('view-article', kwargs={'pk': article.id}))
    else:
        form = ArticleForm(instance=queryset)
        form.fields['authors'].initial=queryset.authors.all()
        form.fields['commentary_of'].initial=queryset.commentary_of
        form.fields['reproducibility_of'].initial=queryset.reproducibility_of
        form.fields['robustness_of'].initial=queryset.robustness_of
    return render(request, "curate/new-edit-article-page.html", {'form': form})
