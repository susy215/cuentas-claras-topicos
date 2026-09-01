# Diseño técnico: Versión inicial de Cuentas Claras

## 1. Contexto

Cuentas Claras será una aplicación web desarrollada por incrementos para administrar actividades con participantes, gastos compartidos y pagos de conciliación. El diseño prioriza claridad, trazabilidad con las especificaciones y entrega dentro del tiempo disponible.

Este documento describe el enfoque técnico. No contiene implementación.

## 2. Objetivos del diseño

- Mantener una relación clara entre requisitos, archivos, tareas y pruebas.
- Separar interfaz, cálculos y almacenamiento para facilitar cambios y corrección de errores.
- Evitar errores monetarios por decimales.
- Mantener sincronizados los participantes, gastos, balances y propuesta de liquidación.
- Facilitar que cualquier persona que revise, mantenga o utilice la aplicación pueda comprender claramente su estructura y funcionamiento.

## 3. Decisiones técnicas

### DT-01 — Tecnologías base

Se utilizarán:

- HTML para la estructura de la página;
- CSS para la presentación visual;
- JavaScript para eventos, validaciones, estado, almacenamiento y cálculos.

No se utilizará un framework en la primera versión.

**Justificación:** el proyecto es pequeño, el tiempo es limitado y se busca aprender los fundamentos sin añadir configuración ni conceptos que no son necesarios para cumplir el alcance.

**Consecuencia:** algunas tareas que un framework automatiza deberán organizarse manualmente, pero el funcionamiento será más directo de estudiar.

### DT-02 — Organización de archivos

La implementación se organizará así:

```text
cuentas-claras-topicos/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── calculations.js
    └── storage.js
```

Responsabilidades:

- `index.html`: formularios, botones y secciones visibles;
- `css/styles.css`: distribución y apariencia;
- `js/app.js`: estado, eventos, validaciones y actualización de la interfaz;
- `js/calculations.js`: división de gastos, balances y propuesta de liquidación;
- `js/storage.js`: lectura y escritura en `localStorage`.

**Justificación:** esta separación evita concentrar todo el comportamiento en un archivo largo y facilita ubicar cambios o errores.

### DT-03 — Interfaz de una sola página

La aplicación tendrá una sola página con secciones que se incorporarán por incrementos:

1. Actividades y encargado.
2. Participantes.
3. Gastos.
4. Balances.
5. Propuesta de liquidación.
6. Pagos y pendientes.

Las secciones se actualizarán sin cambiar de página.

**Justificación:** reduce la complejidad de navegación y permite observar inmediatamente cómo un gasto modifica balances y liquidación.

### DT-04 — Estado en memoria

Mientras la página esté abierta, JavaScript mantendrá un único objeto de estado. Este objeto contendrá:

- una colección de actividades;
- la referencia o identificador de la actividad seleccionada;
- los participantes pertenecientes a cada actividad;
- los gastos pertenecientes a cada actividad;
- los pagos pertenecientes a cada actividad.

Los balances, la propuesta de liquidación y los estados de pago no se almacenarán como colecciones independientes. Se calcularán a partir de los participantes, gastos y pagos de la actividad seleccionada.

Al cambiar la actividad seleccionada, la interfaz utilizará exclusivamente los datos asociados a esa actividad.

**Justificación:** los balances y la liquidación son resultados calculados. Volver a calcularlos desde participantes y gastos evita inconsistencias entre datos almacenados y resultados visibles.

### DT-05 — Modelo de participante

Cada participante tendrá:

- `id`: identificador interno único;
- `name`: nombre visible.

Ejemplo conceptual:

```text
Participante
- id: p1
- name: Ana
```

Los nombres se normalizarán para comprobar duplicados ignorando mayúsculas, minúsculas y espacios externos. El nombre original se conservará para mostrarlo.

### DT-06 — Modelo de gasto

Cada gasto tendrá:

- `id`: identificador interno único;
- `description`: descripción;
- `amountCents`: monto expresado en centavos enteros;
- `payerId`: identificador de quien pagó;
- `participantIds`: identificadores de quienes asumen el gasto, en orden estable.

Ejemplo conceptual:

```text
Gasto
- id: g1
- description: Cena
- amountCents: 9000
- payerId: p1
- participantIds: [p1, p2, p3]
```

**Justificación:** utilizar identificadores evita depender del nombre para relacionar gastos y personas.

### DT-06A — Flujo de edición de un gasto

Para iniciar la edición, el sistema identificará el gasto mediante su `id` y copiará sus datos actuales al formulario de gastos. Iniciar la edición no modificará el gasto almacenado.

Al confirmar la edición:

1. Se validarán la descripción, el monto, el pagador y los participantes seleccionados con las mismas reglas utilizadas al registrar un gasto.
2. Si la validación falla, el gasto original permanecerá sin modificaciones y se mostrará un mensaje específico.
3. Si la validación es correcta, se reemplazarán los datos editables del gasto identificado, conservando su identificador.
4. Después del reemplazo se guardará el estado válido y se recalcularán la división, los balances y la propuesta de liquidación.

Al cancelar la edición:

1. Se descartarán los cambios presentes en el formulario.
2. No se modificará el estado.
3. El gasto conservará todos sus datos anteriores.
4. El formulario dejará el modo de edición.

La interfaz deberá distinguir claramente entre registrar un gasto nuevo y confirmar la edición de un gasto existente.

La decisión sobre qué sucede con los pagos existentes si posteriormente se edita o elimina un gasto continúa pendiente. Este flujo no define ni presupone ese comportamiento.

### DT-07 — Persistencia incremental

El estado se guardará en `localStorage` usando la clave versionada:

```text
cuentasClaras.v1
```

El flujo será:

1. Al abrir la aplicación, intentar recuperar el estado guardado.
2. Si no existe, iniciar con colecciones vacías.
3. Después de cada operación válida, guardar el estado completo.
4. Si el contenido guardado no puede interpretarse, informar el problema y evitar que la aplicación se detenga sin explicación.

**Limitación del primer incremento:** los datos existirán solamente en el mismo navegador y dispositivo.

Después de verificar el flujo funcional, la persistencia podrá sustituirse o complementarse mediante una base de datos. Esa incorporación requerirá un cambio delta propio, la selección justificada de tecnología y la actualización de las tareas y pruebas.

### DT-08 — Representación del dinero

Los montos ingresados en bolivianos se convertirán a centavos enteros antes de calcular o almacenar.

Ejemplos:

- Bs. 100 se representa como `10000` centavos.
- Bs. 33,33 se representa como `3333` centavos.

Los centavos se convertirán nuevamente a bolivianos solamente para mostrarlos.

**Justificación:** evita errores de precisión producidos por operaciones decimales en JavaScript.

### DT-09 — División equitativa y centavos restantes

Para dividir un gasto:

1. Dividir los centavos enteros entre el número de participantes seleccionados.
2. Asignar a cada participante la parte entera base.
3. Distribuir los centavos restantes de uno en uno.
4. Priorizar al pagador si está incluido.
5. Si el pagador está excluido, seguir el orden estable de participantes seleccionados.
6. Comprobar que la suma de las partes sea igual al monto original.

Ejemplo: Bs. 100 entre Ana, Beto y Carla, pagado por Ana:

- Ana: Bs. 33,34.
- Beto: Bs. 33,33.
- Carla: Bs. 33,33.

### DT-10 — Cálculo de balances

Para cada participante, el balance comienza en cero. Por cada gasto:

1. Sumar el monto completo al balance del pagador.
2. Restar a cada participante incluido la parte que le corresponde.
3. Verificar que la suma de todos los balances permanezca exactamente en cero.

Un resultado positivo significa que la persona debe recibir; uno negativo significa que debe pagar.

### DT-11 — Propuesta de liquidación

El cálculo separará:

- deudores: balances negativos;
- acreedores: balances positivos.

Después relacionará deudores y acreedores en un orden estable, proponiendo transferencias hasta reducir todos los balances matemáticamente a cero.

El resultado deberá ser válido y reproducible para los mismos datos. No se promete obtener el mínimo absoluto de transferencias porque la consigna no lo exige.

La propuesta no se almacenará automáticamente como un pago realizado. Los pagos completos o parciales se registrarán de manera explícita por el encargado en el Incremento 2.

### DT-12 — Actividad y encargado

Cada actividad tendrá, como mínimo:

- identificador único;
- nombre libre;
- categoría;
- identificador del participante encargado;
- estado `Abierta` o `Cerrada`.

El encargado será un participante de la actividad y será la única persona que opere la aplicación. No habrá autenticación ni cuentas individuales.

### DT-12A — Validación del encargado antes de registrar pagos

Antes de registrar un pago, el sistema comprobará que:

1. Existe una actividad seleccionada.
2. La actividad tiene un identificador de encargado.
3. El identificador corresponde a un participante perteneciente a esa actividad.

Si alguna de estas condiciones no se cumple:

- el pago no se agregará al estado;
- los pagos y montos pendientes existentes permanecerán sin modificaciones;
- se mostrará un mensaje indicando que primero debe designarse un encargado válido.

Esta validación se ejecutará antes de validar o guardar el monto del pago. La interfaz podrá impedir anticipadamente el inicio del registro, pero la validación deberá repetirse al confirmar la operación para proteger el estado.

### DT-13 — Registro de pagos

Cada pago tendrá, como mínimo:

- identificador único;
- actividad;
- persona que paga;
- persona que recibe;
- monto en centavos;
- referencia a la transferencia pendiente correspondiente.

Una transferencia mostrará monto requerido, total pagado y monto pendiente. El sistema rechazará pagos que superen el pendiente.

### DT-13A — Cálculo del pendiente y estado de una transferencia

Para cada transferencia se utilizarán los siguientes valores, expresados en centavos enteros:

- `requiredCents`: monto requerido por la transferencia;
- `paidCents`: suma de todos los pagos válidos registrados para esa transferencia;
- `pendingCents`: `requiredCents - paidCents`.

Antes de guardar un nuevo pago se comprobará que su monto sea mayor que cero y no supere `pendingCents`.

El estado se derivará en cada actualización y no se almacenará como un dato independiente:

- `Pendiente` cuando `paidCents === 0` y `pendingCents === requiredCents`;
- `Parcial` cuando `paidCents > 0` y `paidCents < requiredCents`;
- `Pagado` cuando `paidCents === requiredCents` y `pendingCents === 0`.

Para datos válidos siempre deberá cumplirse:

`0 <= paidCents <= requiredCents`

y:

`requiredCents === paidCents + pendingCents`.

Si un pago es inválido o supera el pendiente, no se modificará la colección de pagos y el estado derivado conservará su valor anterior.

La decisión sobre cómo tratar los pagos ya registrados cuando posteriormente se edita o elimina un gasto y cambia la transferencia requerida continúa pendiente.

### DT-14 — Validación antes de modificar el estado

Antes de guardar una operación se validará:

- nombre obligatorio y no repetido;
- descripción obligatoria;
- monto mayor que cero y con máximo dos decimales;
- pagador existente y seleccionado;
- al menos un participante existente seleccionado;
- referencias válidas entre gastos y participantes.

Si una validación falla:

- no se modifica el estado;
- no se reemplazan datos válidos;
- se muestra un mensaje específico.

### DT-15 — Eliminaciones y confirmación

Antes de eliminar un participante o gasto se usará la confirmación incorporada del navegador.

Un participante asociado como pagador o integrante de cualquier gasto no podrá eliminarse, aunque su balance sea cero.

**Justificación:** la confirmación nativa es suficiente para la primera entrega y reduce el trabajo de interfaz sin eliminar la protección contra borrados accidentales.

### DT-16 — Ciclo de actualización

Después de cada operación válida:

1. Actualizar el estado en memoria.
2. Guardar actividades, participantes, gastos y pagos en `localStorage`.
3. Volver a mostrar la información de la actividad seleccionada.
4. Recalcular y mostrar balances.
5. Recalcular y mostrar la propuesta de liquidación.
6. Recalcular y mostrar pagos y montos pendientes.

### DT-17 — Cierre de actividad

Una actividad podrá cerrarse cuando todas sus transferencias tengan pendiente cero o cuando los balances no requieran transferencias. El cierre requerirá confirmación.

### DT-18 — Estrategia de pruebas

Los criterios DADO-CUANDO-ENTONCES del `spec.md` serán la base de las pruebas.

La implementación se realizará tarea por tarea. Antes de avanzar, se verificará el comportamiento correspondiente. El escenario de Samaipata será una prueba integral obligatoria.

## 4. Manejo de datos dañados

Si el contenido de `localStorage` no es JSON válido o no contiene la estructura esperada:

- la aplicación no intentará calcular con esos datos;
- mostrará un mensaje de error comprensible;
- iniciará una sesión vacía sin sobrescribir automáticamente el contenido dañado.

Esta decisión permite informar el problema y evita que la aplicación falle sin explicación.

## 5. Decisiones aplazadas o descartadas

### Framework de interfaz

Se descarta para reducir configuración y carga de aprendizaje.

### Base de datos y servidor — aplazados

No forman parte del primer incremento. Se evaluarán mediante un cambio delta después de verificar el flujo funcional. No se seleccionará una tecnología hasta revisar el equipo, el plazo y las exigencias del docente.

### Varias páginas

Se descartan porque una sola página permite observar el efecto inmediato de cada operación.

### Transferencias bancarias o QR reales — descartadas

La aplicación registrará que un pago fue entregado, pero no moverá dinero ni se conectará con bancos o sistemas QR.

### Confirmación directa por participantes — aplazada

Sin cuentas ni inicio de sesión, los participantes no confirmarán personalmente gastos o cuotas. El encargado será el único operador.

### Optimización del número mínimo absoluto de transferencias

Se descarta porque no es una exigencia confirmada. La prioridad es producir una propuesta correcta, estable y explicable.

## 6. Trazabilidad y cambios

Si cambia una regla o decisión antes de implementar, primero se actualizarán `proposal.md`, los specs afectados y este diseño. Después se actualizará `tasks.md`.

Después de implementar y verificar un cambio, OpenSpec podrá sincronizar sus especificaciones y archivarlo. Una regla nueva posterior se documentará mediante otro cambio delta; no se modificará silenciosamente un cambio ya archivado.

## 7. Pendientes y condiciones de continuidad

- Confirmar la conformación definitiva del equipo y si Yandira continuará con esta propuesta o se integrará a otro grupo.
- Si existe integración, comparar estos artefactos con los del grupo antes de reemplazar trabajo aprobado.
- Confirmar la herramienta SDD definitiva si el grupo utiliza GitHub Spec Kit u otra alternativa.
- Definir el catálogo inicial de categorías de actividad.
- Definir qué ocurre si se edita o elimina un gasto después de registrar pagos.
- Definir si una actividad cerrada puede reabrirse.
- Evaluar si el tiempo permite incorporar una base de datos después de completar y probar el flujo funcional.
