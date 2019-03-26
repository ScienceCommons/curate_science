from django.contrib import admin
from curate import models
# Register your models here.
admin.site.register(models.Author)
admin.site.register(models.Article)
admin.site.register(models.Commentary)
admin.site.register(models.KeyFigure)
