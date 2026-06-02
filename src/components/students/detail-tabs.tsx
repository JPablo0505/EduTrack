'use client';

import { useState } from 'react';
import { Student, Followup } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  Award,
  Clock,
  Plus
} from 'lucide-react';

interface DetailTabsProps {
  student: Student;
  followups: Followup[];
  risk: {
    score: number;
    level: string;
    recommendation: string;
  };
  onAddFollowupClick: () => void;
}

export function DetailTabs({ student, followups, risk, onAddFollowupClick }: DetailTabsProps) {
  const creditRatio = student.enrolled_credits / student.suggested_credits;
  const creditsPercentage = Math.min(Math.round(creditRatio * 100), 100);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Riesgo Alto':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Riesgo Medio':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Seguimiento Preventivo':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Estable':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <Tabs defaultValue="summary" className="w-full space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="followups">Seguimientos</TabsTrigger>
        <TabsTrigger value="risk">Riesgo Académico</TabsTrigger>
      </TabsList>

      {/* PESTAÑA 1: RESUMEN */}
      <TabsContent value="summary" className="space-y-6 outline-none">
        {/* Metricas Académicas Rapidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xxs font-semibold text-muted-foreground uppercase">Promedio</p>
                <p className="text-base font-bold text-foreground">{student.academic_average.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <p className="text-xxs font-semibold text-muted-foreground uppercase">Créditos Inscritos</p>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-foreground">
                    {student.enrolled_credits}/{student.suggested_credits}
                  </p>
                  <span className="text-xxs text-muted-foreground">({creditsPercentage}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xxs font-semibold text-muted-foreground uppercase">Reprobadas Actual</p>
                <p className="text-base font-bold text-foreground">{student.failed_subjects_current}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xxs font-semibold text-muted-foreground uppercase">Asistencias Tutorías</p>
                <p className="text-base font-bold text-foreground">{student.attendance_tutorias}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ficha Completa */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-border bg-card">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-foreground text-sm border-b border-border pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Información del Estudiante
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <p className="text-xxs text-muted-foreground font-medium uppercase">Código</p>
                  <p className="font-mono text-foreground font-bold">{student.id}</p>
                </div>
                <div>
                  <p className="text-xxs text-muted-foreground font-medium uppercase">Semestre</p>
                  <p className="text-foreground font-medium">{student.semester}° Semestre</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xxs text-muted-foreground font-medium uppercase">Correo Institucional</p>
                  <p className="text-foreground font-medium break-all">{student.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xxs text-muted-foreground font-medium uppercase">Programa Académico</p>
                  <p className="text-foreground font-medium">{student.program_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-foreground text-sm border-b border-border pb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                Acompañamiento Reciente
              </h3>
              <div className="text-xs space-y-3">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Último seguimiento:</span>
                  <span className="text-foreground">
                    {followups.length > 0
                      ? new Date(followups[0].created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'Ninguno registrado'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Sesiones de tutorías:</span>
                  <span className="text-foreground">{student.attendance_tutorias} asistidas</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Tendencia académica:</span>
                  <span className="font-semibold text-foreground">{student.academic_trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* PESTAÑA 2: HISTORIAL SEGUIMIENTOS */}
      <TabsContent value="followups" className="space-y-6 outline-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground text-sm">Bitácora de Intervenciones</h3>
            <p className="text-xxs text-muted-foreground">Historial detallado del acompañamiento brindado al estudiante.</p>
          </div>
          <Button onClick={onAddFollowupClick} size="sm" className="gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            Registrar Intervención
          </Button>
        </div>

        {followups.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Sin registros</p>
              <p className="text-xs text-muted-foreground max-w-xs mt-0.5">
                No hay bitácoras de tutorías ni seguimientos cargados para este estudiante.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative border-l border-border pl-6 ml-3 space-y-6">
            {followups.map((item) => (
              <div key={item.id} className="relative space-y-2">
                {/* Indicador en la linea de tiempo */}
                <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-4 border-background" />

                <div className="bg-card border border-border rounded-xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-semibold text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20 rounded-md">
                        {item.type}
                      </Badge>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <span className="text-xxs text-muted-foreground">
                      Por: <strong className="text-foreground font-semibold">{item.advisor_name}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* PESTAÑA 3: RIESGO ACADÉMICO */}
      <TabsContent value="risk" className="space-y-6 outline-none">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border border-border bg-card md:col-span-1">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">Score de Riesgo</h3>
              <div className="relative flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-muted flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-foreground">{risk.score}</span>
                  <span className="text-xxs text-muted-foreground font-bold uppercase">/ 100 PTS</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Nivel de Riesgo Calculado:</p>
                <Badge variant="outline" className={`font-bold px-3 py-1 rounded-md text-xs border ${getRiskColor(risk.level)}`}>
                  {risk.level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card md:col-span-2 flex flex-col justify-center">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-foreground text-sm border-b border-border pb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                Recomendación de Permanencia NovaTech
              </h3>
              <div className="space-y-3 text-xs leading-relaxed">
                <p className="text-foreground/80">
                  El motor de cálculo analizó ponderaciones sobre el promedio semestral, créditos perdidos y participación en tutorías, arrojando el siguiente plan estratégico de acompañamiento:
                </p>
                <div className="bg-muted/50 border border-border p-4 rounded-xl text-foreground font-medium">
                  {risk.recommendation}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
