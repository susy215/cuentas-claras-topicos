# Propuesta: Agregar multimoneda y conciliación normalizada

## Identificador

`agregar-multimoneda`

## Motivo

La versión inicial de Cuentas Claras fue especificada en BOB y dejó la conversión entre monedas fuera del alcance. La indicación posterior del docente amplía el producto para admitir BOB, USD y USDT, calcular balances comparables y expresar la liquidación final en USDT.

Durante la validación manual se comprobó que la normalización se calcula correctamente, pero el usuario no puede auditar visualmente cómo cada gasto se convirtió ni cuál es el total normalizado de la actividad. Este cambio amplía la presentación de multimoneda para hacer visible el mismo cálculo que ya utiliza el dominio, sin duplicar reglas monetarias.

## Alcance

Este cambio define exclusivamente reglas monetarias y de conciliación:

- gastos en BOB, USD y USDT;
- una tasa manual BOB/USDT por actividad;
- validación de tasa numérica y mayor que cero;
- regla interna simplificada `1 USD = 1 USDT`;
- conversión de importes a unidades mínimas de USDT para cálculos globales;
- división equitativa con residuo asignado al último participante de un orden estable;
- balances cuya suma sea exactamente cero;
- propuesta de liquidación en USDT;
- persistencia de moneda y tasa;
- soporte mínimo para confirmar transferencias y cerrar efectivamente la actividad cuando no queden pendientes;
- visualización por gasto de moneda original, monto original y equivalente normalizado en USDT;
- visualización del tipo de cambio utilizado por la actividad;
- visualización del total normalizado de todos los gastos de la actividad en USDT.

## Fuera de alcance

- proveedores externos de tipo de cambio;
- tasas distintas por gasto;
- base de datos;
- pagos bancarios o QR reales;
- criptobilleteras;
- optimización por cotización de mercado;
- totales históricos comparativos entre actividades;
- sistema visual, que pertenece al cambio `definir-sistema-diseno`.
