'use client';

import Link from 'next/link';
import { Student } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertCircle, ShieldAlert, Eye } from 'lucide-react';

interface AlertListProps {
  students: Student[];
}

export function AlertList({ students }: AlertListProps) {
  // Filtrar solo estudiantes en Riesgo Alto o Medio
  const alertStudents = students.filter(
    (student) => student.status === 'Riesgo Alto' || student.status === 'Riesgo Medio'
  );

  // Ordenar: Riesgo Alto primero, luego Riesgo Medio
  const sortedAlerts = [...alertStudents].sort((a, b) => {
    if (a.status === 'Riesgo Alto' && b.status !== 'Riesgo Alto') return -1;
    if (a.status !== 'Riesgo Alto' && b.status === 'Riesgo Alto') return 1;
    return 0;
  });

  if (sortedAlerts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">Sin alertas críticas</p>
          <p className="text-xs text-muted-foreground max-w-xs mt-0.5">
            ¡Excelente! No hay estudiantes registrados actualmente bajo niveles de riesgo alto o medio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <h3 className="font-bold text-foreground text-sm">
            Alertas Críticas de Permanencia
          </h3>
        </div>
        <span className="text-xxs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">
          {sortedAlerts.length} Estudiantes
        </span>
      </div>

      <div className="divide-y divide-border max-h-[360px] overflow-y-auto">
        {sortedAlerts.map((student) => (
          <div
            key={student.id}
            className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors text-xs"
          >
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-foreground">{student.id}</span>
                <span className="font-medium text-foreground">
                  {student.first_name} {student.last_name}
                </span>
                {student.status === 'Riesgo Alto' ? (
                  <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20 text-xxs font-semibold rounded-md px-1.5 py-px">
                    Riesgo Alto
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 text-xxs font-semibold rounded-md px-1.5 py-px">
                    Riesgo Medio
                  </Badge>
                )}
              </div>
              <p className="text-xxs text-muted-foreground truncate max-w-xs sm:max-w-md">
                {student.program_name} • Semestre {student.semester}° • Promedio: {student.academic_average.toFixed(2)}
              </p>
            </div>

            <Link
              href={`/students/${student.id}`}
              className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground shrink-0 transition-colors"
              title="Ver Perfil 360°"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
