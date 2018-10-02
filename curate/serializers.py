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
    studies = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

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

class VariableRelationshipSerializer(serializers.ModelSerializer):
    independent_variable_method=serializers.PrimaryKeyRelatedField(source='ind_var', read_only=True)
    dependent_variable_method=serializers.PrimaryKeyRelatedField(source='dep_var', read_only=True)
    class Meta:
        model=VariableRelationship
        #fields='__all__'
        exclude=('ind_var','dep_var',)

class HypothesisSerializer(serializers.ModelSerializer):
    variables = VariableRelationshipSerializer(many=True, read_only=False)
    class Meta:
        model=Hypothesis
        fields='__all__'

class JournalSerializer(serializers.ModelSerializer):
    articles = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

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
