'use client';

import { Brain, ShieldAlert, TrendingUp, Activity, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RiskDistributionItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
  barColor: string;
}

interface RiskEnginePanelProps {
  totalStudents: number;
  activeAlertsCount: number;     // Riesgo Alto + Riesgo Medio
  averageRiskScore: number;      // Score promedio 0-100
  retentionEstimate: number;     // % permanencia estimada
  statusCounts: Record<string, number>;
}

export function RiskEnginePanel({
  totalStudents,
  activeAlertsCount,
  averageRiskScore,
  retentionEstimate,
  statusCounts
}: RiskEnginePanelProps) {

  const riskAltoCount  = statusCounts['Riesgo Alto'] || 0;
  const riskMedioCount = statusCounts['Riesgo Medio'] || 0;
  const segPrevCount   = statusCounts['Seguimiento Preventivo'] || 0;
  const estableCount   = (statusCounts['Estable'] || 0) + (statusCounts['Recuperado'] || 0);
  const activeTotal    = totalStudents - (statusCounts['Inactivo'] || 0);

  const pct = (n: number) =>
    activeTotal > 0 ? parseFloat(((n / activeTotal) * 100).toFixed(1)) : 0;

  const distribution: RiskDistributionItem[] = [
    {
      label: 'Riesgo Alto',
      count: riskAltoCount,
      percentage: pct(riskAltoCount),
      color: 'text-red-600 dark:text-red-500',
      bgColor: 'bg-red-500/10',
      barColor: 'bg-red-500'
    },
    {
      label: 'Riesgo Medio',
      count: riskMedioCount,
      percentage: pct(riskMedioCount),
      color: 'text-amber-600 dark:text-amber-500',
      bgColor: 'bg-amber-500/10',
      barColor: 'bg-amber-500'
    },
    {
      label: 'Seguimiento Preventivo',
      count: segPrevCount,
      percentage: pct(segPrevCount),
      color: 'text-blue-600 dark:text-blue-500',
      bgColor: 'bg-blue-500/10',
      barColor: 'bg-blue-500'
    },
    {
      label: 'Estable / Recuperado',
      count: estableCount,
      percentage: pct(estableCount),
      color: 'text-emerald-600 dark:text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      barColor: 'bg-emerald-500'
    }
  ];

  // Color semafórico del score promedio
  const scoreColor =
    averageRiskScore >= 60
      ? 'text-red-500'
      : averageRiskScore >= 35
      ? 'text-amber-500'
      : 'text-emerald-500';

  const retentionColor =
    retentionEstimate >= 75
      ? 'text-emerald-500'
      : retentionEstimate >= 50
      ? 'text-amber-500'
      : 'text-red-500';

  const summaryCards = [
    {
      title: 'Críticos Detectados',
      value: activeAlertsCount.toString(),
      description: 'Estudiantes en riesgo alto o medio',
      icon: ShieldAlert,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Score Promedio',
      value: averageRiskScore.toString(),
      description: 'Índice de riesgo institucional / 100',
      icon: Activity,
      iconColor: scoreColor,
      bgColor: averageRiskScore >= 60
        ? 'bg-red-500/10'
        : averageRiskScore >= 35
        ? 'bg-amber-500/10'
        : 'bg-emerald-500/10'
    },
    {
      title: 'Permanencia Estimada',
      value: `${retentionEstimate}%`,
      description: 'Estudiantes sin riesgo activo',
      icon: TrendingUp,
      iconColor: retentionColor,
      bgColor: retentionEstimate >= 75
        ? 'bg-emerald-500/10'
        : retentionEstimate >= 50
        ? 'bg-amber-500/10'
        : 'bg-red-500/10'
    },
    {
      title: 'En Seguimiento',
      value: segPrevCount.toString(),
      description: 'Monitoreo preventivo activo',
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    }
  ];

  return (
    <Card className="border border-border bg-card shadow-xs">
      {/* Header */}
      <CardHeader className="p-4 border-b border-border">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          Motor Inteligente de Riesgo Académico
        </CardTitle>
        <p className="text-xxs text-muted-foreground mt-0.5">
          Diagnóstico calculado en tiempo real sobre los tres factores ponderados del riskEngine.
        </p>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Mini KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-background p-3.5 flex flex-col gap-2"
              >
                <div className={`w-8 h-8 rounded-lg ${card.bgColor} ${card.iconColor} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xl font-extrabold tracking-tight ${card.iconColor}`}>
                    {card.value}
                  </p>
                  <p className="text-xxs font-semibold text-muted-foreground leading-tight mt-0.5">
                    {card.title}
                  </p>
                  <p className="text-xxs text-muted-foreground/70 mt-0.5 leading-tight hidden sm:block">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Distribución de Riesgo */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Distribución de riesgo institucional
          </p>
          <div className="space-y-2.5">
            {distribution.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${item.color}`}>{item.label}</span>
                  <span className="text-muted-foreground font-medium">
                    {item.count} Est. &nbsp;·&nbsp; {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
