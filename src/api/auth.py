import jwt
import datetime
from flask import request, jsonify
from src.models.user import User

SECRET_KEY = 'key'  # Replace with a strong, securely stored secret key


def register():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')
    role = data.get('role')

    if not all([login, password, role]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.find_by_login(login):
        return jsonify({'error': 'User with this login already exists'}), 400

    user_id = User.create(login, password, role)
    return jsonify({'user_id': user_id}), 201

def login():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')

    if not all([login, password]):
        return jsonify({'error': 'Missing login or password'}), 400

    user = User.find_by_login(login)

    if not user or not User.check_password(user[2], password):
        return jsonify({'error': 'Invalid login or password'}), 401

    # Generate JWT token
    token = jwt.encode({
        'user_id': user[0],
        'role': user[3],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({'token': token})
