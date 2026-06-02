import { NextResponse } from 'next/server';
import { runSeeds } from '@/database/seeds';

export async function POST() {
  try {
    runSeeds();
    return NextResponse.json(
      {
        success: true,
        message: 'Base de datos inicializada y poblada con datos semilla correctamente de la Universidad NovaTech.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error al ejecutar las semillas:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ocurrió un error al reiniciar la base de datos.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
