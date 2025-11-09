from flask import request, jsonify
from src.models.grade import Grade

def add_grade():
    data = request.get_json()
    student_id = data.get('student_id')
    discipline_id = data.get('discipline_id')
    teacher_id = data.get('teacher_id')
    grade = data.get('grade')

    if not all([student_id, discipline_id, teacher_id, grade]):
        return jsonify({'error': 'Missing required fields'}), 400

    Grade.create(student_id, discipline_id, teacher_id, grade)
    return jsonify({'message': 'Grade added successfully'}), 201

def get_student_grades(student_id):
    grades = Grade.get_by_student(student_id)
    return jsonify(grades)
