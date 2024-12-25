from django.db import models
from rest_framework import serializers
from teaching_management_system.consts import GENDER_CHOICES


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    student_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birthday = models.DateField(null=True)
    class_assigned = models.CharField(max_length=50, blank=True)
    department = models.CharField(max_length=50)

    def __str__(self):
        return self.student_name


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
