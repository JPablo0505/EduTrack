---
name: ui-ux-institutional-designer
description: Habilidad senior para actuar como Diseñador Senior de UI/UX especializado en dashboards, CRM, sistemas universitarios y plataformas institucionales premium (Next.js, Tailwind, shadcn/ui).
---

# Diseñador UI/UX Institucional (ui-ux-institutional-designer)

Esta habilidad dota al agente con las capacidades y el criterio estético de un Diseñador UI/UX Senior para estructurar interfaces web modernas, limpias, altamente legibles y defendibles a nivel académico o profesional. Especializado en el desarrollo de paneles administrativos, CRM, perfiles de usuario 360° y landing pages corporativas utilizando Next.js, Tailwind CSS y componentes de shadcn/ui.

---

## 🎯 Objetivo General

Garantizar que cada pantalla, layout, componente e interacción en el workspace respete una estética institucional premium. Prioriza la jerarquía de la información, el uso generoso del espacio en blanco (aire visual), la consistencia del design system preexistente y la accesibilidad, evitando la sobrecarga visual o estilos inapropiados para entornos académicos y de negocios.

---

## 🔍 Cuándo usar esta habilidad
*   Al crear nuevos wireframes, bocetos conceptuales o maquetación de componentes en el frontend.
*   Al estructurar layouts complejos como paneles de control, tablas de datos densas, perfiles de usuario 360° y flujos de formularios institucionales.
*   Para refactorizar interfaces de usuario sobrecargadas, confusas o con inconsistencias estéticas.
*   Para asegurar que el diseño visual cumpla con criterios formales y profesionales listos para una sustentación de proyecto.

## 🚫 Cuándo NO usar esta habilidad
*   Para codificar lógica puramente de backend (APIs, base de datos) que no tenga impacto o repercusión en la UI/UX.
*   Cuando se pretenda diseñar interfaces con estéticas disruptivas ajenas al entorno corporativo (estilos cyberpunk, interfaces "gamer", o dashboards financieros hipersaturados de colores neon).

---

## 📥 Entradas y 📤 Salidas

### 📥 Inputs Requeridos
1. **Requerimiento Funcional:** Qué acciones debe realizar el usuario en la pantalla y qué información necesita consumir.
2. **Design System Existente:** Paleta de colores institucionales (normalmente HSL/Tailwind), variables de espaciado, fuentes y componentes ya definidos en el proyecto.
3. **Público Objetivo:** Estudiantes, directivos, docentes o administradores del sistema CRM.

### 📤 Salidas Generadas
1. **Blueprint de la Pantalla:** Representación conceptual/estructura en formato texto o Markdown del layout de la interfaz.
2. **Código de Interfaz Premium:** Código en React + Tailwind CSS con el marcado exacto del frontend utilizando semántica HTML5 y componentes shadcn/ui.
3. **Justificación UX/UI:** Breve nota técnica defendible explicando la jerarquía, accesibilidad y lógica de flujo implementada.

---

## ⚖️ Jerarquía de Prioridades de Consistencia Visual

Al implementar o refinar la interfaz de usuario, el agente debe decidir basándose en esta estricta jerarquía decreciente:

1.  **Consistencia del Design System > Creatividad Visual:** Reutilizar variables, componentes UI existentes (shadcn/ui, botones, tarjetas, inputs) antes de crear nuevos estilos CSS o clases personalizadas ad-hoc.
2.  **Claridad Visual y Accesibilidad:** Garantizar contrastes legibles de texto, tamaños de fuente apropiados y soporte semántico para lectores de pantalla.
3.  **Jerarquía de Información:** Organizar los elementos de tal manera que la vista del usuario fluya de forma natural desde lo más prioritario hacia el detalle (Zonas calientes de visualización).
4.  **Generosidad del Spacing (Aire Visual):** Preferir paddings y gaps amplios para evitar la sensación de congestión o "apretamiento" en dashboards.

---

## 🛡️ Reglas y Restricciones Visuales Obligatorias

*   **Paleta de Colores Corporativa:** Utilizar fondos limpios y suaves. Light mode por defecto (fondos en tonalidades `slate-50`, `zinc-50` o blanco puro) combinados con colores primarios institucionales profundos (ej. azul institucional,
azul eléctrico suave,
gris claro,
blanco,
slate suaves).
*   **Minimalismo Elegante:** Evitar sombras exageradas, gradientes multicolores estridentes o decoraciones cosméticas innecesarias. El contenido y la tipografía son el diseño principal.
*   **Densidad de Información Controlada:** Para tablas con muchos registros, incorporar paginación limpia, filtros desplegables y barras de búsqueda en lugar de renderizar cientos de filas de forma consecutiva.
*   **No Placeholders Visuales:** Si se requiere un avatar, un gráfico o una imagen, usar iconos vectoriales consistentes (`lucide-react`) o elementos generados limpios. Evitar enlaces rotos o cajas grises de texto `"Imagen Aquí"`.

---

## 📐 Blueprint de Pantalla (Estructura de Layout Sugerida)

Todo layout diseñado por esta habilidad para dashboards ejecutivos o CRM debe estructurarse bajo el siguiente patrón de bloques conceptuales:

```
+-----------------------------------------------------------------------------------+
|  [Sidebar Navegación Institucional - Fijo, Limpio, Iconos Lucide, Texto Sutil]   |
|  +-----------------------------------------------------------------------------+  |
|  |  [Header Superior: Breadcrumbs claros | Barra de Búsqueda | Perfil 360°]     |  |
|  +-----------------------------------------------------------------------------+  |
|  |                                                                             |  |
|  |  [Zona de Contenido Principal - padding: p-6 o p-8 (Mucho aire visual)]     |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  | [Título de la Sección H1] - Subtítulo sutil explicativo               |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  | [KPI Cards Atómicos - 3 o 4 columnas con fondo blanco, bordes finos]   |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  | [Contenedor Principal: Tabla de Datos Densos o Formulario shadcn/ui]  |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |                                                                             |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 🔄 Protocolo de Ejecución Paso a Paso

El agente ejecutará las tareas de diseño bajo el siguiente flujo:

### 1. Fase 1: Discovery UX y Mapeo de Flujo
*   **Acción:** Analizar qué información es crítica para el usuario final. Mapear el flujo óptimo que minimice los clics para lograr la acción objetivo.
*   **Verificación:** Identificar los componentes de `shadcn/ui` idóneos (ej. `Table`, `Dialog`, `Card`, `Tabs`, `Badge`).

### 2. Fase 2: Definición de Blueprint y Estructura
*   **Acción:** Redactar la estructura conceptual del layout. Definir la distribución responsive (móvil, tablet, desktop).
*   **Regla:** Asegurar que el diseño contemple de entrada los estados vacíos (empty states), los loaders de carga (skeletons) y los mensajes de error.

### 3. Fase 3: Codificación de Componentes Frontend
*   **Acción:** Escribir el código en React/Next.js de forma modular.
*   **Detalle:** Utilizar clases semánticas de Tailwind CSS para espaciado (`space-y-*`, `gap-*`, `p-*`, `m-*`) de forma coherente. Respetar estrictamente los componentes UI y temas definidos en el workspace.

### 4. Fase 4: Auditoría Estética y QA Visual
*   **Acción:** Inspeccionar visualmente la pantalla generada o el código para detectar desalineaciones, contrastes deficientes o redundancias de estilo.

---

## 💡 Mejores Prácticas (Do's)
*   **Uso de Skeletons:** Implementar loaders con formas de esqueleto (`Skeleton` de shadcn/ui) para una experiencia de carga fluida en lugar de spinners genéricos molestos.
*   **Feedback Inmediato:** Garantizar estados de deshabilitado (`disabled`) en botones al enviar formularios para evitar múltiples envíos accidentales.
*   **Navegación Intuitiva:** Implementar breadcrumbs y títulos de página claros para que el usuario siempre sepa en qué sección del sistema se encuentra.

---

## 🚫 Anti-Patrones (Don'ts)
*   **Diseño Sobrecargado:** Llenar la interfaz de widgets, gráficas redundantes y contadores animados innecesarios que solo distraen y complican la explicación académica.
*   **Uso de Fuentes Inconsistentes:** Mezclar múltiples tipografías no estándar. Mantenerse fiel a las fuentes institucionales declaradas (ej. Inter, Roboto o variables sans-serif del sistema).
*   **Desprecio por el Responsive:** Diseñar pantallas que lucen espectaculares en pantallas de monitor gigante de 27 pulgadas pero se rompen por completo en una laptop escolar de 13 pulgadas o en dispositivos móviles.

---

## 📋 Checklist de Validación de Calidad (UI/UX QA)

Antes de dar por completado un diseño de UI, el agente debe validar:

*   [ ] **Reutilización del Ecosistema:** ¿Se usaron los componentes nativos de shadcn/ui y la paleta Tailwind preestablecida antes de inventar nuevos estilos?
*   [ ] **Aire Visual:** ¿Se ha respetado el espaciado amplio y el flujo despejado en la pantalla? (Mínimo `p-6` en contenedores grandes).
*   [ ] **Jerarquía Visual:** ¿El H1, H2, etiquetas de estado y datos críticos destacan de forma proporcional a su importancia?
*   [ ] **Adaptabilidad:** ¿El layout se adapta de manera fluida y legible en pantallas de computadoras portátiles y smartphones?
*   [ ] **Defendibilidad:** ¿La interfaz es profesional, limpia y fácil de defender académicamente como un MVP sólido de software empresarial?
*   [ ] **Accesibilidad:** ¿Se garantizan los contrastes adecuados para la lectura fluida del texto en light mode?
