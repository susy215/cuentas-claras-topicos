# Tareas delta: agregar-multimoneda

Estas tareas pertenecen exclusivamente a este cambio y no modifican las 16 tareas históricas.

- [x] M1. Modelar moneda, tasa por actividad y normalización a centavos USDT.
- [x] M2. Implementar validación manual de tasa `> 0`.
- [x] M3. Implementar división determinista con residuo al último participante estable.
- [x] M4. Calcular balances multimoneda con suma cero.
- [x] M5. Generar propuesta de liquidación en USDT.
- [x] M6. Registrar confirmación de transferencia y calcular pendientes.
- [x] M7. Bloquear cierre con pendientes y persistir cierre efectivo sin pendientes.
- [x] M8. Persistir tasa, moneda, pagos y estado de actividad.
- [x] M9. Mostrar por gasto el monto original y su equivalente normalizado en USDT reutilizando el cálculo del dominio.
- [x] M10. Mostrar el tipo de cambio utilizado y el total normalizado acumulado de la actividad en USDT.
- [x] M11. Ejecutar nuevamente P1 a P9 y registrar evidencia antes de marcar las tareas existentes como completas.
- [x] M12. Agregar y ejecutar pruebas del resumen visible: `69 BOB @ 6,90 = 10,00 USDT` y `100 BOB + 100 USDT @ 100 = 101,00 USDT`.


## Evidencia del incremento de resumen visible

- 2026-09-03: `npm test` ejecutado con **13/13 pruebas aprobadas** (P1-P13).
- P12 verifica `69 BOB @ 6,90 = 10,00 USDT` usando el mismo valor normalizado del cálculo.
- P13 verifica `100 BOB + 100 USDT @ 100 = 101,00 USDT`.
- `node --check` aprobado para `app.js`, `calculations.js`, `domain.js` y `storage.js`.
- La aplicación responde por HTTP local y el HTML contiene el contenedor de resumen multimoneda.
- 2026-09-03: verificación visual manual aprobada en navegador: `Cena BOB 100,00 → USDT 1,00`, `Viaje USDT 100,00 → USDT 100,00`, tipo de cambio `1 USDT = 100,00 BOB` y `Total normalizado = USDT 101,00`.
- M9 y M10 quedan marcadas como completas con evidencia automatizada (P12-P13) y visual manual.
