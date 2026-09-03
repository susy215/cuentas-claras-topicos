export const SUPPORTED_CURRENCIES = Object.freeze(['BOB', 'USD', 'USDT']);

export function parseMoneyToMinor(value) {
  const text = String(value ?? '').trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) {
    throw new Error('El monto debe ser mayor que cero y tener como máximo dos decimales.');
  }
  const number = Number(text);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error('El monto debe ser mayor que cero.');
  }
  return Math.round(number * 100);
}

export function validateBobPerUsdt(value) {
  const text = String(value ?? '').trim().replace(',', '.');
  if (text === '') throw new Error('La tasa BOB/USDT es obligatoria.');
  const rate = Number(text);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('La tasa BOB/USDT debe ser numérica y mayor que cero.');
  }
  return rate;
}

export function normalizeToUsdtCents(amountMinor, currency, bobPerUsdt) {
  if (!Number.isInteger(amountMinor) || amountMinor <= 0) {
    throw new Error('El monto debe representarse en unidades mínimas enteras positivas.');
  }
  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    throw new Error('Moneda no soportada.');
  }
  if (currency === 'USD' || currency === 'USDT') return amountMinor;
  const rate = validateBobPerUsdt(bobPerUsdt);
  return Math.round(amountMinor / rate);
}

export function splitEqualCents(totalCents, participantIds) {
  if (!Number.isInteger(totalCents) || totalCents <= 0) throw new Error('Monto inválido para dividir.');
  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    throw new Error('Debe seleccionarse al menos un participante.');
  }
  const base = Math.floor(totalCents / participantIds.length);
  const remainder = totalCents - base * participantIds.length;
  return participantIds.map((participantId, index) => ({
    participantId,
    cents: base + (index === participantIds.length - 1 ? remainder : 0),
  }));
}

export function computeExpenseShares(expense, bobPerUsdt) {
  const normalizedCents = normalizeToUsdtCents(expense.amountMinor, expense.currency, bobPerUsdt);
  return {
    normalizedCents,
    shares: splitEqualCents(normalizedCents, expense.participantIds),
  };
}

export function computeBalances(activity) {
  const balances = new Map(activity.participants.map((participant) => [participant.id, 0]));
  for (const expense of activity.expenses) {
    if (!balances.has(expense.payerId)) throw new Error('El pagador del gasto no pertenece a la actividad.');
    const { normalizedCents, shares } = computeExpenseShares(expense, activity.bobPerUsdt);
    balances.set(expense.payerId, balances.get(expense.payerId) + normalizedCents);
    for (const share of shares) {
      if (!balances.has(share.participantId)) throw new Error('Un participante del gasto no pertenece a la actividad.');
      balances.set(share.participantId, balances.get(share.participantId) - share.cents);
    }
  }
  const sum = [...balances.values()].reduce((acc, value) => acc + value, 0);
  if (sum !== 0) throw new Error(`Inconsistencia matemática: la suma de balances es ${sum}, no cero.`);
  return balances;
}

export function buildSettlement(activity) {
  const balances = computeBalances(activity);
  const debtors = [];
  const creditors = [];
  for (const participant of activity.participants) {
    const balance = balances.get(participant.id) ?? 0;
    if (balance < 0) debtors.push({ id: participant.id, cents: -balance });
    if (balance > 0) creditors.push({ id: participant.id, cents: balance });
  }
  const transfers = [];
  let d = 0;
  let c = 0;
  while (d < debtors.length && c < creditors.length) {
    const amount = Math.min(debtors[d].cents, creditors[c].cents);
    const fromId = debtors[d].id;
    const toId = creditors[c].id;
    const key = `${fromId}->${toId}:${amount}`;
    transfers.push({ key, fromId, toId, requiredCents: amount });
    debtors[d].cents -= amount;
    creditors[c].cents -= amount;
    if (debtors[d].cents === 0) d += 1;
    if (creditors[c].cents === 0) c += 1;
  }
  if (debtors.some((item) => item.cents !== 0) || creditors.some((item) => item.cents !== 0)) {
    throw new Error('No se pudo liquidar completamente los balances.');
  }
  return transfers;
}

export function settlementWithPayments(activity) {
  const transfers = buildSettlement(activity);
  return transfers.map((transfer) => {
    const paidCents = activity.payments
      .filter((payment) => payment.transferKey === transfer.key)
      .reduce((sum, payment) => sum + payment.amountUsdtCents, 0);
    if (paidCents > transfer.requiredCents) throw new Error('Los pagos superan el monto requerido de una transferencia.');
    const pendingCents = transfer.requiredCents - paidCents;
    return {
      ...transfer,
      paidCents,
      pendingCents,
      status: pendingCents === 0 ? 'Pagado' : paidCents > 0 ? 'Parcial' : 'Pendiente',
    };
  });
}

export function totalPendingCents(activity) {
  return settlementWithPayments(activity).reduce((sum, transfer) => sum + transfer.pendingCents, 0);
}

export function canCloseActivity(activity) {
  return totalPendingCents(activity) === 0;
}

export function formatMoney(cents, currency = 'USDT') {
  const value = (cents / 100).toFixed(2);
  return `${currency} ${value}`;
}
