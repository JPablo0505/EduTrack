import { NextRequest, NextResponse } from 'next/server';
import { getKPIDashboardStats } from '@/services/kpiService';

/**
 * GET /api/kpi
 * Obtiene el consolidado de KPIs globales y distribución del riesgo para el Dashboard.
 */
export async function GET(request: NextRequest) {
  try {
    const stats = getKPIDashboardStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error: any) {
    console.error('Error en GET /api/kpi:', error);
    return NextResponse.json(
      { success: false, message: 'Error al generar indicadores globales del CRM.', error: error.message },
      { status: 500 }
    );
  }
}
