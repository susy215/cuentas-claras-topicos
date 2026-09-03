import assert from 'node:assert/strict';
import { splitEqualCents, computeBalances, normalizeToUsdtCents, settlementWithPayments, summarizeExpenses, validateBobPerUsdt } from '../js/calculations.js';
import { addExpense, addParticipant, closeActivity, confirmTransfer, createActivity, deleteExpense, editExpense, removeParticipant, setManager, updateRate } from '../js/domain.js';
import { deserializeState, serializeState } from '../js/storage.js';

const results = [];
async function test(id, name, fn) {
  try { await fn(); results.push({ id, name, ok: true }); }
  catch (error) { results.push({ id, name, ok: false, error: error.stack || String(error) }); }
}

await test('P1', '100/3 asigna residuo al último participante estable', () => {
  const shares = splitEqualCents(10000, ['A','B','C']);
  assert.deepEqual(shares.map((s) => s.cents), [3333,3333,3334]);
  assert.equal(shares.reduce((s,x)=>s+x.cents,0), 10000);
});

await test('P2', 'la suma de balances es exactamente cero', () => {
  const a = createActivity('P2', 6.9);
  const ana = addParticipant(a,'Ana'); const beto = addParticipant(a,'Beto'); const carla = addParticipant(a,'Carla');
  addExpense(a,{description:'Cena',amountMinor:9000,currency:'USDT',payerId:ana.id,participantIds:[ana.id,beto.id,carla.id]});
  const balances = computeBalances(a);
  assert.equal([...balances.values()].reduce((x,y)=>x+y,0),0);
  assert.deepEqual([...balances.values()], [6000,-3000,-3000]);
});

await test('P3', 'multimoneda BOB, USD y USDT normaliza correctamente', () => {
  assert.equal(normalizeToUsdtCents(6900,'BOB',6.9),1000);
  assert.equal(normalizeToUsdtCents(2000,'USD',6.9),2000);
  assert.equal(normalizeToUsdtCents(2000,'USDT',6.9),2000);
});

await test('P4', 'tasa manual válida y rechaza vacío, cero, negativo y texto', () => {
  assert.equal(validateBobPerUsdt('6.90'),6.9);
  for (const value of ['', '0', '-1', 'abc']) assert.throws(() => validateBobPerUsdt(value));
  const a = createActivity('Tasa', 6.9);
  assert.throws(() => updateRate(a, 0));
  assert.equal(a.bobPerUsdt, 6.9);
});

let samaipata;
await test('P5', 'Samaipata conserva resultado económico tras conversión', () => {
  samaipata = createActivity('Samaipata', 2); // 1 USDT = 2 BOB, resultado esperado = escenario oficial / 2
  const ana = addParticipant(samaipata,'Ana'); const beto = addParticipant(samaipata,'Beto'); const carla = addParticipant(samaipata,'Carla'); const diego = addParticipant(samaipata,'Diego');
  setManager(samaipata, ana.id);
  const all = [ana.id,beto.id,carla.id,diego.id];
  addExpense(samaipata,{description:'Cabaña',amountMinor:80000,currency:'BOB',payerId:ana.id,participantIds:all});
  addExpense(samaipata,{description:'Entradas',amountMinor:16000,currency:'BOB',payerId:ana.id,participantIds:all});
  addExpense(samaipata,{description:'Cena',amountMinor:40000,currency:'BOB',payerId:beto.id,participantIds:all});
  addExpense(samaipata,{description:'Gasolina',amountMinor:24000,currency:'BOB',payerId:carla.id,participantIds:all});
  const transfers = settlementWithPayments(samaipata);
  const named = transfers.map((t)=>({from:samaipata.participants.find(p=>p.id===t.fromId).name,to:samaipata.participants.find(p=>p.id===t.toId).name,cents:t.requiredCents}));
  assert.deepEqual(named,[{from:'Carla',to:'Ana',cents:8000},{from:'Diego',to:'Ana',cents:20000}]);
  assert.equal([...computeBalances(samaipata).values()].reduce((x,y)=>x+y,0),0);
});

await test('P6', 'conciliación real registra pago y deja transferencia pagada', () => {
  const before = settlementWithPayments(samaipata);
  assert.equal(before[0].status,'Pendiente');
  confirmTransfer(samaipata,before[0].key);
  const after = settlementWithPayments(samaipata);
  assert.equal(after[0].status,'Pagado');
  assert.equal(after[0].pendingCents,0);
  assert.equal(samaipata.payments.length,1);
});

await test('P7', 'cierre bloqueado mientras existe una transferencia pendiente', () => {
  assert.throws(() => closeActivity(samaipata), /pendientes/i);
  assert.equal(samaipata.status,'Abierta');
});

await test('P8', 'cierre efectivo después de confirmar todas las conciliaciones', () => {
  for (const transfer of settlementWithPayments(samaipata).filter((t)=>t.pendingCents>0)) confirmTransfer(samaipata,transfer.key);
  assert.ok(settlementWithPayments(samaipata).every((t)=>t.pendingCents===0));
  closeActivity(samaipata);
  assert.equal(samaipata.status,'Cerrada');
});

await test('P9', 'recarga conserva actividad, tasa, gastos, pagos y cierre', () => {
  const state = { activities:[samaipata], selectedActivityId:samaipata.id };
  const restored = deserializeState(serializeState(state));
  const a = restored.activities[0];
  assert.equal(a.status,'Cerrada');
  assert.equal(a.bobPerUsdt,2);
  assert.equal(a.participants.length,4);
  assert.equal(a.expenses.length,4);
  assert.equal(a.payments.length,2);
  assert.ok(settlementWithPayments(a).every((t)=>t.pendingCents===0));
});


await test('P10', 'gastos conciliados no se pueden editar ni eliminar', () => {
  const a = createActivity('P10', 6.9);
  const ana = addParticipant(a, 'Ana'); const beto = addParticipant(a, 'Beto');
  setManager(a, ana.id);
  const expense = addExpense(a,{description:'Cena',amountMinor:10000,currency:'USDT',payerId:ana.id,participantIds:[ana.id,beto.id]});
  const transfer = settlementWithPayments(a)[0];
  confirmTransfer(a, transfer.key);
  assert.throws(() => editExpense(a, expense.id, {...expense, amountMinor:12000}), /después de confirmar conciliaciones/i);
  assert.throws(() => deleteExpense(a, expense.id), /después de confirmar conciliaciones/i);
  assert.equal(a.expenses.length, 1);
  assert.equal(a.expenses[0].amountMinor, 10000);
});

await test('P11', 'actividad cerrada rechaza modificaciones del dominio', () => {
  const a = createActivity('P11', 6.9);
  const ana = addParticipant(a, 'Ana');
  setManager(a, ana.id);
  closeActivity(a);
  assert.throws(() => addParticipant(a, 'Beto'), /cerrada/i);
  assert.throws(() => removeParticipant(a, ana.id), /cerrada/i);
  assert.throws(() => updateRate(a, 7), /cerrada/i);
  assert.throws(() => addExpense(a,{description:'Cena',amountMinor:1000,currency:'USDT',payerId:ana.id,participantIds:[ana.id]}), /cerrada/i);
});


await test('P12', 'resumen visible reutiliza normalización BOB: 69 BOB a 6,90 = 10 USDT', () => {
  const a = createActivity('P12', 6.9);
  const ana = addParticipant(a, 'Ana');
  addExpense(a,{description:'Cena',amountMinor:6900,currency:'BOB',payerId:ana.id,participantIds:[ana.id]});
  const summary = summarizeExpenses(a);
  assert.equal(summary.items[0].normalizedCents, 1000);
  assert.equal(summary.totalNormalizedCents, 1000);
});

await test('P13', 'resumen de monedas mixtas: 100 BOB + 100 USDT a tasa 100 = 101 USDT', () => {
  const a = createActivity('P13', 100);
  const ana = addParticipant(a, 'Ana');
  addExpense(a,{description:'Cena',amountMinor:10000,currency:'BOB',payerId:ana.id,participantIds:[ana.id]});
  addExpense(a,{description:'Viaje',amountMinor:10000,currency:'USDT',payerId:ana.id,participantIds:[ana.id]});
  const summary = summarizeExpenses(a);
  assert.deepEqual(summary.items.map((item) => item.normalizedCents), [100, 10000]);
  assert.equal(summary.totalNormalizedCents, 10100);
});


await test('P14', 'actividades distintas conservan participantes y gastos sin mezclarse', () => {
  const a = createActivity('Actividad A', 6.9);
  const ana = addParticipant(a, 'Ana');
  addExpense(a,{description:'Cena A',amountMinor:1000,currency:'USDT',payerId:ana.id,participantIds:[ana.id]});
  const b = createActivity('Actividad B', 7);
  const beto = addParticipant(b, 'Beto');
  addExpense(b,{description:'Cena B',amountMinor:2000,currency:'USDT',payerId:beto.id,participantIds:[beto.id]});
  const restored = deserializeState(serializeState({ activities:[a,b], selectedActivityId:b.id }));
  assert.equal(restored.activities[0].participants[0].name, 'Ana');
  assert.equal(restored.activities[0].expenses[0].description, 'Cena A');
  assert.equal(restored.activities[1].participants[0].name, 'Beto');
  assert.equal(restored.activities[1].expenses[0].description, 'Cena B');
  assert.equal(restored.selectedActivityId, b.id);
});

await test('P15', 'una actividad nueva comienza limpia e independiente', () => {
  const previous = createActivity('Anterior', 6.9);
  const ana = addParticipant(previous, 'Ana');
  addExpense(previous,{description:'Cena',amountMinor:1000,currency:'USDT',payerId:ana.id,participantIds:[ana.id]});
  const fresh = createActivity('Nueva', 6.9);
  assert.equal(fresh.participants.length, 0);
  assert.equal(fresh.expenses.length, 0);
  assert.equal(fresh.payments.length, 0);
  assert.equal(fresh.managerId, null);
  assert.equal(previous.expenses.length, 1);
});

await test('P16', 'persistencia conserva actividad seleccionada y un historial cerrado', () => {
  const open = createActivity('Abierta', 6.9);
  const closed = createActivity('Histórica', 6.9);
  const ana = addParticipant(closed, 'Ana');
  setManager(closed, ana.id);
  closeActivity(closed);
  const restored = deserializeState(serializeState({ activities:[open,closed], selectedActivityId:closed.id }));
  assert.equal(restored.activities.length, 2);
  assert.equal(restored.selectedActivityId, closed.id);
  assert.equal(restored.activities[1].status, 'Cerrada');
  assert.equal(restored.activities[1].participants[0].name, 'Ana');
});

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id} - ${r.name}${r.ok ? '' : `\n${r.error}`}`);
const failed = results.filter((r)=>!r.ok);
console.log(`\n${results.length - failed.length}/${results.length} pruebas aprobadas.`);
if (failed.length) process.exit(1);
