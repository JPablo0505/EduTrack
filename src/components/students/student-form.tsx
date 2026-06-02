'use client';

import { useState, useEffect } from 'react';
import { Student, AcademicTrend } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Student) => Promise<void>;
  student?: Student | null; // Si se edita, pasamos los datos
}

export function StudentForm({ isOpen, onClose, onSubmit, student }: StudentFormProps) {
  const [formData, setFormData] = useState<Partial<Student>>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    program_id: 1,
    semester: 1,
    academic_average: 4.0,
    enrolled_credits: 16,
    suggested_credits: 16,
    failed_subjects_current: 0,
    attendance_tutorias: 0,
    academic_trend: 'ESTABLE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos cuando está en modo edición
  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        program_id: 1,
        semester: 1,
        academic_average: 4.0,
        enrolled_credits: 16,
        suggested_credits: 16,
        failed_subjects_current: 0,
        attendance_tutorias: 0,
        academic_trend: 'ESTABLE',
      });
    }
    setError(null);
  }, [student, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'program_id' ||
        name === 'semester' ||
        name === 'enrolled_credits' ||
        name === 'suggested_credits' ||
        name === 'failed_subjects_current' ||
        name === 'attendance_tutorias'
          ? parseInt(value, 10) || 0
          : name === 'academic_average'
          ? parseFloat(value) || 0.0
          : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones del lado del cliente
    if (!student && (!formData.id || !formData.id.match(/^NT-\d{4}-\d{3}$/))) {
      setError('El código debe tener el formato NT-YYYY-NNN (ej: NT-2024-001).');
      setLoading(false);
      return;
    }
    if (!formData.first_name?.trim()) {
      setError('El nombre es obligatorio.');
      setLoading(false);
      return;
    }
    if (!formData.last_name?.trim()) {
      setError('El apellido es obligatorio.');
      setLoading(false);
      return;
    }
    if (!formData.email?.includes('@')) {
      setError('El correo electrónico debe ser válido.');
      setLoading(false);
      return;
    }
    if (
      formData.academic_average === undefined ||
      formData.academic_average < 0.0 ||
      formData.academic_average > 5.0
    ) {
      setError('El promedio académico debe estar entre 0.0 y 5.0.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData as Student);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar el estudiante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Editar Estudiante' : 'Registrar Estudiante'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Código Estudiante
              </label>
              <input
                type="text"
                name="id"
                disabled={!!student}
                value={formData.id}
                onChange={handleChange}
                placeholder="NT-2024-001"
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@novatech.edu"
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">Nombres</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Juan Carlos"
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">Apellidos</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Pérez Gómez"
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Programa Académico
              </label>
              <select
                name="program_id"
                value={formData.program_id}
                onChange={handleChange}
                className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value={1}>Ingeniería de Sistemas</option>
                <option value={2}>Ingeniería Civil</option>
                <option value={3}>Ingeniería Ambiental</option>
                <option value={4}>Ingeniería Mecánica</option>
                <option value={5}>Ingeniería Química</option>
                <option value={6}>Ingeniería Industrial</option>
                <option value={7}>Ingeniería Electrónica</option>
              </select>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">Semestre</label>
              <input
                type="number"
                name="semester"
                min={1}
                max={10}
                value={formData.semester}
                onChange={handleChange}
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Promedio Semestral
              </label>
              <input
                type="number"
                name="academic_average"
                step="0.01"
                min="0.0"
                max="5.0"
                value={formData.academic_average}
                onChange={handleChange}
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Tendencia Académica
              </label>
              <select
                name="academic_trend"
                value={formData.academic_trend}
                onChange={handleChange}
                className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="ASCENDENTE">Ascendente</option>
                <option value="ESTABLE">Estable</option>
                <option value="DESCENDENTE">Descendente</option>
              </select>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Créditos Inscritos
              </label>
              <input
                type="number"
                name="enrolled_credits"
                min={1}
                value={formData.enrolled_credits}
                onChange={handleChange}
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Créditos Sugeridos
              </label>
              <input
                type="number"
                name="suggested_credits"
                min={1}
                value={formData.suggested_credits}
                onChange={handleChange}
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Materias Reprobadas
              </label>
              <input
                type="number"
                name="failed_subjects_current"
                min={0}
                value={formData.failed_subjects_current}
                onChange={handleChange}
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Asistencia a Tutorías
              </label>
              <input
                type="number"
                name="attendance_tutorias"
                min={0}
                value={formData.attendance_tutorias}
                onChange={handleChange}
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Guardando...' : student ? 'Guardar Cambios' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
