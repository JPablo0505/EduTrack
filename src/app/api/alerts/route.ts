import { NextRequest, NextResponse } from 'next/server';
import { getStudents } from '@/services/studentService';
import { getFollowupsByStudentId } from '@/services/followupService';
import { calculateRisk } from '@/services/riskEngine';
import { Student } from '@/types';

function getRiskReasons(student: Student): string[] {
  const reasons: string[] = [];
  
  if (student.failed_subjects_current > 0) {
    reasons.push(`${student.failed_subjects_current} materia(s) reprobada(s) este semestre.`);
  }
  if (student.academic_average < 3.5 && student.academic_average > 0) {
    reasons.push(`Promedio académico crítico de ${student.academic_average.toFixed(2)}.`);
  }
  if (student.enrolled_credits < student.suggested_credits) {
    reasons.push(`Carga de créditos por debajo de lo sugerido (${student.enrolled_credits}/${student.suggested_credits}).`);
  }
  if (student.semester <= 2) {
    reasons.push(`Período crítico de adaptación (Semestre ${student.semester}°).`);
  }
  if (student.attendance_tutorias < 2) {
    reasons.push(`Inasistencia a tutorías de acompañamiento (${student.attendance_tutorias} asistidas).`);
  }
  
  if (reasons.length === 0) {
    reasons.push('Señales de alerta conductual o reporte directo de docente.');
  }
  
  return reasons;
}

/**
 * GET /api/alerts
 * Devuelve el listado de estudiantes en riesgo con su score, recomendaciones y motivos detallados.
 */
export async function GET(request: NextRequest) {
  try {
    const students = getStudents({});
    
    // Filtrar solo los estados de riesgo del ecosistema EduTrack
    const alertStudents = students
      .filter((s) => s.status === 'Riesgo Alto' || s.status === 'Riesgo Medio' || s.status === 'Seguimiento Preventivo')
      .map((student) => {
        const followups = getFollowupsByStudentId(student.id);
        const riskResult = calculateRisk(student, followups.length);
        const reasons = getRiskReasons(student);
        
        return {
          student,
          score: riskResult.riskScore,
          level: riskResult.riskLevel,
          recommendation: riskResult.recommendation,
          reasons,
        };
      });

    // Ordenar descendente por el score de riesgo
    alertStudents.sort((a, b) => b.score - a.score);
    
    return NextResponse.json(alertStudents, { status: 200 });
  } catch (error: any) {
    console.error('Error en GET /api/alerts:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener alertas de retención.', error: error.message },
      { status: 500 }
    );
  }
}
