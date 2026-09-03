import { computeBalances, formatMoney, parseMoneyToMinor, settlementWithPayments, summarizeExpenses } from './calculations.js?v=inc3';
import { createEmptyState, loadState, saveState } from './storage.js?v=inc3';
import { addExpense, addParticipant, closeActivity, confirmTransfer, createActivity, deleteExpense, editExpense, getSettlement, removeParticipant, setManager, updateRate } from './domain.js?v=inc3';

let state;
try { state = loadState(); } catch (error) { state = createEmptyState(); queueMicrotask(() => showMessage(error.message, true)); }

const $ = (id) => document.getElementById(id);
const els = Object.fromEntries([
  'activity-form','activity-name','activity-rate','activity-summary','activity-status','activity-list','activity-count','participant-form','participant-name','participant-list','manager-select','rate-update','rate-button','expense-form','expense-id','expense-description','expense-amount','expense-currency','payer-select','expense-participants','expense-submit','expense-cancel','expense-list','expense-summary','balance-list','balance-integrity','settlement-list','close-button','close-message','message'
].map((id) => [id, $(id)]));

function selectedActivity() { return state.activities.find((a) => a.id === state.selectedActivityId) ?? null; }
function isClosed(activity) { return activity?.status === 'Cerrada'; }
function hasConfirmedReconciliations(activity) { return (activity?.payments?.length ?? 0) > 0; }
function canEditExpenses(activity) { return Boolean(activity) && !isClosed(activity) && !hasConfirmedReconciliations(activity); }
function persist() { saveState(state); render(); }

els['activity-form'].addEventListener('submit', (event) => {
  event.preventDefault();
  run(() => {
    const activity = createActivity(els['activity-name'].value, els['activity-rate'].value);
    state.activities.push(activity);
    state.selectedActivityId = activity.id;
    els['activity-form'].reset();
    persist();
  }, 'Actividad creada.');
});

els['participant-form'].addEventListener('submit', (event) => {
  event.preventDefault();
  run(() => { const activity = requireActivity(); addParticipant(activity, els['participant-name'].value); els['participant-name'].value = ''; persist(); }, 'Participante agregado.');
});

els['manager-select'].addEventListener('change', () => run(() => { setManager(requireActivity(), els['manager-select'].value); persist(); }, 'Encargado actualizado.'));
els['rate-button'].addEventListener('click', () => run(() => { updateRate(requireActivity(), els['rate-update'].value); persist(); }, 'Tipo de cambio actualizado.'));

els['expense-form'].addEventListener('submit', (event) => {
  event.preventDefault();
  run(() => {
    const activity = requireActivity();
    const participantIds = [...els['expense-participants'].querySelectorAll('input:checked')].map((input) => input.value);
    const payload = { description: els['expense-description'].value.trim(), amountMinor: parseMoneyToMinor(els['expense-amount'].value), currency: els['expense-currency'].value, payerId: els['payer-select'].value, participantIds };
    const editingId = els['expense-id'].value;
    if (editingId) editExpense(activity, editingId, payload); else addExpense(activity, payload);
    resetExpenseForm();
    persist();
  }, els['expense-id'].value ? 'Gasto actualizado.' : 'Gasto registrado.');
});
els['expense-cancel'].addEventListener('click', resetExpenseForm);
els['close-button'].addEventListener('click', () => {
  const activity = selectedActivity();
  if (!activity) return showMessage('Primero crea una actividad.', true);
  if (!confirm('¿Confirmas el cierre de la actividad? Esta versión no implementa reapertura.')) return;
  run(() => { closeActivity(activity); persist(); }, 'Actividad cerrada correctamente.');
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (action === 'select-activity') {
    const target = state.activities.find((item) => item.id === id);
    if (!target) return showMessage('Actividad no encontrada.', true);
    if (target.id === state.selectedActivityId) return;
    clearExpenseForm();
    state.selectedActivityId = target.id;
    persist();
    showMessage(`Actividad “${target.name}” seleccionada.`);
    return;
  }
  const activity = selectedActivity();
  if (!activity) return;
  if (action === 'remove-participant') {
    if (isClosed(activity)) return showMessage('La actividad está cerrada y es de solo lectura.', true);
    if (confirm('¿Eliminar participante?')) run(() => { removeParticipant(activity, id); persist(); }, 'Participante eliminado.');
  }
  if (action === 'edit-expense') {
    if (!canEditExpenses(activity)) return showMessage('Los gastos ya no pueden modificarse después de confirmar conciliaciones o cerrar la actividad.', true);
    const expense = activity.expenses.find((item) => item.id === id);
    if (!expense) return;
    els['expense-id'].value = expense.id;
    els['expense-description'].value = expense.description;
    els['expense-amount'].value = (expense.amountMinor / 100).toFixed(2);
    els['expense-currency'].value = expense.currency;
    els['payer-select'].value = expense.payerId;
    [...els['expense-participants'].querySelectorAll('input')].forEach((input) => { input.checked = expense.participantIds.includes(input.value); });
    els['expense-submit'].textContent = 'Guardar cambios';
    els['expense-cancel'].classList.remove('hidden');
  }
  if (action === 'delete-expense') {
    if (!canEditExpenses(activity)) return showMessage('Los gastos ya no pueden modificarse después de confirmar conciliaciones o cerrar la actividad.', true);
    if (confirm('¿Eliminar gasto?')) run(() => { deleteExpense(activity, id); persist(); }, 'Gasto eliminado.');
  }
  if (action === 'confirm-transfer') {
    run(() => { confirmTransfer(activity, id); persist(); }, 'Conciliación confirmada.');
  }
});

function requireActivity() {
  const activity = selectedActivity();
  if (!activity) throw new Error('Primero crea una actividad.');
  return activity;
}
function clearExpenseForm() { els['expense-form'].reset(); els['expense-id'].value = ''; els['expense-submit'].textContent = 'Registrar gasto'; els['expense-cancel'].classList.add('hidden'); }
function resetExpenseForm() { clearExpenseForm(); renderParticipantControls(); }
function run(fn, successMessage) { try { fn(); if (successMessage) showMessage(successMessage); } catch (error) { showMessage(error.message, true); } }
function showMessage(text, isError = false) { if (!els.message) return; els.message.textContent = text; els.message.className = `toast${isError ? ' error' : ''}`; clearTimeout(showMessage.timer); showMessage.timer = setTimeout(() => els.message.classList.add('hidden'), 3500); }
function nameFor(activity, id) { return activity.participants.find((p) => p.id === id)?.name ?? 'Desconocido'; }

function render() {
  const activity = selectedActivity();
  const hasActivity = Boolean(activity);
  renderActivityList();
  document.querySelectorAll('section.card:not(:first-of-type) input, section.card:not(:first-of-type) select, section.card:not(:first-of-type) button').forEach((control) => { control.disabled = !hasActivity || activity?.status === 'Cerrada'; });
  if (!activity) {
    els['activity-summary'].textContent = 'Crea una actividad para comenzar.';
    els['activity-summary'].className = 'empty-state';
    els['activity-status'].textContent = 'Sin actividad'; els['activity-status'].className = 'badge badge-neutral';
    renderParticipantControls(); renderExpenses(); renderExpenseSummary(); renderBalances(); renderSettlement(); return;
  }
  els['activity-summary'].className = 'active-activity';
  els['activity-summary'].innerHTML = `<div class="active-activity-label">Actividad activa</div><strong class="active-activity-name">${escapeHtml(activity.name)}</strong><div class="helper">Tipo de cambio: 1 USDT = ${formatRate(activity.bobPerUsdt)} BOB · ${activity.participants.length} participante(s) · ${activity.expenses.length} gasto(s)</div>${isClosed(activity) ? '<div class="readonly-note">Historial de solo lectura · no se permite reapertura en esta entrega.</div>' : ''}`;
  els['activity-status'].textContent = activity.status; els['activity-status'].className = `badge ${activity.status === 'Cerrada' ? 'badge-success' : 'badge-warning'}`;
  els['rate-update'].value = activity.bobPerUsdt;
  renderParticipantControls(); renderExpenses(); renderExpenseSummary(); renderBalances(); renderSettlement();
  els['close-button'].disabled = activity.status === 'Cerrada';
  els['close-message'].textContent = activity.status === 'Cerrada' ? 'La actividad está cerrada y su estado quedó persistido.' : 'Confirma todas las conciliaciones antes de cerrar.';
}

function renderActivityList() {
  els['activity-count'].textContent = String(state.activities.length);
  if (state.activities.length === 0) {
    els['activity-list'].innerHTML = '<div class="empty-state">Todavía no existen actividades.</div>';
    return;
  }
  els['activity-list'].innerHTML = state.activities.map((activity) => {
    const selected = activity.id === state.selectedActivityId;
    const badgeClass = activity.status === 'Cerrada' ? 'badge-success' : 'badge-warning';
    return `<button type="button" class="activity-option${selected ? ' selected' : ''}" data-action="select-activity" data-id="${activity.id}" aria-pressed="${selected}"><span class="activity-option-main"><strong>${escapeHtml(activity.name)}</strong><span class="helper">${activity.participants.length} participante(s) · ${activity.expenses.length} gasto(s)</span></span><span class="badge ${badgeClass}">${activity.status}</span></button>`;
  }).join('');
}

function renderParticipantControls() {
  const activity = selectedActivity();
  const participants = activity?.participants ?? [];
  const participantActions = activity && !isClosed(activity);
  els['participant-list'].innerHTML = participants.length ? participants.map((p) => `<li class="list-item"><span>${escapeHtml(p.name)}${activity.managerId === p.id ? ' · <strong>Encargado</strong>' : ''}</span>${participantActions ? `<button type="button" class="button button-secondary button-small" data-action="remove-participant" data-id="${p.id}">Eliminar</button>` : ''}</li>`).join('') : '<li class="empty-state">Aún no hay participantes.</li>';
  const options = `<option value="">Selecciona un participante</option>${participants.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}`;
  els['manager-select'].innerHTML = options; if (activity?.managerId) els['manager-select'].value = activity.managerId;
  els['payer-select'].innerHTML = `<option value="">Selecciona pagador</option>${participants.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}`;
  els['expense-participants'].innerHTML = participants.map((p) => `<label class="check"><input type="checkbox" value="${p.id}" checked${isClosed(activity) ? ' disabled' : ''}> ${escapeHtml(p.name)}</label>`).join('') || '<span class="helper">Agrega participantes primero.</span>';
}

function renderExpenses() {
  const activity = selectedActivity();
  if (!activity || activity.expenses.length === 0) { els['expense-list'].innerHTML = '<div class="empty-state">Aún no hay gastos registrados.</div>'; return; }
  const expenseActions = canEditExpenses(activity);
  const summaryById = new Map(summarizeExpenses(activity).items.map((item) => [item.expenseId, item]));
  els['expense-list'].innerHTML = activity.expenses.map((expense) => {
    const summary = summaryById.get(expense.id);
    return `<article class="expense-card"><div class="expense-header"><div><strong>${escapeHtml(expense.description)}</strong><div class="helper">Pagó ${escapeHtml(nameFor(activity, expense.payerId))} · ${formatOriginalMoney(expense.amountMinor, expense.currency)} → <strong>${formatMoney(summary.normalizedCents)}</strong></div></div>${expenseActions ? `<div class="actions"><button class="button button-secondary button-small" data-action="edit-expense" data-id="${expense.id}">Editar</button><button class="button button-secondary button-small" data-action="delete-expense" data-id="${expense.id}">Eliminar</button></div>` : ''}</div><div class="helper">Se divide entre: ${expense.participantIds.map((id) => escapeHtml(nameFor(activity, id))).join(', ')}</div></article>`;
  }).join('');
}

function renderExpenseSummary() {
  const activity = selectedActivity();
  if (!activity || activity.expenses.length === 0) {
    els['expense-summary'].innerHTML = '<div class="empty-state">El resumen multimoneda aparecerá cuando registres gastos.</div>';
    return;
  }
  try {
    const summary = summarizeExpenses(activity);
    els['expense-summary'].innerHTML = `
      <div class="summary-heading">
        <div><strong>Resumen multimoneda</strong><div class="helper">Tipo de cambio utilizado: 1 USDT = ${formatRate(summary.bobPerUsdt)} BOB</div></div>
        <span class="badge badge-info">USDT</span>
      </div>
      <div class="summary-list">${summary.items.map((item) => `<div class="summary-row"><span>${escapeHtml(item.description)}</span><span>${formatOriginalMoney(item.amountMinor, item.currency)} → <strong>${formatMoney(item.normalizedCents)}</strong></span></div>`).join('')}</div>
      <div class="summary-total"><span>Total normalizado</span><strong>${formatMoney(summary.totalNormalizedCents)}</strong></div>`;
  } catch (error) {
    els['expense-summary'].innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

function renderBalances() {
  const activity = selectedActivity();
  if (!activity || activity.participants.length === 0) { els['balance-list'].innerHTML = '<div class="empty-state">Sin balances todavía.</div>'; els['balance-integrity'].textContent = ''; return; }
  try {
    const balances = computeBalances(activity); const sum = [...balances.values()].reduce((a,b)=>a+b,0);
    els['balance-list'].innerHTML = activity.participants.map((p) => { const value = balances.get(p.id) ?? 0; const cls = value > 0 ? 'money-positive' : value < 0 ? 'money-negative' : 'money-zero'; return `<article class="balance-card"><strong>${escapeHtml(p.name)}</strong><div class="${cls}">${value > 0 ? '+' : ''}${formatMoney(value)}</div></article>`; }).join('');
    els['balance-integrity'].textContent = `Control matemático: suma de balances = ${formatMoney(sum)}.`;
  } catch (error) { els['balance-list'].innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`; }
}

function renderSettlement() {
  const activity = selectedActivity();
  if (!activity) { els['settlement-list'].innerHTML = '<div class="empty-state">Sin actividad.</div>'; return; }
  try {
    const transfers = getSettlement(activity);
    if (transfers.length === 0) { els['settlement-list'].innerHTML = '<div class="empty-state">No se necesitan transferencias.</div>'; return; }
    els['settlement-list'].innerHTML = transfers.map((t) => `<article class="transfer-card"><div class="transfer-row"><div><strong>${escapeHtml(nameFor(activity,t.fromId))} → ${escapeHtml(nameFor(activity,t.toId))}</strong><div>${formatMoney(t.requiredCents)} · Pendiente: ${formatMoney(t.pendingCents)}</div></div><span class="badge ${t.status === 'Pagado' ? 'badge-success' : 'badge-warning'}">${t.status}</span></div>${t.pendingCents > 0 ? `<button class="button button-primary compact-top" data-action="confirm-transfer" data-id="${t.key}">Confirmar conciliación completa</button>` : ''}</article>`).join('');
  } catch (error) { els['settlement-list'].innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`; }
}
function formatOriginalMoney(cents, currency) { return `${currency} ${(cents / 100).toFixed(2)}`; }
function formatRate(value) { return Number(value).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 6 }); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
render();
