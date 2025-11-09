from .db import get_db_connection

class Specialty:
    @staticmethod
    def create(name):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO specialties (name) VALUES (%s) RETURNING id",
            (name,)
        )
        specialty_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return specialty_id

    @staticmethod
    def get_all():
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM specialties")
        specialties = cur.fetchall()
        cur.close()
        conn.close()
        return specialties
