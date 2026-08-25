# Plan de tareas: Cuentas Claras

## Reglas para utilizar este plan

- Implementar una tarea por vez.
- No marcar una tarea con `[x]` hasta ejecutar su comprobación.
- Si cambia el entendimiento de una función, actualizar primero `proposal.md`, `spec.md` y `design.md`.
- Completar y verificar el Incremento 1 antes de comenzar el Incremento 2.
- No iniciar el Incremento 3 hasta aprobar su tecnología y sus requisitos.

## Incremento 1 — Funcionalidad mínima de la consigna

### 1. Preparar la estructura

- [ ] 1.1 Crear `index.html` con las secciones Participantes, Gastos, Balances y Propuesta de liquidación.
- [ ] 1.2 Crear `css/styles.css` para la presentación visual.
- [ ] 1.3 Crear `js/app.js`, `js/calculations.js` y `js/storage.js` respetando sus responsabilidades.
- [ ] 1.4 Abrir la aplicación en el navegador y comprobar que carga sin errores de consola.

### 2. Implementar participantes — RF-01, RF-02 y RF-03

- [ ] 2.1 Crear el formulario para registrar participantes.
- [ ] 2.2 Implementar la validación de nombre obligatorio y duplicados normalizados.
- [ ] 2.3 Mostrar y actualizar la lista de participantes.
- [ ] 2.4 Implementar la eliminación con confirmación.
- [ ] 2.5 Impedir la eliminación de participantes asociados a gastos.
- [ ] 2.6 Ejecutar los criterios CA-01.1 a CA-03.4 y registrar el resultado.

### 3. Implementar gastos — RF-04, RF-05, RF-06 y RF-07

- [ ] 3.1 Crear el formulario con descripción, monto, pagador y participantes incluidos.
- [ ] 3.2 Seleccionar por defecto a todos los participantes del gasto.
- [ ] 3.3 Validar descripción, monto, pagador y selección mínima de participantes.
- [ ] 3.4 Permitir excluir participantes, incluido el pagador.
- [ ] 3.5 Implementar la edición de gastos sin perder datos válidos ante errores.
- [ ] 3.6 Implementar la eliminación de gastos con confirmación.
- [ ] 3.7 Ejecutar los criterios CA-04.1 a CA-07.2 y registrar el resultado.

### 4. Implementar división monetaria — RF-05

- [ ] 4.1 Convertir los montos ingresados a centavos enteros.
- [ ] 4.2 Dividir el gasto equitativamente entre las personas seleccionadas.
- [ ] 4.3 Distribuir los centavos restantes priorizando al pagador cuando esté incluido.
- [ ] 4.4 Aplicar el orden estable cuando el pagador esté excluido.
- [ ] 4.5 Comprobar CA-05.5 y CA-05.6 y verificar que las partes sumen el monto original.

### 5. Implementar balances — RF-08

- [ ] 5.1 Calcular cuánto pagó y cuánto debe asumir cada participante.
- [ ] 5.2 Mostrar balances positivos, negativos y en cero.
- [ ] 5.3 Recalcular los balances después de agregar, editar o eliminar gastos.
- [ ] 5.4 Verificar automáticamente que la suma de balances sea exactamente cero.
- [ ] 5.5 Ejecutar los criterios CA-08.1 a CA-08.4 y registrar el resultado.

### 6. Implementar propuesta de liquidación — RF-09

- [ ] 6.1 Separar deudores y acreedores a partir de los balances.
- [ ] 6.2 Generar transferencias reproducibles hasta llevar matemáticamente los balances a cero.
- [ ] 6.3 Mostrar el mensaje definido cuando no se necesiten transferencias.
- [ ] 6.4 Diferenciar visualmente una transferencia propuesta de un pago registrado.
- [ ] 6.5 Ejecutar los criterios CA-09.1 a CA-09.5 y registrar el resultado.

### 7. Implementar persistencia local — RF-10

- [ ] 7.1 Guardar el estado válido bajo la clave versionada `cuentasClaras.v1`.
- [ ] 7.2 Recuperar los datos al abrir o refrescar la aplicación.
- [ ] 7.3 Iniciar con datos vacíos cuando no exista información guardada.
- [ ] 7.4 Manejar datos dañados sin bloquear ni sobrescribir automáticamente su contenido.
- [ ] 7.5 Ejecutar los criterios CA-10.1 a CA-10.4 y registrar el resultado.

### 8. Verificar el Incremento 1

- [ ] 8.1 Cargar el escenario completo de Samaipata.
- [ ] 8.2 Comprobar que Diego debe pagar Bs. 400 a Ana y Carla Bs. 160 a Ana.
- [ ] 8.3 Confirmar que Beto no necesita transferir y que la suma de balances es cero.
- [ ] 8.4 Refrescar la página y comprobar que los datos permanecen.
- [ ] 8.5 Revisar los criterios del Incremento 1 y corregir cualquier incumplimiento antes de avanzar.

## Incremento 2 — Flujo completo de una actividad

### 9. Resolver reglas pendientes

- [ ] 9.1 Aprobar el catálogo inicial de categorías.
- [ ] 9.2 Aprobar qué sucede con los pagos si se edita o elimina un gasto.
- [ ] 9.3 Aprobar si una actividad cerrada puede reabrirse.
- [ ] 9.4 Actualizar `spec.md` y `design.md` con las decisiones aprobadas.

### 10. Implementar actividades — RF-11

- [ ] 10.1 Ampliar el modelo de estado para almacenar varias actividades separadas.
- [ ] 10.2 Crear el formulario de actividad con nombre y categoría.
- [ ] 10.3 Permitir seleccionar una actividad.
- [ ] 10.4 Mostrar solamente la información perteneciente a la actividad seleccionada.
- [ ] 10.5 Ejecutar CA-11.1 a CA-11.3 y registrar el resultado.

### 11. Implementar encargado — RF-12

- [ ] 11.1 Permitir elegir como encargado a un participante de la actividad.
- [ ] 11.2 Impedir seleccionar a una persona ajena a la actividad.
- [ ] 11.3 Impedir registrar pagos mientras no exista encargado.
- [ ] 11.4 Ejecutar CA-12.1 a CA-12.3 y registrar el resultado.

### 12. Implementar pagos — RF-13 y RF-14

- [ ] 12.1 Crear el modelo de pago asociado a una transferencia pendiente.
- [ ] 12.2 Crear el formulario para registrar un pago completo o parcial.
- [ ] 12.3 Calcular el total pagado y el monto pendiente.
- [ ] 12.4 Rechazar montos inválidos o superiores al pendiente.
- [ ] 12.5 Mostrar los estados `Pendiente`, `Parcial` y `Pagado`.
- [ ] 12.6 Ejecutar CA-13.1 a CA-14.3 y registrar el resultado.

### 13. Implementar cierre — RF-15

- [ ] 13.1 Permitir cerrar una actividad con todos los pendientes en cero.
- [ ] 13.2 Impedir el cierre cuando todavía exista un monto pendiente.
- [ ] 13.3 Permitir el cierre cuando los balances no requieran transferencias.
- [ ] 13.4 Ejecutar CA-15.1 a CA-15.3 y registrar el resultado.

### 14. Verificar el Incremento 2

- [ ] 14.1 Registrar un pago parcial y comprobar la reducción exacta del pendiente.
- [ ] 14.2 Completar el pago y comprobar el cambio de estado a `Pagado`.
- [ ] 14.3 Intentar cerrar con una deuda pendiente y comprobar el rechazo.
- [ ] 14.4 Completar todas las transferencias y cerrar la actividad.
- [ ] 14.5 Refrescar la página y comprobar que actividades y pagos permanecen.

## Incremento 3 condicionado — Base de datos

- [ ] 15.1 Confirmar equipo, plazo y necesidad de sincronización.
- [ ] 15.2 Crear un cambio delta separado para la base de datos.
- [ ] 15.3 Definir requisitos de persistencia, diseño técnico, migración y pruebas.
- [ ] 15.4 Seleccionar la tecnología solamente después de aprobar el cambio delta.
- [ ] 15.5 Implementar únicamente si los incrementos anteriores están completos y verificados.

## Preparación de entrega

- [ ] 16.1 Revisar la trazabilidad entre RF, criterios, diseño, tareas y pruebas.
- [ ] 16.2 Versionar especificaciones y código en Git.
- [ ] 16.3 Preparar la demostración de tres minutos con el escenario de Samaipata.
- [ ] 16.4 Preparar una explicación del cálculo de división, balances y liquidación.
- [ ] 16.5 No archivar el cambio en OpenSpec hasta completar y verificar las tareas correspondientes.
