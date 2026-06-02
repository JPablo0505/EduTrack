'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Student } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Inbox
} from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => Promise<void>;
}

export function StudentTable({ students, loading, onEdit, onDelete }: StudentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtrado de paginación
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = students.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Riesgo Alto':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20 font-semibold px-2 py-0.5 rounded-md text-xs">
            Riesgo Alto
          </Badge>
        );
      case 'Riesgo Medio':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 font-semibold px-2 py-0.5 rounded-md text-xs">
            Riesgo Medio
          </Badge>
        );
      case 'Seguimiento Preventivo':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20 font-semibold px-2 py-0.5 rounded-md text-xs">
            Preventivo
          </Badge>
        );
      case 'Estable':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20 font-semibold px-2 py-0.5 rounded-md text-xs">
            Estable
          </Badge>
        );
      case 'Recuperado':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20 font-semibold px-2 py-0.5 rounded-md text-xs">
            Recuperado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border font-semibold px-2 py-0.5 rounded-md text-xs">
            Inactivo
          </Badge>
        );
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'ASCENDENTE':
        return (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 text-xs" title="Tendencia Ascendente">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ascendente</span>
          </span>
        );
      case 'DESCENDENTE':
        return (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-500 text-xs" title="Tendencia Descendente">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Descendente</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-muted-foreground text-xs" title="Tendencia Estable">
            <Minus className="w-3.5 h-3.5" />
            <span>Estable</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 justify-between">
                <Skeleton className="h-8 w-1/5" />
                <Skeleton className="h-8 w-2/5" />
                <Skeleton className="h-8 w-1/5" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <Inbox className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">No se encontraron estudiantes</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Prueba a modificar los filtros de búsqueda o registra un nuevo estudiante en el sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
              <th className="p-4">Código</th>
              <th className="p-4">Estudiante</th>
              <th className="p-4">Programa</th>
              <th className="p-4 text-center">Sem.</th>
              <th className="p-4 text-center">Promedio</th>
              <th className="p-4 text-center">Riesgo / Alerta</th>
              <th className="p-4">Tendencia</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentItems.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-muted/10 transition-colors"
              >
                <td className="p-4 font-mono font-medium text-foreground">
                  {student.id}
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {student.program_name || `Programa #${student.program_id}`}
                </td>
                <td className="p-4 text-center text-foreground font-medium">
                  {student.semester}°
                </td>
                <td className="p-4 text-center font-semibold text-foreground">
                  {student.academic_average.toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  {getStatusBadge(student.status)}
                </td>
                <td className="p-4">{getTrendIcon(student.academic_trend)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/students/${student.id}`}
                      className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Ver perfil 360°"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onEdit(student)}
                      className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar a ${student.first_name} ${student.last_name}?`)) {
                          onDelete(student.id);
                        }
                      }}
                      className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/10 text-xs">
          <p className="text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{indexOfFirstItem + 1}</span> a{' '}
            <span className="font-semibold text-foreground">
              {Math.min(indexOfLastItem, students.length)}
            </span>{' '}
            de <span className="font-semibold text-foreground">{students.length}</span> estudiantes
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </Button>
            <span className="text-muted-foreground">
              Página <span className="font-semibold text-foreground">{currentPage}</span> de{' '}
              <span className="font-semibold text-foreground">{totalPages}</span>
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="gap-1.5"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
