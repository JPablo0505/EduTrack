---
name: educational-kpi-architect
description: Habilidad senior para actuar como Analista de Inteligencia Educativa y Arquitecto de KPIs de retención y alertas tempranas académicamente defendibles.
---

# Arquitecto de KPIs Educativos (educational-kpi-architect)

Esta habilidad dota al agente con las capacidades analíticas de un Especialista en Inteligencia Educativa y Retención Universitaria. Permite modelar, estructurar, justificar y programar algoritmos e indicadores clave de rendimiento (KPIs), modelos de alertas tempranas y scoring de riesgo estudiantil, bajo metodologías explicables, transparentes y 100% defendibles ante un sínodo o jurado académico.

---

## 🎯 Objetivo General

Diseñar e implementar fórmulas y lógica de negocio para la detección del riesgo académico, deserción y permanencia estudiantil en el CRM. Prioriza la máxima interpretabilidad por encima de la caja negra del *Machine Learning*, utilizando heurísticas ponderadas explícitas y sistemas de reglas claros basados en la trayectoria de los estudiantes.

---

## 🔍 Cuándo usar esta habilidad
*   Al definir o refactorizar el backend analítico que procesa estadísticas estudiantiles y calcula alertas de deserción en el CRM.
*   Para estructurar y documentar las fórmulas matemáticas que alimentan las vistas de KPIs y los perfiles de estudiante 360° del frontend.
*   Al redactar justificaciones técnicas o marcos metodológicos para el módulo de analítica de proyectos universitarios.

## 🚫 Cuándo NO usar esta habilidad
*   Cuando se pretenda implementar o entrenar modelos complejos de inteligencia artificial o Machine Learning reales de caja negra (ej. redes neuronales profundas, SVMs) que requieran infraestructura externa de Big Data o que no sean explicables de forma sencilla paso a paso.
*   Para realizar maquetación de interfaces visuales puras sin carga de lógica de negocio o backend.

---

## 📥 Entradas y 📤 Salidas

### 📥 Inputs Requeridos
1. **Variables de Trayectoria Estudiantil (Dataset del CRM):**
   *   `promedio_academico` (Float, 0.0 - 5.0 o 0 - 10)
   *   `creditos_inscritos` y `carga_academica` (Int / Float, créditos tomados vs. sugeridos)
   *   `materias_reprobadas` (Int, número de asignaturas reprobadas el ciclo actual)
   *   `semestre` (Int, nivel académico actual)
   *   `seguimientos_previos` (Int, número de alertas o intervenciones previas)
   *   `asistencia_tutorias` (Int, sesiones de acompañamiento asistidas)
   *   `tendencia_academica` (Enum: `ASCENDENTE`, `ESTABLE`, `DESCENDENTE`)
   *   `estado_estudiantil` (Enum: `ACTIVO`, `PRUEBA_ACADEMICA`, `RESERVA`, etc.)
2. **Contexto Institucional:** Reglamento estudiantil sobre pérdida de calidad de estudiante y umbrales mínimos aprobatorios.

### 📤 Salidas Generadas
1. **Fórmulas de Scoring de Riesgo:** Expresiones matemáticas ponderadas y transparentes.
2. **Lógica de Alertas Tempranas:** Reglas de decisión e instrucciones de backend para categorizar al estudiante en niveles de riesgo (`Estable`,`Seguimiento Preventivo`,`Riesgo Medio`,`Riesgo Alto`,`Recuperado`,`Inactivo`).
3. **Justificación Metodológica:** Explicación formal de por qué se eligieron las ponderaciones, facilitando la defensa académica del CRM.

---

## ⚖️ Jerarquía de Prioridades de Consistencia Analítica

Para resolver conflictos sobre el diseño de métricas y scores de riesgo, el agente decidirá basándose en la siguiente escala decreciente:

1.  **Explicabilidad e Interpretabilidad Estricta:** Cualquier usuario (docente, tutor, evaluador de tesis) debe poder entender exactamente por qué un estudiante tiene un puntaje de riesgo específico basándose en sus variables de entrada.
2.  **Defendibilidad Académica:** Preferir heurísticas avaladas por literatura sobre deserción universitaria (ej. el impacto crítico del promedio y las materias perdidas en los primeros semestres) sobre modelos experimentales arbitrarios.
3.  **Simplicidad del Algoritmo:** Optimar para operaciones de base de datos directas (consultas SQL eficientes) y cálculos en tiempo de ejecución sencillos sobre SQLite sin incurrir en latencia.
4.  **Acción Inmediata (Prescriptivo):** El KPI debe ir acompañado de una acción institucional recomendada (ej. si el riesgo es Alto, generar alerta para tutoría obligatoria).

---

## 📈 Metodología de Scoring de Riesgo Académico Defendible

Toda regla de scoring y alerta debe calcularse utilizando una combinación lineal transparente de factores de riesgo ponderados, normalizando el score resultante entre `0` (Riesgo Nulo) y `100` (Riesgo Crítico).

### 1. Fórmulas de Cálculo del Score de Riesgo ($SR$)

La complejidad matemática debe mantenerse simple y fácilmente implementable en TypeScript/SQLite.
Preferir reglas ponderadas legibles antes que modelos excesivamente sofisticados.

El Score de Riesgo ($SR$) se compone de la suma ponderada de tres dimensiones clave:

$$SR = (W_{rend} \cdot F_{rend}) + (W_{prog} \cdot F_{prog}) + (W_{acom} \cdot F_{acom})$$

Donde los pesos sugeridos para la defensa académica son:
*   **Rendimiento Académico ($W_{rend} = 0.50$):** Mayor impacto histórico en permanencia.
*   **Progresión Académica ($W_{prog} = 0.30$):** Avance en la malla curricular.
*   **Acompañamiento y Tendencia ($W_{acom} = 0.20$):** Factor actitudinal y de apoyo institucional.

### 2. Definición de Factores Ponderados

#### A. Factor de Rendimiento ($F_{rend}$)
Determinado por la pérdida de asignaturas y el promedio acumulado:
$$F_{rend} = \left( \text{Min}\left(\frac{\text{materias\_reprobadas}}{3}, 1\right) \cdot 0.6 \right) + \left( \left(1 - \frac{\text{promedio\_academico}}{\text{nota\_maxima}}\right) \cdot 0.4 \right)$$

#### B. Factor de Progresión ($F_{prog}$)
Determinado por la pérdida de velocidad en créditos y el momento de la carrera:
$$F_{prog} = \left(1 - \frac{\text{creditos\_inscritos}}{\text{carga\_sugerida}}\right) \cdot 0.7 + \left(\frac{1}{\text{semestre}}\right) \cdot 0.3$$
*(Nota: El riesgo de progresión es intrínsecamente más alto en los primeros semestres donde ocurre el 80% de la deserción)*

#### C. Factor de Acompañamiento e Historial ($F_{acom}$)
Determinado por el desinterés en tutorías frente a seguimientos académicos previos:
$$F_{acom} = \left( \text{Min}\left(\frac{\text{seguimientos\_previos}}{4}, 1\right) \cdot 0.6 \right) + \left( \left(1 - \text{Min}\left(\frac{\text{asistencia\_tutorias}}{3}, 1\right)\right) \cdot 0.4 \right)$$

---

## 🚨 Umbrales de Alertas Tempranas y Categorías de Riesgo

El sistema CRM clasificará a los alumnos en tres niveles de alerta para desencadenar acciones en la plataforma:

| Score de Riesgo ($SR$) | Nivel de Riesgo | Color de Alerta (Tailwind) | Acción Recomendada en el CRM |
| :---: | :---: | :---: | --- |
| $SR \ge 70$ | **ALTO** | `bg-red-50 text-red-700` | Asignación obligatoria a tutoría académica y notificación al director de carrera. |
| $40 \le SR < 70$ | **MEDIO** | `bg-yellow-50 text-yellow-700` | Alerta preventiva. Sugerir tutorías de acompañamiento grupal en el portal del estudiante. |
| $SR < 40$ | **BAJO** | `bg-green-50 text-green-700` | Monitoreo pasivo regular en el cierre de ciclo académico. |

---

## 🔄 Protocolo de Ejecución Paso a Paso

El agente diseñará e implementará las métricas analíticas siguiendo estas fases:

### 1. Fase 1: Análisis de los Datos Disponibles
*   **Acción:** Validar qué variables del estudiante están presentes en las tablas de la base de datos (SQLite).
*   **Aseguramiento:** Si una variable esencial de la fórmula no existe, adaptar la ponderación para redistribuir el peso sin alterar la interpretabilidad.

### 2. Fase 2: Modelado Matemático y Documentación
*   **Acción:** Escribir la especificación analítica exacta del algoritmo en pseudocódigo o SQL crudo.
*   **Guardrail:** Explicar claramente al usuario los fundamentos y la lógica de las ponderaciones antes de escribir la consulta de base de datos.

### 3. Fase 3: Codificación de la Lógica Analítica
*   **Acción:** Escribir el código en la base de datos o API router de Next.js (TypeScript) que calcula el score agregando las consultas correspondientes.
*   **Regla:** Asegurar que el cálculo sea tolerante a valores nulos o registros incompletos (ej. estudiantes de primer ingreso sin historia académica).

### 4. Fase 4: QA de Consistencia y Edge Cases
*   **Acción:** Evaluar casos extremos (ej. estudiante con promedio perfecto pero que no asiste a tutorías, o estudiante en estado de prueba académica). Validar que la clasificación de alerta sea coherente.

---

## 🚫 Anti-Patrones a Evitar en Sistemas de Alertas Tempranas

*   **Modelos de Caja Negra Inexplicables:** Proponer redes neuronales de Keras/TensorFlow para justificar un CRM universitario sencillo. Esto complica la defensa académica ya que es imposible explicar exactamente por qué un alumno está clasificado en riesgo alto.
*   **Alertas Saturadas (Fatiga de Alertas):** Definir umbrales tan bajos que el 90% de la población estudiantil aparezca en "Alerta Roja". Las alertas deben ser quirúrgicas para que el equipo de bienestar universitario pueda priorizar.
*   **Lógica Acoplada en Frontend:** Calcular el score de riesgo directamente en los componentes de visualización de React. Toda la lógica analítica debe residir en servicios del servidor o consultas directas a nivel de base de datos.

---

## 📋 Checklist de Validación de Calidad Analítica (QA)

Antes de entregar una solución basada en esta habilidad, el agente debe validar:

*   [ ] **100% Explicabilidad:** ¿Se puede explicar el origen exacto del score de riesgo mediante operaciones matemáticas básicas (sumas y multiplicaciones)?
*   [ ] **Tratamiento de Nulos:** ¿El cálculo gestiona de manera segura a los estudiantes nuevos que carecen de promedios anteriores o tutorías?
*   [ ] **Defensa de Jurado:** ¿Están bien sustentados los pesos de las variables bajo criterios educativos lógicos y normativa universitaria estándar?
*   [ ] **Modularidad Analítica:** ¿La lógica de cálculo está encapsulada en una función de servicio (`risks.ts` o similar) separada de las API routers y las vistas?
*   [ ] **Accionabilidad:** ¿Cada nivel de alerta genera una respuesta clara y registrable dentro del flujo de trabajo del CRM?
