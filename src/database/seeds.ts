import db from '../lib/db';
import fs from 'fs';
import path from 'path';
import { ACADEMIC_PROGRAMS } from '../types';

export function runSeeds() {
  console.log('--- Iniciando Sembrado de Datos (Seeds) ---');

  // 1. Leer y aplicar el esquema de la base de datos para resetearla de forma limpia
  const schemaPath = path.join(process.cwd(), 'src', 'database', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  // Ejecutar el script SQL completo
  db.exec(schemaSql);
  console.log('Esquema de base de datos inicializado.');

  // 2. Insertar Programas Académicos
  const insertProgram = db.prepare('INSERT INTO programs (name) VALUES (?)');
  ACADEMIC_PROGRAMS.forEach((programName) => {
    insertProgram.run(programName);
  });
  console.log(`Programas académicos insertados: ${ACADEMIC_PROGRAMS.length}`);

  // Obtener IDs de programas insertados para las relaciones de estudiantes
  const programs = db.prepare('SELECT id, name FROM programs').all() as Array<{ id: number; name: string }>;
  const getProgramId = (name: string) => programs.find((p) => p.name === name)?.id || 1;

  // 3. Estudiantes y sus bitácoras de seguimiento en bloque relacional
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

  // Lista de Estudiantes Semilla con coherencia analítica y notas
  const seedStudents = [
    // --- ESTUDIANTES EN ESTABLE ---
    {
      student: {
        id: 'NT-2024-001',
        first_name: 'Alejandro',
        last_name: 'Gómez Ruiz',
        email: 'a.gomez@novatech.edu.co',
        program_id: getProgramId('Ingeniería de Sistemas'),
        semester: 3,
        academic_average: 4.5,
        enrolled_credits: 18,
        suggested_credits: 18,
        failed_subjects_current: 0,
        attendance_tutorias: 1,
        academic_trend: 'ESTABLE',
        status: 'Estable',
      },
      followups: [
        {
          type: 'Consejería académica',
          description: 'Reunión de inducción semestral ordinaria. El estudiante se encuentra motivado, con buen manejo del tiempo y sin reportar alertas académicas.',
          advisor_name: 'Dra. Patricia Cardona',
          created_at: '2026-02-10 10:00:00',
        }
      ]
    },
    {
      student: {
        id: 'NT-2023-042',
        first_name: 'Camila',
        last_name: 'Bermúdez Castro',
        email: 'c.bermudez@novatech.edu.co',
        program_id: getProgramId('Ingeniería Industrial'),
        semester: 5,
        academic_average: 4.2,
        enrolled_credits: 16,
        suggested_credits: 16,
        failed_subjects_current: 0,
        attendance_tutorias: 0,
        academic_trend: 'ASCENDENTE',
        status: 'Estable',
      },
      followups: []
    },

    // --- ESTUDIANTES EN SEGUIMIENTO PREVENTIVO ---
    {
      student: {
        id: 'NT-2025-115',
        first_name: 'Daniel',
        last_name: 'Patiño Sosa',
        email: 'd.patino@novatech.edu.co',
        program_id: getProgramId('Ingeniería Civil'),
        semester: 2,
        academic_average: 3.4,
        enrolled_credits: 18,
        suggested_credits: 18,
        failed_subjects_current: 1,
        attendance_tutorias: 1,
        academic_trend: 'DESCENDENTE',
        status: 'Seguimiento Preventivo',
      },
      followups: [
        {
          type: 'Correo institucional',
          description: 'Se envía correo preventivo debido a inasistencias reportadas en la materia Física Mecánica. El alumno responde que tuvo problemas de transporte.',
          advisor_name: 'Coordinador Juan Carlos Soto',
          created_at: '2026-03-05 14:30:00',
        },
        {
          type: 'Tutoría académica',
          description: 'Asiste a tutoría de Física Mecánica. Refuerza temas cinemáticos. El docente reporta que tiene vacíos de cálculo pero muestra interés en nivelarse.',
          advisor_name: 'Prof. Carlos Alberto Alzate',
          created_at: '2026-03-12 11:00:00',
        }
      ]
    },

    // --- ESTUDIANTES EN RIESGO MEDIO ---
    {
      student: {
        id: 'NT-2024-088',
        first_name: 'Santiago',
        last_name: 'Montoya Pérez',
        email: 's.montoya@novatech.edu.co',
        program_id: getProgramId('Ingeniería Electrónica'),
        semester: 4,
        academic_average: 3.1,
        enrolled_credits: 18,
        suggested_credits: 18,
        failed_subjects_current: 2,
        attendance_tutorias: 0,
        academic_trend: 'DESCENDENTE',
        status: 'Riesgo Medio',
      },
      followups: [
        {
          type: 'Seguimiento docente',
          description: 'El docente de Circuitos II reporta nota de 1.8 en el primer parcial acumulado. Recomienda remitir a tutorías de urgencia.',
          advisor_name: 'Prof. Nelson Martínez',
          created_at: '2026-03-20 09:15:00',
        },
        {
          type: 'Consejería académica',
          description: 'Entrevista de seguimiento académico por alerta de Circuitos. El estudiante aduce sobrecarga laboral nocturna, lo que afecta su tiempo de estudio.',
          advisor_name: 'Dra. Patricia Cardona',
          created_at: '2026-04-02 16:00:00',
        }
      ]
    },

    // --- ESTUDIANTES EN RIESGO ALTO ---
    {
      student: {
        id: 'NT-2023-102',
        first_name: 'Valentina',
        last_name: 'Cárdenas Marín',
        email: 'v.cardenas@novatech.edu.co',
        program_id: getProgramId('Ingeniería Ambiental'),
        semester: 6,
        academic_average: 2.7,
        enrolled_credits: 12,
        suggested_credits: 18,
        failed_subjects_current: 3,
        attendance_tutorias: 1,
        academic_trend: 'DESCENDENTE',
        status: 'Riesgo Alto',
      },
      followups: [
        {
          type: 'Seguimiento docente',
          description: 'Docente de Microbiología reporta que la estudiante no asistió a los últimos 3 laboratorios prácticos sin justificación.',
          advisor_name: 'Prof. Olga Lucía Ocampo',
          created_at: '2026-02-28 08:00:00',
        },
        {
          type: 'Reunión de acompañamiento',
          description: 'Reunión de alerta crítica con bienestar. Valentina reporta un cuadro severo de ansiedad e inestabilidad familiar que le impide concentrarse en su carga académica.',
          advisor_name: 'Psic. Liliana Holguín (Bienestar)',
          created_at: '2026-03-15 10:30:00',
        },
        {
          type: 'Bienestar universitario',
          description: 'Se formaliza remisión externa a psicología clínica. Se recomienda flexibilización temporal de entregas de trabajos y seguimiento cercano de directores.',
          advisor_name: 'Psic. Liliana Holguín (Bienestar)',
          created_at: '2026-03-22 15:00:00',
        },
        {
          type: 'Tutoría académica',
          description: 'Asiste a una tutoría de Microbiología. Muestra confusión con el software de simulación pero completó el laboratorio pendiente atrasado.',
          advisor_name: 'Prof. Olga Lucía Ocampo',
          created_at: '2026-04-10 14:00:00',
        }
      ]
    },

    // --- ESTUDIANTES EN RECUPERADO ---
    {
      student: {
        id: 'NT-2022-015',
        first_name: 'Mateo',
        last_name: 'Restrepo Vélez',
        email: 'm.restrepo@novatech.edu.co',
        program_id: getProgramId('Ingeniería de Sistemas'),
        semester: 7,
        academic_average: 3.9,
        enrolled_credits: 16,
        suggested_credits: 16,
        failed_subjects_current: 0,
        attendance_tutorias: 4,
        academic_trend: 'ASCENDENTE',
        status: 'Recuperado',
      },
      followups: [
        {
          type: 'Tutoría académica',
          description: 'Estudiante asiste de forma recurrente a tutorías de Estructuras de Datos. Muestra alta dedicación tras haber estado en prueba académica el semestre anterior.',
          advisor_name: 'Prof. Andrés Felipe Muñoz',
          created_at: '2025-10-12 14:00:00',
        },
        {
          type: 'Reunión de acompañamiento',
          description: 'Reunión de cierre de semestre. Se constata la aprobación de todas sus materias y el aumento significativo de su promedio semestral.',
          advisor_name: 'Dra. Patricia Cardona',
          created_at: '2025-11-20 11:30:00',
        },
        {
          type: 'Consejería académica',
          description: 'Evaluación inicial de semestre activo. El estudiante se muestra estable, con rutinas de estudio consolidadas y sin indicios de riesgo.',
          advisor_name: 'Dra. Patricia Cardona',
          created_at: '2026-02-12 09:00:00',
        }
      ]
    },

    // --- ESTUDIANTES INACTIVOS ---
    {
      student: {
        id: 'NT-2021-005',
        first_name: 'Sofía',
        last_name: 'Valencia López',
        email: 's.valencia@novatech.edu.co',
        program_id: getProgramId('Ingeniería Química'),
        semester: 8,
        academic_average: 2.1,
        enrolled_credits: 6,
        suggested_credits: 18,
        failed_subjects_current: 4,
        attendance_tutorias: 0,
        academic_trend: 'DESCENDENTE',
        status: 'Inactivo',
      },
      followups: [
        {
          type: 'Correo institucional',
          description: 'Se envían reiterados correos para reportar inactividad en el portal institucional durante las primeras 4 semanas. Sin respuesta.',
          advisor_name: 'Admisiones y Registro',
          created_at: '2026-02-25 09:00:00',
        },
        {
          type: 'Consejería académica',
          description: 'Se intenta contacto telefónico para entrevista de deserción. El número registrado está fuera de servicio. Se presume deserción formal no asistida.',
          advisor_name: 'Dra. Patricia Cardona',
          created_at: '2026-03-20 15:30:00',
        }
      ]
    }
  ];

  // Inserción en lote utilizando transacciones de better-sqlite3 para garantizar velocidad e integridad
  const transaction = db.transaction(() => {
    seedStudents.forEach(({ student, followups }) => {
      insertStudent.run(student);
      followups.forEach((followup) => {
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
