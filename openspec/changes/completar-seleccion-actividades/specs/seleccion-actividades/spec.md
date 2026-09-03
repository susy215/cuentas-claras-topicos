# Especificación delta: Selección e historial de actividades

## ACT-SEL-01 — Listar actividades

- **Dado** que existen varias actividades,
- **cuando** se consulta el selector o listado de actividades,
- **entonces** se muestran sus nombres y estados `Abierta` o `Cerrada`.

## ACT-SEL-02 — Seleccionar actividad

- **Dado** que existen las actividades A y B,
- **cuando** el usuario selecciona B,
- **entonces** B se convierte en la actividad activa de la interfaz.

## ACT-SEL-03 — Separación de información

- **Dado** que A y B tienen participantes y gastos diferentes,
- **cuando** se selecciona B,
- **entonces** solamente se muestran participantes, gastos, balances y pagos pertenecientes a B.

## ACT-SEL-04 — Nueva actividad limpia

- **Dado** que existe una actividad anterior con participantes y gastos,
- **cuando** se crea una actividad nueva,
- **entonces** la nueva queda seleccionada y comienza con cero participantes, sin encargado, cero gastos y cero pagos propios.

## ACT-SEL-05 — Historial cerrado

- **Dado** una actividad `Cerrada`,
- **cuando** se la selecciona desde el historial/listado,
- **entonces** sus datos permanecen visibles y no se ofrecen acciones de modificación ni reapertura.

## ACT-SEL-06 — Conservación al refrescar

- **Dado** que existen actividades abiertas y cerradas con datos almacenados,
- **cuando** se refresca la página,
- **entonces** las actividades y sus datos reaparecen sin mezclarse y conservan sus estados.


## ACT-SEL-07 — Orientación según estado

- **Dado** que una actividad está seleccionada,
- **cuando** el usuario observa el bloque `Actividad activa`,
- **entonces** la interfaz explica brevemente qué implica su estado.

- **Dado** una actividad `Abierta`,
- **entonces** se informa que puede continuarse el trabajo de la actividad y completar información o conciliaciones antes del cierre.

- **Dado** una actividad `Cerrada`,
- **entonces** se informa que se muestra como historial de solo lectura y que no existe reapertura en esta entrega.
