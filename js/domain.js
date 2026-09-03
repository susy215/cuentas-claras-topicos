import { buildSettlement, settlementWithPayments, validateBobPerUsdt, canCloseActivity } from './calculations.js?v=inc3';

let sequence = 0;
export function nextId(prefix) {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence}`;
}

export function createActivity(name, bobPerUsdt) {
  const cleanName = String(name ?? '').trim();
  if (!cleanName) throw new Error('El nombre de la actividad es obligatorio.');
  return {
    id: nextId('act'),
    name: cleanName,
    bobPerUsdt: validateBobPerUsdt(bobPerUsdt),
    status: 'Abierta',
    managerId: null,
    participants: [],
    expenses: [],
    payments: [],
  };
}

export function addParticipant(activity, name) {
  ensureOpen(activity);
  const cleanName = String(name ?? '').trim();
  if (!cleanName) throw new Error('El nombre es obligatorio.');
  const normalized = cleanName.toLocaleLowerCase();
  if (activity.participants.some((p) => p.name.trim().toLocaleLowerCase() === normalized)) {
    throw new Error('El participante ya existe.');
  }
  const participant = { id: nextId('p'), name: cleanName };
  activity.participants.push(participant);
  return participant;
}

export function removeParticipant(activity, participantId) {
  ensureOpen(activity);
  const associated = activity.expenses.some((expense) => expense.payerId === participantId || expense.participantIds.includes(participantId));
  if (associated) throw new Error('No se puede eliminar un participante asociado a gastos.');
  if (activity.managerId === participantId) activity.managerId = null;
  activity.participants = activity.participants.filter((p) => p.id !== participantId);
}

export function setManager(activity, participantId) {
  ensureOpen(activity);
  if (!activity.participants.some((p) => p.id === participantId)) throw new Error('El encargado debe pertenecer a la actividad.');
  activity.managerId = participantId;
}

export function updateRate(activity, value) {
  ensureOpen(activity);
  const validRate = validateBobPerUsdt(value);
  activity.bobPerUsdt = validRate;
  return validRate;
}

export function addExpense(activity, expense) {
  ensureOpen(activity);
  validateExpense(activity, expense);
  const stored = { ...expense, id: nextId('g'), participantIds: [...expense.participantIds] };
  activity.expenses.push(stored);
  return stored;
}

export function editExpense(activity, expenseId, patch) {
  ensureOpen(activity);
  const index = activity.expenses.findIndex((expense) => expense.id === expenseId);
  if (index < 0) throw new Error('Gasto no encontrado.');
  if (activity.payments.length > 0) throw new Error('No se puede editar un gasto después de confirmar conciliaciones en esta versión.');
  const candidate = { ...activity.expenses[index], ...patch, id: expenseId, participantIds: [...patch.participantIds] };
  validateExpense(activity, candidate);
  activity.expenses[index] = candidate;
  return candidate;
}

export function deleteExpense(activity, expenseId) {
  ensureOpen(activity);
  if (activity.payments.length > 0) throw new Error('No se puede eliminar un gasto después de confirmar conciliaciones en esta versión.');
  activity.expenses = activity.expenses.filter((expense) => expense.id !== expenseId);
}

export function confirmTransfer(activity, transferKey) {
  ensureOpen(activity);
  if (!activity.managerId || !activity.participants.some((p) => p.id === activity.managerId)) {
    throw new Error('Debe designarse un encargado válido antes de confirmar una conciliación.');
  }
  const transfer = settlementWithPayments(activity).find((item) => item.key === transferKey);
  if (!transfer) throw new Error('Transferencia no encontrada.');
  if (transfer.pendingCents <= 0) throw new Error('La transferencia ya está totalmente conciliada.');
  const payment = {
    id: nextId('pay'),
    transferKey: transfer.key,
    fromId: transfer.fromId,
    toId: transfer.toId,
    amountUsdtCents: transfer.pendingCents,
  };
  activity.payments.push(payment);
  return payment;
}

export function closeActivity(activity) {
  ensureOpen(activity);
  if (!canCloseActivity(activity)) throw new Error('No se puede cerrar la actividad mientras existan conciliaciones pendientes.');
  activity.status = 'Cerrada';
  return activity;
}

export function getSettlement(activity) {
  return settlementWithPayments(activity);
}

function validateExpense(activity, expense) {
  const description = String(expense.description ?? '').trim();
  if (!description) throw new Error('La descripción es obligatoria.');
  if (!Number.isInteger(expense.amountMinor) || expense.amountMinor <= 0) throw new Error('El monto es inválido.');
  if (!['BOB', 'USD', 'USDT'].includes(expense.currency)) throw new Error('La moneda es inválida.');
  if (!activity.participants.some((p) => p.id === expense.payerId)) throw new Error('Debe seleccionarse un pagador válido.');
  if (!Array.isArray(expense.participantIds) || expense.participantIds.length === 0) throw new Error('Debe seleccionarse al menos un participante.');
  for (const id of expense.participantIds) {
    if (!activity.participants.some((p) => p.id === id)) throw new Error('La selección contiene un participante inválido.');
  }
}

function ensureOpen(activity) {
  if (activity.status !== 'Abierta') throw new Error('La actividad está cerrada y no admite modificaciones.');
}
