from flask import request, jsonify
from src.models.discipline import Discipline

def create_discipline():
    data = request.get_json()
    name = data.get('name')
    specialty_id = data.get('specialty_id')
    semester = data.get('semester')
    hours = data.get('hours')
    reporting_form = data.get('reporting_form')

    if not all([name, specialty_id, semester, hours, reporting_form]):
        return jsonify({'error': 'Missing required fields'}), 400

    discipline_id = Discipline.create(name, specialty_id, semester, hours, reporting_form)
    return jsonify({'discipline_id': discipline_id}), 201

def get_disciplines():
    disciplines = Discipline.get_all()
    return jsonify(disciplines)
