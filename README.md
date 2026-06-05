# 🎓 EduTrack CRM — Sistema Inteligente de Permanencia Estudiantil

> **Universidad NovaTech · Coordinación Académica**  
> Proyecto desarrollado para el curso **Fundamentos de Sistemas de Información**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-lightblue?logo=sqlite)](https://github.com/WiseLibs/better-sqlite3)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-4.x-black)](https://ui.shadcn.com)

---

## 📋 Descripción del Proyecto

**EduTrack CRM** es una plataforma institucional de gestión de permanencia y seguimiento estudiantil diseñada para la **Universidad NovaTech** (ficticia). Su propósito principal es la **detección temprana del riesgo académico** y la coordinación de intervenciones personalizadas para reducir la deserción estudiantil.

El sistema funciona como un **CRM educativo** (Customer Relationship Management aplicado al ámbito académico), permitiendo a coordinadores y consejeros de la universidad:

- Monitorear el estado académico de cada estudiante mediante un **perfil 360°**
- Detectar automáticamente señales de riesgo antes de que el estudiante abandone sus estudios
- Registrar y rastrear el historial completo de intervenciones, tutorías y acompañamientos
- Consultar KPIs institucionales consolidados para la toma de decisiones basada en datos

> Este proyecto fue construido íntegramente mediante **programación basada en especificaciones**, utilizando las **Skills de Antigravity** — un sistema de agentes especializados de IA que actúan como consultores de software senior. Cada módulo fue diseñado a partir de requerimientos funcionales precisos antes de escribir una sola línea de código.

---

## 🤖 Desarrollo Asistido por IA — Skills de Antigravity

El desarrollo de EduTrack CRM empleó un flujo de trabajo **specification-first** apoyado por múltiples Skills especializadas del agente Antigravity:

| Skill Utilizada | Rol en el Proyecto |
|---|---|
| `arquitecto-software` | Definición de la arquitectura fullstack, estructura de carpetas, decisiones tecnológicas y diseño de la base de datos |
| `educational-kpi-architect` | Diseño del motor de riesgo académico, definición de los KPIs de retención y la lógica de ponderación de factores |
| `crm-fullstack-builder` | Construcción de los módulos de gestión de estudiantes, alertas tempranas y bitácora de seguimientos |
| `seed-generator` | Generación de datos semilla realistas y coherentes para los 60 estudiantes con su historial de intervenciones |
| `ui-ux-institutional-designer` | Diseño del sistema visual, jerarquía de componentes, header institucional y experiencia de usuario del dashboard |
| `project-context-loader` | Alineación continua del contexto del proyecto para evitar inconsistencias entre módulos |

### ¿Cómo se usó la IA en el análisis de KPIs?

La IA participó en tres capas del diseño de inteligencia del sistema:

1. **Diseño del modelo de riesgo**: El agente `educational-kpi-architect` definió la fórmula ponderada de riesgo basada en literatura académica de retención universitaria, estableciendo los tres pilares y sus pesos.

2. **Generación de datos coherentes**: El agente `seed-generator` produjo 60 perfiles de estudiantes con métricas que satisfacen los umbrales del motor de riesgo, garantizando que las distribuciones de estado sean estadísticamente representativas.

3. **Validación de la lógica de negocio**: El agente `arquitecto-software` revisó que cada cálculo del motor fuera determinista, reproducible y auditable — condición fundamental para un sistema académicamente defendible.

---

## 🏗️ Arquitectura del Sistema

```
EduTrack CRM
├── Frontend (Next.js App Router)
│   ├── / → Landing institucional
│   ├── /dashboard → KPIs ejecutivos de permanencia
│   ├── /students → Gestión y perfil 360° de estudiantes
│   ├── /alerts → Semáforo de alertas tempranas
│   └── /followups → Bitácora de intervenciones
│
├── Backend (Next.js API Routes + Server Components)
│   ├── /api/students → CRUD de estudiantes
│   ├── /api/alerts → Motor de riesgo por estudiante
│   ├── /api/followups → Registro de intervenciones
│   └── /api/dashboard → KPIs consolidados
│
└── Capa de Datos (SQLite + better-sqlite3)
    ├── programs → Programas académicos
    ├── students → Registro de estudiantes
    └── followups → Historial de seguimientos
```

---

## 📁 Estructura de Carpetas

```
edutrack-crm/
├── src/
│   ├── app/                    # Rutas Next.js (App Router)
│   │   ├── page.tsx            # Landing institucional
│   │   ├── dashboard/          # Panel de KPIs ejecutivos
│   │   ├── students/           # Gestión de estudiantes
│   │   ├── alerts/             # Alertas tempranas
│   │   ├── followups/          # Bitácora de seguimientos
│   │   └── api/                # API Routes (server-side)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx      # Header institucional
│   │   │   └── sidebar.tsx     # Navegación lateral
│   │   ├── dashboard/          # Componentes del dashboard
│   │   ├── students/           # Componentes de estudiantes
│   │   ├── followups/          # Componentes de seguimientos
│   │   └── ui/                 # Componentes base (shadcn/ui)
│   │
│   ├── services/
│   │   ├── riskEngine.ts       # 🧠 Motor de cálculo de riesgo académico
│   │   ├── kpiService.ts       # 📊 Agregación de KPIs institucionales
│   │   ├── studentService.ts   # CRUD y consultas de estudiantes
│   │   └── followupService.ts  # CRUD de bitácora de seguimientos
│   │
│   ├── database/
│   │   ├── schema.sql          # Esquema relacional de la base de datos
│   │   └── seeds.ts            # Datos semilla (60 estudiantes + followups)
│   │
│   ├── lib/
│   │   └── db.ts               # Singleton de conexión SQLite
│   │
│   └── types/                  # Tipos TypeScript del dominio
│
├── data/                       # Archivo SQLite generado en runtime
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## 🧠 Motor de Alertas Tempranas — Lógica de Riesgo

El núcleo inteligente del sistema es el **`riskEngine.ts`**, que calcula de forma **determinista y explicable** el nivel de riesgo académico de cada estudiante.

### Fórmula de Riesgo

```
Score_Riesgo = (F_rendimiento × 0.50) + (F_progresión × 0.30) + (F_acompañamiento × 0.20)
```

Donde cada factor se normaliza en el rango [0, 1] (siendo 1 el mayor riesgo):

| Factor | Peso | Variables Evaluadas |
|---|---|---|
| **Rendimiento Académico** | 50% | Promedio ponderado semestral + materias reprobadas |
| **Progresión Curricular** | 30% | Créditos inscritos vs. créditos sugeridos + semestre cursado |
| **Nivel de Acompañamiento** | 20% | Asistencia a tutorías + historial de seguimientos registrados |

### Clasificación de Niveles de Riesgo

| Score | Estado | Protocolo de Acción |
|---|---|---|
| ≥ 70 | 🔴 **Riesgo Alto** | Remisión prioritaria a Dirección de Carrera + Bienestar Universitario + plan semanal |
| 45–69 | 🟠 **Riesgo Medio** | Tutoría de nivelación + llamada de seguimiento preventivo |
| 25–44 | 🟡 **Seguimiento Preventivo** | Correo institucional de oferta de tutorías + monitoreo de notas |
| < 25 | 🟢 **Estable** | Monitoreo pasivo ordinario de fin de ciclo |
| Criterios especiales | 🔵 **Recuperado** | Promedio ≥ 3.5, sin reprobadas, ≥ 2 tutorías asistidas |
| — | ⚫ **Inactivo** | Deserción declarada — sin intervención activa |

> **Propiedad clave:** El motor produce una **explicación detallada por dimensión** (`explainRisk()`), con causas en lenguaje natural y un protocolo de acciones concretas, lo que hace cada alerta auditable y justificable ante el comité académico.

---

## 📊 KPIs del Dashboard Institucional

El módulo `kpiService.ts` consolida los siguientes indicadores para la vista ejecutiva:

| KPI | Descripción |
|---|---|
| **Total de Estudiantes** | Conteo global de estudiantes en el sistema |
| **Promedio Académico Institucional** | Media del promedio ponderado (excluye inactivos) |
| **Alertas Activas** | Estudiantes en Riesgo Alto + Riesgo Medio |
| **Tasa de Riesgo (%)** | Proporción de estudiantes en alerta vs. total activos |
| **Score de Riesgo Promedio** | Puntuación media institucional calculada por el motor (0–100) |
| **Tasa de Permanencia Estimada (%)** | Estable + Recuperado + Seg. Preventivo / Total activos |
| **Distribución por Estado** | Conteo desglosado por cada uno de los 6 estados académicos |
| **Riesgo por Programa Académico** | Porcentaje de estudiantes en alerta por carrera |

---

## 👨‍🎓 Datos Semilla — Estudiantes Analizados

El sistema incluye **60 estudiantes ficticios** de la Universidad NovaTech, distribuidos en **7 programas académicos** con la siguiente distribución estadística:

| Estado | Cantidad | % del Total | Descripción |
|---|---|---|---|
| 🟢 Estable | 30 | 50.0% | Buen promedio, créditos al día, sin reprobadas |
| 🟡 Seguimiento Preventivo | 14 | 23.3% | Alertas leves, baja asistencia a tutorías |
| 🟠 Riesgo Medio | 8 | 13.3% | Promedio bajo, 2 materias reprobadas |
| 🔴 Riesgo Alto | 3 | 5.0% | Promedio crítico, 3+ reprobadas, tendencia descendente |
| 🔵 Recuperado | 3 | 5.0% | Superaron situación de riesgo con tutorías |
| ⚫ Inactivo | 2 | 3.3% | Deserción declarada, sin respuesta institucional |

### Programas Académicos Cubiertos

1. Ingeniería de Sistemas
2. Ingeniería Civil
3. Ingeniería Ambiental
4. Ingeniería Mecánica
5. Ingeniería Química
6. Ingeniería Industrial
7. Ingeniería Electrónica

Los códigos de estudiante siguen el formato institucional `NT-YYYY-NNN` (ej. `NT-2024-001`), con correos `@novatech.edu.co`.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| Lenguaje | TypeScript | ^5.x |
| Estilos | Tailwind CSS | ^4.x |
| Componentes UI | shadcn/ui + Base UI | ^4.x |
| Base de Datos | SQLite (better-sqlite3) | ^12.x |
| Iconos | lucide-react | ^1.x |
| Runtime | Node.js | ≥ 20 |

---

## ⚙️ Comandos para Ejecutar

### Prerrequisitos

- Node.js **v20 o superior**
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd edutrack-crm

# Instalar dependencias
npm install
```

### Inicializar la Base de Datos con Datos Semilla

La base de datos SQLite se crea y puebla **automáticamente** la primera vez que se inicia el servidor de desarrollo. No se requiere ningún comando adicional.

> Si deseas reiniciar los datos desde cero, elimina el archivo `data/edutrack.db` y reinicia el servidor.

### Ejecutar en Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para Producción

```bash
npm run build
npm run start
```

### Verificar Calidad de Código

```bash
npm run lint
```

---

## 🗺️ Rutas del Sistema

| Ruta | Descripción |
|---|---|
| `/` | Landing institucional — presentación del sistema |
| `/dashboard` | Panel ejecutivo con KPIs de permanencia y distribución de riesgo |
| `/students` | Tabla de estudiantes con filtros por estado, programa y búsqueda |
| `/students/[id]` | Perfil 360° individual — métricas, motor de riesgo y bitácora |
| `/alerts` | Vista de semáforo de alertas tempranas activas |
| `/followups` | Registro global de intervenciones académicas |

---

## 📌 Notas Importantes

- **Base de datos local**: EduTrack usa **SQLite** como motor de base de datos, ideal para proyectos académicos y demos. El archivo `data/edutrack.db` se genera automáticamente al arrancar el servidor.
- **No requiere configuración de entorno**: No hay variables `.env` requeridas para ejecutar el proyecto en modo local.
- **Modo oscuro incluido**: El sistema soporta cambio de tema light/dark preservado en `localStorage`.
- **Datos ficticios únicamente**: Todos los estudiantes, programas y seguimientos son datos simulados con fines académicos y demostrativos. No representan personas reales.
- **Motor de riesgo determinista**: El mismo conjunto de datos siempre produce el mismo resultado, garantizando reproducibilidad y auditabilidad académica.

---

## 👩‍💻 Contexto Académico

| Campo | Detalle |
|---|---|
| **Institución** | Universidad NovaTech *(ficticia)* |
| **Curso** | Fundamentos de Sistemas de Información |
| **Tipo de proyecto** | CRM Educativo — Sistema de Soporte a la Toma de Decisiones |
| **Enfoque** | Retención y permanencia estudiantil |
| **Metodología de desarrollo** | Programación basada en especificaciones + IA como agente consultor |
| **Herramientas de IA** | Antigravity Skills (specification-driven development) |

---

*EduTrack CRM — Universidad NovaTech · Coordinación Académica · Sistema Inteligente de Permanencia Estudiantil*
