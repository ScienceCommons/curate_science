from rest_framework import serializers
from rest_framework.utils import model_meta
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from drf_writable_nested import WritableNestedModelSerializer, UniqueFieldsMixin
from curate.models import (
    Author,
    Article,
    Commentary,
    KeyFigure,
    UserProfile,
)

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Author
        fields='__all__'

class KeyFigureSerializer(serializers.ModelSerializer):
    class Meta:
        model=KeyFigure
        exclude=('article',)

class CommentarySerializer(serializers.ModelSerializer):
    class Meta:
        model=Commentary
        fields='__all__'

class ArticleListSerializer(serializers.ModelSerializer):
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

class ArticleSerializerNested(WritableNestedModelSerializer):
    key_figures = KeyFigureSerializer(many=True)
    commentaries = CommentarySerializer(many=True)
    authors = serializers.PrimaryKeyRelatedField(many=True, queryset=Author.objects.all())

    class Meta:
        model=Article
        fields='__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields='__all__'

class UserSerializer(WritableNestedModelSerializer):
    userprofile = UserProfileSerializer(required=False, allow_null=True)
    extra_kwargs = {
            'password': {
                'write_only': True,
                'required': False,
            },
    }
    class Meta:
        model=User
        fields=('email', 'username', 'first_name',
                'last_name', 'password', 'userprofile')

    def create(self, validated_data):
        user = User(
            email = validated_data["email"],
            username = validated_data["username"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
