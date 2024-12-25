import json

from students.models import Student
from teachers.models import Teacher
from administration.models import Counselor, Admin


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
                    admin_id=data["adminID"],
                    ad_name=data["adName"],
                    role=data["role"]
                )
                admin.save()
                print("Admin saved successfully:", admin)
            case _:
                return f"Unknown type: {data["type"]}"
    except Exception as e:
        return f"An error occurred: {str(e)}"
    return "OK"

def get_user_object(user_type, user_id):
    match user_type:
        case "student":
            from students.models import Student
            return Student.objects.get(student_id=user_id)

