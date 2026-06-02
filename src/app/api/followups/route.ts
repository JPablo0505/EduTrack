import { NextRequest, NextResponse } from 'next/server';
import { createFollowup } from '@/services/followupService';
import { getStudentById } from '@/services/studentService';
import { validateFollowup, Followup } from '@/types';

/**
 * POST /api/followups
 * Registra un nuevo seguimiento para un estudiante y recalcula su nivel de riesgo.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Followup, 'id' | 'created_at'>;

    // 1. Validar requerimiento técnico
    const validationError = validateFollowup(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    // 2. Verificar existencia del estudiante
    const student = getStudentById(body.student_id);
    if (!student) {
      return NextResponse.json(
        { success: false, message: 'El estudiante referenciado no existe.' },
        { status: 404 }
      );
    }

    // 3. Crear bitácora y disparar recálculos
    createFollowup(body);

    return NextResponse.json(
      { success: true, message: 'Seguimiento registrado y nivel de riesgo actualizado correctamente.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en POST /api/followups:', error);
    return NextResponse.json(
      { success: false, message: 'Error al registrar el seguimiento.', error: error.message },
      { status: 500 }
    );
  }
}
