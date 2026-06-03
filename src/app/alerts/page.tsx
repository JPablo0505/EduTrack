'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Student, StudentStatus, FollowupType } from '@/types';
import { FollowupForm } from '@/components/followups/followup-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Plus,
  ArrowRight,
  TrendingDown,
  BookOpen
} from 'lucide-react';

interface AlertStudent {
  student: Student;
  score: number;
  level: StudentStatus;
  recommendation: string;
  reasons: string[];
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');

  // Followup modal state
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error('Error al cargar las alertas tempranas.');
      const data = await res.json();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleOpenFollowup = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsFollowupOpen(true);
  };

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
      throw new Error(data.message || 'Error al registrar el seguimiento.');
    }

    // Refrescar alertas (lo cual recalculará los riesgos y potencialmente cambiará de columna al estudiante)
    fetchAlerts();
  };

  const getScoreCircleStyle = (score: number, level: string) => {
    switch (level) {
      case 'Riesgo Alto':
        return 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400 dark:border-red-500/30';
      case 'Riesgo Medio':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
      case 'Seguimiento Preventivo':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Filtrado en el cliente
  const filteredAlerts = alerts.filter((item) => {
    const fullName = `${item.student.first_name} ${item.student.last_name}`.toLowerCase();
    const code = item.student.id.toLowerCase();
    const query = search.toLowerCase().trim();
    
    const matchesSearch = !query || fullName.includes(query) || code.includes(query);
    const matchesProgram = !programFilter || item.student.program_id.toString() === programFilter;

    return matchesSearch && matchesProgram;
  });

  // Clasificación por columnas
  const highRiskStudents = filteredAlerts.filter((item) => item.level === 'Riesgo Alto');
  const mediumRiskStudents = filteredAlerts.filter((item) => item.level === 'Riesgo Medio');
  const preventiveStudents = filteredAlerts.filter((item) => item.level === 'Seguimiento Preventivo');

  // Conteos
  const totalCount = filteredAlerts.length;
  const highCount = highRiskStudents.length;
  const mediumCount = mediumRiskStudents.length;
  const preventiveCount = preventiveStudents.length;

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Alertas Tempranas y Retención
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Clasificación analítica de estudiantes con factores de vulnerabilidad académica o deserción.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAlerts} variant="outline" size="sm" className="gap-2 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Resumen Analítico */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Alertas Totales</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : totalCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Riesgo Alto</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : highCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Riesgo Medio</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : mediumCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">S. Preventivo</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {loading ? <Skeleton className="h-6 w-12" /> : preventiveCount}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Filtros */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="space-y-1 col-span-1 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              Búsqueda
            </label>
            <input
              type="text"
              placeholder="Buscar estudiante por nombre, apellido o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              Programa
            </label>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos los programas</option>
              <option value="1">Ingeniería de Sistemas</option>
              <option value="2">Ingeniería Civil</option>
              <option value="3">Ingeniería Ambiental</option>
              <option value="4">Ingeniería Mecánica</option>
              <option value="5">Ingeniería Química</option>
              <option value="6">Ingeniería Industrial</option>
              <option value="7">Ingeniería Electrónica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAlerts} className="underline text-xs font-semibold flex items-center gap-1 hover:text-destructive/80 cursor-pointer">
            <RefreshCw className="w-3 h-3" />
            Reintentar
          </button>
        </div>
      )}

      {/* Columnas de Alertas */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, colIdx) => (
            <div key={colIdx} className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMNA 1: RIESGO ALTO */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-sm">Riesgo Alto</h3>
              </div>
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 font-bold px-2 py-0.5 rounded-md text-xs">
                {highCount}
              </Badge>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {highRiskStudents.length === 0 ? (
                <EmptyColumn text="Sin alertas en riesgo alto" />
              ) : (
                highRiskStudents.map((item) => (
                  <AlertCard key={item.student.id} item={item} onAddFollowup={handleOpenFollowup} getStyle={getScoreCircleStyle} />
                ))
              )}
            </div>
          </div>

          {/* COLUMNA 2: RIESGO MEDIO */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-sm">Riesgo Medio</h3>
              </div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold px-2 py-0.5 rounded-md text-xs">
                {mediumCount}
              </Badge>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {mediumRiskStudents.length === 0 ? (
                <EmptyColumn text="Sin alertas en riesgo medio" />
              ) : (
                mediumRiskStudents.map((item) => (
                  <AlertCard key={item.student.id} item={item} onAddFollowup={handleOpenFollowup} getStyle={getScoreCircleStyle} />
                ))
              )}
            </div>
          </div>

          {/* COLUMNA 3: SEGUIMIENTO PREVENTIVO */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
                <Info className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-sm">Seguimiento Preventivo</h3>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold px-2 py-0.5 rounded-md text-xs">
                {preventiveCount}
              </Badge>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {preventiveStudents.length === 0 ? (
                <EmptyColumn text="Sin alertas preventivas" />
              ) : (
                preventiveStudents.map((item) => (
                  <AlertCard key={item.student.id} item={item} onAddFollowup={handleOpenFollowup} getStyle={getScoreCircleStyle} />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro de Seguimientos */}
      <FollowupForm
        isOpen={isFollowupOpen}
        onClose={() => {
          setIsFollowupOpen(false);
          setSelectedStudentId('');
        }}
        onSubmit={handleCreateFollowup}
        studentId={selectedStudentId}
      />
    </div>
  );
}

// Subcomponente de Tarjeta de Alerta
function AlertCard({
  item,
  onAddFollowup,
  getStyle
}: {
  item: AlertStudent;
  onAddFollowup: (id: string) => void;
  getStyle: (score: number, level: string) => string;
}) {
  return (
    <Card className="bg-card border border-border hover:border-muted-foreground/20 hover:shadow-xs transition-all duration-200">
      <CardContent className="p-4 space-y-3.5">
        {/* Cabecera Tarjeta */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <Link
              href={`/students/${item.student.id}`}
              className="font-bold text-foreground hover:underline hover:text-primary text-xs sm:text-sm leading-tight block"
            >
              {item.student.first_name} {item.student.last_name}
            </Link>
            <span className="font-mono text-xxs text-muted-foreground font-bold">{item.student.id}</span>
          </div>

          {/* Círculo de Puntuación de Riesgo */}
          <div className={`w-9 h-9 rounded-full flex flex-col items-center justify-center font-bold text-xs shrink-0 border ${getStyle(item.score, item.level)}`} title="Puntaje de Riesgo Ponderado">
            <span className="leading-none">{item.score}</span>
            <span className="text-[7px] font-medium tracking-tight mt-0.5">PTS</span>
          </div>
        </div>

        {/* Detalles Programa */}
        <div className="text-xxs text-muted-foreground leading-normal">
          {item.student.program_name || `Programa #${item.student.program_id}`} • <strong className="text-foreground font-semibold">Semestre {item.student.semester}°</strong>
        </div>

        {/* Factores de Alerta */}
        <div className="space-y-1 py-1.5 border-t border-b border-border/60">
          <span className="text-[10px] font-bold text-foreground/80 block uppercase tracking-wider">Factores Críticos:</span>
          <ul className="text-xxs text-muted-foreground list-disc pl-3.5 space-y-0.5 leading-relaxed">
            {item.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* Recomendación Institucional */}
        <div className="bg-muted/50 border border-border/80 p-2.5 rounded-lg text-xxs leading-normal">
          <span className="font-bold text-primary block mb-0.5">Recomendación NovaTech:</span>
          <p className="text-muted-foreground font-medium">{item.recommendation}</p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 pt-1">
          <Link href={`/students/${item.student.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xxs gap-1 cursor-pointer">
              <Eye className="w-3.5 h-3.5" />
              Ficha 360°
            </Button>
          </Link>
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddFollowup(item.student.id)}
            className="flex-1 text-xxs gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Atender
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Subcomponente de Columna Vacía
function EmptyColumn({ text }: { text: string }) {
  return (
    <div className="bg-muted/20 border border-dashed border-border rounded-xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center min-h-[140px] space-y-2">
      <TrendingDown className="w-5 h-5 text-muted-foreground/50" />
      <span>{text}</span>
    </div>
  );
}
