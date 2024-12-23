# Generated by Django 5.1.4 on 2024-12-24 06:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('students', '0001_initial'),
        ('teachers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('course_id', models.AutoField(primary_key=True, serialize=False)),
                ('course_name', models.CharField(max_length=100)),
                ('credits', models.IntegerField()),
                ('semester', models.IntegerField()),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='courses', to='students.student')),
                ('teacher', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='courses', to='teachers.teacher')),
            ],
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('enrollment_id', models.AutoField(primary_key=True, serialize=False)),
                ('enrollment_date', models.DateField()),
                ('status', models.CharField(max_length=50)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='courses.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='students.student')),
            ],
        ),
        migrations.CreateModel(
            name='Score',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.FloatField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scores', to='courses.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scores', to='students.student')),
            ],
            options={
                'unique_together': {('student', 'course')},
            },
        ),
    ]
