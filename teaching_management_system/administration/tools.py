import json

from students.models import Student, StudentSerializer
from teachers.models import Teacher, TeacherSerializer
from administration.models import Counselor, Admin, CounselorSerializer, AdminSerializer


def save_to_db(user_object):
    try:
        data = json.loads(user_object["body"])
        print(data)
        match data["type"]:
            case "student":
                # Create and save a Student object
                student = Student(
                    student_id=data["id"],
                    student_name=data["name"],
                    gender=data["gender"],
                    birthday=data["birthdate"],
                    class_assigned=data["class"],
                    department=data["major"]
                )
                student.save()
                print("Student saved successfully:", student)
            case "teacher":
                # Create and save a Teacher object
                teacher = Teacher(
                    teacher_id=data["id"],
                    teacher_name=data["name"],
                    gender=data["gender"],
                    department=data["department"],
                    contact=data.get("contact", "")  # Use default empty string if contact is missing
                )
                teacher.save()
                print("Teacher saved successfully:", teacher)
            case "counselor":
                # Create and save a Counselor object
                counselor = Counselor(
                    counselor_id=data["id"],
                    counselor_name=data["name"],
                    department=data["department"],
                    class_assigned=data["class"]
                )
                counselor.save()
                print("Counselor saved successfully:", counselor)
            case "admin":
                # Create and save an Admin object
                admin = Admin(
                    admin_id=data["id"],
                    admin_name=data["name"],
                    # role=data["role"]
                )
                admin.save()
                print("Admin saved successfully:", admin)
            case _:
                return f"Unknown type: {data["type"]}"
    except Exception as e:
        return f"An error occurred: {str(e)}"
    return "OK"

def get_users_object(user_id):
    users = dict()

    try:
        users["student"] = StudentSerializer(Student.objects.get(student_id=user_id)).data
    except Student.DoesNotExist:
        print("No students found!")

    try:
        users["teacher"] = TeacherSerializer(Teacher.objects.get(teacher_id=user_id)).data
    except Teacher.DoesNotExist:
        print("No teachers found!")

    try:
        users["counselor"] = CounselorSerializer(Counselor.objects.get(counselor_id=user_id)).data
    except Counselor.DoesNotExist:
        print("No counselor found!")

    try:
        users["admin"] = AdminSerializer(Admin.objects.get(admin_id=user_id)).data
    except Admin.DoesNotExist:
        print("No admin found!")

    return users
