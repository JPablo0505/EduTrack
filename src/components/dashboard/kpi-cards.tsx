'use client';

import { Users, GraduationCap, AlertTriangle, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPICardsProps {
  totalStudents: number;
  averageAcademicPerformance: number;
  activeAlertsCount: number;
  atRiskRate: number;
}

export function KPICards({
  totalStudents,
  averageAcademicPerformance,
  activeAlertsCount,
  atRiskRate
}: KPICardsProps) {
  const cards = [
    {
      title: 'Matrícula Total',
      value: totalStudents.toString(),
      description: 'Estudiantes activos y registrados',
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Promedio Académico',
      value: averageAcademicPerformance.toFixed(2),
      description: 'Promedio global semestral',
      icon: GraduationCap,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Alertas Críticas',
      value: activeAlertsCount.toString(),
      description: 'Riesgo alto y medio activo',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Tasa de Riesgo',
      value: `${atRiskRate}%`,
      description: 'Índice general de deserción',
      icon: Percent,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="border border-border bg-card shadow-xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground tracking-tight">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  {card.value}
                </h3>
                <p className="text-xxs text-muted-foreground">{card.description}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} ${card.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
