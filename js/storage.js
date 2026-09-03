export const STORAGE_KEY = 'cuentasClaras.v2';

export function createEmptyState() {
  return { activities: [], selectedActivityId: null };
}

export function serializeState(state) {
  return JSON.stringify(state);
}

export function deserializeState(serialized) {
  if (!serialized) return createEmptyState();
  const parsed = JSON.parse(serialized);
  if (!parsed || !Array.isArray(parsed.activities)) throw new Error('Los datos guardados no tienen una estructura válida.');
  return parsed;
}

export function loadState(storage = globalThis.localStorage) {
  if (!storage) return createEmptyState();
  const raw = storage.getItem(STORAGE_KEY);
  return deserializeState(raw);
}

export function saveState(state, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, serializeState(state));
}
