/*
 * Application state.
 *
 * Module data is READ ONLY — loaded from data/modules.json and never written back.
 * Only user-owned things (the blueprint library, filter preferences) persist, and
 * they live under their own localStorage key.
 */

import { evaluate } from './contracts.js';

const LS_KEY = 'tpt2-bp-tool.v3';
const PHASE_ORDER = ['Normal', 'Era', 'Inf'];

/* Category order as the game lists it. Used for every sort and grouping, so the
 * tool reads the same way the in-game module list does. Note Utility comes
 * before Ultimate. */
export const TYPE_ORDER = ['Offensive', 'Defensive', 'Utility', 'Ultimate', 'Special', 'Legendary'];
const typeRank = t => TYPE_ORDER.indexOf(t);

const listeners = new Set();
export const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };
const emit = () => { persist(); listeners.forEach(fn => fn(state)); };

export const MAX_MODULES = 51;

export const state = {
  ready: false,
  all: [],                 // every module, sorted by name
  byId: new Map(),
  tags: [],

  // library
  blueprints: [],          // [{ id, name, ids: string[] }]
  activeId: null,

  // browser filters
  phases: new Set(PHASE_ORDER),   // every phase on by default; toggle any off
  search: '',
  types: new Set(),
  tags_: new Set(),
  tagsOpen: false,         // the tag chip grid is tall; keep it folded away by default

  view: 'build',
  notice: null,            // { kind: 'error'|'info', text }
};

/* ---------- persistence ---------- */
function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      blueprints: state.blueprints,
      activeId: state.activeId,
      phases: [...state.phases],
      tagsOpen: state.tagsOpen,
    }));
  } catch { /* private mode, quota — not worth interrupting the user */ }
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    if (Array.isArray(saved.blueprints)) state.blueprints = saved.blueprints;
    if (saved.activeId) state.activeId = saved.activeId;
    if (Array.isArray(saved.phases)) {
      const valid = saved.phases.filter(p => PHASE_ORDER.includes(p));
      if (valid.length) state.phases = new Set(valid);
    }
    if (typeof saved.tagsOpen === 'boolean') state.tagsOpen = saved.tagsOpen;
  } catch { /* corrupt storage should not brick the app */ }
}

/* ---------- load ---------- */
export async function load() {
  const res = await fetch('data/modules.json');
  if (!res.ok) throw new Error(`Could not load module data (${res.status}).`);
  const data = await res.json();

  state.all = data.modules;
  state.byId = new Map(data.modules.map(m => [m.id, m]));
  state.tags = data.tags;

  restore();
  if (!state.blueprints.length) {
    state.blueprints = [{ id: newId(), name: 'New blueprint', ids: [] }];
  }
  if (!state.blueprints.some(b => b.id === state.activeId)) {
    state.activeId = state.blueprints[0].id;
  }
  state.ready = true;
  emit();
}

const newId = () => `bp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

/* ---------- derived ---------- */
export const active = () => state.blueprints.find(b => b.id === state.activeId);

/**
 * Modules in the active blueprint, grouped by category in game order.
 * Inside a category the order you added them in is preserved — the game has no
 * secondary sort there, it is whatever order you picked or rearranged them into.
 * Array.prototype.sort is stable, so insertion order survives.
 * Unknown ids are skipped.
 */
export function activeModules() {
  const bp = active();
  if (!bp) return [];
  return bp.ids
    .map(id => state.byId.get(id))
    .filter(Boolean)
    .sort((a, b) => typeRank(a.type) - typeRank(b.type));
}

export const PHASES = PHASE_ORDER;

/** Phase gate: a module shows when its phase is one of the enabled ones. */
export const inPhase = m => state.phases.has(m.phase);

/** Is this module already in the working blueprint? */
export const isAdded = id => (active()?.ids || []).includes(id);

/**
 * Split the search box into tag terms and free text, the way the game does it:
 * a word starting with '#' is a tag filter, everything else is plain text.
 * "#fire #area splash" = tagged FIRE and AREA, and the word "splash" somewhere.
 */
export function parseSearch(raw) {
  const tags = [], words = [];
  for (const part of String(raw).trim().split(/\s+/).filter(Boolean)) {
    if (part.startsWith('#')) {
      const t = part.slice(1).toUpperCase();
      if (t) tags.push(t);
    } else {
      words.push(part.toLowerCase());
    }
  }
  return { tags, text: words.join(' ') };
}

/**
 * The browser list, after every active filter.
 *
 * Modules already in the blueprint stay in the list and are greyed out rather
 * than removed: dropping a row out of a 399-item list shifts everything below it,
 * so the module you wanted next jumps under your cursor. The game dims in place
 * for the same reason.
 */
export function visibleModules() {
  const { tags: searchTags, text } = parseSearch(state.search);

  return state.all.filter(m => {
    if (!inPhase(m)) return false;
    if (state.types.size && !state.types.has(m.type)) return false;
    if (state.tags_.size && ![...state.tags_].every(t => m.tags.includes(t))) return false;

    // '#fire' matches FIRE exactly; a partial like '#fi' still narrows usefully.
    for (const t of searchTags) {
      if (!m.tags.some(x => x === t || x.startsWith(t))) return false;
    }
    if (text) {
      const hay = `${m.name} ${m.description} ${m.location}`.toLowerCase();
      if (!hay.includes(text)) return false;
    }
    return true;
  })
  // Game order: category first, then alphabetical inside it.
  .sort((a, b) => typeRank(a.type) - typeRank(b.type) || a.name.localeCompare(b.name));
}

export const contractResults = () => evaluate(activeModules());

/* ---------- blueprint mutation ---------- */

export function addModule(id) {
  const bp = active();
  if (!bp) return;
  if (bp.ids.includes(id)) return notify('error', `${state.byId.get(id)?.name} is already in this blueprint.`);
  if (bp.ids.length >= MAX_MODULES) {
    return notify('error', `A blueprint holds at most ${MAX_MODULES} modules. Remove one first.`);
  }
  bp.ids.push(id);
  emit();
}

/**
 * Reorder within the blueprint. `dragId` is placed immediately before or after
 * `targetId` in the stored order.
 *
 * The displayed list is sorted by category, so this only visibly reorders
 * modules within their own category — dropping one into a different category's
 * block moves it in the underlying order, but the category sort pulls it back
 * to its own group. That matches the game: category first, then whatever order
 * you arranged them in.
 */
export function moveModule(dragId, targetId, before) {
  const bp = active();
  if (!bp) return;
  const next = reorderIds(bp.ids, dragId, targetId, before);
  if (next === bp.ids) return;
  bp.ids = next;
  emit();
}

/** Pure reorder. Returns the original array unchanged when the move is a no-op. */
export function reorderIds(ids, dragId, targetId, before) {
  if (dragId === targetId) return ids;
  const out = ids.filter(x => x !== dragId);
  if (out.length === ids.length) return ids;      // dragId not in the list
  const at = out.indexOf(targetId);
  if (at === -1) return ids;
  out.splice(before ? at : at + 1, 0, dragId);
  return out;
}

export function removeModule(id) {
  const bp = active();
  if (!bp) return;
  bp.ids = bp.ids.filter(x => x !== id);
  emit();
}

export function clearBlueprint() {
  const bp = active();
  if (!bp) return;
  bp.ids = [];
  emit();
}

/* ---------- library ---------- */

export function createBlueprint(name = 'New blueprint', ids = []) {
  const bp = { id: newId(), name: uniqueName(name), ids: ids.slice(0, MAX_MODULES) };
  state.blueprints.push(bp);
  state.activeId = bp.id;
  emit();
  return bp;
}

export function duplicateBlueprint(id) {
  const src = state.blueprints.find(b => b.id === id);
  if (src) createBlueprint(`${src.name} copy`, [...src.ids]);
}

export function deleteBlueprint(id) {
  state.blueprints = state.blueprints.filter(b => b.id !== id);
  if (!state.blueprints.length) state.blueprints = [{ id: newId(), name: 'New blueprint', ids: [] }];
  if (!state.blueprints.some(b => b.id === state.activeId)) state.activeId = state.blueprints[0].id;
  emit();
}

export function renameBlueprint(id, name) {
  const bp = state.blueprints.find(b => b.id === id);
  if (!bp) return;
  const clean = name.replace(/;/g, ' ').trim();      // ';' is the export field separator
  bp.name = clean || 'Untitled';
  emit();
}

export function selectBlueprint(id) {
  state.activeId = id;
  emit();
}

function uniqueName(name) {
  const taken = new Set(state.blueprints.map(b => b.name));
  if (!taken.has(name)) return name;
  let n = 2;
  while (taken.has(`${name} ${n}`)) n++;
  return `${name} ${n}`;
}

/* ---------- ui state ---------- */

export function set(patch) { Object.assign(state, patch); emit(); }

export function toggleIn(setName, value) {
  const s = state[setName];
  s.has(value) ? s.delete(value) : s.add(value);
  emit();
}

export function clearFilters() {
  state.search = '';
  state.types = new Set();
  state.tags_ = new Set();
  state.phases = new Set(PHASE_ORDER);
  emit();
}

export const filterCount = () =>
  state.types.size + state.tags_.size + (state.search ? 1 : 0) +
  (state.phases.size < PHASE_ORDER.length ? 1 : 0);

export function notify(kind, text) {
  state.notice = { kind, text };
  emit();
  clearTimeout(notify._t);
  notify._t = setTimeout(() => { state.notice = null; emit(); }, 6000);
}
