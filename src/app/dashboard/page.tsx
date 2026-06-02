'use client';

import { useState, useEffect } from 'react';
import { Student, STUDENT_STATUSES } from '@/types';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { AlertList } from '@/components/dashboard/alert-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, GraduationCap, RefreshCw } from 'lucide-react';

interface ProgramStat {
  programId: number;
  programName: string;
  totalStudents: number;
  atRiskStudents: number;
  riskPercentage: number;
}

interface KPIData {
  totalStudents: number;
  averageAcademicPerformance: number;
  activeAlertsCount: number;
  atRiskRate: number;
  statusCounts: Record<string, number>;
  programStats: ProgramStat[];
}

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiRes, studentsRes] = await Promise.all([
        fetch('/api/kpi'),
        fetch('/api/students')
      ]);

      if (!kpiRes.ok || !studentsRes.ok) {
        throw new Error('Error al cargar métricas del CRM.');
      }

      const kpiJson = await kpiRes.json();
      const studentsJson = await studentsRes.json();

      setKpiData(kpiJson);
      setStudents(studentsJson);
    } catch (err: any) {
      setError(err.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error || !kpiData) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
        <div>
          <p className="font-bold">Error de Carga</p>
          <p className="text-xs mt-1">{error || 'No se pudieron recuperar los KPIs.'}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    'Estable': 'bg-emerald-500',
    'Seguimiento Preventivo': 'bg-blue-500',
    'Riesgo Medio': 'bg-amber-500',
    'Riesgo Alto': 'bg-red-500',
    'Recuperado': 'bg-purple-500',
    'Inactivo': 'bg-slate-400'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Dashboard de Retención
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Consolidado institucional de permanencia estudiantil y alertas preventivas.
        </p>
      </div>

      {/* KPI Row */}
      <KPICards
        totalStudents={kpiData.totalStudents}
        averageAcademicPerformance={kpiData.averageAcademicPerformance}
        activeAlertsCount={kpiData.activeAlertsCount}
        atRiskRate={kpiData.atRiskRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alerts & Status Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Alerts */}
          <AlertList students={students} />

          {/* Status Distribution */}
          <Card className="border border-border bg-card shadow-xs">
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Distribución por Estado de Retención
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {STUDENT_STATUSES.map((statusName) => {
                const count = kpiData.statusCounts[statusName] || 0;
                const percentage = kpiData.totalStudents > 0
                  ? (count / kpiData.totalStudents) * 100
                  : 0;

                return (
                  <div key={statusName} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-foreground">{statusName}</span>
                      <span className="text-muted-foreground">
                        {count} Est. ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${statusColors[statusName] || 'bg-primary'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Program Breakdown */}
        <div className="space-y-6">
          <Card className="border border-border bg-card shadow-xs h-full flex flex-col">
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4.5 h-4.5 text-primary" />
                Índice de Riesgo por Programa
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-border overflow-y-auto flex-1 text-xs">
              {kpiData.programStats.map((prog) => (
                <div key={prog.programId} className="p-4 space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-foreground truncate max-w-[180px]" title={prog.programName}>
                      {prog.programName}
                    </span>
                    <span className="text-muted-foreground shrink-0">
                      {prog.atRiskStudents}/{prog.totalStudents} Riesgo
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xxs text-muted-foreground">
                      <span>Tasa de Alerta</span>
                      <span className={`${prog.riskPercentage > 30 ? 'text-red-500 font-semibold' : ''}`}>
                        {prog.riskPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${prog.riskPercentage > 40 ? 'bg-red-500' : prog.riskPercentage > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${prog.riskPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
