from rest_framework import serializers
from rest_framework.utils import model_meta
from django.shortcuts import get_object_or_404
from drf_writable_nested import WritableNestedModelSerializer, UniqueFieldsMixin
from curate.models import (
    Author,
    Article,
    ArticleAuthor,
    Collection,
    Construct,
    Effect,
    Hypothesis,
    Journal,
    KeyFigure,
    Method,
    RelatedArticle,
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


class ConstructSerializer(UniqueFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model=Construct
        fields='__all__'


class MethodSerializer(UniqueFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model=Method
        fields='__all__'


class TransparencySerializer(serializers.ModelSerializer):
    class Meta:
        model=Transparency
        exclude=('article',)


class KeyFigureSerializer(serializers.ModelSerializer):
    class Meta:
        model=KeyFigure
        exclude=('article',)

class EffectSerializer(UniqueFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model=Effect
        fields='__all__'

class NestedStudySerializer(WritableNestedModelSerializer):
    #id = serializers.ModelField(model_field=Study()._meta.get_field('id'))
    effects = EffectSerializer(many=True)
    key_figures = KeyFigureSerializer(many=True)
    transparencies = TransparencySerializer(many=True)
    ind_vars = ConstructSerializer(many=True)
    dep_vars = ConstructSerializer(many=True)
    ind_var_methods = MethodSerializer(many=True)
    dep_var_methods = MethodSerializer(many=True)

    class Meta:
        model=Study
        exclude=('article',)

class StudySerializer(WritableNestedModelSerializer):
    effects = EffectSerializer(many=True)
    key_figures = KeyFigureSerializer(many=True)
    transparencies = TransparencySerializer(many=True)
    ind_vars = ConstructSerializer(many=True)
    dep_vars = ConstructSerializer(many=True)
    ind_var_methods = MethodSerializer(many=True)
    dep_var_methods = MethodSerializer(many=True)

    class Meta:
        model=Study
        fields='__all__'

class JournalSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    name = serializers.CharField()
    issn = serializers.CharField()
    articles = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model=Journal
        fields='__all__'

class ArticleListSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField(required=False, allow_null=True)
    key_figures = KeyFigureSerializer(many=True)
    transparencies = TransparencySerializer(many=True)
    studies = NestedStudySerializer(many=True)
    authors = AuthorSerializer(many=True)
    journal = JournalSerializer()

    class Meta:
        model=Article
        fields='__all__'

class ArticleSerializerNested(WritableNestedModelSerializer):
    year = serializers.IntegerField(required=False, allow_null=True)
    studies = NestedStudySerializer(many=True)
    key_figures = KeyFigureSerializer(many=True)
    transparencies = TransparencySerializer(many=True)
    authors = serializers.PrimaryKeyRelatedField(many=True, queryset=Author.objects.all())
    commentary_of = serializers.PrimaryKeyRelatedField(many=True, queryset=Article.objects.all())
    reproducibility_of = serializers.PrimaryKeyRelatedField(many=True, queryset=Article.objects.all())
    robustness_of = serializers.PrimaryKeyRelatedField(many=True, queryset=Article.objects.all())

    def create(self, validated_data):
        authors = validated_data.pop('authors', [])
        commentary_of = validated_data.pop('commentary_of', [])
        reproducibility_of = validated_data.pop('reproducibility_of', [])
        robustness_of = validated_data.pop('robustness_of', [])
        instance = super().create(validated_data)

        for index, author in enumerate(authors):
            ArticleAuthor.objects.create(
                author=author,
                article=instance,
                order=index+1
            )

        for index, article in enumerate(commentary_of):
            RelatedArticle.objects.create(
                original_article=instance,
                related_article=article,
                is_commentary=True,
                order=index+1
            )

        for index, article in enumerate(reproducibility_of):
            RelatedArticle.objects.create(
                original_article=instance,
                related_article=article,
                is_reproducibility=True,
                order=index+1
            )

        for index, article in enumerate(robustness_of):
            RelatedArticle.objects.create(
                original_article=instance,
                related_article=article,
                is_robustness=True,
                order=index+1
            )

        return instance

    def update(self, instance, validated_data):
        authors = validated_data.pop('authors', [])
        commentary_of = validated_data.pop('commentary_of', [])
        reproducibility_of = validated_data.pop('reproducibility_of', [])
        robustness_of = validated_data.pop('robustness_of', [])
        instance = super().update(instance, validated_data)

        for index, author in enumerate(authors):
            ArticleAuthor.objects.update_or_create(
                author=author,
                article=instance,
                defaults={'order': index + 1}
            )

        for a in instance.authors.all():
            if a not in authors:
                instance.articleauthor_set.filter(author=a).delete()

        for index, article in enumerate(commentary_of):
            RelatedArticle.objects.update_or_create(
                original_article=instance,
                related_article=article,
                is_commentary=True,
                defaults={'order': index + 1}
            )

        for ra in instance.commentary_of:
            if ra not in commentary_of:
                instance.related_articles.filter(
                    related_article=ra,
                    is_commentary=True
                ).delete()

        for index, article in enumerate(reproducibility_of):
            RelatedArticle.objects.update_or_create(
                    original_article=instance,
                    related_article=article,
                    is_reproducibility=True,
                    defaults={'order': index + 1}
                )

        for ra in instance.reproducibility_of:
            if ra not in reproducibility_of:
                instance.related_articles.filter(
                    related_article=ra,
                    is_reproducibility=True
                ).delete()

        for index, article in enumerate(robustness_of):
            RelatedArticle.objects.update_or_create(
                original_article=instance,
                related_article=article,
                is_robustness=True,
                defaults={'order': index + 1}
            )

        for ra in instance.robustness_of:
            if ra not in robustness_of:
                instance.related_articles.filter(
                    related_article=ra,
                    is_robustness=True
                ).delete()

        return instance

    class Meta:
        model=Article
        fields='__all__'

class ArticleDetailSerializer(serializers.ModelSerializer):
    key_figures = KeyFigureSerializer(many=True)
    transparencies = TransparencySerializer(many=True)
    studies = NestedStudySerializer(many=True)
    authors = AuthorSerializer(many=True)
    journal = JournalSerializer()
    publication_year = serializers.ReadOnlyField()

    class Meta:
        model=Article
        fields='__all__'

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Collection
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
    # TODO: write create() and update() methods
    # http://www.django-rest-framework.org/api-guide/serializers/#writable-nested-representations
    class Meta:
        model=Hypothesis
        fields='__all__'

class StatisticalResultSerializer(serializers.ModelSerializer):
    class Meta:
        model=StatisticalResult
        fields='__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields='__all__'
