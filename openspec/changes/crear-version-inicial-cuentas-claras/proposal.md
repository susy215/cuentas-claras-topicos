# Propuesta: Crear la versión inicial de Cuentas Claras

## Identificador del cambio

`crear-version-inicial-cuentas-claras`

## Problema

Cuando un grupo de amigos realiza un viaje y diferentes personas pagan distintos gastos, puede resultar difícil determinar cuánto aportó cada participante, cuánto debe y a quién debe pagar para quedar a mano.

## Objetivo

Construir incrementalmente una aplicación web llamada **Cuentas Claras** que permita administrar actividades de gastos compartidos, registrar participantes y gastos, calcular balances, proponer transferencias, registrar pagos completos o parciales y cerrar una actividad cuando no existan montos pendientes.

## Alcance de la primera versión

La primera versión permitirá:

1. Agregar y listar participantes.
2. Rechazar nombres vacíos o repetidos.
3. Eliminar participantes que no estén asociados a gastos, previa confirmación.
4. Registrar gastos con descripción, monto, pagador y participantes entre quienes se divide.
5. Seleccionar por defecto a todos los participantes y permitir excluir personas, incluido el pagador.
6. Editar y eliminar gastos.
7. Calcular el balance de cada participante.
8. Generar una propuesta de transferencias para quedar a mano.
9. Conservar los datos después de refrescar o volver a abrir la página en el mismo navegador.
10. Manejar divisiones no exactas sin perder centavos y mantener la suma de balances en cero.

Este alcance constituye el **Incremento 1**, obligatorio para cumplir la consigna y demostrar primero la lógica central.

## Incremento 2 aprobado: completar el flujo de una actividad

Después de verificar el Incremento 1, se incorporará:

1. Crear actividades con nombre libre y una categoría seleccionable.
2. Administrar más de una actividad, manteniendo separados sus participantes, gastos y pagos.
3. Elegir como encargado a uno de los participantes de la actividad.
4. Permitir que el encargado registre pagos completos o parciales.
5. Mostrar por participante el monto pagado y el monto todavía pendiente.
6. Cerrar una actividad únicamente cuando no existan pagos pendientes.

La aplicación será operada por el encargado. No se requerirán cuentas ni inicio de sesión y los demás participantes no confirmarán personalmente desde la aplicación.

## Incremento 3 condicionado: base de datos

Una vez verificado el flujo funcional, se evaluará sustituir o complementar `localStorage` con una base de datos conectada a la aplicación. La tecnología y el momento de implementación dependerán del tiempo disponible, de la conformación definitiva del equipo y de la retroalimentación del docente.

## Fuera del alcance inicial

Esta primera versión no incluirá:

- registro e inicio de sesión;
- varios usuarios conectados simultáneamente;
- sincronización entre computadoras o celulares;
- transferencias bancarias o pagos QR reales;
- aprobación de gastos por parte de los participantes;
- notificaciones y recordatorios;
- división por porcentajes o cantidades personalizadas;
- conversión entre monedas;
- exportación de reportes;
- aplicación móvil;
- inicio de sesión y cuentas individuales;
- mejoras opcionales antes de completar y verificar cada incremento anterior.

## Resultado esperado

El sistema permitirá cargar el escenario de Samaipata indicado en la consigna y mostrará una propuesta de liquidación económicamente correcta. La suma de todos los balances será exactamente cero.

## Mejoras futuras posibles

Después de completar y verificar los incrementos aprobados, podrán proponerse como cambios OpenSpec separados:

- confirmación directa de gastos o cuotas por cada participante;
- historial ampliado y comprobantes de pagos;
- sincronización entre dispositivos;
- división personalizada por porcentajes o montos.

## Decisiones provisionales pendientes de validación docente

Las siguientes decisiones fueron aprobadas para continuar la planificación, pero podrán cambiar después de la revisión del docente:

- conformación definitiva del equipo y continuidad de esta propuesta si la estudiante es incorporada a otro grupo;
- herramienta SDD definitiva si el nuevo grupo ya utiliza otra herramienta;
- catálogo inicial de categorías de actividad;
- comportamiento al editar o eliminar gastos después de registrar pagos;
- incorporación de base de datos dentro del plazo del proyecto.

Si el docente modifica alguna decisión, primero se actualizarán las especificaciones y después el diseño y el plan de tareas. No se generará código antes de aprobar esos cambios.
