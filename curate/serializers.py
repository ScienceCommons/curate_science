from rest_framework import serializers
from rest_framework.utils import model_meta
from rest_framework.fields import ImageField, CharField, EmailField
from rest_framework.validators import UniqueValidator
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from drf_writable_nested import WritableNestedModelSerializer, UniqueFieldsMixin
from invitations.models import Invitation
from curate.models import (
    Author,
    Article,
    Commentary,
    KeyFigure,
)
import re


class AuthorSearchResultSerializer(serializers.ModelSerializer):
    number_of_articles = serializers.IntegerField(source='articles.count')
    search_result_type = serializers.ReadOnlyField(default='AUTHOR')

    class Meta:
        model = Author
        fields = (
            'id',
            'name',
            'affiliations',
            'number_of_articles',
            'slug',
            'search_result_type',
        )


class AuthorSerializer(serializers.ModelSerializer):
    account = serializers.SlugRelatedField(
        slug_field='username',
        source='user',
        queryset=User.objects.all(),
        required=False
    )
    class Meta:
        model=Author
        fields=(
            'id', 'account', 'orcid', 'name', 'position_title', 'affiliations',
            'profile_urls', 'created', 'slug', 'articles', 'is_activated',
        )

class KeyFigureSerializer(serializers.ModelSerializer):
    image = ImageField(max_length=None, allow_empty_file=False, use_url=True)
    class Meta:
        model=KeyFigure
        exclude=('article',)


class CommentarySerializer(serializers.ModelSerializer):
    class Meta:
        model=Commentary
        fields='__all__'

class ArticleListSerializer(serializers.ModelSerializer):
    commentaries = CommentarySerializer(many=True, required=False, allow_null=True)
    authors = serializers.PrimaryKeyRelatedField(many=True, queryset=Author.objects.all())

    class Meta:
        model=Article
        fields='__all__'
        extra_kwargs = {
            'number_of_reps': {
                'allow_null': True,
                'required': False,
            },
            'pdf_citations': {
                'allow_null': True,
                'required': False,
            },
            'pdf_downloads': {
                'allow_null': True,
                'required': False,
            },
            'pdf_views': {
                'allow_null': True,
                'required': False,
            },
            'html_views': {
                'allow_null': True,
                'required': False,
            },
            'preprint_downloads': {
                'allow_null': True,
                'required': False,
            },
            'preprint_views': {
                'allow_null': True,
                'required': False,
            },
            'preprint_views': {
                'required': False,
            },
        }


class ArticleSearchResultSerializer(ArticleListSerializer):
    search_result_type = serializers.ReadOnlyField(default='ARTICLE')


class ArticleSerializerNested(WritableNestedModelSerializer):
    key_figures = KeyFigureSerializer(many=True, required=False, allow_null=True)
    commentaries = CommentarySerializer(many=True)
    authors = serializers.PrimaryKeyRelatedField(many=True, queryset=Author.objects.all())

    def validate_doi(self, value):
        if value:
            value = re.sub(r'http[s]?:\/\/[^.]*[.]?doi.org\/', '', value)
            if len(Article.objects.filter(doi=value).exclude(id=self.initial_data.get('id'))) > 0:
                raise serializers.ValidationError("DOI must be unique.")
        return value

    class Meta:
        model=Article
        fields='__all__'

class UserSerializer(WritableNestedModelSerializer):
    author = AuthorSerializer(required=False, allow_null=True)
    password = CharField(write_only=True, required=False)
    email = EmailField(write_only=True, required=False)
    class Meta:
        model=User
        fields=('email', 'username', 'first_name',
                'last_name', 'password', 'author')

    def create(self, validated_data):
        user = User(
            email = validated_data["email"],
            username = validated_data["username"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

class AuthorNameSerializer(UniqueFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model=Author
        fields=('name', 'slug')

class InvitationSerializer(WritableNestedModelSerializer):
    email = EmailField(validators=[UniqueValidator(queryset=User.objects.all()),
                                   UniqueValidator(queryset=Invitation.objects.all())])
    author = AuthorNameSerializer(required=True, allow_null=False)

    class Meta:
        model=Invitation
        fields=('email', 'author')

class AuthorArticleSerializer(serializers.Serializer):
    article = serializers.IntegerField(required=True)
    linked = serializers.BooleanField(required=True)
