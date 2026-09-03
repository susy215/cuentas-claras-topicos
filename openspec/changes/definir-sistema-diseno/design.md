# Diseño: Sistema visual

## Principios

El sistema visual prioriza comprensión antes que decoración. Cada componente debe ayudar a responder al menos una de estas preguntas: qué puedo hacer, qué está seleccionado, qué ocurrió después de mi acción y qué ya no puedo modificar.

Los efectos visuales se usan como señal de interacción y feedback, no como animación ornamental.

## Tokens

Se conserva la identidad cromática actual para evitar un rediseño arbitrario y se formalizan sus valores:

- Fuente: sistema sans-serif (`Inter`, `Segoe UI`, Arial, sans-serif como fallback sin dependencia externa).
- Espaciado: 4, 8, 12, 16, 24, 32 px.
- Radios: 8 px para controles y 12 px para tarjetas.
- Borde: 1 px sólido semántico.
- Ancho de contenido: máximo 1120 px.
- Altura mínima de controles interactivos: 44 px.
- Sombra de tarjeta: `0 8px 24px rgba(23, 32, 51, .08)`.
- Sombra interactiva elevada: `0 10px 28px rgba(23, 32, 51, .12)`.
- Duración de transición: entre 120 y 180 ms para color, borde, sombra y transformación.

## Colores semánticos

Se definen mediante variables CSS y los componentes deben consumir variables, no valores dispersos:

- fondo `#f6f8fb`;
- superficie `#ffffff`;
- texto `#172033`;
- texto secundario `#657084`;
- borde `#dfe4ec`;
- primario `#145a69`;
- éxito `#147a4f`;
- advertencia `#9a6500`;
- error/peligro `#b42318`;
- información `#315f9b`.

El color nunca será el único indicador de estado: debe combinarse con texto, badge, icono de apoyo o estado del control.

## Componentes

- encabezado general de la aplicación;
- contexto de actividad seleccionada;
- formulario de creación de actividad;
- selector/lista de actividades;
- formulario;
- botón primario/secundario/peligro;
- campo y selector;
- lista de participantes;
- tarjeta de gasto;
- resumen multimoneda;
- tarjeta de balance;
- transferencia de liquidación;
- badge `Abierta`/`Cerrada` y `Pendiente`/`Pagado`;
- mensaje de estado/error;
- tooltip contextual;
- estado vacío.

## Actividad seleccionada

Cuando existe una actividad seleccionada, debe existir un bloque visual dominante que indique:

- nombre de la actividad;
- estado `Abierta` o `Cerrada`;
- tipo de cambio `1 USDT = X BOB`;
- cantidad de participantes;
- cantidad de gastos.

El formulario para crear otra actividad no debe competir visualmente con ese contexto. Debe quedar claro cuál actividad se está consultando o modificando.

## Actividad cerrada

Una actividad `Cerrada` se presenta como historial de solo lectura:

- datos, gastos, balances y conciliaciones continúan visibles;
- acciones de mutación no se muestran como disponibles;
- botones `Editar`, `Eliminar`, `Agregar`, `Guardar tasa`, `Registrar gasto`, `Confirmar conciliación` y `Cerrar actividad` no deben inducir a pensar que aún pueden ejecutarse;
- el estado `Cerrada` debe ser visible sin depender solamente del color.

La protección del dominio se mantiene aunque la interfaz oculte o deshabilite acciones.

## Acciones después de conciliación

Cuando una actividad abierta ya contiene pagos confirmados y la regla de dominio impide editar o eliminar gastos, la interfaz no debe permitir entrar al modo edición ni mostrar esas acciones como disponibles.

La regla visual debe reflejar la regla de negocio existente; no sustituirla.

## Estados interactivos

### Botones

- `normal`: estado base con contraste suficiente;
- `hover`: cambio sutil de tono o superficie, elevación máxima de 1 px y sombra interactiva;
- `focus-visible`: contorno de 3 px con separación de 2 px;
- `active`: elimina la elevación y confirma visualmente la pulsación;
- `disabled`: menor énfasis, cursor no interactivo y sin efecto `hover`.

### Campos y selectores

- `normal`: borde semántico base;
- `hover`: borde ligeramente más perceptible sin simular error;
- `focus`: borde/contorno primario claramente visible;
- `error`: mensaje textual contextual y estado visual de error;
- `disabled/read-only`: aspecto inequívoco de no edición.

## Placeholders y ayuda

Los placeholders son ejemplos, no valores. Deben mostrarse con menor contraste que un dato ingresado y, cuando pueda existir ambigüedad, usar prefijo `Ej.:`.

Ejemplos:

- actividad: `Ej.: Viaje a Samaipata`;
- tipo de cambio: `Ej.: 6,90` con ayuda `1 USDT equivale a X BOB`;
- participante: `Ej.: Ana Pérez`;
- descripción: `Ej.: Cena`;
- monto: `Ej.: 100,00`.

## Feedback

Las acciones relevantes deben producir feedback inmediato y comprensible mediante un mensaje no modal cuando la operación se complete o falle.

Ejemplos:

- `Participante agregado.`;
- `Gasto registrado.`;
- `Conciliación confirmada.`;
- `No se puede cerrar: existen conciliaciones pendientes.`

El mensaje usa `aria-live` y no debe exigir que el usuario cierre manualmente una alerta para continuar.

## Tooltips

Se permiten tooltips breves solo en conceptos que no sean obvios para el usuario, por ejemplo:

- `Tipo de cambio`;
- `Balance normalizado`;
- `Total normalizado`.

El tooltip complementa una etiqueta visible; no la reemplaza.

## Iconografía

La iconografía puede apoyar la identificación de actividad, participantes, gastos, conversión, estado pagado y estado pendiente. Ninguna acción crítica dependerá exclusivamente de un icono sin texto o nombre accesible.

El catálogo de categorías de gasto no forma parte de este cambio.

## Microinteracciones

Las transiciones deben ser breves y no impedir el uso. Se admite elevación sutil de tarjeta o botón en `hover` y aparición suave de mensajes. Si el sistema operativo indica preferencia por movimiento reducido, se eliminarán transformaciones y animaciones no esenciales mediante `prefers-reduced-motion`.

## Responsividad

- escritorio: formularios pueden usar dos columnas cuando exista espacio;
- móvil: controles pasan a una columna sin desbordamiento horizontal;
- ninguna acción esencial puede desaparecer por el ancho de pantalla.

## Accesibilidad

- foco visible;
- controles con etiqueta visible o accesible;
- altura mínima interactiva de 44 px;
- errores expresados con texto, no solo color;
- estados cerrados, pendientes y pagados expresados mediante texto;
- contraste suficiente entre texto, fondo y controles.


## Orientación de estado de actividad

El badge `Abierta`/`Cerrada` se complementa con un mensaje dentro del contexto de actividad activa:

- actividad abierta: `Puedes continuar trabajando en esta actividad y completar información o conciliaciones antes del cierre.`;
- actividad cerrada: `Historial de solo lectura · no se permite reapertura en esta entrega.`

Esto evita que el usuario tenga que deducir el significado operativo del estado únicamente por el color o la palabra del badge.
