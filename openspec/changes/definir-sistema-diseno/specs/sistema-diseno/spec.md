# Especificación delta: Sistema de diseño

## DS-01 — Jerarquía visual

La interfaz debe distinguir claramente títulos, subtítulos, etiquetas, texto de apoyo, valores monetarios y el contexto de la actividad seleccionada.

## DS-02 — Espaciado

La interfaz debe usar una escala consistente de 4, 8, 12, 16, 24 y 32 px.

## DS-03 — Controles

Botones, campos y selectores deben compartir radios, altura mínima y estados visuales consistentes.

## DS-04 — Estados semánticos

Deben distinguirse visualmente: éxito, advertencia, error, actividad abierta/cerrada y transferencia pendiente/pagada. Ningún estado crítico debe depender solamente del color.

## DS-05 — Accesibilidad

Todos los controles deben tener etiqueta visible o accesible, foco visible y mensajes de error comprensibles.

## DS-06 — Responsividad básica

La interfaz debe ser utilizable en anchos de escritorio y móvil sin ocultar controles esenciales del flujo.

## DS-07 — Actividad seleccionada reconocible

- **Dado** que existe una actividad seleccionada,
- **cuando** el usuario observa el Paso 1,
- **entonces** el nombre, estado, tipo de cambio, cantidad de participantes y cantidad de gastos de esa actividad se distinguen claramente del formulario para crear otra.

## DS-08 — Estados de interacción

- **Dado** un botón, campo o selector habilitado,
- **cuando** recibe `hover`, `focus-visible` o `active`,
- **entonces** el componente muestra feedback visual consistente sin desplazar significativamente el contenido.

- **Dado** un control deshabilitado,
- **cuando** el usuario pasa el puntero sobre él,
- **entonces** no adopta apariencia de acción disponible.

## DS-09 — Solo lectura después de cierre

- **Dado** una actividad con estado `Cerrada`,
- **cuando** se muestran participantes, gastos, balances y conciliaciones,
- **entonces** los datos continúan visibles como historial y ninguna acción de modificación se presenta como disponible.

## DS-10 — Acciones bloqueadas después de conciliación

- **Dado** una actividad abierta con conciliaciones confirmadas que impiden modificar gastos en la versión actual,
- **cuando** se muestran los gastos,
- **entonces** la interfaz no permite entrar al modo edición ni presenta `Editar` o `Eliminar` como acciones disponibles.

## DS-11 — Placeholders inequívocos

- **Dado** un campo vacío que muestra un ejemplo,
- **cuando** el usuario observa el formulario,
- **entonces** el ejemplo se distingue visualmente de un valor real y usa `Ej.:` cuando sea necesario para evitar ambigüedad.

## DS-12 — Feedback contextual

- **Dado** una acción que finaliza correctamente o es rechazada,
- **cuando** el sistema procesa la acción,
- **entonces** muestra un mensaje breve, comprensible y accesible que informa el resultado sin interrumpir innecesariamente el flujo.

## DS-13 — Tooltips de ayuda

- **Dado** un concepto técnico como `Tipo de cambio`, `Balance normalizado` o `Total normalizado`,
- **cuando** se ofrece ayuda contextual,
- **entonces** el tooltip complementa una etiqueta visible y puede entenderse sin depender exclusivamente del icono.

## DS-14 — Movimiento reducido

- **Dado** que el dispositivo indica `prefers-reduced-motion: reduce`,
- **cuando** se renderizan componentes interactivos,
- **entonces** se eliminan transformaciones y animaciones no esenciales sin perder feedback de estado.


## DS-15 — Orientación del estado de actividad

- **Dado** que existe una actividad activa,
- **cuando** se muestra su estado,
- **entonces** la interfaz acompaña el badge con una explicación breve y comprensible del significado de `Abierta` o `Cerrada`.

- Una actividad `Abierta` indica que el usuario puede continuar trabajando en ella antes del cierre.
- Una actividad `Cerrada` indica historial de solo lectura sin reapertura en esta entrega.
