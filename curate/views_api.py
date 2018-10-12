from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.contrib.postgres.search import SearchVector, SearchRank
from dal import autocomplete
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework import status, schemas, renderers
from curate.models import (
    Author,
    Article,
    Collection,
    Construct,
    Effect,
    Hypothesis,
    Journal,
    KeyFigure,
    Method,
    StatisticalResult,
    Study,
    Transparency,
    UserProfile,
)
from curate.serializers import (
    AuthorSerializer,
    ArticleSerializer,
    CollectionSerializer,
    ConstructSerializer,
    EffectSerializer,
    HypothesisSerializer,
    JournalSerializer,
    KeyFigureSerializer,
    MethodSerializer,
    StatisticalResultSerializer,
    StudySerializer,
    TransparencySerializer,
    UserProfileSerializer,
)

@api_view(('GET',))
@renderer_classes([renderers.CoreJSONRenderer])
def schema(request):
    generator = schemas.SchemaGenerator(title='Curate Science API')
    return Response(generator.get_schema())

@api_view(('GET',))
def index(request, format=None):
    return Response({
        'docs': reverse('api-docs:docs-index', request=request, format=format),
        'schema': reverse('api-schema', request=request, format=format),
        'authors': reverse('api-list-authors', request=request, format=format),
        'articles': reverse('api-list-articles', request=request, format=format),
        'collections': reverse('api-list-collections', request=request, format=format),
        'constructs': reverse('api-list-constructs', request=request, format=format),
        'effects': reverse('api-list-effects', request=request, format=format),
        'hypotheses': reverse('api-list-hypotheses', request=request, format=format),
        'journals': reverse('api-list-journals', request=request, format=format),
        'key_figures': reverse('api-list-key-figures', request=request, format=format),
        'methods': reverse('api-list-methods', request=request, format=format),
        'statistical_results': reverse('api-list-statistical-results', request=request, format=format),
        'studies': reverse('api-list-studies', request=request, format=format),
        'transparencies': reverse('api-list-transparencies', request=request, format=format),
    })

# Author views
@api_view(('GET', ))
def list_authors(request):
    queryset=Author.objects.all()
    serializer=AuthorSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_author(request, pk):
    queryset=get_object_or_404(Author, id=pk)
    serializer=AuthorSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('GET', 'POST', ))
@permission_classes((IsAuthenticated,))
def create_author(request):
    if request.method == 'POST':
        serializer=AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer=AuthorSerializer()
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_author(request, pk):
    author=get_object_or_404(Author, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = AuthorSerializer(author, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_author(request, pk):
    '''
    Delete one specific author.
    '''
    author=get_object_or_404(Author, id=pk)
    author.delete()
    return Response(status=status.HTTP_200_OK)

# Article views
@api_view(('GET', ))
def list_articles(request):
    '''
    Return a list of all existing articles.
    '''
    queryset=Article.objects.all()
    serializer=ArticleSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_article(request, pk):
    '''
    View one specific article.
    '''
    queryset=get_object_or_404(Article, id=pk)
    serializer=ArticleSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('GET', 'POST', ))
@permission_classes((IsAuthenticated,))
def create_article(request):
    if request.method=='POST':
        serializer=ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = ArticleSerializer()
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(('GET', 'PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_article(request, pk):
    queryset=get_object_or_404(Article, id=pk)
    if request.method in ('PUT', 'PATCH'):
        if request.method=="PATCH":
            is_partial=True
        else:
            is_partial=False
        serializer = ArticleSerializer(queryset, data=request.data, partial=is_partial)
        if serializer.is_valid():
            serializer.save()
            result_status=status.HTTP_200_OK
        else:
            result_status=status.HTTP_400_BAD_REQUEST
        return Response(serializer.errors, status=result_status)
    else:
        serializer = ArticleSerializer(instance=queryset)
        return Response(serializer.data)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_article(request, pk):
    article=get_object_or_404(Article, id=pk)
    article.delete()
    return Response(status=status.HTTP_200_OK)

# Collection views
@api_view(('GET', ))
def list_collections(request):
    queryset=Collection.objects.all()
    serializer=CollectionSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_collection(request, pk):
    queryset=get_object_or_404(Collection, id=pk)
    serializer=CollectionSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_collection(request):
    serializer=CollectionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_collection(request, pk):
    collection=get_object_or_404(Collection, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = CollectionSerializer(collection, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_collection(request, pk):
    collection=get_object_or_404(Collection, id=pk)
    collection.delete()
    return Response(status=status.HTTP_200_OK)

# Construct views
@api_view(('GET', ))
def list_constructs(request):
    queryset=Construct.objects.all()
    serializer=ConstructSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_construct(request):
    queryset=get_object_or_404(Construct, id=pk)
    serializer=ConstructSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_construct(request):
    serializer=ConstructSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_construct(request, pk):
    construct=get_object_or_404(Construct, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = ConstructSerializer(construct, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_construct(request, pk):
    construct=get_object_or_404(Construct, id=pk)
    construct.delete()
    return Response(status=status.HTTP_200_OK)

# Effect views
@api_view(('GET', ))
def list_effects(request):
    queryset=Effect.objects.all()
    serializer=EffectSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_effect(request, pk):
    queryset=get_object_or_404(Effect, id=pk)
    serializer=EffectSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_effect(request):
    serializer=EffectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_effect(request, pk):
    effect=get_object_or_404(Effect, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = EffectSerializer(effect, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_effect(request, pk):
    effect=get_object_or_404(Effect, id=pk)
    effect.delete()
    return Response(status=status.HTTP_200_OK)

# Hypothesis views
@api_view(('GET', ))
def list_hypotheses(request):
    queryset=Hypothesis.objects.all()
    serializer=HypothesisSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_hypothesis(request, pk):
    queryset=get_object_or_404(Hypothesis.objects.select_related('variables'), id=pk)
    serializer=HypothesisSerializer(instance=queryset, context={'request': request})
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_hypothesis(request):
    serializer=HypothesisSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_hypothesis(request, pk):
    hypothesis=get_object_or_404(Hypothesis, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False

    serializer = HypothesisSerializer(hypothesis, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST

    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_hypothesis(request, pk):
    hypothesis=get_object_or_404(Hypothesis, id=pk)
    hypothesis.delete()
    return Response(status=status.HTTP_200_OK)

# Journal views
@api_view(('GET', ))
def list_journals(request):
    queryset=Journal.objects.all()
    serializer=JournalSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_journal(request, pk):
    queryset=get_object_or_404(Journal, id=pk)
    serializer=JournalSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_journal(request):
    serializer=JournalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_journal(request, pk):
    journal=get_object_or_404(Journal, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False

    serializer = JournalSerializer(journal, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST

    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_journal(request, pk):
    journal=get_object_or_404(Journal, id=pk)
    journal.delete()
    return Response(status=status.HTTP_200_OK)

# KeyFigure views
@api_view(('GET', ))
def list_key_figures(request):
    queryset=KeyFigure.objects.all()
    serializer=KeyFigureSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_key_figure(request, pk):
    queryset=get_object_or_404(KeyFigure, id=pk)
    serializer=KeyFigureSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_key_figure(request):
    serializer=KeyFigureSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_key_figure(request, pk):
    key_figure=get_object_or_404(Key_Figure, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = KeyFigureSerializer(key_figure, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_key_figure(request, pk):
    key_figure=get_object_or_404(KeyFigure, id=pk)
    key_figure.delete()
    return Response(status=status.HTTP_200_OK)

# Method views
@api_view(('GET', ))
def list_methods(request):
    queryset=Method.objects.all()
    serializer=MethodSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_method(request, pk):
    queryset=get_object_or_404(Method, id=pk)
    serializer=MethodSerializer(instance=queryset, context={'request': request})
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_method(request):
    serializer=MethodSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_method(request, pk):
    method=get_object_or_404(Method, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = MethodSerializer(method, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_method(request, pk):
    method=get_object_or_404(Method, id=pk)
    method.delete()
    return Response(status=status.HTTP_200_OK)

#StatisticalResult views
@api_view(('GET', ))
def list_statistical_results(request):
    queryset=StatisticalResult.objects.all()
    serializer=StatisticalResultSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_statistical_result(request):
    queryset=get_object_or_404(StatisticalResult, id=pk)
    serializer=StatisticalResultSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_statistical_result(request):
    serializer=StatisticalResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_statistical_result(request, pk):
    statistical_result=get_object_or_404(Statistical_Result, id=pk)
    if request.statistical_result=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = StatisticalResultSerializer(statistical_result, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_statistical_result(request, pk):
    statistical_result=get_object_or_404(StatisticalResult, id=pk)
    statistical_result.delete()
    return Response(status=status.HTTP_200_OK)

#Study views
@api_view(('GET', ))
def list_studies(request):
    queryset=Study.objects.all()
    serializer=StudySerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_study(request, pk):
    queryset=get_object_or_404(Study, id=pk)
    serializer=StudySerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_study(request):
    serializer=StudySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_study(request, pk):
    study=get_object_or_404(Study, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = StudySerializer(study, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_study(request, pk):
    study=get_object_or_404(Study, id=pk)
    study.delete()
    return Response(status=status.HTTP_200_OK)

#Transparency views
@api_view(('GET', ))
def list_transparencies(request):
    queryset=Transparency.objects.all()
    serializer=TransparencySerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_transparency(request, pk):
    queryset=get_object_or_404(Transparency, id=pk)
    serializer=TransparencySerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_transparency(request):
    serializer=TransparencySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_transparency(request, pk):
    transparency=get_object_or_404(Transparency, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = TransparencySerializer(transparency, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_transparency(request, pk):
    transparency=get_object_or_404(Transparency, id=pk)
    transparency.delete()
    return Response(status=status.HTTP_200_OK)

# Search Articles view
@api_view(('GET', ))
def search_articles(request):
    q = request.GET.get('q')
    page_size = int(request.GET.get('page_size')) or 25
    if q:
        search_vector = SearchVector('title', 'abstract', 'authors__last_name')
        search_rank = SearchRank(search_vector, q)
        queryset=Article.objects.annotate(rank=search_rank).order_by('-rank').distinct()
    else:
        queryset=Article.objects.order_by('updated')[:10]
    paginator = PageNumberPagination()
    paginator.page_size = page_size
    result_page = paginator.paginate_queryset(queryset, request)
    serializer=ArticleSerializer(instance=result_page, many=True)
    return Response(serializer.data)

# Autocomplete views

class AuthorAutocomplete(LoginRequiredMixin, autocomplete.Select2QuerySetView):
    def get_queryset(self):
        queryset = Author.objects.all().order_by('last_name')
        if self.q:
            queryset = queryset.filter(Q(last_name__istartswith=self.q)
                                       | Q(first_name__istartswith=self.q)).order_by('last_name')
        return queryset

class ArticleAutocomplete(LoginRequiredMixin, autocomplete.Select2QuerySetView):
    def get_queryset(self):
        queryset = Article.objects.all()
        if self.q:
            queryset = queryset.filter(Q(authors__last_name__startswith=self.q)
                                       | Q(title__startswith=self.q))
        return queryset
