from django.db import models
from rest_framework import serializers

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=100)
    credits = models.IntegerField()
    semester = models.IntegerField()
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.SET_NULL, null=True, related_name="courses")
    student = models.ForeignKey('students.Student', on_delete=models.SET_NULL, null=True, related_name="courses")

    def __str__(self):
        return self.course_name


class Enrollment(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    enrollment_date = models.DateField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.student.student_name} - {self.course.course_name}"


class Score(models.Model):
    score = models.FloatField()
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name="scores")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="scores")

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.student_name} - {self.course.course_name}: {self.score}"
