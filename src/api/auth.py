from flask import request, jsonify
from src.models.user import User

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

    # In a real application, you would return a JWT token here
    return jsonify({'message': 'Login successful'})
