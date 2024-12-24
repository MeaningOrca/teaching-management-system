from django.db import models
from teaching_management_system.consts import GENDER_CHOICES
# TODO: gender choices


class Teacher(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    teacher_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    department = models.CharField(max_length=50)
    contact = models.CharField(max_length=100)

    def __str__(self):
        return self.teacher_name
