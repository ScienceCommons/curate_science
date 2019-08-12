from itertools import chain

from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import F, Q
from django.contrib.postgres.search import SearchVector, SearchRank
import logging
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from dal import autocomplete
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework import status, schemas, renderers
from invitations.models import Invitation
from curate.models import (
    Author,
    Article,
    Commentary,
    KeyFigure,
    TransparencyURL,
)
from curate.serializers import (
    AuthorSearchResultSerializer,
    AuthorSerializer,
    AuthorArticleSerializer,
    ArticleSearchResultSerializer,
    ArticleSerializerNested,
    ArticleListSerializer,
    CommentarySerializer,
    InvitationSerializer,
    KeyFigureSerializer,
    UserSerializer,
)
from PIL import Image

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
    })

@api_view(['GET'])
@permission_classes((IsAuthenticated, IsAdminUser,))
def list_accounts(request):
    queryset=User.objects.all().select_related('userprofile')
    serializer=UserSerializer(instance=queryset, many=True)
    return Response(serializer.data)

# Invitation creation
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated, IsAdminUser,))
def create_invitation(request):
    if request.method == 'POST':
        serializer = InvitationSerializer(data=request.data)
        if serializer.is_valid():
            author = serializer.validated_data.get('author')
            email = serializer.validated_data.get('email')
            author_slug = author.get('slug')
            author_name = author.get('name')
            invite = Invitation.create(email=email, inviter=request.user)
            author_instance = None
            if author_slug:
                try:
                    author_instance = Author.objects.get(slug=author_slug)
                    author_instance.invite = invite
                    author_instance.save()
                except ObjectDoesNotExist:
                    pass

            if author_instance is None:
                author_instance = Author.objects.create(name=author_name, invite=invite)

            invite.send_invitation(request)
            response_serializer = InvitationSerializer(invite)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = InvitationSerializer()
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def view_user(request, username):
    queryset=get_object_or_404(User, username=username)
    serializer=UserSerializer(instance=queryset)
    return Response(serializer.data)

# Author views
@api_view(('GET', ))
def list_authors(request):
    queryset=Author.objects.all().select_related('user').prefetch_related('articles')
    serializer=AuthorSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_author(request, slug):
    queryset=get_object_or_404(Author, slug=slug)
    serializer=AuthorSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('GET', 'POST', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def create_author(request):
    if request.method == 'POST':
        serializer=AuthorSerializer(data=request.data)
        if serializer.is_valid():
            author = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer=AuthorSerializer()
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_author(request, slug):
    author=get_object_or_404(Author, slug=slug)
    if request.user != author.user and not (request.user.is_superuser or request.user.is_staff):
        return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
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
def delete_author(request, slug):
    '''
    Delete one specific author.
    '''
    author=get_object_or_404(Author, slug=slug)
    author.delete()
    return Response(status=status.HTTP_200_OK)

def filter_and_sort_articles(request):
    """ Parses transparency filters, content filters and ordering query parameters
        from the request and return the appropriate Article queryset.
    """
    # Sort the results by created or impact
    ordering = request.query_params.get('ordering')
    if ordering not in ['created', 'impact']:
        ordering = None

    queryset = Article.objects.all()
    if ordering == 'created':
        queryset = queryset.order_by('-created')
    elif ordering == 'impact':
        # Caculate the impact value by adding all view, citations and downloads
        impact_fields = [
            'pdf_citations',
            'pdf_downloads',
            'pdf_views',
            'html_views',
            'preprint_downloads',
            'preprint_views',
        ]
        impact = sum(map(F, impact_fields))
        queryset = queryset.annotate(impact=impact).order_by('-impact')

    # Transparency filters
    # There are two types of transparency filters
    #     - Preregistration
    #     - Openness
    transparency_filters = request.query_params.getlist('transparency')

    # Preregistration options
    prereg_filter_expressions = {
        'registered_design_analysis': Article.PREREG_STUDY_DESIGN_ANALYSIS,
        'registered_report': Article.REGISTERED_REPORT,
    }
    prereg_values = [
        prereg_type for (filter, prereg_type) in prereg_filter_expressions.items() if filter in transparency_filters
    ]

    if prereg_values:
        # The preregistration values are combined with an OR so any articles
        # matching at least one of the filters are returned
        queryset = queryset.filter(prereg_protocol_type__in=prereg_values)

    # A dict where the key is the expected query parameter and the value is a
    # queryset filter that will return the appropriate articles
    filter_expressions = {
        'open_code': Q(transparency_urls__transparency_type=TransparencyURL.CODE),
        'open_data': Q(transparency_urls__transparency_type=TransparencyURL.DATA),
        'open_materials': Q(transparency_urls__transparency_type=TransparencyURL.MATERIALS),
        'reporting_standards': Q(reporting_standards_type__isnull=False),
    }

    # Remove any invalid filters
    valid_filters = [filter for filter in transparency_filters if filter in filter_expressions.keys()]

    for filter in valid_filters:
        queryset = queryset.filter(filter_expressions[filter])

    # Content type filter
    content_filters = request.query_params.getlist('content')
    valid_content_types = ['ORIGINAL', 'REPLICATION', 'REPRODUCIBILITY', 'META_ANALYSIS']
    valid_content_filters = [filter for filter in content_filters if filter in valid_content_types]
    if valid_content_filters:
        article_types = [getattr(Article, content_type) for content_type in valid_content_filters]
        queryset = queryset.filter(article_type__in=article_types)

    queryset = queryset.prefetch_related('commentaries', 'authors')

    return queryset.distinct()

# Article views
@api_view(('GET', ))
def list_articles(request):
    '''
    Return a list of all existing articles.
    '''
    queryset = filter_and_sort_articles(request)
    queryset = queryset.filter(is_live=True)
    queryset = queryset.prefetch_related('commentaries', 'authors')

    serializer = ArticleListSerializer(instance=queryset, many=True)

    paginator = PageNumberPagination()
    paginator.page_size = int(request.GET.get('page_size', 10))

    result_page = paginator.paginate_queryset(queryset, request)

    serializer = ArticleListSerializer(instance=result_page, many=True)

    return Response(serializer.data)

# Article views
@api_view(('GET', ))
def list_articles_for_author(request, slug):
    '''
    Return a list of all articles for an author
    '''
    author=get_object_or_404(Author, slug=slug)
    queryset=author.articles.all().prefetch_related('commentaries')
    serializer=ArticleListSerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('POST', 'GET', ))
def link_articles_to_author(request, slug):
    '''
    Link and unlink articles to/from an author
    '''
    if request.method == 'POST':
        author=get_object_or_404(Author, slug=slug)
        serializer=AuthorArticleSerializer(data=request.data, many=True)
        if serializer.is_valid():
            for article in serializer.validated_data:
                article_id = article.get('article')
                linked = article.get('linked')

                try:
                    instance = Article.objects.get(id=article_id)
                    if linked and instance not in author.articles.all():
                        author.articles.add(instance)
                    elif (not linked) and instance in author.articles.all():
                        author.articles.remove(instance)
                except ObjectDoesNotExist:
                    return Response(
                        'Invalid pk "{0}" - object does not exist.'.format(article_id),
                        status=status.HTTP_400_BAD_REQUEST
                    )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data)
    else:
        serializer=AuthorArticleSerializer()
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(('GET', ))
def view_article(request, pk):
    '''
    View one specific article.
    '''
    queryset=get_object_or_404(Article.objects \
            .prefetch_related('authors', 'commentaries', 'key_figures'), id=pk)
    serializer=ArticleSerializerNested(instance=queryset)
    return Response(serializer.data)

@api_view(('GET', 'POST', ))
@permission_classes((IsAuthenticated,))
def create_article(request):
    if request.method=='POST':
        user = request.user
        if not user.is_staff and not hasattr(request.user, 'author'):
            # Only admins and authors can add articles.
            # If the non-admin user has not created an author profile, they must do so
            # before curating articles.
            return Response("Forbidden", status=status.HTTP_403_FORBIDDEN)
        serializer=ArticleSerializerNested(data=request.data)
        if serializer.is_valid():
            article = serializer.save()
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
        user = request.user
        if (not user.is_staff and not hasattr(request.user, 'author')): #or (hasattr(request.user, 'author') and request.user.author not in queryset.authors.all()):
            # Only admins and authors can update articles.
            return Response("Forbidden", status=status.HTTP_403_FORBIDDEN)
        if request.method=="PATCH":
            is_partial=True
        else:
            is_partial=False
        serializer = ArticleSerializerNested(queryset, data=request.data, partial=is_partial)
        if serializer.is_valid():
            serializer.save()
            response_data = serializer.data
            result_status=status.HTTP_200_OK
        else:
            response_data = serializer.errors
            result_status=status.HTTP_400_BAD_REQUEST
        return Response(response_data, status=result_status)
    else:
        serializer = ArticleSerializerNested(instance=queryset)
        return Response(serializer.data)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, ))
def delete_article(request, pk):
    article=get_object_or_404(Article.objects.prefetch_related('authors'), id=pk)
    #non-admins can only delete an article if they are the only author
    if request.user.is_superuser or request.user.is_staff:
        article.delete()
        return Response(status=status.HTTP_200_OK)
    elif hasattr(request.user, "author") and all(a == request.user.author for a in article.authors.all()):
        article.delete()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


# Commentary views
@api_view(('GET', ))
def list_commentaries(request):
    queryset=Commentary.objects.all()
    serializer=CommentarySerializer(instance=queryset, many=True)
    return Response(serializer.data)

@api_view(('GET', ))
def view_commentary(request, pk):
    queryset=get_object_or_404(Commentary, id=pk)
    serializer=CommentarySerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('POST', ))
@permission_classes((IsAuthenticated,))
def create_commentary(request):
    serializer=CommentarySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('PUT', 'PATCH', ))
@permission_classes((IsAuthenticated,))
def update_commentary(request, pk):
    commentary=get_object_or_404(Commentary, id=pk)
    if request.method=="PATCH":
        is_partial=True
    else:
        is_partial=False
    serializer = CommentarySerializer(commentary, data=request.data, partial=is_partial)
    if serializer.is_valid():
        serializer.save()
        result_status=status.HTTP_200_OK
    else:
        result_status=status.HTTP_400_BAD_REQUEST
    return Response(serializer.errors, status=result_status)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_commentary(request, pk):
    commentary=get_object_or_404(Commentary, id=pk)
    commentary.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(('GET', ))
def list_key_figures_for_article(request, article_pk):
    article=get_object_or_404(Article, id=article_pk)
    kfs = article.key_figures.all()
    serializer = KeyFigureSerializer(kfs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(('GET', ))
def view_key_figure(request, pk):
    queryset=get_object_or_404(KeyFigure, id=pk)
    serializer=KeyFigureSerializer(instance=queryset)
    return Response(serializer.data)

@api_view(('DELETE', ))
@permission_classes((IsAuthenticated, IsAdminUser,))
def delete_key_figure(request, pk):
    key_figure=get_object_or_404(KeyFigure, id=pk)
#    key_figure.image.delete(save=True)
#    key_figure.thumbnail.delete(save=True)
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

@api_view(('GET', ))
def search_articles_and_authors(request):
    q = request.GET.get('q', '')
    page_size = int(request.GET.get('page_size', 10))
    if q:
        logger.warning('Query: %s' % q)

        article_queryset = filter_and_sort_articles(request)
        article_queryset = (
            article_queryset
            .filter(is_live=True)
            .prefetch_related('authors', 'commentaries')
            .filter(
                Q(authors__name__icontains=q) |
                Q(title__icontains=q) |
                Q(author_list__icontains=q)
            )
            .distinct()
        )

        author_queryset = (
            Author
            .objects
            .prefetch_related('articles')
            .filter(is_activated=True)
            .filter(
                Q(name__icontains=q) |
                Q(affiliations__icontains=q)
            )
        )
    else:
        author_queryset = Author.objects.order_by('name')
        article_queryset = Article.objects.order_by('updated')

    results = list(chain(author_queryset, article_queryset))
    paginator = PageNumberPagination()
    paginator.page_size = page_size
    paginated_results = paginator.paginate_queryset(results, request)

    data = []
    # Loop through results and use the appropriate serializer
    authors = [result for result in paginated_results if type(result) is Author]
    articles = [result for result in paginated_results if type(result) is Article]

    data = {
        'authors': AuthorSearchResultSerializer(authors, many=True).data,
        'articles': ArticleSearchResultSerializer(articles, many=True).data,
    }
    return Response(data)


class ImageUploadView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser,)

    def put(self, request, **kwargs):
        if 'file' not in request.data:
            raise ParseError("Empty content")
        f = request.data['file']
        article = get_object_or_404(Article, id=self.kwargs['article_pk'])

        try:
            img = Image.open(f)
            img.verify()
        except:
            raise ParseError("File is not in a supported image format")
        kf = KeyFigure()
        kf.article = article
        kf.image.save(f.name, f, save=True)
        serializer=KeyFigureSerializer(instance=kf)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
                                       | Q(title__icontains=self.q))
        return queryset
