-- Esquema de base de datos SQLite para EduTrack CRM

-- Habilitar integridad de llaves foráneas
PRAGMA foreign_keys = ON;

-- Eliminar tablas si existen para garantizar idempotencia en seeds
DROP TABLE IF EXISTS followups;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS programs;

-- Tabla de Programas Académicos
CREATE TABLE programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Tabla de Estudiantes
CREATE TABLE students (
    id TEXT PRIMARY KEY, -- Código del estudiante (ej: NT-2024-001)
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    program_id INTEGER NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 10),
    academic_average REAL NOT NULL CHECK (academic_average BETWEEN 0.0 AND 5.0),
    enrolled_credits INTEGER NOT NULL CHECK (enrolled_credits > 0),
    suggested_credits INTEGER NOT NULL CHECK (suggested_credits > 0),
    failed_subjects_current INTEGER DEFAULT 0 CHECK (failed_subjects_current >= 0),
    attendance_tutorias INTEGER DEFAULT 0 CHECK (attendance_tutorias >= 0),
    academic_trend TEXT CHECK(academic_trend IN ('ASCENDENTE', 'ESTABLE', 'DESCENDENTE')) DEFAULT 'ESTABLE',
    status TEXT CHECK(status IN ('Estable', 'Seguimiento Preventivo', 'Riesgo Medio', 'Riesgo Alto', 'Recuperado', 'Inactivo')) DEFAULT 'Estable',
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT
);

-- Tabla de Seguimientos Académicos / Bitácora
CREATE TABLE followups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('Tutoría académica', 'Seguimiento docente', 'Bienestar universitario', 'Consejería académica', 'Correo institucional', 'Reunión de acompañamiento')),
    description TEXT NOT NULL,
    advisor_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas frecuentes
CREATE INDEX idx_students_program ON students(program_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_followups_student ON followups(student_id);
