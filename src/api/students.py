from flask import request, jsonify
from src.models.student import Student
from src.models.user import User

def create_student():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    patronymic = data.get('patronymic')
    admission_year = data.get('admission_year')
    group_name = data.get('group_name')
    study_form = data.get('study_form')

    if not all([login, password, first_name, last_name, admission_year, group_name, study_form]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.find_by_login(login):
        return jsonify({'error': 'User with this login already exists'}), 400

    user_id = User.create(login, password, 'Студент')
    student_id = Student.create(user_id, first_name, last_name, patronymic, admission_year, group_name, study_form)

    return jsonify({'student_id': student_id}), 201

def get_students():
    students = Student.get_all()
    return jsonify(students)

def archive_student(student_id):
    Student.archive(student_id)
    return jsonify({'message': 'Student archived successfully'})
