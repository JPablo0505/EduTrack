import Link from 'next/link';
import {
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-12">
      {/* 1. Hero Institucional */}
      <section className="bg-card rounded-2xl border border-border p-8 md:p-12 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="max-w-2xl relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <GraduationCap className="w-3.5 h-3.5" />
            Sistema de Retención & Acompañamiento
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Garantizando el éxito académico y la permanencia estudiantil
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            EduTrack CRM es la plataforma institucional de la Universidad NovaTech diseñada para identificar de manera temprana el riesgo académico, coordinar tutorías personalizadas y potenciar la retención de nuestros estudiantes.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all shadow-xs cursor-pointer text-sm"
            >
              Acceder al Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/students"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 border border-border transition-all cursor-pointer text-sm"
            >
              Ver Estudiantes
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ¿Qué es EduTrack? */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            ¿Qué es EduTrack CRM?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Un ecosistema integral que conecta datos académicos y de bienestar para ofrecer un perfil 360° de cada estudiante.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Perfil 360°</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Consolidación centralizada de promedios, créditos matriculados, materias reprobadas, tutorías asistidas e historial de seguimientos en tiempo real.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Predicción de Riesgo</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Motor de analítica integrado que evalúa el rendimiento, la progresión y el acompañamiento para clasificar alertas preventivas de deserción.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Bitácora Dinámica</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Registro histórico y sistemático de las intervenciones realizadas por consejeros, psicólogos y docentes del campus.
            </p>
          </div>
        </div>
      </section>

      {/* 3. KPIs y Alertas Tempranas */}
      <section className="bg-card border border-border rounded-xl p-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Motor de Alertas Tempranas
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nuestros algoritmos evalúan automáticamente a cada estudiante bajo tres pilares fundamentales ponderados:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2 border-l-2 border-primary/40 pl-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Rendimiento (50%)</div>
            <h3 className="font-bold text-foreground">Promedio & Pérdida</h3>
            <p className="text-xs text-muted-foreground">
              Monitorea el promedio ponderado del semestre actual y el volumen de asignaturas reprobadas.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-primary/40 pl-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Progresión (30%)</div>
            <h3 className="font-bold text-foreground">Carga Académica</h3>
            <p className="text-xs text-muted-foreground">
              Mide la relación de créditos inscritos frente a los sugeridos y la tendencia del desempeño estudiantil.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-primary/40 pl-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Acompañamiento (20%)</div>
            <h3 className="font-bold text-foreground">Participación Activa</h3>
            <p className="text-xs text-muted-foreground">
              Valora la asistencia del estudiante a tutorías académicas institucionales programadas.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Beneficios Institucionales */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Beneficios Institucionales
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Optimizando la labor de coordinación académica y la atención estudiantil.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex gap-4 p-5 bg-card border border-border rounded-xl">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Toma de decisiones basada en datos</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visualización clara de KPIs globales para decanos y coordinadores de permanencia.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-card border border-border rounded-xl">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Optimización de tutorías</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Canalización inmediata de estudiantes con riesgo alto hacia consejerías y mentorías prioritarias.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-card border border-border rounded-xl">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Trazabilidad histórica completa</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Historial robusto e inmutable de seguimientos para analizar la efectividad de las intervenciones.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-card border border-border rounded-xl">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Prevención temprana y oportuna</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Detección oportuna antes de finalizar el periodo académico para evitar reprobación y deserción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Proceso del Sistema */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            El Proceso EduTrack
          </h2>
          <p className="text-sm text-muted-foreground">
            Un ciclo continuo de monitoreo y soporte al estudiante.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="bg-card border border-border rounded-xl p-5 relative">
            <div className="absolute -top-3 left-4 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">1</div>
            <h4 className="font-bold text-sm text-foreground mt-2 mb-1">Registro de Datos</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Matrícula, rendimiento histórico y promedios actualizados.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 relative">
            <div className="absolute -top-3 left-4 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">2</div>
            <h4 className="font-bold text-sm text-foreground mt-2 mb-1">Cálculo de Riesgo</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">El motor de riesgo evalúa y categoriza al estudiante.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 relative">
            <div className="absolute -top-3 left-4 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">3</div>
            <h4 className="font-bold text-sm text-foreground mt-2 mb-1">Alerta Temprana</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Clasificación en semáforo de alertas (Riesgo Alto y Medio).</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 relative">
            <div className="absolute -top-3 left-4 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">4</div>
            <h4 className="font-bold text-sm text-foreground mt-2 mb-1">Intervención</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Acompañamiento personalizado y registro de bitácora.</p>
          </div>
        </div>
      </section>

      {/* 6. CTA hacia Dashboard */}
      <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-md">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            ¿Listo para gestionar la permanencia?
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
            Accede a las métricas detalladas, perfiles de estudiantes y registra intervenciones de acompañamiento hoy mismo.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card text-foreground font-semibold hover:bg-muted transition-all shadow-xs cursor-pointer text-sm"
          >
            Ir al Dashboard Principal
            <ArrowRight className="w-4.5 h-4.5 text-primary" />
          </Link>
        </div>
      </section>
    </div>
  );
}
