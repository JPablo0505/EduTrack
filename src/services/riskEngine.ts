import { Student, StudentStatus } from '../types';

interface RiskResult {
  riskScore: number;
  riskLevel: StudentStatus;
  recommendation: string;
}

/**
 * Calcula de forma determinista y explicable el puntaje y nivel de riesgo de un estudiante.
 * 
 * @param student Datos del estudiante a evaluar.
 * @param followupsCount Cantidad total de seguimientos históricos registrados en la base de datos.
 */
export function calculateRisk(student: Student, followupsCount: number): RiskResult {
  // Manejo de estudiantes Inactivos (egresados, retirados, desertores confirmados)
  if (student.status === 'Inactivo') {
    return {
      riskScore: 100,
      riskLevel: 'Inactivo',
      recommendation: 'Estudiante inactivo en el sistema. No se requieren acciones de acompañamiento activo.'
    };
  }

  // --- 1. Factor de Rendimiento (F_rend - Peso 50%) ---
  // Estudiantes de primer semestre sin promedio histórico se tratan de forma neutral
  const isFirstSemesterNew = student.semester === 1 && (student.academic_average === 0 || !student.academic_average);
  const avgRisk = isFirstSemesterNew ? 0.2 : 1 - (student.academic_average / 5.0);
  const failedRisk = Math.min((student.failed_subjects_current || 0) / 3, 1);
  const F_rend = (failedRisk * 0.6) + (avgRisk * 0.4);

  // --- 2. Factor de Progresión (F_prog - Peso 30%) ---
  const enrolled = student.enrolled_credits || 16;
  const suggested = student.suggested_credits || 16;
  const creditsRisk = suggested > 0 ? Math.max(0, 1 - (enrolled / suggested)) : 0;
  const semesterRisk = 1 / (student.semester || 1); // El riesgo es mayor en los primeros semestres
  const F_prog = (creditsRisk * 0.7) + (semesterRisk * 0.3);

  // --- 3. Factor de Acompañamiento e Historial (F_acom - Peso 20%) ---
  const followupsRisk = Math.min(followupsCount / 4, 1);
  const tutoriasRatio = Math.min((student.attendance_tutorias || 0) / 3, 1);
  const F_acom = (followupsRisk * 0.6) + ((1 - tutoriasRatio) * 0.4);

  // --- 4. Cálculo del Score de Riesgo (SR) ---
  const W_rend = 0.50;
  const W_prog = 0.30;
  const W_acom = 0.20;

  const rawScore = (W_rend * F_rend) + (W_prog * F_prog) + (W_acom * F_acom);
  const riskScore = Math.min(Math.max(Math.round(rawScore * 100), 0), 100);

  // --- 5. Determinación de Nivel y Recomendaciones ---
  let riskLevel: StudentStatus;
  let recommendation: string;

  if (riskScore >= 70) {
    riskLevel = 'Riesgo Alto';
    recommendation = 'Remisión prioritaria al Director de Carrera y agendamiento obligatorio con Psicología de Bienestar.';
  } else if (riskScore >= 45) {
    riskLevel = 'Riesgo Medio';
    recommendation = 'Agendar tutoría académica de nivelación de materias y llamada de seguimiento preventivo.';
  } else if (riskScore >= 25) {
    riskLevel = 'Seguimiento Preventivo';
    recommendation = 'Enviar correo preventivo de oferta de tutorías y monitorear notas del segundo corte.';
  } else {
    // Si estaba anteriormente en riesgo pero ha mejorado y asiste a tutorías
    if (student.attendance_tutorias >= 2 && student.failed_subjects_current === 0 && student.academic_average >= 3.5) {
      riskLevel = 'Recuperado';
      recommendation = 'Estudiante recuperado con éxito. Mantener monitoreo pasivo ordinario de fin de ciclo.';
    } else {
      riskLevel = 'Estable';
      recommendation = 'Estudiante en estado óptimo y regular. Sin acciones de acompañamiento requeridas.';
    }
  }

  return {
    riskScore,
    riskLevel,
    recommendation
  };
}
