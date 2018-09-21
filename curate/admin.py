from django.contrib import admin
from curate import models
# Register your models here.
admin.site.register(models.Author)
admin.site.register(models.Article)
admin.site.register(models.ArticleAuthor)
admin.site.register(models.Collection)
admin.site.register(models.Construct)
admin.site.register(models.Effect)
admin.site.register(models.Hypothesis)
admin.site.register(models.Journal)
admin.site.register(models.KeyFigure)
admin.site.register(models.Method)
admin.site.register(models.RelatedArticle)
admin.site.register(models.StatisticalResult)
admin.site.register(models.Study)
admin.site.register(models.Transparency)
admin.site.register(models.UserProfile)
admin.site.register(models.VariableRelationship)
