# Especificación delta: Multimoneda

## Reglas

1. Cada actividad mantiene una única tasa `bobPerUsdt`, interpretada como `1 USDT = X BOB`.
2. La tasa se ingresa manualmente, debe ser numérica, finita y mayor que cero.
3. Los gastos admiten `BOB`, `USD` o `USDT`.
4. Para esta versión `1 USD = 1 USDT`.
5. La liquidación se calcula y muestra en USDT.
6. Los montos mostrados aceptan como máximo dos decimales; internamente los importes normalizados para balance se representan en centavos de USDT enteros.
7. Para BOB, la conversión a centavos de USDT redondea al centavo más cercano una sola vez al normalizar el gasto.
8. Cada gasto normalizado se divide usando enteros. La parte base es división entera y todas las unidades mínimas residuales se asignan al último participante según el orden estable almacenado en `participantIds`.
9. La suma de las partes de un gasto debe ser exactamente igual al monto normalizado de ese gasto.
10. La suma de balances de todos los participantes debe ser exactamente cero.
11. Una transferencia propuesta no equivale a una conciliación realizada.
12. El encargado puede confirmar una transferencia propuesta completa; al confirmarla se registra un pago por el monto pendiente de esa transferencia.
13. Una actividad solo puede cerrarse efectivamente cuando todas las transferencias requeridas estén totalmente conciliadas. El cierre cambia y persiste el estado de la actividad a `Cerrada`.
14. Cada gasto debe conservar y mostrar su monto y moneda original junto con su equivalente normalizado en USDT.
15. El equivalente visible debe provenir del mismo valor normalizado utilizado para balances, sin recalcularlo con una fórmula paralela.
16. La actividad debe mostrar el tipo de cambio utilizado y el total normalizado de sus gastos en USDT.
17. El total normalizado se obtiene sumando los centavos USDT normalizados de cada gasto, no sumando directamente monedas diferentes.

## CA-MON-01 — Monedas admitidas

- **Dado** un gasto nuevo,
- **cuando** se selecciona BOB, USD o USDT,
- **entonces** el sistema acepta la moneda y conserva esa selección.

## CA-MON-02 — Tasa válida

- **Dado** una actividad,
- **cuando** se ingresa una tasa BOB/USDT numérica y mayor que cero,
- **entonces** la tasa se guarda para la actividad.

## CA-MON-03 — Tasa inválida

- **Dado** una actividad con una tasa válida previa,
- **cuando** se intenta guardar una tasa vacía, no numérica, cero o negativa,
- **entonces** el sistema rechaza el cambio y conserva la tasa válida anterior.

## CA-MON-04 — USD equivalente a USDT

- **Dado** un gasto de 20,00 USD,
- **cuando** se normaliza para balance,
- **entonces** el resultado es 20,00 USDT.

## CA-MON-05 — Conversión BOB

- **Dado** una tasa de 6,90 BOB por USDT y un gasto de 69,00 BOB,
- **cuando** se normaliza,
- **entonces** el resultado es 10,00 USDT.

## CA-MON-06 — Residuo determinista

- **Dado** un gasto normalizado de 100,00 dividido en orden A, B, C,
- **cuando** se divide en partes iguales,
- **entonces** A asume 33,33, B 33,33 y C 33,34.

## CA-MON-07 — Integridad

- **Dado** cualquier conjunto válido de gastos multimoneda,
- **cuando** se calculan balances normalizados,
- **entonces** la suma de todos los balances es exactamente 0 centavos USDT.

## CA-MON-08 — Conciliación confirmada

- **Dado** una transferencia propuesta con monto pendiente,
- **cuando** el encargado la confirma,
- **entonces** se registra un pago por el monto pendiente y esa transferencia queda totalmente pagada.

## CA-MON-09 — Cierre bloqueado

- **Dado** una actividad con al menos una transferencia pendiente,
- **cuando** se intenta cerrar,
- **entonces** el sistema rechaza el cierre y mantiene la actividad `Abierta`.

## CA-MON-10 — Cierre efectivo

- **Dado** una actividad sin transferencias pendientes,
- **cuando** el usuario confirma el cierre,
- **entonces** el estado cambia a `Cerrada` y ese estado se conserva al recargar.

## CA-MON-11 — Conversión visible por gasto

- **Dado** una actividad con tasa `1 USDT = 6,90 BOB` y un gasto `Cena` de `69,00 BOB`,
- **cuando** se muestra el resumen de gastos,
- **entonces** el sistema muestra el gasto original `69,00 BOB` y su equivalente `10,00 USDT`.

## CA-MON-12 — Total normalizado con monedas mixtas

- **Dado** una actividad con tasa `1 USDT = 100 BOB`, un gasto de `100,00 BOB` y otro de `100,00 USDT`,
- **cuando** se muestra el resumen de gastos,
- **entonces** el sistema muestra equivalentes de `1,00 USDT` y `100,00 USDT`, y un `Total normalizado: 101,00 USDT`.

## CA-MON-13 — Coherencia entre resumen y balances

- **Dado** cualquier conjunto válido de gastos,
- **cuando** se muestran equivalencias y total normalizado,
- **entonces** esos valores se obtienen de los mismos centavos USDT utilizados por el cálculo de balances y no presentan diferencias por redondeo.
