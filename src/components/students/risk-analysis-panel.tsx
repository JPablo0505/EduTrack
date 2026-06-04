'use client';

import { Brain, CheckCircle2, AlertCircle, Info, TrendingUp, BookOpen, HeartHandshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { RiskExplanation, RiskFactor } from '@/services/riskEngine';

interface RiskAnalysisPanelProps {
  explanation: RiskExplanation;
}

// ── Helpers visuales ──────────────────────────────────────────────────────────

function getRiskLevelStyle(level: string) {
  switch (level) {
    case 'Riesgo Alto':
      return {
        badge: 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20',
        bar: 'bg-red-500',
        label: 'text-red-600 dark:text-red-500'
      };
    case 'Riesgo Medio':
      return {
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20',
        bar: 'bg-amber-500',
        label: 'text-amber-600 dark:text-amber-500'
      };
    case 'Seguimiento Preventivo':
      return {
        badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20',
        bar: 'bg-blue-500',
        label: 'text-blue-600 dark:text-blue-500'
      };
    case 'Recuperado':
      return {
        badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20',
        bar: 'bg-purple-500',
        label: 'text-purple-600 dark:text-purple-500'
      };
    case 'Estable':
      return {
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20',
        bar: 'bg-emerald-500',
        label: 'text-emerald-600 dark:text-emerald-500'
      };
    default:
      return {
        badge: 'bg-muted text-muted-foreground border-border',
        bar: 'bg-slate-400',
        label: 'text-muted-foreground'
      };
  }
}

function getFactorBarColor(score: number) {
  if (score >= 0.65) return 'bg-red-500';
  if (score >= 0.40) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getProtocolActionStyle(level: string) {
  switch (level) {
    case 'Riesgo Alto':   return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'Riesgo Medio':  return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    case 'Seguimiento Preventivo': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    default:              return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
  }
}

// ── Sub-componente: barra de factor ───────────────────────────────────────────

interface FactorRowProps {
  icon: React.ElementType;
  label: string;
  weightLabel: string;
  factor: RiskFactor;
}

function FactorRow({ icon: Icon, label, weightLabel, factor }: FactorRowProps) {
  const barPct = Math.round(factor.score * 100);
  const barColor = getFactorBarColor(factor.score);

  return (
    <div className="space-y-2">
      {/* Encabezado */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Icon className="w-3.5 h-3.5 text-primary" />
          {label}
          <span className="text-muted-foreground font-normal">({weightLabel})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xxs">Contribución al score:</span>
          <span className={`font-bold text-xs ${barColor.replace('bg-', 'text-')}`}>
            +{factor.contribution} pts
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${barPct}%` }}
        />
      </div>

      {/* Causas detectadas */}
      <ul className="space-y-1 pl-1">
        {factor.causes.map((cause, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xxs text-muted-foreground">
            <Info className="w-3 h-3 shrink-0 mt-0.5 text-muted-foreground/60" />
            {cause}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function RiskAnalysisPanel({ explanation }: RiskAnalysisPanelProps) {
  const style = getRiskLevelStyle(explanation.riskLevel);
  const isRisk = explanation.riskLevel === 'Riesgo Alto' || explanation.riskLevel === 'Riesgo Medio';
  const protocolStyle = getProtocolActionStyle(explanation.riskLevel);

  return (
    <div className="space-y-5">

      {/* Header del panel */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Análisis Inteligente del Estudiante</h3>
        </div>
        <Badge variant="outline" className={`font-bold px-2.5 py-1 rounded-md text-xs border ${style.badge}`}>
          {explanation.riskLevel}
        </Badge>
      </div>

      {/* Score visual compacto */}
      <div className="bg-muted/40 border border-border rounded-xl p-4 flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 border-muted bg-background shrink-0">
          <span className={`text-2xl font-extrabold ${style.label}`}>{explanation.riskScore}</span>
          <span className="text-xxs text-muted-foreground font-bold">/100</span>
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-xs font-semibold text-foreground">Score de Riesgo Calculado</p>
          <p className="text-xxs text-muted-foreground leading-relaxed">
            {explanation.recommendation}
          </p>
        </div>
      </div>

      {/* Desglose de factores */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Desglose por factor del Motor de Riesgo
        </p>

        <FactorRow
          icon={BookOpen}
          label="Rendimiento Académico"
          weightLabel="50%"
          factor={explanation.factors.rendimiento}
        />

        <div className="border-t border-border" />

        <FactorRow
          icon={TrendingUp}
          label="Progresión Curricular"
          weightLabel="30%"
          factor={explanation.factors.progresion}
        />

        <div className="border-t border-border" />

        <FactorRow
          icon={HeartHandshake}
          label="Acompañamiento e Historial"
          weightLabel="20%"
          factor={explanation.factors.acompanamiento}
        />
      </div>

      {/* Protocolo de acción */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          {isRisk
            ? <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          }
          Protocolo de Acción Recomendado
        </p>
        <ol className="space-y-2">
          {explanation.actionProtocol.map((action, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs">
              <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xxs font-bold ${protocolStyle}`}>
                {i + 1}
              </span>
              <span className="text-foreground/80 leading-relaxed pt-0.5">{action}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
