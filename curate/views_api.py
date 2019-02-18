from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.contrib.postgres.search import SearchVector, SearchRank
import logging
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
    Commentary,
    KeyFigure,
    UserProfile,
)
from curate.serializers import (
    AuthorSerializer,
    ArticleSerializerNested,
    ArticleDetailSerializer,
    ArticleListSerializer,
    CommentarySerializer,
    KeyFigureSerializer,
    UserProfileSerializer,
)

logger = logging.getLogger()

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
        'commentaries': reverse('api-list-commentaries', request=request, format=format),
        'key_figures': reverse('api-list-key-figures', request=request, format=format),
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
    queryset=Article.objects.select_related('journal').prefetch_related('studies', 'studies__transparencies', 'authors').all()
    serializer=ArticleListSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_article(request, pk):
    '''
    View one specific article.
    '''
    queryset=get_object_or_404(Article.objects \
            .select_related('journal') \
            .prefetch_related(
                'studies',
                'studies__transparencies',
                'studies__effects',
                'studies__ind_vars',
                'authors'), id=pk)
    serializer=ArticleDetailSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('GET', 'POST', ))
@permission_classes((IsAuthenticated,))
def create_article(request):
    if request.method=='POST':
        serializer=ArticleSerializerNested(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = ArticleSerializerNested()
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(('GET', 'PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_article(request, pk):
    queryset=get_object_or_404(Article, id=pk)
    logging.warning(request.data)
    if request.method in ('PUT', 'PATCH'):
        if request.method=="PATCH":
            is_partial=True
        else:
            is_partial=False
        serializer = ArticleSerializerNested(queryset, data=request.data, partial=is_partial)
        if serializer.is_valid():
            serializer.save()
            result_status=status.HTTP_200_OK
        else:
            result_status=status.HTTP_400_BAD_REQUEST
        return Response(serializer.errors, status=result_status)
    else:
        serializer = ArticleSerializerNested(instance=queryset)
        return Response(serializer.data)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_article(request, pk):
    article=get_object_or_404(Article, id=pk)
    article.delete()
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

# Search Articles view
@api_view(('GET', ))
def search_articles(request):
    q = request.GET.get('q','')
    page_size = int(request.GET.get('page_size', 25))
    if q:
        logger.warning("Query: %s" % q)
        search_vector = SearchVector('title', 'abstract', 'authors__last_name')
        search_rank = SearchRank(search_vector, q)
        queryset=Article.objects.annotate(rank=search_rank) \
            .order_by('-rank') \
            .filter(rank__gt=0)
    else:
        queryset=Article.objects.order_by('updated')[:10]
    paginator = PageNumberPagination()
    paginator.page_size = page_size
    result_page = paginator.paginate_queryset(queryset, request)
    serializer=ArticleListSerializer(instance=result_page, many=True)
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
            queryset = queryset.filter(Q(author_list__icontains=self.q)
                                       | Q(title__istartswith=self.q))
        return queryset
