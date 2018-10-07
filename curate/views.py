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
        form = ArticleForm(request.POST, request.FILES)
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
        form = ArticleForm(request.POST, request.FILES)
        if form.is_valid():
            article = form.save()
            aa_set = []
            commentary_set = []
            reproducibility_set = []
            robustness_set = []
            for index, author in enumerate(form.cleaned_data['authors']):
                aa, _ = ArticleAuthor.objects.update_or_create(
                    article=article,
                    author=author,
                    defaults={'order': index}
                )
                aa_set.append(aa)
            for index, commentary_of in enumerate(form.cleaned_data['commentary_of']):
                co, _ = RelatedArticle.objects.update_or_create(
                    original_article=article,
                    related_article=commentary_of,
                    is_commentary=True,
                    defaults={'order': index}
                )
                commentary_set.append(co)
            for index, reproducibility_of in enumerate(form.cleaned_data['reproducibility_of']):
                re, _ = RelatedArticle.objects.update_or_create(
                    original_article=article,
                    related_article=reproducibility_of,
                    is_reproducibility=True,
                    defaults={'order': index}
                )
                reproducibility_set.append(re)
            for index, robustness_of in enumerate(form.cleaned_data['robustness_of']):
                ro, _ = RelatedArticle.objects.update_or_create(
                    original_article=article,
                    related_article=robustness_of,
                    is_robustness=True,
                    defaults={'order': index}
                )
                robustness_set.append(ro)
            for co in article.commentary_of:
                if co not in commentary_set:
                    article.related_articles.remove(co)
            for re in article.reproducibility_of:
                if re not in reproducibiliity_set:
                    article.related_articles.remove(re)
            for ro in article.robustness_of:
                if ro not in robustness_set:
                    article.related_articles.remove(ro)
            article.save()
            return redirect(reverse('view-article', kwargs={'pk': article.id}))
    else:
        form = ArticleForm(instance=queryset)
        form.fields['authors'].initial=queryset.authors.all()
        form.fields['commentary_of'].initial=queryset.commentary_of
        form.fields['reproducibility_of'].initial=queryset.reproducibility_of
        form.fields['robustness_of'].initial=queryset.reproducibility_of
    return render(request, "curate/new-edit-article-page.html", {'form': form})
