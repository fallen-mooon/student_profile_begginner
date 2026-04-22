import sqlite3

def init_db():
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT    NOT NULL,
            email   TEXT    NOT NULL UNIQUE,
            age     INTEGER NOT NULL
        )
    ''')

    conn.commit()
    conn.close()
    print("Database initialized successfully.")

if __name__ == '__main__':
    init_db()