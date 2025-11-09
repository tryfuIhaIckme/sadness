'''
Main application file
'''
from flask import Flask
from src.api import auth, students, teachers, disciplines, grades, specialties

# Configure the Flask app to serve static files from the 'src' directory
app = Flask(__name__, static_folder='src', static_url_path='')

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

# Register auth blueprints
app.add_url_rule('/login', 'login', auth.login, methods=['POST'])

# Register student blueprints
app.add_url_rule('/students', 'create_student', students.create_student, methods=['POST'])
app.add_url_rule('/students', 'get_students', students.get_students, methods=['GET'])
app.add_url_rule('/students/<int:student_id>/archive', 'archive_student', students.archive_student, methods=['POST'])
app.add_url_rule('/students/<int:student_id>/grades', 'get_student_grades', grades.get_student_grades, methods=['GET'])

# Register teacher blueprints
app.add_url_rule('/teachers', 'create_teacher', teachers.create_teacher, methods=['POST'])
app.add_url_rule('/teachers', 'get_teachers', teachers.get_teachers, methods=['GET'])
app.add_url_rule('/teachers/<int:teacher_id>/disciplines', 'get_teacher_disciplines', teachers.get_teacher_disciplines, methods=['GET'])
app.add_url_rule('/teachers/<int:teacher_id>/disciplines/<int:discipline_id>/students', 'get_students_for_discipline', teachers.get_students_for_discipline, methods=['GET'])

# Register discipline blueprints
app.add_url_rule('/disciplines', 'create_discipline', disciplines.create_discipline, methods=['POST'])
app.add_url_rule('/disciplines', 'get_disciplines', disciplines.get_disciplines, methods=['GET'])

# Register grade blueprints
app.add_url_rule('/grades', 'add_grade', grades.add_grade, methods=['POST'])

# Register specialty blueprints
app.add_url_rule('/specialties', 'create_specialty', specialties.create_specialty, methods=['POST'])
app.add_url_rule('/specialties', 'get_specialties', specialties.get_specialties, methods=['GET'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
