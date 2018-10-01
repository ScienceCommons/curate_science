from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
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

# Author views
@api_view(('GET', ))
#@permission_classes((IsAuthenticated,))
def list_authors(request):
    queryset=Author.objects.all()
    serializer=AuthorSerializer(instance=queryset, many=True)
    return Response(serializer.data)

# Article views
@api_view(('GET', ))
def list_articles(request):
    queryset=Article.objects.all()
    serializer=ArticleSerializer(instance=queryset, many=True)
    return Response(serializer.data)

# Collection views
@api_view(('GET', ))
def list_collections(request):
    queryset=Collection.objects.all()
    serializer=CollectionSerializer(instance=queryset, many=True)
    return Response(serializer.data)

# Construct views
@api_view(('GET', ))
def list_constructs(request):
    queryset=Construct.objects.all()
    serializer=ConstructSerializer(instance=queryset, many=True)
    return Response(serializer.data)

# Effect views
@api_view(('GET', ))
def list_effects(request):
    queryset=Effect.objects.all()
    serializer=EffectSerializer(instance=queryset, many=True)
    return Response(serializer.data)

# Hypothesis views
@api_view(('GET', ))
def list_hypotheses(request):
    queryset=Hypothesis.objects.all()
    serializer=HypothesisSerializer(instance=queryset, many=True)
    return Response(serializer.data)

# Journal views
@api_view(('GET', ))
def list_journals(request):
    queryset=Journal.objects.all()
    serializer=JournalSerializer(instance=queryset, many=True)
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
def list_transparencies(request):
    queryset=Transparency.objects.all()
    serializer=TransparencySerializer(instance=queryset, many=True)
    return Response(serializer.data)
