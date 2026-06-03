'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FOLLOWUP_TYPES, FollowupType, Student } from '@/types';

interface FollowupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (followup: {
    student_id: string;
    type: FollowupType;
    description: string;
    advisor_name: string;
  }) => Promise<void>;
  studentId?: string;
  students?: Student[];
}

export function FollowupForm({ isOpen, onClose, onSubmit, studentId, students = [] }: FollowupFormProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formData, setFormData] = useState({
    type: 'Tutoría académica' as FollowupType,
    description: '',
    advisor_name: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync or reset selectedStudentId when dialog opens or changes
  useEffect(() => {
    if (isOpen) {
      setSelectedStudentId(studentId || '');
      setError(null);
    }
  }, [isOpen, studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const targetStudentId = studentId || selectedStudentId;

    // Validaciones básicas del lado del cliente
    if (!targetStudentId) {
      setError('Debe seleccionar un estudiante.');
      setLoading(false);
      return;
    }
    if (!formData.advisor_name.trim()) {
      setError('El nombre del consejero/docente es obligatorio.');
      setLoading(false);
      return;
    }
    if (formData.description.trim().length < 10) {
      setError('La descripción del seguimiento debe tener al menos 10 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        student_id: targetStudentId,
        ...formData
      });
      // Limpiar formulario y cerrar
      setFormData({
        type: 'Tutoría académica',
        description: '',
        advisor_name: '',
      });
      setSelectedStudentId('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al registrar la bitácora de seguimiento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Bitácora de Acompañamiento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Student selection dropdown (visible only if studentId is not pre-specified) */}
          {!studentId && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Estudiante
              </label>
              <select
                name="student_id"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Seleccione un estudiante...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} ({student.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Tipo de Intervención
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              {FOLLOWUP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Responsable / Asesor
            </label>
            <input
              type="text"
              name="advisor_name"
              value={formData.advisor_name}
              onChange={handleChange}
              placeholder="Ej: Dr. Alejandro Silva"
              className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Detalle del Seguimiento
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describa el desarrollo de la tutoría, alertas encontradas o compromisos del estudiante..."
              className="w-full p-3 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring resize-none"
              required
            />
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
              {loading ? 'Guardando...' : 'Registrar Seguimiento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
