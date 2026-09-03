# Diseño: Multimoneda

## Modelo mínimo

La actividad incorpora:

- `id`
- `name`
- `bobPerUsdt`
- `status`: `Abierta` o `Cerrada`
- `managerId`
- `participants[]`
- `expenses[]`
- `payments[]`

Cada gasto incorpora:

- `id`
- `description`
- `amountMinor`: unidades mínimas de la moneda original;
- `currency`: `BOB`, `USD` o `USDT`;
- `payerId`;
- `participantIds` en orden estable.

Cada pago confirmado incorpora:

- `id`
- `fromId`
- `toId`
- `amountUsdtCents`;
- `transferKey`.

## Conversión

- USD y USDT: `amountUsdtCents = amountMinor`.
- BOB: convertir `amountMinor` a BOB, dividir entre `bobPerUsdt` y redondear una única vez a centavos USDT.
- La tasa nunca se obtiene de servicios externos.
- La equivalencia visible de un gasto debe reutilizar exactamente el mismo resultado normalizado empleado para balances; no se permite una segunda fórmula de presentación que pueda producir diferencias por redondeo.

## Resumen visible de conversión

Para cada gasto se presentarán, como datos de lectura:

- descripción;
- monto y moneda original;
- equivalente normalizado en USDT.

El resumen de actividad mostrará además:

- `1 USDT = X BOB` como tipo de cambio utilizado;
- total normalizado en USDT, calculado como la suma de los `amountUsdtCents` normalizados de todos los gastos.

Ejemplo verificable con `1 USDT = 100 BOB`:

- `Cena · 100,00 BOB → 1,00 USDT`;
- `Caso centavo · 100,00 USDT → 100,00 USDT`;
- `Total normalizado: 101,00 USDT`.

El resumen es informativo y no altera balances, transferencias ni pagos.

## División

1. Normalizar el gasto a centavos USDT.
2. `base = floor(total / cantidad)`.
3. Asignar `base` a todos.
4. `residuo = total - base * cantidad`.
5. Sumar todo el residuo al último `participantId` del orden estable.
6. Verificar que la suma de partes sea exactamente `total`.

## Balances

Por cada gasto normalizado:

- sumar el total al pagador;
- restar a cada participante su parte;
- verificar suma global `0`.

## Liquidación y conciliación

La propuesta se genera desde balances fuente mediante un algoritmo determinista de deudores y acreedores. Los pagos confirmados no cambian el balance histórico del gasto; reducen el pendiente de la transferencia propuesta correspondiente.

Una transferencia pendiente se identifica de forma estable por `fromId`, `toId` y monto requerido. Confirmar conciliación registra exactamente el pendiente actual.

## Cierre

`closeActivity` solo puede cambiar `status` a `Cerrada` cuando el pendiente total de todas las transferencias es cero. El estado cerrado se persiste. No se implementa reapertura en esta entrega.

## Persistencia

Se usa `localStorage` con la clave `cuentasClaras.v2`. No se añade base de datos.
