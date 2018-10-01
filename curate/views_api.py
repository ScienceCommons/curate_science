from django.shortcuts import get_object_or_404
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
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
def index(request, format=None):
    return Response({
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

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_author(request, pk):
    serializer=AuthorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_author(request, pk):
    author = get_object_or_404(Author, pk)
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

# Article views
@api_view(('GET', ))
def list_articles(request):
    queryset=Article.objects.all()
    serializer=ArticleSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_article(request, pk):
    queryset=get_object_or_404(Article, id=pk)
    serializer=ArticleSerializer(instance=queryset)
    return Response(serializer.data)

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

# Hypothesis views
@api_view(('GET', ))
def list_hypotheses(request):
    queryset=Hypothesis.objects.all()
    serializer=HypothesisSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_hypothesis(request, pk):
    queryset=get_object_or_404(Hypothesis, id=pk)
    serializer=HypothesisSerializer(instance=queryset)
    return Response(serializer.data)

# Journal views
@api_view(('GET', ))
def list_journals(request):
    queryset=Journal.objects.all()
    serializer=JournalSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_journal(request, pk):
    queryset=Journal.objects.get(id=pk)
    serializer=JournalSerializer(instance=queryset)
    return Response(serializer.data)

# KeyFigure views
@api_view(('GET', ))
def list_key_figures(request):
    queryset=KeyFigure.objects.all()
    serializer=KeyFigureSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def list_methods(request):
    queryset=Method.objects.all()
    serializer=MethodSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def list_statistical_results(request):
    queryset=StatisticalResult.objects.all()
    serializer=StatisticalResultSerializer(instance=queryset, many=True)
    return Response(serializer.data)

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

@api_view(('GET', ))
def list_transparencies(request):
    queryset=Transparency.objects.all()
    serializer=TransparencySerializer(instance=queryset, many=True)
    return Response(serializer.data)
