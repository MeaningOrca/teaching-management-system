# Generated by Django 5.1.4 on 2024-12-26 01:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
