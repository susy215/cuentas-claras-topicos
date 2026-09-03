# Propuesta: Completar selección e historial de actividades

## Identificador

`completar-seleccion-actividades`

## Motivo

La aplicación ya conserva varias actividades y separa sus participantes, gastos, balances y pagos. La validación manual confirmó que al crear una actividad nueva su contexto comienza vacío, pero la interfaz no ofrece una forma suficientemente clara de volver a seleccionar actividades anteriores ni de reconocer una actividad cerrada como historial de solo lectura.

Este cambio completa la experiencia de selección sin borrar información histórica y sin reabrir actividades cerradas.

## Alcance

- mostrar las actividades existentes;
- identificar visualmente su estado `Abierta` o `Cerrada`;
- seleccionar con qué actividad se trabaja o consulta;
- mostrar únicamente los datos pertenecientes a la actividad seleccionada;
- conservar actividades cerradas como historial de solo lectura;
- seleccionar automáticamente una actividad recién creada;
- garantizar que una actividad nueva comience sin participantes, encargado, gastos, pagos ni balances propios;
- conservar la selección y los datos mediante la persistencia local existente cuando corresponda.

## Fuera de alcance

- eliminar actividades;
- reabrir actividades cerradas;
- copiar participantes o gastos entre actividades;
- estadísticas comparativas entre actividades;
- filtros avanzados, búsquedas o paginación;
- catálogo de categorías de actividad o de gasto;
- base de datos.
