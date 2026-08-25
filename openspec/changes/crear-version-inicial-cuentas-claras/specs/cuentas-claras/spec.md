# Especificación funcional: Cuentas Claras

## Propósito

Definir comportamientos verificables para la construcción incremental de la aplicación web Cuentas Claras.

## Reglas de negocio generales

1. Cada participante, gasto, pago y balance pertenece a una actividad determinada.
2. Los nombres se comparan ignorando mayúsculas, minúsculas y espacios al inicio o al final.
3. Dos personas con el mismo nombre deben diferenciarse mediante apellidos u otra parte del nombre.
4. Los montos deben ser mayores que cero y tener como máximo dos decimales.
5. Los cálculos monetarios se realizan en centavos enteros.
6. Cada gasto se divide equitativamente entre las personas seleccionadas.
7. El pagador puede estar incluido o excluido de la división.
8. Si una división produce centavos restantes, se asignan primero al pagador cuando este participa. Si está excluido, se asignan a las primeras personas seleccionadas, siguiendo un orden estable.
9. La suma de todos los balances debe ser exactamente cero.
10. La propuesta de liquidación indica lo que debería pagarse; los pagos registrados indican lo que el encargado declara como efectivamente entregado.
11. Los pagos pueden ser completos o parciales y nunca pueden superar el monto pendiente.
12. Solamente el encargado opera la aplicación; no existen cuentas ni inicio de sesión en el alcance aprobado.

## RF-01 — Registrar participante

**Requisito:** El sistema debe permitir registrar un participante mediante un nombre que no esté vacío ni repetido.

### Criterios de aceptación

#### CA-01.1 — Registro válido

- **Dado** que no existe un participante llamado Ana,
- **cuando** se registra el nombre `Ana`,
- **entonces** Ana aparece en la lista de participantes.

#### CA-01.2 — Nombre vacío

- **Dado** que el campo del nombre está vacío o contiene solamente espacios,
- **cuando** se intenta registrar al participante,
- **entonces** el sistema rechaza el registro e informa que el nombre es obligatorio.

#### CA-01.3 — Nombre repetido

- **Dado** que ya existe `Ana`,
- **cuando** se intenta registrar `ana` o ` ANA `,
- **entonces** el sistema rechaza el registro e informa que el participante ya existe.

#### CA-01.4 — Personas con el mismo nombre

- **Dado** que ya existe `Ana Pérez`,
- **cuando** se registra `Ana López`,
- **entonces** el sistema permite el registro porque los nombres completos son diferentes.

## RF-02 — Listar participantes

**Requisito:** El sistema debe mostrar la lista de participantes registrados.

### Criterios de aceptación

#### CA-02.1 — Lista con participantes

- **Dado** que se registraron Ana, Beto y Carla,
- **cuando** se consulta la lista,
- **entonces** aparecen los tres participantes.

#### CA-02.2 — Lista vacía

- **Dado** que todavía no existe ningún participante,
- **cuando** se consulta la lista,
- **entonces** el sistema informa que aún no hay participantes registrados.

#### CA-02.3 — Actualización de la lista

- **Dado** que Ana aparece en la lista,
- **cuando** se registra a Beto,
- **entonces** la lista muestra a Ana y Beto sin necesidad de refrescar la página.

## RF-03 — Eliminar participante

**Requisito:** El sistema debe permitir eliminar participantes que no estén asociados como pagadores ni como integrantes de ningún gasto, siempre después de solicitar confirmación.

### Criterios de aceptación

#### CA-03.1 — Eliminación permitida

- **Dado** que Beto no está asociado a ningún gasto,
- **cuando** se solicita eliminarlo y se confirma la operación,
- **entonces** Beto deja de aparecer en la lista.

#### CA-03.2 — Participante asociado

- **Dado** que Beto figura como pagador o participante de un gasto,
- **cuando** se intenta eliminarlo,
- **entonces** el sistema impide la eliminación e informa que está asociado a uno o más gastos.

#### CA-03.3 — Balance cero con asociación

- **Dado** que Beto tiene balance cero, pero continúa asociado a un gasto,
- **cuando** se intenta eliminarlo,
- **entonces** el sistema impide la eliminación.

#### CA-03.4 — Cancelación

- **Dado** que se solicitó eliminar a Beto,
- **cuando** el usuario cancela la confirmación,
- **entonces** Beto permanece registrado sin modificaciones.

## RF-04 — Registrar gasto

**Requisito:** El sistema debe permitir registrar un gasto indicando descripción, monto, pagador y participantes incluidos en la división.

### Criterios de aceptación

#### CA-04.1 — Registro válido

- **Dado** que existen Ana, Beto y Carla,
- **cuando** se registra `Cena`, Bs. 90, pagado por Ana y dividido entre los tres,
- **entonces** el gasto aparece en la lista con esos datos.

#### CA-04.2 — Sin participantes registrados

- **Dado** que no existe ningún participante registrado,
- **cuando** se intenta registrar un gasto,
- **entonces** el sistema impide la operación e informa que primero debe agregarse al menos un participante.

#### CA-04.3 — Descripción vacía

- **Dado** que la descripción está vacía o contiene solamente espacios,
- **cuando** se intenta guardar el gasto,
- **entonces** el sistema rechaza el registro e informa que la descripción es obligatoria.

#### CA-04.4 — Monto inválido

- **Dado** un monto vacío, igual a cero, negativo o con más de dos decimales,
- **cuando** se intenta guardar el gasto,
- **entonces** el sistema rechaza el registro e informa que el monto debe ser mayor que cero y tener como máximo dos decimales.

#### CA-04.5 — Pagador obligatorio

- **Dado** que no se seleccionó quién pagó,
- **cuando** se intenta guardar el gasto,
- **entonces** el sistema rechaza el registro e informa que debe seleccionarse un pagador.

## RF-05 — Seleccionar y dividir participantes

**Requisito:** El sistema debe permitir seleccionar entre qué participantes se dividirá equitativamente cada gasto.

### Criterios de aceptación

#### CA-05.1 — Selección predeterminada

- **Dado** que existen Ana, Beto y Carla,
- **cuando** se inicia el registro de un gasto,
- **entonces** los tres aparecen seleccionados por defecto.

#### CA-05.2 — Pagador excluido

- **Dado** un gasto de Bs. 90 pagado por Ana,
- **cuando** se seleccionan solamente Beto y Carla,
- **entonces** cada uno asume Bs. 45 y Ana tiene un balance positivo de Bs. 90 por ese gasto.

#### CA-05.3 — Pagador incluido

- **Dado** un gasto de Bs. 90 pagado por Ana,
- **cuando** se seleccionan Ana, Beto y Carla,
- **entonces** cada participante asume Bs. 30 y Ana tiene un balance positivo de Bs. 60 por ese gasto.

#### CA-05.4 — Ninguna persona seleccionada

- **Dado** que se desmarcaron todos los participantes,
- **cuando** se intenta guardar el gasto,
- **entonces** el sistema rechaza el registro e informa que debe seleccionarse al menos una persona.

#### CA-05.5 — División no exacta con pagador incluido

- **Dado** un gasto de Bs. 100 pagado por Ana y dividido entre Ana, Beto y Carla,
- **cuando** se calcula la división,
- **entonces** Ana asume Bs. 33,34, Beto Bs. 33,33 y Carla Bs. 33,33; las partes suman exactamente Bs. 100.

#### CA-05.6 — División no exacta con pagador excluido

- **Dado** un gasto de Bs. 100 pagado por Ana y dividido, en ese orden, entre Beto, Carla y Diego,
- **cuando** se calcula la división,
- **entonces** Beto asume Bs. 33,34, Carla Bs. 33,33 y Diego Bs. 33,33; las partes suman exactamente Bs. 100.

## RF-06 — Editar gasto

**Requisito:** El sistema debe permitir modificar los datos de un gasto registrado y recalcular los resultados.

### Criterios de aceptación

#### CA-06.1 — Edición válida

- **Dado** un gasto `Cena` de Bs. 90,
- **cuando** el monto se modifica a Bs. 120,
- **entonces** el gasto muestra Bs. 120 y los balances se recalculan.

#### CA-06.2 — Cambio de participantes

- **Dado** un gasto dividido entre Ana, Beto y Carla,
- **cuando** Carla es excluida mediante la edición,
- **entonces** el gasto se divide solamente entre Ana y Beto y los balances se actualizan.

#### CA-06.3 — Edición inválida

- **Dado** un gasto válido,
- **cuando** se intenta reemplazar su monto por cero o dejar su descripción vacía,
- **entonces** el sistema rechaza el cambio y conserva los datos anteriores.

#### CA-06.4 — Cancelar edición

- **Dado** que se modificaron datos de un gasto,
- **cuando** se cancela la edición,
- **entonces** el gasto conserva sus datos anteriores.

## RF-07 — Eliminar gasto

**Requisito:** El sistema debe permitir eliminar un gasto después de solicitar confirmación.

### Criterios de aceptación

#### CA-07.1 — Confirmar eliminación

- **Dado** un gasto registrado,
- **cuando** se solicita eliminarlo y se confirma,
- **entonces** el gasto desaparece y los balances se recalculan.

#### CA-07.2 — Cancelar eliminación

- **Dado** un gasto registrado,
- **cuando** se solicita eliminarlo y se cancela,
- **entonces** el gasto y los balances permanecen sin cambios.

## RF-08 — Calcular y mostrar balances

**Requisito:** El sistema debe calcular y mostrar el balance de cada participante a partir de los gastos registrados.

### Reglas específicas

- Un balance positivo indica que la persona debe recibir dinero.
- Un balance negativo indica que la persona debe pagar.
- Un balance cero indica que la persona está equilibrada según los gastos registrados.

### Criterios de aceptación

#### CA-08.1 — Balance positivo y negativo

- **Dado** un gasto de Bs. 90 pagado por Ana y dividido entre Ana, Beto y Carla,
- **cuando** se consultan los balances,
- **entonces** Ana tiene `+Bs. 60`, Beto `-Bs. 30` y Carla `-Bs. 30`.

#### CA-08.2 — Sin gastos

- **Dado** que existen participantes, pero no hay gastos,
- **cuando** se consultan los balances,
- **entonces** todos muestran un balance de Bs. 0.

#### CA-08.3 — Suma exacta

- **Dado** cualquier conjunto válido de gastos,
- **cuando** se calculan los balances,
- **entonces** la suma de todos ellos es exactamente Bs. 0.

#### CA-08.4 — Actualización

- **Dado** que existen balances calculados,
- **cuando** se agrega, edita o elimina un gasto,
- **entonces** los balances se actualizan con los nuevos datos.

## RF-09 — Generar propuesta de liquidación

**Requisito:** El sistema debe calcular y mostrar una propuesta de transferencias que, si fueran realizadas, permitirían que todos los participantes quedaran con balance cero.

**Aclaración:** La propuesta se calcula antes de considerar los pagos registrados y no debe presentar una transferencia como realizada automáticamente.

### Criterios de aceptación

#### CA-09.1 — Propuesta de transferencias

- **Dado** que Ana tiene `+Bs. 60`, Beto `-Bs. 30` y Carla `-Bs. 30`,
- **cuando** se consulta la propuesta de liquidación,
- **entonces** el sistema indica que Beto debe pagar Bs. 30 a Ana y Carla debe pagar Bs. 30 a Ana.

#### CA-09.2 — Sin transferencias pendientes

- **Dado** que todos los participantes tienen balance cero,
- **cuando** se consulta la propuesta de liquidación,
- **entonces** el sistema informa: `Todos los balances están en cero. No se necesitan transferencias y no existen pagos pendientes según los gastos registrados`.

#### CA-09.3 — Validación matemática

- **Dado** un conjunto válido de balances,
- **cuando** se genera la propuesta,
- **entonces** las transferencias propuestas, si fueran realizadas, dejarían matemáticamente todos los balances en cero.

#### CA-09.4 — Escenario de Samaipata

- **Dado** el escenario completo de Samaipata indicado en la consigna,
- **cuando** se calcula la propuesta de liquidación,
- **entonces** el sistema propone:
  - Diego debe pagar Bs. 400 a Ana.
  - Carla debe pagar Bs. 160 a Ana.
  - Beto no necesita realizar ninguna transferencia.

El orden en pantalla puede variar, pero el resultado económico debe ser equivalente.

#### CA-09.5 — Sin confirmación automática

- **Dado** que se muestra una transferencia propuesta,
- **cuando** el usuario consulta la liquidación,
- **entonces** el sistema no la presenta como pagada hasta que el encargado registre el pago correspondiente.

## RF-10 — Conservar datos al refrescar o volver a abrir

**Requisito:** El sistema debe conservar participantes y gastos después de refrescar o volver a abrir la página en el mismo navegador.

### Criterios de aceptación

#### CA-10.1 — Refrescar

- **Dado** que existen participantes y gastos registrados,
- **cuando** se refresca la página,
- **entonces** todos los datos reaparecen sin cambios.

#### CA-10.2 — Volver a abrir

- **Dado** que existen datos guardados,
- **cuando** se cierra y vuelve a abrir la aplicación en el mismo navegador,
- **entonces** se recuperan los participantes y gastos.

#### CA-10.3 — Sin información guardada

- **Dado** que es la primera apertura o no existen datos almacenados,
- **cuando** se abre la aplicación,
- **entonces** se muestran listas vacías sin producir errores.

#### CA-10.4 — Datos completos

- **Dado** un gasto guardado,
- **cuando** se recupera después de refrescar,
- **entonces** conserva su descripción, monto, pagador y participantes incluidos.

## Incremento 2 — Flujo completo de la actividad

## RF-11 — Crear y seleccionar actividad

**Fuente o necesidad:** ampliación aprobada por Yandira para separar distintos eventos de gastos.

**Requisito:** El sistema debe permitir crear una actividad mediante un nombre libre y una categoría seleccionada, y permitir elegir con cuál actividad se trabajará.

### Criterios de aceptación

#### CA-11.1 — Creación válida

- **Dado** un nombre de actividad no vacío y una categoría seleccionada,
- **cuando** el encargado crea la actividad,
- **entonces** la actividad aparece disponible y puede seleccionarse.

#### CA-11.2 — Nombre obligatorio

- **Dado** que el nombre está vacío o contiene solamente espacios,
- **cuando** se intenta crear la actividad,
- **entonces** el sistema rechaza la operación e informa que el nombre es obligatorio.

#### CA-11.3 — Separación de información

- **Dado** que existen dos actividades,
- **cuando** se selecciona una de ellas,
- **entonces** solamente se muestran sus participantes, gastos, balances y pagos.

**Pendiente:** definir el catálogo inicial de categorías.

## RF-12 — Designar encargado

**Fuente o necesidad:** decisión de que una sola persona opere el flujo de cada actividad sin inicio de sesión.

**Requisito:** El sistema debe permitir designar como encargado a uno de los participantes registrados en la actividad.

### Criterios de aceptación

#### CA-12.1 — Designación válida

- **Dado** que Ana pertenece a la actividad,
- **cuando** se la designa como encargada,
- **entonces** la actividad muestra a Ana como encargada.

#### CA-12.2 — Persona ajena a la actividad

- **Dado** que una persona no pertenece a la actividad,
- **cuando** se intenta designarla como encargada,
- **entonces** el sistema impide la operación.

#### CA-12.3 — Encargado obligatorio para registrar pagos

- **Dado** que la actividad no tiene encargado,
- **cuando** se intenta registrar un pago,
- **entonces** el sistema impide la operación e informa que primero debe designarse un encargado.

## RF-13 — Registrar pago completo o parcial

**Fuente o necesidad:** necesidad aprobada de reflejar abonos y pagos totales realizados durante la conciliación.

**Requisito:** El sistema debe permitir que el encargado registre un pago completo o parcial asociado a una transferencia pendiente.

### Criterios de aceptación

#### CA-13.1 — Pago parcial

- **Dado** que Diego debe pagar Bs. 400 a Ana,
- **cuando** el encargado registra un pago de Bs. 150,
- **entonces** el sistema muestra Bs. 150 pagados y Bs. 250 pendientes.

#### CA-13.2 — Pago completo

- **Dado** que Diego tiene Bs. 250 pendientes con Ana,
- **cuando** el encargado registra un pago de Bs. 250,
- **entonces** el sistema muestra esa obligación con monto pendiente de Bs. 0.

#### CA-13.3 — Monto inválido

- **Dado** un pago vacío, igual a cero, negativo o con más de dos decimales,
- **cuando** se intenta registrarlo,
- **entonces** el sistema rechaza la operación y conserva el pendiente anterior.

#### CA-13.4 — Pago superior al pendiente

- **Dado** que una transferencia tiene Bs. 250 pendientes,
- **cuando** se intenta registrar un pago mayor a Bs. 250,
- **entonces** el sistema rechaza la operación e informa el máximo permitido.

## RF-14 — Mostrar estado de pagos

**Fuente o necesidad:** el encargado necesita mostrar quién pagó, quién abonó parcialmente y cuánto falta.

**Requisito:** El sistema debe mostrar, para cada transferencia de la actividad, el monto requerido, el total pagado, el monto pendiente y su estado.

### Criterios de aceptación

#### CA-14.1 — Pendiente

- **Dado** que no se registraron pagos para una transferencia de Bs. 400,
- **cuando** se consulta su estado,
- **entonces** muestra Bs. 0 pagados, Bs. 400 pendientes y estado `Pendiente`.

#### CA-14.2 — Pago parcial

- **Dado** que se pagaron Bs. 150 de una transferencia de Bs. 400,
- **cuando** se consulta su estado,
- **entonces** muestra Bs. 150 pagados, Bs. 250 pendientes y estado `Parcial`.

#### CA-14.3 — Pagado

- **Dado** que el total pagado iguala el monto requerido,
- **cuando** se consulta su estado,
- **entonces** muestra monto pendiente de Bs. 0 y estado `Pagado`.

## RF-15 — Cerrar actividad conciliada

**Fuente o necesidad:** completar el flujo cuando todos los pagos requeridos fueron registrados.

**Requisito:** El sistema debe permitir que el encargado cierre una actividad únicamente cuando todas sus transferencias tengan monto pendiente igual a cero.

### Criterios de aceptación

#### CA-15.1 — Cierre permitido

- **Dado** que todas las transferencias tienen monto pendiente de Bs. 0,
- **cuando** el encargado confirma el cierre,
- **entonces** la actividad queda marcada como `Cerrada`.

#### CA-15.2 — Cierre impedido

- **Dado** que al menos una transferencia conserva un monto pendiente,
- **cuando** se intenta cerrar la actividad,
- **entonces** el sistema impide el cierre e informa cuánto falta por pagar.

#### CA-15.3 — Sin transferencias necesarias

- **Dado** que la actividad no requiere transferencias porque todos sus balances están en cero,
- **cuando** el encargado solicita cerrarla,
- **entonces** el sistema permite el cierre.

## Pendientes que afectan el Incremento 2

- Definir qué ocurre con los pagos registrados si posteriormente se edita o elimina un gasto.
- Definir el catálogo inicial de categorías de actividad.
- Definir si una actividad cerrada podrá reabrirse.

## Estado de aprobación

- RF-01 a RF-08: aprobados por Yandira.
- RF-09: aprobado con aclaración de que es una propuesta de liquidación y con la redacción definitiva de CA-09.2.
- RF-10: aprobado por Yandira.
- RF-11 a RF-15: alcance adicional aprobado por Yandira y pendiente de revisión docente.
- El conjunto completo queda sujeto a la conformación definitiva del equipo y a la retroalimentación del docente antes de generar código.
