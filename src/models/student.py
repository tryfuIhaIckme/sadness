from .db import get_db_connection

class Student:
    @staticmethod
    def create(user_id, first_name, last_name, patronymic, admission_year, group_name, study_form):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO students (user_id, first_name, last_name, patronymic, admission_year, group_name, study_form) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (user_id, first_name, last_name, patronymic, admission_year, group_name, study_form)
        )
        student_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return student_id

    @staticmethod
    def get_all():
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT s.id, u.login, s.first_name, s.last_name, s.patronymic, s.admission_year, s.group_name, s.study_form, s.archived FROM students s JOIN users u ON s.user_id = u.id")
        students = cur.fetchall()
        cur.close()
        conn.close()
        return students

    @staticmethod
    def archive(student_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE students SET archived = TRUE WHERE id = %s", (student_id,))
        conn.commit()
        cur.close()
        conn.close()
