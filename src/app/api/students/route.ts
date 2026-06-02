import { NextRequest, NextResponse } from 'next/server';
import { getStudents, createStudent } from '@/services/studentService';
import { validateStudent, Student } from '@/types';

/**
 * GET /api/students
 * Obtiene el listado de estudiantes aplicando filtros opcionales.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') as any) || undefined;
    const programIdRaw = searchParams.get('programId');
    const programId = programIdRaw ? parseInt(programIdRaw, 10) : undefined;
    const risk = (searchParams.get('risk') as any) || undefined;

    const students = getStudents({ search, status, programId, risk });
    
    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    console.error('Error en GET /api/students:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener estudiantes.', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * Registra un nuevo estudiante en el sistema, validando sus datos.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Student;
    
    // Ejecutar validador de negocio de tipos
    const validationError = validateStudent(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    createStudent(body);
    
    return NextResponse.json(
      { success: true, message: 'Estudiante registrado y riesgo calculado con éxito.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en POST /api/students:', error);
    
    // Gestionar error de llave primaria duplicada en SQLite
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      return NextResponse.json(
        { success: false, message: 'El código del estudiante ya se encuentra registrado.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Error al registrar el estudiante.', error: error.message },
      { status: 500 }
    );
  }
}
