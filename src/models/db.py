import os
import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="db",
        database="academ_control",
        user="user",
        password="password")
    return conn
