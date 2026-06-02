---
name: project-context-loader
description: Habilidad senior para actuar como Gestor Maestro de Contexto del proyecto, alineando la base de código, stack, decisiones de diseño e indicadores aprobados del proyecto EduTrack CRM para evitar alucinaciones y scope creep.
---

# Gestor de Contexto del Proyecto (project-context-loader)

Esta habilidad actúa como el ancla de verdad y alineación conceptual de EduTrack CRM en el workspace. Su propósito es garantizar que todas las sesiones de desarrollo, subagentes y tareas compartan la misma visión de arquitectura, reglas de negocio, limitaciones técnicas y decisiones de diseño aprobadas, reduciendo el consumo de tokens y evitando que el agente proponga soluciones fuera del alcance predefinido.

---

## 🎯 Objetivo General

Garantizar que todo desarrollo en el workspace sea consistente con la verdad base de **EduTrack CRM**. Protege el ecosistema contra la sobreingeniería (overengineering), la duplicación de código y los desvíos del stack de tecnologías autorizado.

---

## 🔍 Cuándo usar esta habilidad
*   **Al inicio de cada sesión de desarrollo o tarea:** Para establecer la base conceptual del trabajo.
*   **Antes de crear o modificar cualquier módulo o componente:** Para contrastar la propuesta de código con las restricciones, paletas de colores y reglas de negocio autorizadas.
*   **Al integrar subagentes:** Para transferir las reglas y restricciones del proyecto en un formato minimalista de alta densidad de información.

## 🚫 Cuándo NO usar esta habilidad
*   Para escribir código funcional directamente (esta habilidad provee el contexto y los guardrails conceptuales, no implementa software).
*   Para modificar la base de datos o el frontend sin antes haber alineado los requerimientos contra el contexto cargado.

---

## 📥 Entradas y 📤 Salidas

### 📥 Inputs Requeridos
1. **Directiva de Desarrollo:** La tarea actual o módulo a implementar o modificar.
2. **Contexto Histórico del Workspace:** Archivos y código base ya creados en el repositorio.

### 📤 Salidas Generadas
1. **Diagnóstico de Alineación Contextual:** Validación inmediata de si la propuesta respeta el alcance del proyecto, indicando desviaciones detectadas.
2. **Contexto de Sesión Consolidado:** Declaración formal del estado del proyecto en memoria para guiar las siguientes fases de desarrollo.

---

## ⚖️ Jerarquía de Verdad del Proyecto (Base de Conocimiento)

El agente debe considerar las siguientes definiciones como la única verdad base para la toma de decisiones, rechazando cualquier requerimiento o sugerencia que las contradiga:

### 1. El Proyecto: EduTrack CRM
*   **Definición:** Sistema Inteligente de Permanencia Estudiantil y Alertas Tempranas.
*   **Organización:** Universidad NovaTech (Institución ficticia).
*   **Problema a resolver:** Detección tardía de estudiantes con bajo rendimiento o riesgo de deserción; información fragmentada entre docentes, coordinación y bienestar.
*   **Objetivo General:** Centralizar estudiantes, seguimientos, KPIs institucionales y alertas tempranas en una única plataforma de consulta y gestión rápida.

### 2. Stack Tecnológico Aprobado (Estricto)
*   **Frontend & Routing:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
*   **Persistencia:** SQLite (Base de datos local embebida mediante `lib/db.ts`).
*   **Entorno de Agente:** Herramientas de Antigravity, Skills de Workspace y Gemini 3 Flash.

### 3. Restricciones Técnicas Inviolables
*   **Sin autenticación/login complex:** Diseñado para entornos de demostración/evaluación directa.
*   **Sin multiusuario complejo:** Acceso de rol único o simulado directamente en la UI.
*   **Sin Machine Learning real:** Scoring mediante heurísticas ponderadas transparentes y explicables.
*   **Sin APIs externas:** Los datos se obtienen de la base de datos SQLite local inicializada mediante seeds realistas.
*   **Sin microservicios ni colas:** Aplicación monolítica e integrada.

### 4. Módulos Autorizados
1.  **Landing Institucional:** Página de bienvenida y presentación formal de la Universidad NovaTech.
2.  **CRUD Estudiantes:** Alta, baja, modificación y listado de alumnos.
3.  **CRUD Seguimientos:** Registro de bitácoras de acompañamiento por parte de tutores/docentes.
4.  **Dashboard KPI:** Panel de control con métricas de deserción, retención y alertas activas.
5.  **Consulta Multiparámetro:** Buscador avanzado de estudiantes por estado, promedio, semestre y riesgo.
6.  **Alertas Inteligentes:** Sistema automático de clasificación de riesgo basado en el score matemático.
7.  **Perfil Estudiante 360°:** Vista integral de la historia de un alumno, sus seguimientos y evolución de notas.
8.  **SQLite con Seeds Realistas:** Dataset inicial de estudiantes y tutorías ya cargado para pruebas fluidas.

---

## 🛠️ Reglas del Negocio y Dominio de Datos

Cualquier lógica programada debe alinearse perfectamente con las siguientes taxonomías oficiales:

### A. Estados Estudiantiles Oficiales (Estricto)
*   `Estable` (Sin riesgos aparentes)
*   `Seguimiento Preventivo` (Baja de rendimiento menor o ausencias)
*   `Riesgo Medio` (Reprobación inicial de materias)
*   `Riesgo Alto` (En peligro inminente de perder calidad de estudiante)
*   `Recuperado` (Estudiante con intervención exitosa que estabilizó su rendimiento)
*   `Inactivo` (Retirado, desertor o egresado)

### B. Tipos de Seguimiento Autorizados
*   `Tutoría académica`
*   `Seguimiento docente`
*   `Bienestar universitario`
*   `Consejería académica`
*   `Correo institucional`
*   `Reunión de acompañamiento`

### C. Variables Analíticas del Estudiante
*   `promedio académico` (0.0 a 5.0 o 0 a 10)
*   `créditos inscritos` vs `carga académica sugerida`
*   `materias reprobadas` (el ciclo actual)
*   `semestre`
*   `seguimientos previos`
*   `asistencia a tutorías`
*   `tendencia académica`
*   `estado estudiantil`

### D. IA Permitida (Explicable)
*   Cálculo del score de riesgo mediante heurísticas matemáticas (Suma ponderada).
*   Recomendaciones automáticas basadas en reglas lógicas (ej. *"Si materias reprobadas > 2 -> Recomendar Tutoría Académica"*).
*   Señalización de "Next Best Action" (Siguiente mejor paso recomendado para el tutor).

---

## 🛡️ Guardrails de Consistencia de Contexto

1.  **Rechazo de Funciones No Aprobadas:** Si se solicita agregar módulos ajenos a los 8 oficiales (por ejemplo, pasarela de pagos, chat de soporte en tiempo real o integraciones con Slack), el agente debe advertir al usuario la violación del alcance (scope creep) y pedir confirmación explícita antes de proceder.
2.  **No Cambiar el Stack:** Denegar la instalación de frameworks CSS distintos a Tailwind, u ORMs pesados de base de datos no contemplados, a menos que sea estrictamente necesario.
3.  **Mantener Estética NovaTech:** Verificar que todo frontend cumpla con el tema institucional (Light mode por defecto, colores azul institucional y gris claro, uso amplio de spacing y estética premium shadcn/ui).

---

## 🚫 Anti-Patrones a Evitar

*   **Pérdida de Memoria Operativa:** Empezar una tarea de codificación asumiendo variables, estados o nombres de campos que no están en la verdad base (ej. inventarse un estado estudiantil como `"En Peligro"` en lugar de usar `"Riesgo Alto"`).
*   **Paralelismo Arquitectónico:** Implementar un segundo motor de persistencia o servicios que no respeten el patrón de carpetas del proyecto.
*   **Ignorar Restricciones de Cajas Negras:** Intentar implementar código en Python o llamadas a APIs externas de IA para calcular el riesgo estudiantil, violando el principio de simplicidad y base SQLite local.

---

## 📋 Checklist de Validación Contextual (Mandatorio)

Antes de iniciar cualquier tarea de implementación en el proyecto, el agente debe verificar:

*   [ ] **Alineación de Módulos:** ¿La tarea pertenece a los 8 módulos autorizados del proyecto?
*   [ ] **Respeto de Restricciones:** ¿La solución evita dependencias de red, inicios de sesión o machine learning complejo?
*   [ ] **Vocabulario Oficial:** ¿Se están utilizando los estados estudiantiles (`Estable`, `Riesgo Medio`, etc.) y tipos de seguimiento oficiales en bases de datos y UI?
*   [ ] **Consistencia de Stack:** ¿Se está construyendo sobre Next.js + Tailwind + SQLite + TypeScript + shadcn/ui?
*   [ ] **Defensa del Alcance:** ¿Se alertó al usuario si su solicitud constituye una sobreingeniería o scope creep?
