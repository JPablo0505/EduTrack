'use client';

import Link from 'next/link';
import { Student } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertCircle, ShieldAlert, Eye } from 'lucide-react';

const ALERT_PROTOCOLS: Record<string, string[]> = {
  'Riesgo Alto': ['Tutoría obligatoria', 'Remisión a Bienestar', 'Notificar Director'],
  'Riesgo Medio': ['Tutoría de nivelación', 'Llamada preventiva', 'Monitorear notas'],
  'Seguimiento Preventivo': ['Correo preventivo', 'Monitoreo de corte']
};

const PROTOCOL_STYLE: Record<string, string> = {
  'Riesgo Alto': 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  'Riesgo Medio': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  'Seguimiento Preventivo': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
};

interface AlertListProps {
  students: Student[];
}

export function AlertList({ students }: AlertListProps) {
  // Filtrar estudiantes en niveles de alerta activa (Alto, Medio, Preventivo)
  const alertStudents = students.filter(
    (student) =>
      student.status === 'Riesgo Alto' ||
      student.status === 'Riesgo Medio' ||
      student.status === 'Seguimiento Preventivo'
  );

  const statusOrder: Record<string, number> = {
    'Riesgo Alto': 0,
    'Riesgo Medio': 1,
    'Seguimiento Preventivo': 2
  };

  const sortedAlerts = [...alertStudents].sort(
    (a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
  );

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
          {sortedAlerts.length} en seguimiento
        </span>
      </div>

      <div className="divide-y divide-border max-h-[360px] overflow-y-auto">
        {sortedAlerts.map((student) => (
          <div
            key={student.id}
            className="p-4 flex items-start justify-between hover:bg-muted/10 transition-colors text-xs gap-3"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              {/* Nombre y nivel */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-foreground">{student.id}</span>
                <span className="font-medium text-foreground">
                  {student.first_name} {student.last_name}
                </span>
                {student.status === 'Riesgo Alto' ? (
                  <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20 text-xxs font-semibold rounded-md px-1.5 py-px">
                    Riesgo Alto
                  </Badge>
                ) : student.status === 'Riesgo Medio' ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 text-xxs font-semibold rounded-md px-1.5 py-px">
                    Riesgo Medio
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20 text-xxs font-semibold rounded-md px-1.5 py-px">
                    Seg. Preventivo
                  </Badge>
                )}
              </div>

              {/* Info académica */}
              <p className="text-xxs text-muted-foreground truncate max-w-xs sm:max-w-md">
                {student.program_name} • Semestre {student.semester}° • Promedio: {student.academic_average.toFixed(2)}
              </p>

              {/* Chips de protocolo */}
              {ALERT_PROTOCOLS[student.status] && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {ALERT_PROTOCOLS[student.status].map((action) => (
                    <span
                      key={action}
                      className={`inline-flex items-center px-1.5 py-0.5 rounded border text-xxs font-medium ${PROTOCOL_STYLE[student.status]}`}
                    >
                      {action}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/students/${student.id}`}
              className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground shrink-0 transition-colors mt-0.5"
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
