# Generated by Django 2.1.7 on 2019-08-15 19:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('curate', '0047_mediacoverage'),
    ]

    operations = [
        migrations.CreateModel(
            name='Presentation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=1000)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='presentations', to='curate.Article')),
            ],
        ),
        migrations.CreateModel(
            name='SupplementalMaterials',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=1000)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supplemental_materials', to='curate.Article')),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=1000)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='videos', to='curate.Article')),
            ],
        ),
    ]
