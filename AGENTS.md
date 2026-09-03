# Instrucciones del proyecto Cuentas Claras

## Fuentes obligatorias

Antes de generar o modificar código, leer en este orden:

1. La consigna oficial del proyecto.
2. `openspec/changes/crear-version-inicial-cuentas-claras/proposal.md`.
3. `openspec/changes/crear-version-inicial-cuentas-claras/specs/cuentas-claras/spec.md`.
4. `openspec/changes/crear-version-inicial-cuentas-claras/design.md`.
5. `openspec/changes/crear-version-inicial-cuentas-claras/tasks.md`.

Si existe una contradicción, detenerse y solicitar una decisión. No resolverla inventando información.

## Flujo SDD obligatorio

- No generar código antes de que la tarea correspondiente esté aprobada.
- Implementar una sola tarea comprobable por vez.
- Verificar cada tarea contra sus criterios DADO-CUANDO-ENTONCES.
- Marcar una tarea como terminada solamente después de comprobarla.
- Si cambia el entendimiento, actualizar primero la especificación y después el diseño, las tareas y el código.
- Registrar funciones nuevas mediante un cambio delta; no agregarlas silenciosamente.
- No ejecutar `archive` hasta que el cambio esté implementado y verificado.

## Alcance por incrementos

- Completar primero el Incremento 1 exigido por la consigna.
- No iniciar actividades, encargado y pagos del Incremento 2 hasta verificar el Incremento 1 y resolver sus reglas pendientes.
- No seleccionar ni implementar una base de datos sin un cambio delta aprobado.
- No agregar inicio de sesión, cuentas individuales, pagos bancarios o QR reales.
- No implementar confirmaciones directas de participantes sin una modificación aprobada del alcance.

## Convenciones técnicas aprobadas

- Utilizar HTML, CSS y JavaScript sin framework mientras esta decisión permanezca vigente.
- Mantener separadas la interfaz, los cálculos y el almacenamiento.
- Representar el dinero en centavos enteros.
- Mantener identificadores únicos para actividades, participantes, gastos y pagos.
- Calcular balances y liquidación desde los datos fuente; no guardar copias independientes innecesarias.
- La suma de todos los balances debe ser exactamente cero.
- Una transferencia propuesta no debe aparecer como pago realizado automáticamente.

## Calidad y seguridad

- Validar entradas antes de modificar el estado.
- Conservar los datos anteriores cuando una edición sea inválida.
- Solicitar confirmación antes de eliminaciones o cierres.
- Mostrar mensajes de error comprensibles.
- No afirmar que una función trabaja correctamente sin ejecutar su prueba.
- No borrar ni reemplazar trabajo aprobado sin autorización.
- No incorporar librerías, frameworks, servicios o tecnologías no aprobadas.

## Cambios aprobados para la entrega del 3 de septiembre de 2026

- Conservar intactas las 16 tareas históricas de `openspec/changes/crear-version-inicial-cuentas-claras/tasks.md`.
- Mantener dos cambios delta separados: `agregar-multimoneda` y `definir-sistema-diseno`.
- Implementar primero el flujo end-to-end defendible: actividad, participantes, gasto, división, conversión, balances, liquidación, conciliación confirmada y cierre efectivo.
- Para ese flujo se permite únicamente el soporte mínimo necesario de RF-11 a RF-15; no se declara implementado su alcance completo sin ejecutar todos sus criterios históricos.
- Multimoneda admite BOB, USD y USDT; la liquidación se expresa en USDT.
- Cada actividad usa una única tasa manual `1 USDT = X BOB`, numérica y mayor que cero.
- Para esta versión, `1 USD = 1 USDT` es una simplificación interna aprobada.
- En divisiones no exactas, las unidades mínimas residuales se asignan al último participante según un orden estable.
- No usar base de datos, frameworks, pagos bancarios reales, QR, facturas con IA, WhatsApp, notificaciones ni otros extras no aprobados.
