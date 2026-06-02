export type AcademicTrend = 'ASCENDENTE' | 'ESTABLE' | 'DESCENDENTE';

export type StudentStatus =
  | 'Estable'
  | 'Seguimiento Preventivo'
  | 'Riesgo Medio'
  | 'Riesgo Alto'
  | 'Recuperado'
  | 'Inactivo';

export type FollowupType =
  | 'Tutoría académica'
  | 'Seguimiento docente'
  | 'Bienestar universitario'
  | 'Consejería académica'
  | 'Correo institucional'
  | 'Reunión de acompañamiento';

export interface Program {
  id: number;
  name: string;
}

export interface Student {
  id: string; // Código del estudiante (ej: NT-2024-001)
  first_name: string;
  last_name: string;
  email: string;
  program_id: number;
  semester: number;
  academic_average: number;
  enrolled_credits: number;
  suggested_credits: number;
  failed_subjects_current: number;
  attendance_tutorias: number;
  academic_trend: AcademicTrend;
  status: StudentStatus;
  program_name?: string; // Mapeado del join
}

export interface Followup {
  id: number;
  student_id: string;
  type: FollowupType;
  description: string;
  advisor_name: string;
  created_at: string;
}

export interface KPIStats {
  totalStudents: number;
  retentionRate: number;
  activeAlerts: number;
  statusCounts: Record<StudentStatus, number>;
  programDistribution: Array<{ programName: string; count: number; riskRate: number }>;
}

export const ACADEMIC_PROGRAMS = [
  'Ingeniería de Sistemas',
  'Ingeniería Civil',
  'Ingeniería Ambiental',
  'Ingeniería Mecánica',
  'Ingeniería Química',
  'Ingeniería Industrial',
  'Ingeniería Electrónica'
] as const;

export const STUDENT_STATUSES: StudentStatus[] = [
  'Estable',
  'Seguimiento Preventivo',
  'Riesgo Medio',
  'Riesgo Alto',
  'Recuperado',
  'Inactivo'
];

export const FOLLOWUP_TYPES: FollowupType[] = [
  'Tutoría académica',
  'Seguimiento docente',
  'Bienestar universitario',
  'Consejería académica',
  'Correo institucional',
  'Reunión de acompañamiento'
];

// Validadores básicos
export const validateStudent = (student: Partial<Student>): string | null => {
  if (!student.id || !student.id.match(/^NT-\d{4}-\d{3}$/)) {
    return 'El código del estudiante debe tener el formato NT-YYYY-NNN (ej: NT-2024-001).';
  }
  if (!student.first_name || student.first_name.trim().length === 0) {
    return 'El nombre es requerido.';
  }
  if (!student.last_name || student.last_name.trim().length === 0) {
    return 'El apellido es requerido.';
  }
  if (!student.email || !student.email.includes('@')) {
    return 'El correo electrónico no es válido.';
  }
  if (!student.program_id || student.program_id <= 0) {
    return 'Debe seleccionar un programa académico válido.';
  }
  if (!student.semester || student.semester < 1 || student.semester > 10) {
    return 'El semestre debe estar entre 1 y 10.';
  }
  if (
    student.academic_average === undefined ||
    student.academic_average < 0.0 ||
    student.academic_average > 5.0
  ) {
    return 'El promedio académico debe estar entre 0.0 y 5.0.';
  }
  if (!student.enrolled_credits || student.enrolled_credits <= 0) {
    return 'Los créditos inscritos deben ser mayores a 0.';
  }
  return null;
};

export const validateFollowup = (followup: Partial<Followup>): string | null => {
  if (!followup.student_id) {
    return 'El ID de estudiante es requerido.';
  }
  if (!followup.type || !FOLLOWUP_TYPES.includes(followup.type)) {
    return 'El tipo de seguimiento seleccionado no es válido.';
  }
  if (!followup.description || followup.description.trim().length < 10) {
    return 'La descripción debe tener al menos 10 caracteres.';
  }
  if (!followup.advisor_name || followup.advisor_name.trim().length === 0) {
    return 'El nombre del consejero/docente es requerido.';
  }
  return null;
};
