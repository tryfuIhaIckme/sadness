
const app = document.getElementById('app');
let token = localStorage.getItem('token');

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function renderView(view) {
    app.innerHTML = view;
}

function mainView() {
    return `
        <h2>Добро пожаловать в АкадемКонтроль!</h2>
        <p>Выберите свою роль для входа в систему:</p>
        <ul>
            <li><a href="#login/dekanat">Сотрудник деканата</a></li>
            <li><a href="#login/teacher">Преподаватель</a></li>
            <li><a href="#login/student">Студент</a></li>
        </ul>
    `;
}

function loginView(role) {
    return `
        <h2>Вход для: ${role}</h2>
        <form id="login-form">
            <input type="text" id="username" placeholder="Логин" required>
            <input type="password" id="password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
        </form>
    `;
}

async function login(role, username, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, password, role })
    });

    if (response.ok) {
        const data = await response.json();
        token = data.token;
        localStorage.setItem('token', token);
        window.location.hash = '#dashboard';
    } else {
        alert('Invalid credentials');
    }
}

function logout() {
    token = null;
    localStorage.removeItem('token');
    window.location.hash = '#';
}

async function studentDashboard() {
    const decodedToken = parseJwt(token);
    const studentId = decodedToken.user_id;

    const response = await fetch(`/students/${studentId}/grades`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    let gradesHtml = '<p>No grades available.</p>';
    if (response.ok) {
        const grades = await response.json();
        if (grades.length > 0) {
            gradesHtml = '<ul>' + grades.map(grade => `<li>${grade.discipline}: ${grade.grade}</li>`).join('') + '</ul>';
        }
    }

    return `
        <h2>Панель студента</h2>
        <h3>Ваши оценки:</h3>
        ${gradesHtml}
    `;
}

async function teacherDashboard() {
    const decodedToken = parseJwt(token);
    const teacherId = decodedToken.user_id;

    const disciplinesResponse = await fetch(`/teachers/${teacherId}/disciplines`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    let disciplinesHtml = '<p>No disciplines assigned.</p>';
    let disciplines = [];
    if (disciplinesResponse.ok) {
        disciplines = await disciplinesResponse.json();
        if (disciplines.length > 0) {
            disciplinesHtml = '<ul>' + disciplines.map(d => `<li>${d[1]}</li>`).join('') + '</ul>';
        }
    }

    const gradeManagementHtml = `
        <div id="grade-management">
            <h3>Выставление оценок</h3>
            <form id="grade-form">
                <select id="discipline-select">
                    <option value="">Выберите дисциплину</option>
                    ${disciplines.map(d => `<option value="${d[0]}">${d[1]}</option>`).join('')}
                </select>
                <select id="student-select">
                    <option value="">Выберите студента</option>
                </select>
                <input type="number" id="grade-input" placeholder="Оценка" required>
                <button type="submit">Поставить оценку</button>
            </form>
        </div>
    `;

    return `
        <h2>Панель преподавателя</h2>
        <h3>Ваши дисциплины:</h3>
        ${disciplinesHtml}
        ${gradeManagementHtml}
    `;
}

async function dekanatDashboard() {
    return `
        <h2>Панель сотрудника деканата</h2>
        <div id="dekanat-management">
            <h3>Управление студентами</h3>
            <form id="create-student-form">
                <input type="text" id="student-login" placeholder="Логин" required>
                <input type="password" id="student-password" placeholder="Пароль" required>
                <input type="text" id="student-first-name" placeholder="Имя" required>
                <input type="text" id="student-last-name" placeholder="Фамилия" required>
                <input type="text" id="student-patronymic" placeholder="Отчество">
                <button type="submit">Создать студента</button>
            </form>
            <table id="students-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Логин</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Отчество</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>

            <h3>Управление преподавателями</h3>
            <form id="create-teacher-form">
                <input type="text" id="teacher-login" placeholder="Логин" required>
                <input type="password" id="teacher-password" placeholder="Пароль" required>
                <input type="text" id="teacher-first-name" placeholder="Имя" required>
                <input type="text" id="teacher-last-name" placeholder="Фамилия" required>
                <input type="text" id="teacher-patronymic" placeholder="Отчество">
                <button type="submit">Создать преподавателя</button>
            </form>
            <table id="teachers-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Логин</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Отчество</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>

            <h3>Управление дисциплинами</h3>
            <form id="create-discipline-form">
                <input type="text" id="discipline-name" placeholder="Название дисциплины" required>
                <button type="submit">Создать дисциплину</button>
            </form>
            <table id="disciplines-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>

            <h3>Управление специальностями</h3>
            <form id="create-specialty-form">
                <input type="text" id="specialty-name" placeholder="Название специальности" required>
                <button type="submit">Создать специальность</button>
            </form>
            <table id="specialties-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;
}

async function dashboardView() {
    if (!token) {
        window.location.hash = '#';
        return;
    }

    const decodedToken = parseJwt(token);
    const role = decodedToken.role;

    let dashboardContent = '';
    if (role === 'student') {
        dashboardContent = await studentDashboard();
    } else if (role === 'teacher') {
        dashboardContent = await teacherDashboard();
    } else if (role === 'dekanat') {
        dashboardContent = await dekanatDashboard();
    }

    const view = `
        <h2>Панель управления</h2>
        <button id="logout-btn">Выйти</button>
        <div id="dashboard-content">${dashboardContent}</div>
    `;
    renderView(view);
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Initialize dashboard-specific logic
    if (role === 'teacher') {
        initializeTeacherDashboard();
    } else if (role === 'dekanat') {
        initializeDekanatDashboard();
    }
}

function initializeTeacherDashboard() {
    const disciplineSelect = document.getElementById('discipline-select');
    disciplineSelect.addEventListener('change', async (e) => {
        const disciplineId = e.target.value;
        const studentSelect = document.getElementById('student-select');
        studentSelect.innerHTML = '<option value="">Выберите студента</option>';
        if (disciplineId) {
            const decodedToken = parseJwt(token);
            const teacherId = decodedToken.user_id;
            const response = await fetch(`/teachers/${teacherId}/disciplines/${disciplineId}/students`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const students = await response.json();
                studentSelect.innerHTML += students.map(student => `<option value="${student[0]}">${student[1]} ${student[2]}</option>`).join('');
            }
        }
    });

    const gradeForm = document.getElementById('grade-form');
    gradeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const disciplineId = document.getElementById('discipline-select').value;
        const studentId = document.getElementById('student-select').value;
        const grade = document.getElementById('grade-input').value;
        if (disciplineId && studentId && grade) {
            const response = await fetch('/grades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ student_id: studentId, discipline_id: disciplineId, grade: grade })
            });
            if (response.ok) {
                alert('Оценка успешно выставлена!');
                gradeForm.reset();
            } else {
                alert('Ошибка при выставлении оценки.');
            }
        }
    });
}

function initializeDekanatDashboard() {
    // Student Management
    const createStudentForm = document.getElementById('create-student-form');
    createStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const response = await fetch('/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ 
                login: document.getElementById('student-login').value,
                password: document.getElementById('student-password').value, 
                first_name: document.getElementById('student-first-name').value, 
                last_name: document.getElementById('student-last-name').value, 
                patronymic: document.getElementById('student-patronymic').value 
            })
        });
        if (response.ok) {
            alert('Студент успешно создан!');
            createStudentForm.reset();
            populateStudentsTable();
        } else {
            alert('Ошибка при создании студента.');
        }
    });

    const studentsTable = document.getElementById('students-table');
    studentsTable.addEventListener('click', async (e) => {
        if (e.target.classList.contains('archive-student-btn')) {
            const studentId = e.target.dataset.studentId;
            const response = await fetch(`/students/${studentId}/archive`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Студент успешно архивирован!');
                populateStudentsTable();
            } else {
                alert('Ошибка при архивации студента.');
            }
        }
    });

    // Teacher Management
    const createTeacherForm = document.getElementById('create-teacher-form');
    createTeacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const response = await fetch('/teachers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ 
                login: document.getElementById('teacher-login').value, 
                password: document.getElementById('teacher-password').value,
                first_name: document.getElementById('teacher-first-name').value, 
                last_name: document.getElementById('teacher-last-name').value, 
                patronymic: document.getElementById('teacher-patronymic').value 
            })
        });
        if (response.ok) {
            alert('Преподаватель успешно создан!');
            createTeacherForm.reset();
            populateTeachersTable();
        } else {
            alert('Ошибка при создании преподавателя.');
        }
    });

    // Discipline Management
    const createDisciplineForm = document.getElementById('create-discipline-form');
    createDisciplineForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const response = await fetch('/disciplines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: document.getElementById('discipline-name').value })
        });
        if (response.ok) {
            alert('Дисциплина успешно создана!');
            createDisciplineForm.reset();
            populateDisciplinesTable();
        } else {
            alert('Ошибка при создании дисциплины.');
        }
    });

    // Specialty Management
    const createSpecialtyForm = document.getElementById('create-specialty-form');
    createSpecialtyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const response = await fetch('/specialties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: document.getElementById('specialty-name').value })
        });
        if (response.ok) {
            alert('Специальность успешно создана!');
            createSpecialtyForm.reset();
            populateSpecialtiesTable();
        } else {
            alert('Ошибка при создании специальности.');
        }
    });

    // Initial population
    populateStudentsTable();
    populateTeachersTable();
    populateDisciplinesTable();
    populateSpecialtiesTable();
}

async function populateStudentsTable() {
    const studentsTable = document.getElementById('students-table').getElementsByTagName('tbody')[0];
    const response = await fetch('/students', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        const students = await response.json();
        studentsTable.innerHTML = students.map(s => `
            <tr>
                <td>${s[0]}</td>
                <td>${s[1]}</td>
                <td>${s[2]}</td>
                <td>${s[3]}</td>
                <td>${s[4]}</td>
                <td><button class="archive-student-btn" data-student-id="${s[0]}">Архивировать</button></td>
            </tr>
        `).join('');
    }
}

async function populateTeachersTable() {
    const teachersTable = document.getElementById('teachers-table').getElementsByTagName('tbody')[0];
    const response = await fetch('/teachers', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        const teachers = await response.json();
        teachersTable.innerHTML = teachers.map(t => `
            <tr>
                <td>${t[0]}</td>
                <td>${t[1]}</td>
                <td>${t[2]}</td>
                <td>${t[3]}</td>
                <td>${t[4]}</td>
            </tr>
        `).join('');
    }
}

async function populateDisciplinesTable() {
    const disciplinesTable = document.getElementById('disciplines-table').getElementsByTagName('tbody')[0];
    const response = await fetch('/disciplines', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        const disciplines = await response.json();
        disciplinesTable.innerHTML = disciplines.map(d => `
            <tr>
                <td>${d[0]}</td>
                <td>${d[1]}</td>
            </tr>
        `).join('');
    }
}

async function populateSpecialtiesTable() {
    const specialtiesTable = document.getElementById('specialties-table').getElementsByTagName('tbody')[0];
    const response = await fetch('/specialties', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        const specialties = await response.json();
        specialtiesTable.innerHTML = specialties.map(s => `
            <tr>
                <td>${s[0]}</td>
                <td>${s[1]}</td>
            </tr>
        `).join('');
    }
}

// Router
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

function router() {
    const hash = window.location.hash;
    if (hash.startsWith('#login/')) {
        const role = hash.substring('#login/'.length);
        renderView(loginView(role));
        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(role, username, password);
        });
    } else if (hash === '#dashboard') {
        dashboardView();
    } else {
        renderView(mainView());
    }
}
