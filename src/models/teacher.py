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

    @staticmethod
    def get_disciplines(teacher_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT d.id, d.name FROM disciplines d JOIN teacher_discipline td ON d.id = td.discipline_id WHERE td.teacher_id = %s", (teacher_id,))
        disciplines = cur.fetchall()
        cur.close()
        conn.close()
        return disciplines

    @staticmethod
    def get_students_by_discipline(teacher_id, discipline_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT s.id, s.first_name, s.last_name FROM students s JOIN student_discipline sd ON s.id = sd.student_id WHERE sd.discipline_id = %s", (discipline_id,))
        students = cur.fetchall()
        cur.close()
        conn.close()
        return students
