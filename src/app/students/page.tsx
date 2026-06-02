'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/types';
import { StudentTable } from '@/components/students/student-table';
import { StudentForm } from '@/components/students/student-form';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros y búsqueda
  const [search, setSearch] = useState('');
  const [programId, setProgramId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [risk, setRisk] = useState<string>('');

  // Estados para abrir el modal y el estudiante seleccionado
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search);
      if (programId) params.append('programId', programId);
      if (status) params.append('status', status);
      if (risk) params.append('risk', risk);

      const res = await fetch(`/api/students?${params.toString()}`);
      if (!res.ok) throw new Error('Error al cargar los estudiantes.');
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estudiantes al montar el componente o cuando cambian los filtros
  useEffect(() => {
    fetchStudents();
  }, [programId, status, risk]);

  // Manejador del botón Buscar (para evitar sobrecargar peticiones mientras se escribe)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleCreateOrUpdate = async (studentData: Student) => {
    const isEdit = !!editingStudent;
    const url = isEdit ? `/api/students/${editingStudent.id}` : '/api/students';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al guardar los datos del estudiante.');
    }

    // Refrescar el listado después de crear o editar
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al eliminar el estudiante.');
      }
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Gestión de Estudiantes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitorea el progreso, rendimiento académico e inicia acciones preventivas de retención.
          </p>
        </div>
        <div>
          <Button onClick={handleCreateClick} size="sm" className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" />
            Registrar Estudiante
          </Button>
        </div>
      </div>

      {/* Panel de Filtros y Búsqueda */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
          {/* Búsqueda */}
          <div className="space-y-1 col-span-1 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              Búsqueda
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre, apellido o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-3 pr-16 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-6 px-2.5 bg-primary text-primary-foreground text-xxs font-medium rounded-md hover:bg-primary/95 transition-all cursor-pointer"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Programa */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              Programa
            </label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
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

          {/* Nivel de Riesgo */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Nivel Riesgo</label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos los riesgos</option>
              <option value="Alto">Riesgo Alto</option>
              <option value="Medio">Riesgo Medio</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Estable">Estable</option>
            </select>
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos los estados</option>
              <option value="Estable">Estable</option>
              <option value="Seguimiento Preventivo">Seguimiento Preventivo</option>
              <option value="Riesgo Medio">Riesgo Medio</option>
              <option value="Riesgo Alto">Riesgo Alto</option>
              <option value="Recuperado">Recuperado</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchStudents}
            className="flex items-center gap-1.5 text-xs underline font-semibold hover:text-destructive/80"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de Estudiantes */}
      <StudentTable
        students={students}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* Formulario Modal (Crear / Editar) */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        student={editingStudent}
      />
    </div>
  );
}
