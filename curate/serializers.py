from rest_framework import serializers
from rest_framework.utils import model_meta
from django.shortcuts import get_object_or_404
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
