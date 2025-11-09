from flask import request, jsonify
from src.models.teacher import Teacher
from src.models.user import User

def create_teacher():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    patronymic = data.get('patronymic')

    if not all([login, password, first_name, last_name]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.find_by_login(login):
        return jsonify({'error': 'User with this login already exists'}), 400

    user_id = User.create(login, password, 'Преподаватель')
    teacher_id = Teacher.create(user_id, first_name, last_name, patronymic)

    return jsonify({'teacher_id': teacher_id}), 201

def get_teachers():
    teachers = Teacher.get_all()
    return jsonify(teachers)
