import db from '../lib/db';
import { StudentStatus } from '../types';

export interface ProgramStat {
  programId: number;
  programName: string;
  totalStudents: number;
  atRiskStudents: number;
  riskPercentage: number;
}

export interface KPIDashboardStats {
  totalStudents: number;
  averageAcademicPerformance: number;
  activeAlertsCount: number; // Estudiantes en Riesgo Alto + Riesgo Medio
  atRiskRate: number; // Porcentaje de estudiantes en riesgo vs el total
  statusCounts: Record<StudentStatus, number>;
  programStats: ProgramStat[];
}

/**
 * Genera el consolidado de métricas e indicadores de retención y riesgo para el Dashboard.
 */
export function getKPIDashboardStats(): KPIDashboardStats {
  // 1. Obtener total de estudiantes
  const totalResult = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
  const totalStudents = totalResult?.count || 0;

  // 2. Obtener promedio académico acumulado global
  const avgResult = db.prepare("SELECT AVG(academic_average) as average FROM students WHERE status != 'Inactivo'").get() as { average: number | null };
  const averageAcademicPerformance = avgResult?.average ? parseFloat(avgResult.average.toFixed(2)) : 0.0;

  // 3. Conteo por estados oficiales
  const statusRows = db.prepare(`
    SELECT status, COUNT(*) as count 
    FROM students 
    GROUP BY status
  `).all() as Array<{ status: StudentStatus; count: number }>;

  const statusCounts: Record<StudentStatus, number> = {
    'Estable': 0,
    'Seguimiento Preventivo': 0,
    'Riesgo Medio': 0,
    'Riesgo Alto': 0,
    'Recuperado': 0,
    'Inactivo': 0
  };

  statusRows.forEach((row) => {
    if (row.status in statusCounts) {
      statusCounts[row.status] = row.count;
    }
  });

  // 4. Cantidad de alertas críticas (Riesgo Alto + Riesgo Medio)
  const activeAlertsCount = statusCounts['Riesgo Alto'] + statusCounts['Riesgo Medio'];

  // 5. Tasa de estudiantes en riesgo
  const atRiskRate = totalStudents > 0 
    ? parseFloat(((activeAlertsCount / totalStudents) * 100).toFixed(1)) 
    : 0.0;

  // 6. Estadísticas detalladas por programa académico
  const programRows = db.prepare(`
    SELECT 
      p.id as programId, 
      p.name as programName,
      COUNT(s.id) as totalStudents,
      SUM(CASE WHEN s.status IN ('Riesgo Alto', 'Riesgo Medio') THEN 1 ELSE 0 END) as atRiskStudents
    FROM programs p
    LEFT JOIN students s ON p.id = s.program_id
    GROUP BY p.id, p.name
    ORDER BY p.name ASC
  `).all() as Array<{
    programId: number;
    programName: string;
    totalStudents: number;
    atRiskStudents: number;
  }>;

  const programStats: ProgramStat[] = programRows.map((row) => {
    const riskPercentage = row.totalStudents > 0
      ? parseFloat(((row.atRiskStudents / row.totalStudents) * 100).toFixed(1))
      : 0.0;
    return {
      programId: row.programId,
      programName: row.programName,
      totalStudents: row.totalStudents,
      atRiskStudents: row.atRiskStudents,
      riskPercentage
    };
  });

  return {
    totalStudents,
    averageAcademicPerformance,
    activeAlertsCount,
    atRiskRate,
    statusCounts,
    programStats
  };
}
