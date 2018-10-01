from rest_framework import serializers
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
    VariableRelationship,
)

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Author
        fields='__all__'

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Article
        fields='__all__'

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Collection
        fields='__all__'

class ConstructSerializer(serializers.ModelSerializer):
    class Meta:
        model=Construct
        fields='__all__'

class EffectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Effect
        fields='__all__'

class HypothesisSerializer(serializers.ModelSerializer):
    class Meta:
        model=Hypothesis
        fields='__all__'

class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model=Journal
        fields='__all__'

class KeyFigureSerializer(serializers.ModelSerializer):
    class Meta:
        model=KeyFigure
        fields='__all__'

class MethodSerializer(serializers.ModelSerializer):
    class Meta:
        model=Method
        fields='__all__'

class StatisticalResultSerializer(serializers.ModelSerializer):
    class Meta:
        model=StatisticalResult
        fields='__all__'

class StudySerializer(serializers.ModelSerializer):
    class Meta:
        model=Study
        fields='__all__'

class TransparencySerializer(serializers.ModelSerializer):
    class Meta:
        model=Transparency
        fields='__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields='__all__'
