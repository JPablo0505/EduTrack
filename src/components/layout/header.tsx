'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, GraduationCap } from 'lucide-react';

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Inicio', subtitle: 'Panel principal del sistema' },
  '/dashboard': { title: 'Dashboard de Retención', subtitle: 'Indicadores de permanencia estudiantil' },
  '/students': { title: 'Gestión de Estudiantes', subtitle: 'Registro y seguimiento académico' },
  '/alerts': { title: 'Alertas Tempranas', subtitle: 'Detección de riesgo de deserción' },
  '/followups': { title: 'Bitácora de Seguimientos', subtitle: 'Historial de intervenciones académicas' },
};

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sincronizar el tema inicial desde la clase del HTML
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setTheme(nextTheme);
  };

  const current = routeTitles[pathname] ?? {
    title: 'EduTrack CRM',
    subtitle: 'Sistema Inteligente de Permanencia Estudiantil',
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      {/* Page Identity */}
      <div className="flex flex-col justify-center">
        <h1 className="text-base font-semibold text-foreground leading-tight tracking-tight">
          {current.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 leading-none">
          {current.subtitle}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          title="Alternar tema"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5" />
          ) : (
            <Moon className="w-4.5 h-4.5" />
          )}
        </button>

        <div className="h-5 w-px bg-border" />

        {/* Institutional Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none tracking-tight">
              Universidad NovaTech
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-none">
              Coordinación Académica
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
