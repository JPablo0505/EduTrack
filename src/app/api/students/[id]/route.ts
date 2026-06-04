import { NextRequest, NextResponse } from 'next/server';
import { getStudentById, updateStudent, deleteStudent } from '@/services/studentService';
import { getFollowupsByStudentId } from '@/services/followupService';
import { explainRisk } from '@/services/riskEngine';

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/students/[id]
 * Devuelve el perfil 360° del estudiante (Datos + Seguimientos + Diagnóstico de Riesgo).
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const student = getStudentById(id);

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Estudiante no encontrado.' },
        { status: 404 }
      );
    }

    const followups = getFollowupsByStudentId(id);
    const explanation = explainRisk(student, followups.length);

    return NextResponse.json(
      {
        student,
        followups,
        risk: {
          score: explanation.riskScore,
          level: explanation.riskLevel,
          recommendation: explanation.recommendation,
          explanation
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error en GET /api/students/[id]:`, error);
    return NextResponse.json(
      { success: false, message: 'Error al cargar el perfil estudiantil.', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/students/[id]
 * Actualiza los datos académicos de un estudiante y recalcula el riesgo.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const studentExists = getStudentById(id);
    if (!studentExists) {
      return NextResponse.json(
        { success: false, message: 'Estudiante no encontrado.' },
        { status: 404 }
      );
    }

    updateStudent(id, body);
    const updatedStudent = getStudentById(id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Estudiante actualizado y riesgo recalculado correctamente.',
        student: updatedStudent 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error en PUT /api/students/[id]:`, error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el estudiante.', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/students/[id]
 * Elimina un estudiante y sus seguimientos asociados en cascada.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const studentExists = getStudentById(id);
    if (!studentExists) {
      return NextResponse.json(
        { success: false, message: 'Estudiante no encontrado.' },
        { status: 404 }
      );
    }

    deleteStudent(id);

    return NextResponse.json(
      { success: true, message: 'Estudiante eliminado con éxito.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error en DELETE /api/students/[id]:`, error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar el estudiante.', error: error.message },
      { status: 500 }
    );
  }
}
