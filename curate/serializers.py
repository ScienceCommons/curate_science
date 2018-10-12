from rest_framework import serializers
from rest_framework.utils import model_meta
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

class ArticleSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField(required=False, allow_null=True)
    studies = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    authors = serializers.PrimaryKeyRelatedField(many=True, queryset=Author.objects.all())
    commentary_of = serializers.PrimaryKeyRelatedField(many=True, queryset=Article.objects.all())
    reproducibility_of = serializers.PrimaryKeyRelatedField(many=True, queryset=Article.objects.all())
    robustness_of = serializers.PrimaryKeyRelatedField(many=True, queryset=Article.objects.all())

    def create(self, validated_data):

        if 'authors' in validated_data:
            authors = validated_data.pop('authors')
        else:
            authors = None

        if 'commentary_of' in validated_data:
            commentary_of = validated_data.pop('commentary_of')
        else:
            commentary_of = None

        if 'reproducibility_of' in validated_data:
            reproducibility_of = validated_data.pop('reproducibility_of')
        else:
            reproducibility_of = None

        if 'robustness_of' in validated_data:
            robustness_of = validated_data.pop('robustness_of')
        else:
            robustness_of = None

        instance = Article.objects.create(**validated_data)

        if authors is not None:
            for index, author in enumerate(authors):
                aa = ArticleAuthor.objects.create(
                    author=author,
                    article=instance,
                    order=index+1
                )
        else:
            raise Exception(str(validated_data))

        if commentary_of is not None:
            for index, article in enumerate(commentary_of):
                ra = RelatedArticle.objects.create(
                    original_article=instance,
                    related_article=article,
                    is_commentary=True,
                    order=index+1
                )
        if reproducibility_of is not None:
            for index, article in enumerate(reproducibility_of):
                ra = RelatedArticle.objects.create(
                    original_article=instance,
                    related_article=article,
                    is_reproducibility=True,
                    order=index+1
                )
        if robustness_of is not None:
            for index, article in enumerate(robustness_of):
                ra = RelatedArticle.objects.create(
                    original_article=instance,
                    related_article=article,
                    is_robustness=True,
                    order=index+1
                )

        instance.save()
        return instance

    def update(self, instance, validated_data):
        info = model_meta.get_field_info(instance)

        if 'authors' in validated_data:
            authors = validated_data.pop('authors')
        else:
            authors = None
        if 'commentary_of' in validated_data:
            commentary_of = validated_data.pop('commentary_of')
        else:
            commentary_of = None
        if 'reproducibility_of' in validated_data:
            reproducibility_of = validated_data.pop('reproducibility_of')
        else:
            reproducibility_of = None
        if 'robustness_of' in validated_data:
            robustness_of = validated_data.pop('robustness_of')
        else:
            robustness_of = None

        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(instance, attr)
                field.set(value)
            else:
                setattr(instance, attr, value)

        instance.save()

        if authors is not None:
            for index, author in enumerate(authors):
                aa = ArticleAuthor.objects.update_or_create(
                    author=author,
                    article=instance,
                    defaults={'order': index + 1}
                )

            for a in instance.authors.all():
                if a not in authors:
                    instance.articleauthor_set.filter(author=a).delete()

        if commentary_of is not None:
            for index, article in enumerate(commentary_of):
                ra = RelatedArticle.objects.update_or_create(
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

        if reproducibility_of is not None:
            for index, article in enumerate(reproducibility_of):
                ra = RelatedArticle.objects.update_or_create(
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

        if robustness_of is not None:
            for index, article in enumerate(robustness_of):
                ra = RelatedArticle.objects.update_or_create(
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
    # TODO: write create() and update() methods
    # http://www.django-rest-framework.org/api-guide/serializers/#writable-nested-representations
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
    effects = serializers.PrimaryKeyRelatedField(
        many=True, allow_null=True, required=False,
        queryset=Effect.objects.all()
    )
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
