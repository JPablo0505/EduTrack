'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Student, Followup, FollowupType } from '@/types';
import { DetailTabs } from '@/components/students/detail-tabs';
import { FollowupForm } from '@/components/followups/followup-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, GraduationCap, Mail } from 'lucide-react';

interface StudentProfileResponse {
  student: Student;
  followups: Followup[];
  risk: {
    score: number;
    level: string;
    recommendation: string;
  };
}

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = use(params); // Next.js 16/App Router dynamic params resolution

  const [data, setData] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  const fetchStudentProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/students/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Estudiante no encontrado.');
        }
        throw new Error('Error al cargar el perfil del estudiante.');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  const handleAddFollowup = async (followupData: {
    student_id: string;
    type: FollowupType;
    description: string;
    advisor_name: string;
  }) => {
    const res = await fetch('/api/followups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(followupData),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Error al guardar la bitácora.');
    }

    // Refrescar el perfil completo para obtener nuevos seguimientos y riesgo recalculado
    fetchStudentProfile();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Riesgo Alto':
        return 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20';
      case 'Riesgo Medio':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20';
      case 'Seguimiento Preventivo':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20';
      case 'Estable':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Link href="/students">
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>

        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <div>
            <p className="font-bold">Error de Carga</p>
            <p className="text-xs mt-1">{error || 'No se pudo recuperar el perfil.'}</p>
          </div>
          <button
            onClick={fetchStudentProfile}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { student, followups, risk } = data;

  return (
    <div className="space-y-6">
      {/* Botón de Retorno */}
      <div>
        <Link href="/students">
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Volver al listado
          </Button>
        </Link>
      </div>

      {/* Ficha Encabezado Estudiante */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {student.first_name} {student.last_name}
              </h2>
              <Badge variant="outline" className={`font-bold px-2 py-0.5 rounded-md text-xs border ${getRiskColor(student.status)}`}>
                {student.status}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground font-bold">{student.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              {student.program_name} • Semestre {student.semester}°
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {student.email}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setIsFollowupOpen(true)} size="sm" className="cursor-pointer">
            Registrar Seguimiento
          </Button>
        </div>
      </div>

      {/* Detalle en Pestañas */}
      <DetailTabs
        student={student}
        followups={followups}
        risk={risk}
        onAddFollowupClick={() => setIsFollowupOpen(true)}
      />

      {/* Modal de Registro de Seguimientos */}
      <FollowupForm
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        onSubmit={handleAddFollowup}
        studentId={student.id}
      />
    </div>
  );
}

// Subcomponente de esqueleto de carga
function CardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 w-full bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="h-10 w-full max-w-md bg-muted rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 md:col-span-2 w-full" />
      </div>
    </div>
  );
}
