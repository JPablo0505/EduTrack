'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Bell, User } from 'lucide-react';

const routeTitles: Record<string, string> = {
  '/': 'Inicio',
  '/dashboard': 'Dashboard de Retención',
  '/students': 'Gestión de Estudiantes',
  '/alerts': 'Alertas Tempranas',
  '/followups': 'Bitácora de Seguimientos',
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

  // Encontrar título de ruta o default
  const title = routeTitles[pathname] || 'EduTrack CRM';

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      {/* Title / Breadcrumb */}
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          title="Alternar tema"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications (Institutional Placeholder) */}
        <button
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors relative cursor-pointer"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full ring-2 ring-card" />
        </button>

        <div className="h-6 w-px bg-border" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">
              Dr. Alejandro Silva
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Coordinador Académico
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
