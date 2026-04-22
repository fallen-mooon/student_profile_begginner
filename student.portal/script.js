// ─── Index page ──────────────────────────────────────────────────
function showMessage() {
    alert("Welcome to the Student Learning Portal!");
}

// ─── Register page ───────────────────────────────────────────────
function validateForm() {
    const name  = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const age   = document.getElementById('age')?.value.trim();
    const msg   = document.getElementById('msg');

    if (!name || !email || !age) {
        msg.style.color = 'red';
        msg.textContent = 'Please fill in all fields.';
        return false;
    }

    if (parseInt(age) < 10 || parseInt(age) > 100) {
        msg.style.color = 'red';
        msg.textContent = 'Please enter a valid age.';
        return false;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age })
    })
    .then(res => res.json())
    .then(data => {
        msg.style.color = data.success ? 'green' : 'red';
        msg.textContent = data.message;
        if (data.success) {
            document.getElementById('name').value  = '';
            document.getElementById('email').value = '';
            document.getElementById('age').value   = '';
            loadStudents();
        }
    })
    .catch(() => {
        msg.style.color = 'red';
        msg.textContent = 'Server error. Is Flask running?';
    });

    return false;
}

// ─── Load students table ─────────────────────────────────────────
function loadStudents() {
    fetch('/students')
    .then(res => res.json())
    .then(students => {
        const div = document.getElementById('student-list');
        if (!div) return;

        if (students.length === 0) {
            div.innerHTML = '<p>No students registered yet.</p>';
            return;
        }

        let html = `<table border="1" cellpadding="8" cellspacing="0" 
            style="margin:auto; border-collapse:collapse; width:80%;">
            <tr style="background:#2c3e50; color:white;">
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Action</th>
            </tr>`;

        students.forEach(s => {
            html += `<tr>
                <td style="text-align:center">${s.id}</td>
                <td style="text-align:center">${s.name}</td>
                <td style="text-align:center">${s.email}</td>
                <td style="text-align:center">${s.age}</td>
                <td style="text-align:center">
                    <button onclick="deleteStudent(${s.id})" 
                        style="background:red; color:white; border:none; 
                        padding:5px 10px; cursor:pointer;">
                        Delete
                    </button>
                </td>
            </tr>`;
        });

        html += '</table>';
        div.innerHTML = html;
    })
    .catch(() => {
        const div = document.getElementById('student-list');
        if (div) div.innerHTML = '<p style="color:red">Could not load students. Is Flask running?</p>';
    });
}

// ─── Delete student ───────────────────────────────────────────────
function deleteStudent(id) {
    if (!confirm('Delete this student?')) return;

    fetch(`/students/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => loadStudents());
}

// Auto-load students when page opens
window.onload = () => {
    if (document.getElementById('student-list')) loadStudents();
};