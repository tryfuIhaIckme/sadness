from .db import get_db_connection

class Grade:
    @staticmethod
    def create(student_id, discipline_id, teacher_id, grade):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO grades (student_id, discipline_id, teacher_id, grade) VALUES (%s, %s, %s, %s)",
            (student_id, discipline_id, teacher_id, grade)
        )
        conn.commit()
        cur.close()
        conn.close()

    @staticmethod
    def get_by_student(student_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT d.name, g.grade, g.grade_date 
            FROM grades g 
            JOIN disciplines d ON g.discipline_id = d.id
            WHERE g.student_id = %s
        """, (student_id,))
        grades = cur.fetchall()
        cur.close()
        conn.close()
        return grades
