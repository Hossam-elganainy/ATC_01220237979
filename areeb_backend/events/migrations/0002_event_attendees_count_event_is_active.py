# Generated by Django 5.2.1 on 2025-05-15 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="attendees_count",
            field=models.IntegerField(default=0, verbose_name="attendees_count"),
        ),
        migrations.AddField(
            model_name="event",
            name="is_active",
            field=models.BooleanField(default=True, verbose_name="is_active"),
        ),
    ]
