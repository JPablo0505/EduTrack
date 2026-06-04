import { Student, StudentStatus } from '../types';

// ─────────────────────────────────────────────
// Interfaces públicas
// ─────────────────────────────────────────────

interface RiskResult {
  riskScore: number;
  riskLevel: StudentStatus;
  recommendation: string;
}

export interface RiskFactor {
  /** Valor normalizado del factor (0-1, donde 1 = mayor riesgo) */
  score: number;
  /** Peso configurado del factor sobre el score final */
  weight: number;
  /** Contribución en puntos al score total (0-100) */
  contribution: number;
  /** Causas detectadas en lenguaje natural */
  causes: string[];
}

export interface RiskExplanation {
  factors: {
    rendimiento: RiskFactor;
    progresion: RiskFactor;
    acompanamiento: RiskFactor;
  };
  riskScore: number;
  riskLevel: StudentStatus;
  recommendation: string;
  /** Acciones concretas recomendadas según el nivel de riesgo calculado */
  actionProtocol: string[];
}

// ─────────────────────────────────────────────
// Cálculo interno de factores (fuente de verdad única)
// ─────────────────────────────────────────────

interface ComputedFactors {
  F_rend: number;
  F_prog: number;
  F_acom: number;
}

function computeFactors(student: Student, followupsCount: number): ComputedFactors {
  // --- 1. Factor de Rendimiento (F_rend) ---
  const isFirstSemesterNew =
    student.semester === 1 && (student.academic_average === 0 || !student.academic_average);
  const avgRisk = isFirstSemesterNew ? 0.2 : 1 - (student.academic_average / 5.0);
  const failedRisk = Math.min((student.failed_subjects_current || 0) / 3, 1);
  const F_rend = failedRisk * 0.6 + avgRisk * 0.4;

  // --- 2. Factor de Progresión (F_prog) ---
  const enrolled = student.enrolled_credits || 16;
  const suggested = student.suggested_credits || 16;
  const creditsRisk = suggested > 0 ? Math.max(0, 1 - enrolled / suggested) : 0;
  const semesterRisk = 1 / (student.semester || 1);
  const F_prog = creditsRisk * 0.7 + semesterRisk * 0.3;

  // --- 3. Factor de Acompañamiento (F_acom) ---
  const followupsRisk = Math.min(followupsCount / 4, 1);
  const tutoriasRatio = Math.min((student.attendance_tutorias || 0) / 3, 1);
  const F_acom = followupsRisk * 0.6 + (1 - tutoriasRatio) * 0.4;

  return { F_rend, F_prog, F_acom };
}

// ─────────────────────────────────────────────
// Determinación de nivel, recomendación y protocolo
// ─────────────────────────────────────────────

const W_rend = 0.50;
const W_prog = 0.30;
const W_acom = 0.20;

function classifyRisk(
  riskScore: number,
  student: Student
): { riskLevel: StudentStatus; recommendation: string; actionProtocol: string[] } {
  if (riskScore >= 70) {
    return {
      riskLevel: 'Riesgo Alto',
      recommendation:
        'Remisión prioritaria al Director de Carrera y agendamiento obligatorio con Psicología de Bienestar.',
      actionProtocol: [
        'Agendar tutoría académica obligatoria de forma inmediata.',
        'Remitir a Bienestar Universitario para apoyo psicosocial.',
        'Notificar al Director de Carrera sobre el caso.',
        'Establecer plan de seguimiento semanal con consejero asignado.',
        'Evaluar posibilidad de cancelación de materias en riesgo.'
      ]
    };
  }

  if (riskScore >= 45) {
    return {
      riskLevel: 'Riesgo Medio',
      recommendation:
        'Agendar tutoría académica de nivelación de materias y llamada de seguimiento preventivo.',
      actionProtocol: [
        'Programar tutoría de nivelación en materias con bajo rendimiento.',
        'Realizar llamada telefónica o virtual de seguimiento preventivo.',
        'Monitorear el desempeño en el segundo corte del semestre.',
        'Registrar intervención en la bitácora del sistema.'
      ]
    };
  }

  if (riskScore >= 25) {
    return {
      riskLevel: 'Seguimiento Preventivo',
      recommendation:
        'Enviar correo preventivo de oferta de tutorías y monitorear notas del segundo corte.',
      actionProtocol: [
        'Enviar correo institucional de oferta de tutorías disponibles.',
        'Incluir en lista de monitoreo de notas del período.',
        'Verificar situación en próxima revisión de corte académico.'
      ]
    };
  }

  if (
    student.attendance_tutorias >= 2 &&
    student.failed_subjects_current === 0 &&
    student.academic_average >= 3.5
  ) {
    return {
      riskLevel: 'Recuperado',
      recommendation: 'Estudiante recuperado con éxito. Mantener monitoreo pasivo ordinario de fin de ciclo.',
      actionProtocol: [
        'Mantener monitoreo pasivo de cierre de ciclo.',
        'Felicitar al estudiante por su recuperación académica.'
      ]
    };
  }

  return {
    riskLevel: 'Estable',
    recommendation: 'Estudiante en estado óptimo y regular. Sin acciones de acompañamiento requeridas.',
    actionProtocol: [
      'Monitoreo pasivo ordinario de fin de ciclo.',
      'Sin intervención activa requerida en el período actual.'
    ]
  };
}

// ─────────────────────────────────────────────
// API pública
// ─────────────────────────────────────────────

/**
 * Calcula de forma determinista y explicable el puntaje y nivel de riesgo de un estudiante.
 *
 * @param student       Datos del estudiante a evaluar.
 * @param followupsCount Cantidad total de seguimientos históricos registrados.
 */
export function calculateRisk(student: Student, followupsCount: number): RiskResult {
  if (student.status === 'Inactivo') {
    return {
      riskScore: 100,
      riskLevel: 'Inactivo',
      recommendation: 'Estudiante inactivo en el sistema. No se requieren acciones de acompañamiento activo.'
    };
  }

  const { F_rend, F_prog, F_acom } = computeFactors(student, followupsCount);
  const rawScore = W_rend * F_rend + W_prog * F_prog + W_acom * F_acom;
  const riskScore = Math.min(Math.max(Math.round(rawScore * 100), 0), 100);
  const { riskLevel, recommendation } = classifyRisk(riskScore, student);

  return { riskScore, riskLevel, recommendation };
}

/**
 * Versión extendida de `calculateRisk` que expone el desglose completo de factores,
 * causas detectadas por dimensión y el protocolo de acción recomendado.
 *
 * @param student       Datos del estudiante a evaluar.
 * @param followupsCount Cantidad total de seguimientos históricos registrados.
 */
export function explainRisk(student: Student, followupsCount: number): RiskExplanation {
  // Caso especial: Inactivo
  if (student.status === 'Inactivo') {
    return {
      factors: {
        rendimiento: {
          score: 1,
          weight: W_rend,
          contribution: 50,
          causes: ['Estudiante inactivo en el sistema.']
        },
        progresion: { score: 1, weight: W_prog, contribution: 30, causes: [] },
        acompanamiento: { score: 1, weight: W_acom, contribution: 20, causes: [] }
      },
      riskScore: 100,
      riskLevel: 'Inactivo',
      recommendation: 'Estudiante inactivo en el sistema. No se requieren acciones de acompañamiento activo.',
      actionProtocol: ['Verificar estado de retiro o deserción en el sistema académico institucional.']
    };
  }

  const { F_rend, F_prog, F_acom } = computeFactors(student, followupsCount);
  const rawScore = W_rend * F_rend + W_prog * F_prog + W_acom * F_acom;
  const riskScore = Math.min(Math.max(Math.round(rawScore * 100), 0), 100);
  const { riskLevel, recommendation, actionProtocol } = classifyRisk(riskScore, student);

  // ── Causas de Rendimiento ──────────────────
  const rendimientoCauses: string[] = [];
  if (student.failed_subjects_current > 0) {
    rendimientoCauses.push(
      `${student.failed_subjects_current} materia(s) reprobada(s) en el semestre actual.`
    );
  }
  if (student.academic_average < 3.0 && student.academic_average > 0) {
    rendimientoCauses.push(
      `Promedio crítico de ${student.academic_average.toFixed(2)} (umbral mínimo institucional: 3.0).`
    );
  } else if (student.academic_average < 3.5 && student.academic_average > 0) {
    rendimientoCauses.push(
      `Promedio bajo de ${student.academic_average.toFixed(2)} (nivel recomendado: ≥ 3.5).`
    );
  }
  if (student.academic_trend === 'DESCENDENTE') {
    rendimientoCauses.push('Tendencia académica descendente detectada en el período actual.');
  }
  if (rendimientoCauses.length === 0) {
    rendimientoCauses.push(`Rendimiento satisfactorio. Promedio actual: ${student.academic_average.toFixed(2)}.`);
  }

  // ── Causas de Progresión ───────────────────
  const progresionCauses: string[] = [];
  const enrolled = student.enrolled_credits || 16;
  const suggested = student.suggested_credits || 16;
  if (enrolled < suggested) {
    progresionCauses.push(
      `Carga curricular reducida: ${enrolled} de ${suggested} créditos sugeridos inscritos.`
    );
  }
  if (student.semester <= 2) {
    progresionCauses.push(
      `Período crítico de inducción y adaptación universitaria (Semestre ${student.semester}°).`
    );
  }
  if (progresionCauses.length === 0) {
    progresionCauses.push(
      `Progresión curricular en rango normal (${enrolled}/${suggested} créditos inscritos).`
    );
  }

  // ── Causas de Acompañamiento ───────────────
  const acompañamientoCauses: string[] = [];
  if (student.attendance_tutorias < 2) {
    acompañamientoCauses.push(
      `Baja asistencia a tutorías institucionales (${student.attendance_tutorias} de 3 esperadas).`
    );
  }
  if (followupsCount === 0) {
    acompañamientoCauses.push('Sin historial de seguimientos o intervenciones registradas.');
  } else if (followupsCount < 3) {
    acompañamientoCauses.push(
      `Historial de acompañamiento limitado (${followupsCount} intervenciones registradas).`
    );
  }
  if (acompañamientoCauses.length === 0) {
    acompañamientoCauses.push(
      `Acompañamiento activo: ${followupsCount} seguimientos y ${student.attendance_tutorias} tutorías.`
    );
  }

  return {
    factors: {
      rendimiento: {
        score: F_rend,
        weight: W_rend,
        contribution: Math.round(W_rend * F_rend * 100),
        causes: rendimientoCauses
      },
      progresion: {
        score: F_prog,
        weight: W_prog,
        contribution: Math.round(W_prog * F_prog * 100),
        causes: progresionCauses
      },
      acompanamiento: {
        score: F_acom,
        weight: W_acom,
        contribution: Math.round(W_acom * F_acom * 100),
        causes: acompañamientoCauses
      }
    },
    riskScore,
    riskLevel,
    recommendation,
    actionProtocol
  };
}
