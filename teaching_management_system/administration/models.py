from django.db import models
from rest_framework import serializers


class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    admin_name = models.CharField(max_length=100)

    # role = models.CharField(max_length=50)

    def __str__(self):
        return self.admin_name


class Counselor(models.Model):
    counselor_id = models.AutoField(primary_key=True)
    counselor_name = models.CharField(max_length=100)
    department = models.CharField(max_length=50)
    class_assigned = models.CharField(max_length=50, blank=True)
    course = models.ForeignKey('courses.Course', on_delete=models.SET_NULL, null=True, related_name="counselors")

    def __str__(self):
        return self.counselor_name


class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    report_date = models.DateField()
    reason = models.CharField(max_length=255, blank=True)
    report_role = models.CharField(max_length=50)
    report_status = models.CharField(max_length=50)
    report_text = models.TextField(blank=True)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name="reports")
    counselor = models.ForeignKey(Counselor, on_delete=models.CASCADE, related_name="reports")
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name="reports")

    def __str__(self):
        return f"Report {self.report_id}"


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'


class CounselorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counselor
        fields = '__all__'
