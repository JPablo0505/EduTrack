'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Student, Followup, FollowupType, FOLLOWUP_TYPES } from '@/types';
import { FollowupForm } from '@/components/followups/followup-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  UserCheck,
  Building,
  GraduationCap
} from 'lucide-react';

interface FollowupWithStudent extends Followup {
  student_first_name: string;
  student_last_name: string;
  student_program_name: string;
}

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<FollowupWithStudent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  // Dialog Form State
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener followups
      const followupsRes = await fetch('/api/followups');
      if (!followupsRes.ok) throw new Error('Error al cargar las bitácoras de seguimiento.');
      const followupsData = await followupsRes.json();

      // 2. Obtener estudiantes (necesarios para el formulario)
      const studentsRes = await fetch('/api/students');
      if (!studentsRes.ok) throw new Error('Error al cargar la lista de estudiantes.');
      const studentsData = await studentsRes.json();

      setFollowups(followupsData);
      setStudents(studentsData);
    } catch (err: any) {
      setError(err.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFollowup = async (followupData: {
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

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al guardar la bitácora.');
    }

    // Refrescar lista
    fetchData();
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFollowupTypeBadge = (type: string) => {
    switch (type) {
      case 'Tutoría académica':
        return 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20';
      case 'Seguimiento docente':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'Bienestar universitario':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'Consejería académica':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'Correo institucional':
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20';
      case 'Reunión de acompañamiento':
        return 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Filtrado de followups en memoria del cliente
  const filteredFollowups = followups.filter((f) => {
    const studentFullName = `${f.student_first_name} ${f.student_last_name}`.toLowerCase();
    const studentId = f.student_id.toLowerCase();
    const advisorName = f.advisor_name.toLowerCase();
    const description = f.description.toLowerCase();
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      studentFullName.includes(query) ||
      studentId.includes(query) ||
      advisorName.includes(query) ||
      description.includes(query);

    const matchesType = !typeFilter || f.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Estadísticas rápidas para KPIs
  const totalCount = followups.length;
  const tutoriasCount = followups.filter((f) => f.type === 'Tutoría académica').length;
  const bienestarCount = followups.filter((f) => f.type === 'Bienestar universitario').length;
  const uniqueStudentsCount = new Set(followups.map((f) => f.student_id)).size;

  return (
    <div className="space-y-6">
      {/* Cabecera de Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Bitácoras de Acompañamiento
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consulta y registra el histórico de intervenciones académicas, docentes y de bienestar estudiantil.
          </p>
        </div>
        <div>
          <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" />
            Registrar Seguimiento
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Intervenciones</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : totalCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Tutorías Académicas</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : tutoriasCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Bienestar Universitario</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : bienestarCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Estudiantes Atendidos</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : uniqueStudentsCount}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Búsqueda y Filtro */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          {/* Búsqueda */}
          <div className="space-y-1 col-span-1 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              Búsqueda
            </label>
            <input
              type="text"
              placeholder="Buscar por estudiante, código, asesor o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Tipo de Seguimiento */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              Tipo de Intervención
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="">Todas las intervenciones</option>
              {FOLLOWUP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs underline font-semibold hover:text-destructive/80 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de Resultados */}
      {loading ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filteredFollowups.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">No se encontraron seguimientos</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              No existen bitácoras registradas o ninguna coincide con los filtros aplicados.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="p-4">Estudiante</th>
                  <th className="p-4">Intervención</th>
                  <th className="p-4">Detalle / Compromisos</th>
                  <th className="p-4">Responsable</th>
                  <th className="p-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFollowups.map((f) => {
                  const isExpanded = !!expandedRows[f.id];
                  return (
                    <tr key={f.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 align-top">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {f.student_first_name} {f.student_last_name}
                          </p>
                          <div className="flex flex-col gap-0.5 text-xxs text-muted-foreground">
                            <span className="font-mono font-bold">{f.student_id}</span>
                            <span>{f.student_program_name}</span>
                          </div>
                          <Link
                            href={`/students/${f.student_id}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline text-xxs font-semibold mt-1"
                          >
                            Ver perfil 360°
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </td>

                      <td className="p-4 align-top">
                        <Badge variant="outline" className={`font-semibold px-2 py-0.5 rounded-md text-xs border ${getFollowupTypeBadge(f.type)}`}>
                          {f.type}
                        </Badge>
                      </td>

                      <td className="p-4 align-top max-w-xs md:max-w-md">
                        <div className="space-y-1">
                          <p className={`text-muted-foreground text-xs leading-relaxed ${!isExpanded && 'line-clamp-2'}`}>
                            {f.description}
                          </p>
                          {f.description.length > 100 && (
                            <button
                              onClick={() => toggleRow(f.id)}
                              className="text-primary hover:text-primary/80 font-semibold text-xxs flex items-center gap-1 cursor-pointer"
                            >
                              {isExpanded ? (
                                <>
                                  Contraer <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  Expandir <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-4 align-top font-medium text-foreground">
                        {f.advisor_name}
                      </td>

                      <td className="p-4 align-top text-muted-foreground font-mono">
                        {formatDate(f.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Registro */}
      <FollowupForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateFollowup}
        students={students}
      />
    </div>
  );
}
