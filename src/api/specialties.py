from flask import request, jsonify
from src.models.specialty import Specialty

def create_specialty():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Missing required field'}), 400

    specialty_id = Specialty.create(name)
    return jsonify({'specialty_id': specialty_id}), 201

def get_specialties():
    specialties = Specialty.get_all()
    return jsonify(specialties)
