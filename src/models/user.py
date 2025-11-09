'''
User model
'''
import hashlib
from .db import get_db_connection

class User:
    @staticmethod
    def create(login, password, role):
        '''Create a new user'''
        conn = get_db_connection()
        cur = conn.cursor()
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cur.execute(
            "INSERT INTO users (login, password_hash, role) VALUES (%s, %s, %s) RETURNING id",
            (login, password_hash, role)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return user_id

    @staticmethod
    def find_by_login(login):
        '''Find a user by login'''
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE login = %s", (login,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        return user

    @staticmethod
    def check_password(password_hash, password):
        '''Check if the provided password matches the stored hash'''
        return password_hash == hashlib.sha256(password.encode()).hexdigest()
