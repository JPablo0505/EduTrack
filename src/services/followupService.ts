import db from '../lib/db';
import { Followup } from '../types';
import { recalculateRiskForStudent } from './studentService';

/**
 * Registra una nueva bitácora de seguimiento académico y actualiza automáticamente los contadores del estudiante.
 * 
 * @param followup Estructura con la información del seguimiento a crear.
 */
export function createFollowup(followup: Omit<Followup, 'id' | 'created_at'>): void {
  // Ejecutar dentro de una transacción para garantizar consistencia atómica
  const transaction = db.transaction(() => {
    // 1. Insertar el registro de seguimiento
    db.prepare(`
      INSERT INTO followups (student_id, type, description, advisor_name)
      VALUES (?, ?, ?, ?)
    `).run(
      followup.student_id,
      followup.type,
      followup.description,
      followup.advisor_name
    );

    // 2. Si el tipo de seguimiento es una Tutoría Académica, incrementar la asistencia del estudiante
    if (followup.type === 'Tutoría académica') {
      db.prepare(`
        UPDATE students 
        SET attendance_tutorias = attendance_tutorias + 1 
        WHERE id = ?
      `).run(followup.student_id);
    }

    // 3. Forzar el recálculo automático del score y nivel de riesgo
    recalculateRiskForStudent(followup.student_id);
  });

  transaction();
}

/**
 * Obtiene el historial completo de bitácoras de seguimiento de un estudiante específico, ordenado de forma cronológica descendente.
 * 
 * @param studentId Código identificador del estudiante.
 */
export function getFollowupsByStudentId(studentId: string): Followup[] {
  return db.prepare(`
    SELECT id, student_id, type, description, advisor_name, datetime(created_at, 'localtime') as created_at
    FROM followups
    WHERE student_id = ?
    ORDER BY created_at DESC
  `).all(studentId) as Followup[];
}

/**
 * Obtiene el listado completo de todos los seguimientos del sistema, con información del estudiante y programa asociada.
 */
export function getAllFollowups(): (Followup & { student_first_name: string; student_last_name: string; student_program_name: string })[] {
  return db.prepare(`
    SELECT f.id, f.student_id, f.type, f.description, f.advisor_name, 
           datetime(f.created_at, 'localtime') as created_at,
           s.first_name as student_first_name, 
           s.last_name as student_last_name,
           p.name as student_program_name
    FROM followups f
    JOIN students s ON f.student_id = s.id
    JOIN programs p ON s.program_id = p.id
    ORDER BY f.created_at DESC
  `).all() as any[];
}
