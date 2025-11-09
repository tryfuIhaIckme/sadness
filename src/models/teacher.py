from .db import get_db_connection

class Teacher:
    @staticmethod
    def create(user_id, first_name, last_name, patronymic):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO teachers (user_id, first_name, last_name, patronymic) VALUES (%s, %s, %s, %s) RETURNING id",
            (user_id, first_name, last_name, patronymic)
        )
        teacher_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return teacher_id

    @staticmethod
    def get_all():
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT t.id, u.login, t.first_name, t.last_name, t.patronymic FROM teachers t JOIN users u ON t.user_id = u.id")
        teachers = cur.fetchall()
        cur.close()
        conn.close()
        return teachers
