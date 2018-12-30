from rest_framework import serializers
from rest_framework.utils import model_meta
from django.shortcuts import get_object_or_404
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


class ConstructSerializer(serializers.ModelSerializer):
    class Meta:
        model=Construct
        fields='__all__'


class MethodSerializer(serializers.ModelSerializer):
    class Meta:
        model=Method
        fields='__all__'


class TransparencySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    transparency_type = serializers.CharField(read_only=True)
    url = serializers.CharField(read_only=True)

    class Meta:
        model=Transparency
        fields= ('id', 'transparency_type', 'url')


class KeyFigureSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    figure_number = serializers.CharField(read_only=True)
    image_url = serializers.CharField(read_only=True)
    study = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model=KeyFigure
        fields= ('id', 'figure_number', 'image_url', 'study')

class EffectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Effect
        fields='__all__'

class NestedStudySerializer(serializers.ModelSerializer):
    id = serializers.ModelField(model_field=Study()._meta.get_field('id'))
    # effects = serializers.PrimaryKeyRelatedField(
    #     many=True, allow_null=True, required=False,
    #     queryset=Effect.objects.all()
    # )
    effects = EffectSerializer(many=True, read_only=True)
    key_figures = KeyFigureSerializer(many=True)
    transparencies = TransparencySerializer(many=True)
    ind_vars = ConstructSerializer(many=True)
    dep_vars = ConstructSerializer(many=True)
    ind_var_methods = MethodSerializer(many=True)
    dep_var_methods = MethodSerializer(many=True)

    class Meta:
        model=Study
        exclude=('article',)

class StudySerializer(serializers.ModelSerializer):
    effects = serializers.PrimaryKeyRelatedField(
        many=True, allow_null=True, required=False,
        queryset=Effect.objects.all()
    )

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

class ArticleSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField(required=False, allow_null=True)
    studies = NestedStudySerializer(many=True)
    #key_figures = serializers.PrimaryKeyRelatedField(many=True, queryset=KeyFigure.objects.all(), required=False, allow_null=True)
    #transparencies = serializers.PrimaryKeyRelatedField(many=True, queryset=Transparency.objects.all(), required=False, allow_null=True)
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
        studies = validated_data.pop('studies', [])
        key_figures = validated_data.pop('key_figures', [])
        transparencies = validated_data.pop('transparencies', [])

        instance = Article.objects.create(**validated_data)

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

        for t in transparencies:
            Transparency.objects.create(
                article=instance,
                **t
            )

        for k in key_figures:
            KeyFigure.objects.create(
                article=instance,
                **k
            )

        for s in studies:
            effects = s.pop('effects', [])
            ind_vars = s.pop('ind_vars', [])
            dep_vars = s.pop('dep_vars', [])
            ind_var_methods = s.pop('ind_var_methods', [])
            dep_var_methods = s.pop('dep_var_methods', [])
            study_transparencies = s.pop('transparencies', [])
            study_key_figures = s.pop('key_figures', [])

            study = Study.objects.create(
                article=instance,
                **s
            )

            for effect in effects:
                study.effects.add(effect)

            for ind_var in ind_vars:
                study.ind_vars.add(ind_var)

            for dep_var in dep_vars:
                study.dep_vars.add(dep_var)

            for ind_var_method in ind_var_methods:
                study.ind_var_methods.add(ind_var_method)

            for dep_var_method in dep_var_methods:
                study.dep_var_methods.add(dep_var_method)

            for st in study_transparencies:
                Transparency.objects.create(
                    article=instance,
                    study=s,
                    **st
                )

            for k in study_key_figures:
                KeyFigure.objects.create(
                    article=instance,
                    study=s,
                    **st
                )

        instance.save()
        return instance

    def update(self, instance, validated_data):
        info = model_meta.get_field_info(instance)

        authors = validated_data.pop('authors', [])
        commentary_of = validated_data.pop('commentary_of', [])
        reproducibility_of = validated_data.pop('reproducibility_of', [])
        robustness_of = validated_data.pop('robustness_of', [])
        studies = validated_data.pop('studies', [])
        key_figures = validated_data.pop('key_figures', [])
        transparencies = validated_data.pop('transparencies', [])

        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(instance, attr)
                field.set(value)
            else:
                setattr(instance, attr, value)

        instance.save()

        for index, author in enumerate(authors):
            ArticleAuthor.objects.update_or_create(
                author=author,
                article=instance,
                defaults={'order': index + 1}
            )

        for a in instance.authors.all():
            if a not in authors:
                instance.articleauthor_set.filter(author=a).delete()

        for t in transparencies:
            url = t.pop('url', '')
            transparency_type = t.pop('transparency_type')
            Transparency.objects.update_or_create(
                article=instance,
                url=url,
                transparency_type=transparency_type,
                defaults=t
            )

        for k in key_figures:
            figure_number=k.pop('figure_number', None)
            KeyFigure.objects.update_or_create(
                article=instance,
                figure_number=figure_number,
                defaults=k
            )

        for s in studies:
            effects = s.pop('effects', [])
            ind_vars = s.pop('ind_vars', [])
            dep_vars = s.pop('dep_vars', [])
            ind_var_methods = s.pop('ind_var_methods', [])
            dep_var_methods = s.pop('dep_var_methods', [])
            study_transparencies = s.pop('transparencies', [])
            study_key_figures = s.pop('key_figures', [])

            if 'id' in s:
                study = Study.objects.filter(id=s['id'])
                study.update(**s)
                study = study.first()
            else:
                study = Study.objects.create(
                    article=instance,
                    **s
                )

            for effect in effects:
                study.effects.add(effect)
            for e in study.effects.all():
                if e not in effects:
                    study.effects.remove(e)

            study_ind_vars = study.ind_vars.all()
            for ind_var in ind_vars:
                study.ind_vars.add(ind_var)
            for i in study_ind_vars:
                if i not in ind_vars:
                    study.ind_vars.remove(i)

            for dep_var in dep_vars:
                study.dep_vars.add(dep_var)
            for d in study.dep_vars.all():
                if d not in dep_vars:
                    study.dep_vars.remove(d)

            for ind_var_method in ind_var_methods:
                study.ind_var_methods.add(ind_var_method)
            for i in study.ind_var_methods.all():
                if i not in ind_var_methods:
                    study.ind_var_methods.remove(i)

            for dep_var_method in dep_var_methods:
                study.dep_var_methods.add(dep_var_method)
            for d in study.dep_var_methods.all():
                if d not in dep_var_methods:
                    study.dep_var_methods.remove(d)

            for t in study_transparencies:
                url = t.pop('url', None)
                transparency_type = t.pop('transparency_type', None)
                tr, c = Transparency.objects.update_or_create(
                    article=instance,
                    study=study,
                    url=url,
                    transparency_type=transparency_type
                )

            for k in study_key_figures:
                figure_number=k.pop('figure_number', None)
                KeyFigure.objects.update_or_create(
                    article=instance,
                    study=study,
                    figure_number=figure_number,
                    defaults=k
                )

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
