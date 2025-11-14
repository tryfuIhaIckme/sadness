-- Создание перечисления для форм обучения
CREATE TYPE study_form AS ENUM ('дневная', 'вечерняя', 'заочная');

-- Создание перечисления для форм отчетности
CREATE TYPE reporting_form AS ENUM ('экзамен', 'зачет');

-- Создание перечисления для ролей пользователей
CREATE TYPE user_role AS ENUM ('Администратор', 'Сотрудник деканата', 'Преподаватель', 'Студент');

-- Создание перечисления для оценок
CREATE TYPE grade_value AS ENUM ('зачтено', 'не зачтено', 'отлично', 'хорошо', 'удовлетворительно', 'неудовлетворительно');

-- Таблица специальностей
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Таблица дисциплин
CREATE TABLE disciplines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty_id INT REFERENCES specialties(id),
    semester INT NOT NULL,
    hours INT NOT NULL,
    reporting_form reporting_form NOT NULL,
    UNIQUE(name, specialty_id)
);

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL
);

-- Таблица студентов
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255),
    admission_year INT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    study_form study_form NOT NULL,
    archived BOOLEAN DEFAULT FALSE
);

-- Таблица преподавателей
-- (Расширяем пользователей, если нужна дополнительная информация)
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255)
);

-- Таблица для связи преподавателей и дисциплин
CREATE TABLE teachers_disciplines (
    teacher_id INT REFERENCES teachers(id),
    discipline_id INT REFERENCES disciplines(id),
    PRIMARY KEY (teacher_id, discipline_id)
);

-- Таблица успеваемости (журнал)
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    discipline_id INT REFERENCES disciplines(id),
    teacher_id INT REFERENCES teachers(id),
    grade grade_value NOT NULL,
    grade_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Добавление новой специальности
INSERT INTO specialties (name) VALUES ('Информационные системы и технологии');

INSERT INTO users (login, password_hash, role) VALUES (
    'admin',
    'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646',
    'Администратор'
);