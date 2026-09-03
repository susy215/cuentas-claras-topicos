# Diseño: Selección e historial de actividades

## Estado existente

Se reutiliza el modelo actual:

- `state.activities[]` contiene las actividades;
- `state.selectedActivityId` identifica la actividad seleccionada;
- cada actividad conserva sus propios participantes, gastos, pagos, tasa y estado.

No se requiere duplicar datos ni introducir un segundo modelo de historial.

## Selección

La interfaz presentará una lista o selector de actividades con, como mínimo:

- nombre;
- estado `Abierta` o `Cerrada`.

Al seleccionar una actividad se actualiza `selectedActivityId` y se vuelven a renderizar únicamente sus datos.

## Nueva actividad

Al crear una actividad:

1. se agrega una actividad nueva con sus colecciones vacías;
2. se asigna su `id` a `selectedActivityId`;
3. la interfaz pasa a mostrar el nuevo contexto;
4. los datos de actividades anteriores permanecen almacenados sin mezclarse.

## Historial

No se crea una copia histórica separada. Una actividad `Cerrada` dentro de `activities[]` constituye el registro histórico de esa actividad.

Al seleccionarla:

- se muestran sus participantes, gastos, balances y conciliaciones;
- las reglas del dominio y del sistema de diseño la mantienen en solo lectura;
- no existe acción de reapertura en esta entrega.

## Persistencia

Se reutiliza la persistencia local existente. La selección no debe provocar pérdida ni mezcla de información entre actividades.


## Orientación de estado

El bloque de actividad activa incluye un mensaje textual complementario al badge:

- `Abierta`: indica que se puede continuar trabajando en la actividad y completar información o conciliaciones antes del cierre.
- `Cerrada`: indica que el contenido es historial de solo lectura y que no existe reapertura en esta entrega.

El mensaje no sustituye las reglas del dominio; solo hace visible al usuario qué significa el estado.
