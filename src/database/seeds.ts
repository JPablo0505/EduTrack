import db from '../lib/db';
import fs from 'fs';
import path from 'path';
import { ACADEMIC_PROGRAMS, StudentStatus, FollowupType } from '../types';

export function runSeeds() {
  console.log('--- Iniciando Sembrado de Datos (Seeds) ---');

  // 1. Leer y aplicar el esquema de la base de datos para resetearla de forma limpia
  const schemaPath = path.join(process.cwd(), 'src', 'database', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schemaSql);
  console.log('Esquema de base de datos inicializado.');

  // 2. Insertar Programas Académicos
  const insertProgram = db.prepare('INSERT INTO programs (name) VALUES (?)');
  ACADEMIC_PROGRAMS.forEach((programName) => {
    insertProgram.run(programName);
  });
  console.log(`Programas académicos insertados: ${ACADEMIC_PROGRAMS.length}`);

  // Names lists (60 unique combinations)
  const FIRST_NAMES = [
    'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Luisa', 'Andrés', 'Camila', 'Santiago', 'Valentina',
    'Mateo', 'Sofía', 'Daniel', 'Daniela', 'Alejandro', 'Alejandra', 'Felipe', 'Gabriela', 'Sebastián', 'Isabella',
    'Nicolás', 'Manuela', 'Diego', 'Paula', 'Javier', 'Natalia', 'Esteban', 'Valeria', 'Miguel', 'Lucía',
    'Jorge', 'Carolina', 'Fernando', 'Diana', 'Ricardo', 'Sara', 'David', 'Adriana', 'Gustavo', 'Elena',
    'Mauricio', 'Claudia', 'Oscar', 'Liliana', 'Héctor', 'Patricia', 'Julio', 'Mónica', 'Francisco', 'Beatriz',
    'Hugo', 'Irene', 'Eduardo', 'Gloria', 'César', 'Silvia', 'Raúl', 'Martha', 'Álvaro', 'Verónica'
  ];

  const LAST_NAMES = [
    'Gómez', 'Rodríguez', 'Pérez', 'Fernández', 'Martínez', 'García', 'González', 'López', 'Sánchez', 'Ramírez',
    'Díaz', 'Vásquez', 'Restrepo', 'Castro', 'Torres', 'Ruiz', 'Morales', 'Herrera', 'Giraldo', 'Medina',
    'Cardona', 'Muñoz', 'Silva', 'Ríos', 'Ortega', 'Mendoza', 'Delgado', 'Vega', 'Rojas', 'Marín',
    'Soto', 'Salazar', 'Bermúdez', 'Cárdenas', 'Ocampo', 'Vélez', 'Alzate', 'Patiño', 'Villa', 'Guerra',
    'Montoya', 'Jaramillo', 'Bedoya', 'Londoño', 'Henao', 'Agudelo', 'Cano', 'Flórez', 'Escobar', 'Uribe',
    'Arango', 'Zapata', 'Gallego', 'Suárez', 'Pinzón', 'Duque', 'Guerrero', 'Rendón', 'Bustamante', 'Palacio'
  ];

  // Materias por programa académico para dar coherencia
  const MATERIAS_POR_PROGRAMA: Record<number, string[]> = {
    1: ['Estructuras de Datos', 'Cálculo Integral', 'Programación Orientada a Objetos'], // Sistemas
    2: ['Análisis Estructural', 'Resistencia de Materiales', 'Geotecnia'],              // Civil
    3: ['Microbiología Ambiental', 'Química del Agua', 'Impacto Ambiental'],             // Ambiental
    4: ['Termodinámica', 'Mecánica de Fluidos', 'Diseño de Máquinas'],                   // Mecánica
    5: ['Cinética Química', 'Operaciones Unitarias', 'Fisicoquímica'],                   // Química
    6: ['Investigación de Operaciones', 'Gestión de Calidad', 'Logística y Distribución'],// Industrial
    7: ['Circuitos II', 'Electrónica Analógica', 'Sistemas Digitales']                   // Electrónica
  };

  const getMateriaRandom = (progId: number, index: number) => {
    const list = MATERIAS_POR_PROGRAMA[progId] || ['Matemáticas Básicas'];
    return list[index % list.length];
  };

  // Definición exacta de cantidades para cumplir con los porcentajes de distribución de riesgo
  // Total: 60 estudiantes
  // Estable: 30 (50% del total, 54.5% de activos)
  // Seguimiento Preventivo: 14 (23.3% del total, 25.5% de activos)
  // Riesgo Medio: 8 (13.3% del total, 14.5% de activos)
  // Riesgo Alto: 3 (5% del total, 5.5% de activos)
  // Recuperado: 3 (5% del total)
  // Inactivo: 2 (3.3% del total)
  const seedSpecs: { status: StudentStatus; count: number }[] = [
    { status: 'Estable', count: 30 },
    { status: 'Seguimiento Preventivo', count: 14 },
    { status: 'Riesgo Medio', count: 8 },
    { status: 'Riesgo Alto', count: 3 },
    { status: 'Recuperado', count: 3 },
    { status: 'Inactivo', count: 2 }
  ];

  let studentIndex = 0;
  const seedStudents: any[] = [];

  seedSpecs.forEach(({ status, count }) => {
    for (let j = 0; j < count; j++) {
      const idx = studentIndex;
      const firstName = FIRST_NAMES[idx % FIRST_NAMES.length];
      const lastName = LAST_NAMES[idx % LAST_NAMES.length];
      const email = `${firstName.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')}.${lastName.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')}@novatech.edu.co`;
      
      const programId = (idx % 7) + 1; // Distribución equitativa entre programas 1 a 7
      
      // Código de estudiante correlativo con el año de ingreso realista
      const year = 2026 - Math.floor(idx / 15) - 1; // Genera ingresos entre 2021 y 2025
      const studentCode = `NT-${year}-${String(idx + 1).padStart(3, '0')}`;

      // Configuración de métricas según el estado para pasar el cálculo del motor de riesgo (calculateRisk)
      let semester = 3;
      let academicAverage = 4.2;
      let enrolledCredits = 18;
      let suggestedCredits = 18;
      let failedSubjectsCurrent = 0;
      let attendanceTutorias = 0;
      let academicTrend = 'ESTABLE';
      const followups: any[] = [];

      if (status === 'Estable') {
        // Estudiantes estables: buen promedio, sin reprobadas, créditos al día
        semester = (idx % 8) + 2; // Semestres 2 a 9
        academicAverage = parseFloat((3.8 + (idx % 12) * 0.1).toFixed(2)); // 3.8 a 4.9
        enrolledCredits = idx % 2 === 0 ? 18 : 16;
        suggestedCredits = enrolledCredits;
        failedSubjectsCurrent = 0;
        attendanceTutorias = idx % 3 === 0 ? 1 : 0;
        academicTrend = idx % 4 === 0 ? 'ASCENDENTE' : 'ESTABLE';
        
        // Un solo seguimiento de consejería regular o ninguno
        if (idx % 3 === 0) {
          followups.push({
            type: 'Consejería académica',
            description: `Sesión de inducción y planeación de matrícula para el semestre. El estudiante manifiesta motivación por sus cursos y excelente adaptación al campus.`,
            advisor_name: 'Dra. Patricia Cardona',
            created_at: `2026-02-${String(10 + (idx % 15)).padStart(2, '0')} 10:00:00`
          });
        }
      } 
      else if (status === 'Seguimiento Preventivo') {
        // Seguimiento preventivo: alertas leves o baja asistencia a tutorías
        semester = (idx % 4) + 1; // Semestres 1 a 4 (mayor peso en primeros semestres)
        academicAverage = parseFloat((3.3 + (idx % 5) * 0.1).toFixed(2)); // 3.3 a 3.7
        enrolledCredits = 16;
        suggestedCredits = 18; // Leve rezago de créditos
        failedSubjectsCurrent = idx % 3 === 0 ? 1 : 0; // Algunas veces 1 reprobada
        attendanceTutorias = 1;
        academicTrend = 'ESTABLE';

        const materia = getMateriaRandom(programId, idx);
        
        followups.push({
          type: 'Correo institucional',
          description: `Se envía alerta institucional preventiva automática al detectar promedio ponderado cercano al límite de permanencia. Se le insta a programar tutorías.`,
          advisor_name: 'Admisiones y Registro',
          created_at: `2026-03-${String(2 + (idx % 10)).padStart(2, '0')} 14:00:00`
        });

        if (idx % 2 === 0) {
          followups.push({
            type: 'Tutoría académica',
            description: `Asiste a la primera tutoría de nivelación de la materia ${materia}. Demuestra compromiso en superar los vacíos matemáticos detectados en el parcial.`,
            advisor_name: 'Prof. Carlos Alberto Alzate',
            created_at: `2026-03-${String(12 + (idx % 10)).padStart(2, '0')} 11:30:00`
          });
        }
      } 
      else if (status === 'Riesgo Medio') {
        // Riesgo medio: promedio bajo, materias perdidas
        semester = (idx % 4) + 2; // Semestres 2 a 5
        academicAverage = parseFloat((2.8 + (idx % 4) * 0.1).toFixed(2)); // 2.8 a 3.1
        enrolledCredits = idx % 2 === 0 ? 14 : 12;
        suggestedCredits = 18; // Rezago de créditos
        failedSubjectsCurrent = 2; // 2 materias perdidas
        attendanceTutorias = 0;
        academicTrend = 'DESCENDENTE';

        const materia = getMateriaRandom(programId, idx);
        const materia2 = getMateriaRandom(programId, idx + 1);

        followups.push({
          type: 'Seguimiento docente',
          description: `Reporte de alerta temprana: el estudiante reprobó el primer corte en las materias ${materia} y ${materia2}. Manifiesta vacíos del ciclo previo.`,
          advisor_name: 'Coordinación Académica',
          created_at: `2026-03-${String(15 + (idx % 5)).padStart(2, '0')} 09:00:00`
        });

        followups.push({
          type: 'Consejería académica',
          description: `Entrevista presencial para indagar factores del bajo rendimiento. Expresa dificultades para organizar sus horarios de estudio debido a responsabilidades en casa.`,
          advisor_name: 'Dra. Patricia Cardona',
          created_at: `2026-04-${String(2 + (idx % 5)).padStart(2, '0')} 15:30:00`
        });
      } 
      else if (status === 'Riesgo Alto') {
        // Riesgo alto: promedio crítico, múltiples reprobadas
        semester = (idx % 3) + 1; // Semestres 1 a 3
        academicAverage = parseFloat((2.1 + (idx % 4) * 0.1).toFixed(2)); // 2.1 a 2.4
        enrolledCredits = 10;
        suggestedCredits = 18; // Alta pérdida de velocidad
        failedSubjectsCurrent = 3; // 3 materias perdidas
        attendanceTutorias = 1;
        academicTrend = 'DESCENDENTE';

        const materia = getMateriaRandom(programId, idx);

        followups.push({
          type: 'Seguimiento docente',
          description: `El estudiante registra fallas consecutivas en las clases de ${materia} y no ha presentado los últimos talleres evaluativos del corte.`,
          advisor_name: 'Coordinador Juan Carlos Soto',
          created_at: `2026-03-${String(10 + (idx % 3)).padStart(2, '0')} 08:30:00`
        });

        followups.push({
          type: 'Reunión de acompañamiento',
          description: `Citación de urgencia con Bienestar Universitario. El alumno manifiesta estar pasando por problemas emocionales y familiares severos que limitan su capacidad de estudio.`,
          advisor_name: 'Psic. Liliana Holguín (Bienestar)',
          created_at: `2026-03-${String(22 + (idx % 3)).padStart(2, '0')} 10:00:00`
        });

        followups.push({
          type: 'Bienestar universitario',
          description: `Se activa protocolo de remisión psicológica y acompañamiento académico especial. Se aconseja flexibilización curricular temporal y seguimiento semanal.`,
          advisor_name: 'Psic. Liliana Holguín (Bienestar)',
          created_at: `2026-04-${String(5 + (idx % 3)).padStart(2, '0')} 16:00:00`
        });
      } 
      else if (status === 'Recuperado') {
        // Recuperados: asistencias a tutorías, sin reprobadas actuales, promedio aceptable
        semester = (idx % 5) + 4; // Semestres 4 a 8
        academicAverage = parseFloat((3.6 + (idx % 4) * 0.1).toFixed(2)); // 3.6 a 3.9
        enrolledCredits = 16;
        suggestedCredits = 16;
        failedSubjectsCurrent = 0;
        attendanceTutorias = 4; // Alto número de asistencias
        academicTrend = 'ASCENDENTE';

        const materia = getMateriaRandom(programId, idx);

        followups.push({
          type: 'Tutoría académica',
          description: `Estudiante asiste semanalmente a las asesorías de ${materia}. Ha superado satisfactoriamente los vacíos y niveló sus notas conceptuales.`,
          advisor_name: 'Prof. Andrés Felipe Muñoz',
          created_at: `2025-10-${String(10 + (idx % 10)).padStart(2, '0')} 14:00:00`
        });

        followups.push({
          type: 'Reunión de acompañamiento',
          description: `Sesión de cierre de semestre: se verifica el levantamiento del estado de prueba académica tras haber aprobado con éxito todo su plan de estudios del ciclo.`,
          advisor_name: 'Dra. Patricia Cardona',
          created_at: `2025-11-${String(20 + (idx % 5)).padStart(2, '0')} 11:00:00`
        });

        followups.push({
          type: 'Consejería académica',
          description: `Entrevista de control. El estudiante presenta hábitos de estudio estructurados y reporta absoluta estabilidad. Se retira del monitoreo de riesgo activo.`,
          advisor_name: 'Dra. Patricia Cardona',
          created_at: `2026-02-${String(15 + (idx % 5)).padStart(2, '0')} 09:30:00`
        });
      } 
      else if (status === 'Inactivo') {
        // Inactivo: deserción confirmada, notas muy bajas
        semester = (idx % 5) + 2; // Semestres 2 a 6
        academicAverage = parseFloat((1.5 + (idx % 6) * 0.1).toFixed(2)); // 1.5 a 2.0
        enrolledCredits = 4;
        suggestedCredits = 18;
        failedSubjectsCurrent = 4;
        attendanceTutorias = 0;
        academicTrend = 'DESCENDENTE';

        followups.push({
          type: 'Correo institucional',
          description: `Alerta por inactividad física y digital. El alumno no registra ingresos a la plataforma educativa durante el primer bloque del semestre académico.`,
          advisor_name: 'Admisiones y Registro',
          created_at: `2026-02-${String(18 + (idx % 5)).padStart(2, '0')} 11:00:00`
        });

        followups.push({
          type: 'Consejería académica',
          description: `Intento de llamada telefónica de rescate para programar cita de retiro oficial. No se logra contacto (teléfono suspendido). Se declara inactividad.`,
          advisor_name: 'Dra. Patricia Cardona',
          created_at: `2026-03-${String(15 + (idx % 5)).padStart(2, '0')} 14:30:00`
        });
      }

      seedStudents.push({
        student: {
          id: studentCode,
          first_name: firstName,
          last_name: lastName,
          email,
          program_id: programId,
          semester,
          academic_average: academicAverage,
          enrolled_credits: enrolledCredits,
          suggested_credits: suggestedCredits,
          failed_subjects_current: failedSubjectsCurrent,
          attendance_tutorias: attendanceTutorias,
          academic_trend: academicTrend,
          status,
        },
        followups
      });

      studentIndex++;
    }
  });

  // 3. Sentencias de inserción preparadas
  const insertStudent = db.prepare(`
    INSERT INTO students (
      id, first_name, last_name, email, program_id, semester, 
      academic_average, enrolled_credits, suggested_credits, 
      failed_subjects_current, attendance_tutorias, academic_trend, status
    ) VALUES (
      @id, @first_name, @last_name, @email, @program_id, @semester, 
      @academic_average, @enrolled_credits, @suggested_credits, 
      @failed_subjects_current, @attendance_tutorias, @academic_trend, @status
    )
  `);

  const insertFollowup = db.prepare(`
    INSERT INTO followups (
      student_id, type, description, advisor_name, created_at
    ) VALUES (
      @student_id, @type, @description, @advisor_name, @created_at
    )
  `);

  // Inserción en lote utilizando transacciones de better-sqlite3 para garantizar velocidad e integridad
  const transaction = db.transaction(() => {
    seedStudents.forEach(({ student, followups }) => {
      insertStudent.run(student);
      followups.forEach((followup: any) => {
        insertFollowup.run({
          student_id: student.id,
          type: followup.type,
          description: followup.description,
          advisor_name: followup.advisor_name,
          created_at: followup.created_at,
        });
      });
    });
  });

  transaction();
  console.log('Semillas de Estudiantes y Seguimientos insertadas con éxito.');
  console.log('--- Sembrado Completado ---');
}
