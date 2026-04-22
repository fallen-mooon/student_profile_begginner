from flask import Flask, request, jsonify, send_from_directory
from database import init_db
import sqlite3
import os

app = Flask(__name__, static_folder='.')

# Initialize DB on startup
init_db()

# ─── Serve HTML pages ────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

# ─── Register a student ──────────────────────────────────────────
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name  = data.get('name')
    email = data.get('email')
    age   = data.get('age')

    if not name or not email or not age:
        return jsonify({'success': False, 'message': 'All fields are required.'}), 400

    try:
        conn = sqlite3.connect('students.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO students (name, email, age) VALUES (?, ?, ?)',
            (name, email, int(age))
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': f'Welcome, {name}! Registration successful.'})

    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Email already registered.'}), 409

# ─── Get all students ────────────────────────────────────────────
@app.route('/students', methods=['GET'])
def get_students():
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email, age FROM students')
    rows = cursor.fetchall()
    conn.close()

    students = [{'id': r[0], 'name': r[1], 'email': r[2], 'age': r[3]} for r in rows]
    return jsonify(students)

# ─── Delete a student ────────────────────────────────────────────
@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM students WHERE id = ?', (student_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Student deleted.'})

if __name__ == '__main__':
    app.run(debug=True)