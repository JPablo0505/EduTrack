---
name: seed-generator
description: Habilidad senior para actuar como Generador Senior de Datos Semilla realistas para CRM universitarios, garantizando consistencia relacional, coherencia académica y alto valor demostrativo para dashboards, KPIs y alertas tempranas.
---

# Generador de Datos Semilla (seed-generator)

Esta habilidad dota al agente con la capacidad de diseñar e implementar scripts de inicialización de datos (seeds) relacionales realistas para la base de datos SQLite de EduTrack CRM. Asegura que los datos generados posean coherencia académica y relacional estricta, ideal para evaluar visualmente dashboards, indicadores KPI y el motor de alertas de riesgo en fases de demostración y defensa del proyecto.

---

## 🎯 Objetivo General

Generar datasets consistentes, libres de datos absurdos o lógicas inconexas, que reflejen de forma realista el comportamiento académico, la deserción, la retención y la permanencia estudiantil en la Universidad NovaTech.

---

## 🔍 Cuándo usar esta habilidad
*   Al crear o actualizar el script de semillas (`seed.ts` o `seed.js`) que inicializa la base de datos SQLite del proyecto.
*   Cuando se necesite simular escenarios específicos de estudiantes con riesgo de deserción para validar la lógica del motor de alertas preventivas.
*   Al estructurar datos de prueba con el volumen suficiente para probar la paginación, filtros y visualizaciones gráficas del dashboard institucional.

## 🚫 Cuándo NO usar esta habilidad
*   Para generar registros aleatorios ruidosos (ej. con nombres tipo "Estudiante 1", "Lorem Ipsum" o notas académicas incoherentes con el estado del alumno).
*   Para realizar desarrollos de layouts o maquetación visual en el frontend.

---

## 📥 Entradas y 📤 Salidas

### 📥 Inputs Requeridos
1. **Esquema de Base de Datos SQLite:** Estructura de tablas y tipos de datos del proyecto (Estudiantes, Seguimientos, Programas).
2. **Taxonomías Oficiales:**
   *   **Programas:** *Ingeniería de Sistemas, Ingeniería Civil, Ingeniería Ambiental, Ingeniería Mecánica, Ingeniería Química, Ingeniería Industrial, Ingeniería Electrónica*.
   *   **Estados:** *Estable, Seguimiento Preventivo, Riesgo Medio, Riesgo Alto, Recuperado, Inactivo*.
   *   **Tipos de Seguimiento:** *Tutoría académica, Seguimiento docente, Bienestar universitario, Consejería académica, Correo institucional, Reunión de acompañamiento*.
3. **Volumen Requerido:** Cantidad aproximada de registros para simular (ej. 50 estudiantes y 150 registros de seguimiento).

### 📤 Salidas Generadas
1. **Script de Seeds SQL o TypeScript/Node:** Código ejecutable listo para vaciar e inicializar la base de datos SQLite de forma limpia y reproducible.
2. **Reporte de Coherencia de Casos Sembrados:** Resumen que indica qué escenarios críticos fueron simulados para facilitar las pruebas de QA.

---

## ⚖️ Jerarquía de Prioridades de Consistencia de Datos

Al simular los datos, el agente estructurará la información bajo la siguiente jerarquía de veracidad y coherencia decreciente:

1.  **Coherencia y Lógica de Rendimiento (No Contradicción):**
    *   Un estudiante con promedio excelente (ej. 4.8 / 5.0) y cero materias reprobadas **NO** puede tener estado `Riesgo Alto` o `Riesgo Medio`.
    *   Un estudiante en estado `Recuperado` debe mostrar una mejora en su tendencia de calificaciones e intervenciones recientes finalizadas con éxito.
2.  **Consistencia de Relaciones Claves Foráneas (Integridad Referencial):**
    *   Cada registro de seguimiento debe estar enlazado a un estudiante existente y tener un tipo de seguimiento y tutor válido.
3.  **Realismo de la Nomenclatura:** Utilizar nombres, apellidos, correos electrónicos y códigos de estudiantes verosímiles de la Universidad NovaTech.
4.  **Distribución Normalizada del Riesgo:** Simular una población equilibrada (ej. 65% Estable/Recuperado, 20% Preventivo/Medio, 10% Riesgo Alto, 5% Inactivo) para evitar visualizaciones sesgadas en el Dashboard KPI.

---

## 🔄 Reglas de Coherencia Académica (Modelado de Escenarios)

El agente programará los generadores de semillas respetando las siguientes correlaciones de datos del mundo real:

### A. Escenario: Riesgo Alto
*   **Perfil:** Promedio acumulado bajo ($< 3.2$ sobre 5.0 o $< 6.5$ sobre 10.0), materias reprobadas el ciclo actual $\ge 2$, tendencia académica `DESCENDENTE`.
*   **Historial:** Registros de seguimiento previos frecuentes en la tabla de bitácoras (mínimo 3 seguimientos de tipo `Tutoría académica` o `Consejería académica` con notas de "inasistencia" o "bajo desempeño").

### B. Escenario: Recuperado
*   **Perfil:** Promedio académico actual estable o al alza, materias reprobadas actuales $= 0$, tendencia `ASCENDENTE`.
*   **Historial:** Muestra tutorías de bienestar o académicas registradas en semestres anteriores, seguidas de notas de evolución positivas.

### C. Escenario: Estable
*   **Perfil:** Promedio medio-alto ($> 3.8$ sobre 5.0 o $> 7.5$ sobre 10.0), cero o máximo una materia reprobada, tendencia `ESTABLE` o `ASCENDENTE`.
*   **Historial:** Seguimientos nulos o esporádicos (ej. un único registro preventivo de inducción o consejería general).

---

## 🚫 Anti-Patrones a Evitar en Generación de Seeds

*   **Registros Huérfanos o Inválidos:** Insertar fechas de seguimientos en el futuro, o seguimientos fechados antes de la fecha de ingreso del estudiante a la carrera.
*   **Datos Genéricos Incomprensibles:** Usar nombres tipo `"Test User"`, `"Student A"` o descripciones de seguimientos tipo `"Lorem Ipsum dolor sit amet"`. Toda nota de seguimiento debe redactarse con un resumen realista del caso (ej. *"Estudiante manifiesta problemas de salud que afectaron su asistencia al segundo parcial"*).
*   **Sobrecarga Académica Imposible:** Registrar estudiantes cursando 40 créditos en primer semestre cuando la carga máxima sugerida institucional es de 18 créditos.

---

## 📋 Checklist de Validación de Datos Semilla (Seeds QA)

Antes de dar por bueno un conjunto de datos o script de inicialización, el agente debe validar:

*   [ ] **Ejecución Limpia:** ¿El script limpia las tablas (`DELETE FROM` o `DROP`) antes de insertar, evitando errores de duplicidad de llave primaria al reejecutarse?
*   [ ] **Vocabulario y Taxonomía:** ¿Todos los programas, estados y tipos de seguimiento coinciden exactamente con los términos oficiales del proyecto?
*   [ ] **Validación Matemática de Alertas:** ¿Si procesamos los estudiantes sembrados con el algoritmo de scoring de `educational-kpi-architect`, sus clasificaciones de alerta en el CRM coinciden con su estado sembrado?
*   [ ] **Representatividad Gráfica:** ¿El volumen de datos permite renderizar correctamente componentes de dashboards, tablas paginadas e indicadores clave de desempeño sin verse vacío?
*   [ ] **Zero placeholders en bitácoras:** ¿Las notas de seguimiento cuentan con descripciones realistas redactadas en español profesional aplicable a la Universidad NovaTech?
