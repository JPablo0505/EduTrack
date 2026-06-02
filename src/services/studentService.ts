import db from '../lib/db';
import { Student, StudentStatus } from '../types';
import { calculateRisk } from './riskEngine';

export interface StudentFilters {
  status?: StudentStatus;
  programId?: number;
  search?: string;
  risk?: 'Alto' | 'Medio' | 'Preventivo' | 'Estable';
}

/**
 * Recalcula el nivel de riesgo de un estudiante en la base de datos basándose en sus estadísticas.
 * 
 * @param studentId Código identificador del estudiante.
 */
export function recalculateRiskForStudent(studentId: string): void {
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId) as Student | undefined;
  if (!student) return;

  // Contar seguimientos históricos
  const followupsCountResult = db.prepare('SELECT COUNT(*) as count FROM followups WHERE student_id = ?').get(studentId) as { count: number };
  const followupsCount = followupsCountResult?.count || 0;

  // Calcular score y nivel de riesgo
  const riskResult = calculateRisk(student, followupsCount);

  // Si el estado original no es Inactivo, actualizamos según el motor de riesgo
  const newStatus = student.status === 'Inactivo' ? 'Inactivo' : riskResult.riskLevel;

  db.prepare('UPDATE students SET status = ? WHERE id = ?').run(newStatus, studentId);
}

/**
 * Obtiene el listado de estudiantes aplicando filtros dinámicos.
 */
export function getStudents(filters: StudentFilters): Student[] {
  let query = `
    SELECT s.*, p.name as program_name 
    FROM students s
    JOIN programs p ON s.program_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.status) {
    query += ' AND s.status = ?';
    params.push(filters.status);
  }

  if (filters.programId) {
    query += ' AND s.program_id = ?';
    params.push(filters.programId);
  }

  if (filters.search) {
    query += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.id LIKE ?)';
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (filters.risk) {
    const riskStatusMap: Record<string, StudentStatus> = {
      Alto: 'Riesgo Alto',
      Medio: 'Riesgo Medio',
      Preventivo: 'Seguimiento Preventivo',
      Estable: 'Estable'
    };
    const targetStatus = riskStatusMap[filters.risk];
    if (targetStatus) {
      query += ' AND s.status = ?';
      params.push(targetStatus);
    }
  }

  query += ' ORDER BY s.last_name ASC';

  return db.prepare(query).all(...params) as Student[];
}

/**
 * Obtiene la información detallada de un estudiante por su código identificador.
 */
export function getStudentById(id: string): Student | null {
  const student = db.prepare(`
    SELECT s.*, p.name as program_name 
    FROM students s
    JOIN programs p ON s.program_id = p.id
    WHERE s.id = ?
  `).get(id) as Student | undefined;

  return student || null;
}

/**
 * Registra un nuevo estudiante en el sistema y calcula su nivel de riesgo inicial.
 */
export function createStudent(student: Student): void {
  // Inicializar estado por defecto antes del cálculo
  student.status = student.status || 'Estable';

  // Calcular riesgo inicial
  const riskResult = calculateRisk(student, 0);
  student.status = riskResult.riskLevel;

  db.prepare(`
    INSERT INTO students (
      id, first_name, last_name, email, program_id, semester, 
      academic_average, enrolled_credits, suggested_credits, 
      failed_subjects_current, attendance_tutorias, academic_trend, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `).run(
    student.id,
    student.first_name,
    student.last_name,
    student.email,
    student.program_id,
    student.semester,
    student.academic_average,
    student.enrolled_credits,
    student.suggested_credits,
    student.failed_subjects_current || 0,
    student.attendance_tutorias || 0,
    student.academic_trend || 'ESTABLE',
    student.status
  );

  // Recalcular riesgo inmediatamente por si existen relaciones previas
  recalculateRiskForStudent(student.id);
}

/**
 * Modifica los datos de un estudiante y actualiza automáticamente su clasificación de riesgo.
 */
export function updateStudent(id: string, updates: Partial<Omit<Student, 'id'>>): void {
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
  });

  if (fields.length === 0) return;

  params.push(id);
  const query = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...params);

  // Forzar recalculo de riesgo automático
  recalculateRiskForStudent(id);
}

/**
 * Elimina un estudiante de la base de datos.
 */
export function deleteStudent(id: string): void {
  db.prepare('DELETE FROM students WHERE id = ?').run(id);
}
