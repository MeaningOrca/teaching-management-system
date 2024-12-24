from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', '学生'),
        ('teacher', '教师'),
        ('counselor', '辅导员'),
        ('administrator', '管理员'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
