from .db import get_db_connection

class Discipline:
    @staticmethod
    def create(name, specialty_id, semester, hours, reporting_form):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO disciplines (name, specialty_id, semester, hours, reporting_form) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, specialty_id, semester, hours, reporting_form)
        )
        discipline_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return discipline_id

    @staticmethod
    def get_all():
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT d.id, d.name, s.name as specialty, d.semester, d.hours, d.reporting_form FROM disciplines d JOIN specialties s ON d.specialty_id = s.id")
        disciplines = cur.fetchall()
        cur.close()
        conn.close()
        return disciplines
