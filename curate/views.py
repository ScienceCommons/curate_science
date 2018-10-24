from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.contrib.auth.decorators import login_required
from curate.forms import (
    ArticleForm,
    KeyFigureForm,
    KeyFigureFormSet,
    StudyForm,
    StudyFormSet,
    TransparencyForm,
    TransparencyFormSet,
    #VariableRelationshipForm,
    #VariableRelationshipFormSet,
)
from curate.models import(
    Article,
    ArticleAuthor,
    KeyFigure,
    RelatedArticle,
    Study,
    Transparency,
)
from curate.view_utils import sync_child_m2m_instances

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
        transparency_formset = TransparencyFormSet(post_data, request.FILES, prefix='transparency')
        study_formset = StudyFormSet(post_data, request.FILES, prefix='study')
        key_figure_formset = KeyFigureFormSet(post_data, request.FILES, prefix='keyfigure')
        if form.is_valid() and transparency_formset.is_valid() and study_formset.is_valid() and key_figure_formset.is_valid():
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
            for transparency_form in transparency_formset:
                if transparency_form.cleaned_data != {}:
                    if 'DELETE' in transparency_form.cleaned_data:
                        transparency_form.cleaned_data.pop('DELETE')
                    if 'article' in transparency_form.cleaned_data:
                        transparency_form.cleaned_data.pop('article')
                    Transparency.objects.create(
                        article=article,
                        **(transparency_form.cleaned_data)
                    )
            for study_form in study_formset:
                if study_form.cleaned_data != {}:
                    study_form.cleaned_data.pop('DELETE', False)
                    study_form.cleaned_data.pop('article', False)
                    effects = study_form.cleaned_data.pop('effects', [])
                    ind_vars = study_form.cleaned_data.pop('ind_vars', [])
                    dep_vars = study_form.cleaned_data.pop('dep_vars', [])
                    ind_var_methods = study_form.cleaned_data.pop('ind_var_methods', [])
                    dep_var_methods = study_form.cleaned_data.pop('dep_var_methods', [])
                    study = Study.objects.create(
                        article=article,
                        **(study_form.cleaned_data)
                    )
                    for effect in effects:
                        study.effects.add(effect)
                    for ind_var in ind_vars:
                        study.ind_vars.add(ind_var)
                    for dep_var in dep_vars:
                        study.dep_vars.add(dep_var)
                    for ind_var_method in ind_var_methods:
                        study.ind_var_methods.add(ind_var_method)
                    for dep_var_method in dep_var_methods:
                        study.dep_var_methods.add(dep_var_method)
            for key_figure_form in key_figure_formset:
                if key_figure_form.cleaned_data != {}:
                    if 'DELETE' in key_figure_form.cleaned_data:
                        key_figure_form.cleaned_data.pop('DELETE')
                    if 'article' in key_figure_form.cleaned_data:
                        key_figure_form.cleaned_data.pop('article')
                    KeyFigure.objects.create(
                        article=article,
                        **(key_figure_form.cleaned_data)
                    )

            article.save()
            return redirect(reverse('view-article', kwargs={'pk': article.id}))
        #else:
        #    raise Exception("form invalid")
    else:
        form = ArticleForm()
        transparency_formset = TransparencyFormSet(prefix='transparency')
        study_formset = StudyFormSet(prefix='study')
        key_figure_formset = KeyFigureFormSet(prefix='keyfigure')
        #variable_relationship_formset = VariableRelationshipFormSet(prefix='variable')
    return render(request, "curate/new-edit-article-page.html",
                  {'form': form,
                   'transparency_formset': transparency_formset,
                   'study_formset': study_formset,
                   'key_figure_formset': key_figure_formset,
                   #'variable_relationship_formset': variable_relationship_formset,
                  })

@login_required
@require_http_methods(["GET", "POST"])
def update_article(request, pk):
    queryset = get_object_or_404(Article.objects.prefetch_related('authors', 'studies'), id=pk)
    if request.method=="POST":
        form = ArticleForm(request.POST, request.FILES, instance=queryset)
        transparency_formset = TransparencyFormSet(
            request.POST, request.FILES, prefix='transparency'
        )
        study_formset = StudyFormSet(request.POST, request.FILES, prefix='study')
        key_figure_formset = KeyFigureFormSet(request.POST, request.FILES, prefix='keyfigure')
        if form.is_valid() and transparency_formset.is_valid() \
           and study_formset.is_valid() and key_figure_formset.is_valid():
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

            for transparency_form in transparency_formset:
                if transparency_form.cleaned_data != {}:
                    instance = transparency_form.cleaned_data.pop('id', False)
                    delete = transparency_form.cleaned_data.pop('DELETE', False)
                    if instance and delete:
                        instance.delete()
                    else:
                        transparency_form.cleaned_data.pop('article')
                        if instance is not None:
                            Transparency.objects.filter(id=instance.id).update(
                                **(transparency_form.cleaned_data)
                            )
                        else:
                            Transparency.objects.create(
                                article=article,
                                **(transparency_form.cleaned_data)
                            )

            for key_figure_form in key_figure_formset:
                if key_figure_form.cleaned_data != {}:
                    instance = key_figure_form.cleaned_data.pop('id', False)
                    delete = key_figure_form.cleaned_data.pop('DELETE', False)
                    if instance and delete:
                        instance.delete()
                    else:
                        key_figure_form.cleaned_data.pop('article')
                        if instance is not None:
                            KeyFigure.objects.filter(id=instance.id).update(
                                **(key_figure_form.cleaned_data)
                            )
                        else:
                            KeyFigure.objects.create(
                                article=article,
                                **(key_figure_form.cleaned_data)
                            )

            for study_form in study_formset:
                if study_form.cleaned_data != {}:
                    study_form.cleaned_data.pop('article')
                    study_instance = study_form.cleaned_data.pop('id', False)
                    delete = study_form.cleaned_data.pop('DELETE', False)
                    effects = study_form.cleaned_data.pop('effects', False)
                    ind_vars = study_form.cleaned_data.pop('ind_vars', False)
                    dep_vars = study_form.cleaned_data.pop('dep_vars', False)
                    ind_var_methods = study_form.cleaned_data.pop('ind_var_methods', False)
                    dep_var_methods = study_form.cleaned_data.pop('dep_var_methods', False)

                    if study_instance:
                        if delete:
                            study_instance.delete()
                        else:
                            study, _ = Study.objects.update_or_create(
                                id=study_instance.id,
                                defaults=study_form.cleaned_data
                            )
                            sync_child_m2m_instances(study, 'effects', effects)
                            sync_child_m2m_instances(
                                study,
                                'ind_vars',
                                ind_vars
                            )
                            sync_child_m2m_instances(
                                study,
                                'dep_vars',
                                dep_vars
                            )
                            sync_child_m2m_instances(
                                study,
                                'ind_var_methods',
                                ind_var_methods
                            )
                            sync_child_m2m_instances(
                                study,
                                'dep_var_methods',
                                dep_var_methods
                            )
                    else:
                        study = Study.objects.create(
                            article=article,
                            **(study_form.cleaned_data)
                        )
                        for effect in effects:
                            study.effects.add(effect)

            article.save()
            return redirect(reverse('view-article', kwargs={'pk': article.id}))
        #else:
        #    raise Exception('form invalid')
    else:
        form = ArticleForm(instance=queryset)
        transparency_formset = TransparencyFormSet(instance=queryset, prefix='transparency')
        key_figure_formset = KeyFigureFormSet(instance=queryset, prefix='keyfigure')
        study_formset = StudyFormSet(instance=queryset, prefix='study')

        form.fields['authors'].initial=queryset.authors.all()
        form.fields['commentary_of'].initial=queryset.commentary_of
        form.fields['reproducibility_of'].initial=queryset.reproducibility_of
        form.fields['robustness_of'].initial=queryset.robustness_of
    return render(request, "curate/new-edit-article-page.html",
                  {'form': form,
                   'transparency_formset': transparency_formset,
                   'study_formset': study_formset,
                   'key_figure_formset': key_figure_formset,
                  })
