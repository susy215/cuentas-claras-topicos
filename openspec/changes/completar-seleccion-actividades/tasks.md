# Tareas delta: completar-seleccion-actividades

Estas tareas no modifican las 16 tareas históricas.

- [ ] A1. Mostrar una lista o selector de actividades existentes con nombre y estado.
- [ ] A2. Permitir seleccionar una actividad y actualizar `selectedActivityId`.
- [x] A3. Garantizar que participantes, gastos, balances y pagos mostrados pertenezcan solo a la actividad seleccionada.
- [x] A4. Seleccionar automáticamente una actividad recién creada y mostrarla con contexto vacío.
- [ ] A5. Presentar actividades cerradas como historial de solo lectura sin implementar reapertura.
- [x] A6. Verificar que cambiar de actividad no mezcle ni borre datos.
- [x] A7. Verificar persistencia mediante F5 para actividad seleccionada, estado cerrado y datos históricos.


## Evidencia del incremento 3

- Implementación: listado/selector de actividades, resaltado de actividad activa y selección mediante `selectedActivityId`.
- Las actividades cerradas se renderizan sin acciones de modificación; los controles dinámicos de reparto también quedan deshabilitados.
- P14: separación de participantes y gastos entre actividades + conservación de `selectedActivityId`.
- P15: una actividad nueva inicia con participantes/gastos/pagos vacíos y sin encargado.
- P16: persistencia conserva selección e historial cerrado.
- A1, A2 y A5 quedan sin marcar hasta verificación visual/manual en navegador.
