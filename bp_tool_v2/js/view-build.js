/* The Build view: module browser | blueprint | contracts. */

import { el, mount, frag } from './dom.js';
import * as S from './store.js';
import { hasRichText } from './rich-text.js';

const TYPES = S.TYPE_ORDER;

/* Tag groups keep the filter bar readable — 60 flat tags is unusable. */
const TAG_GROUPS = {
  Elements: ['FIRE', 'WATER', 'EARTH', 'AIR', 'NATURE', 'ELECTRICITY', 'LIGHT', 'DARKNESS', 'NEUTRAL', 'UNIVERSAL', 'INFINITY'],
  Mechanics: ['DAMAGE', 'CHANCE', 'AREA', 'AOE', 'BUFF', 'DEBUFF', 'AURA', 'REACTIVE', 'INSTANT', 'ACTIVE', 'TOGGLE'],
  Defence: ['HEALTH', 'ARMOR', 'BLOCK', 'RESISTANCE', 'SHIELD', 'REGENERATION', 'REFLECT'],
  Other: ['COMMUNITY', 'ENERGY', 'COST', 'RESOURCES', 'STUN', 'SLOW', 'ATTACKSPEED', 'COOLDOWN', 'RANGE', 'XP'],
};

/* ---------- module card ---------- */

/* The id being dragged. Kept outside the render so a re-render cannot lose it —
 * though in practice nothing re-renders between dragstart and drop. */
let dragId = null;

const clearDropMarks = () => document.querySelectorAll('.drop-before, .drop-after')
  .forEach(n => n.classList.remove('drop-before', 'drop-after'));

function moduleCard(m, { inBlueprint }) {
  // In the browser an already-added module stays put, greyed. Double-clicking it
  // takes it back out, so the row you are looking at is the row that responds —
  // no hunting for it in the blueprint panel.
  const added = !inBlueprint && S.isAdded(m.id);
  const act = () => (inBlueprint || added) ? S.removeModule(m.id) : S.addModule(m.id);

  /* Double-click, not single: single-click made it far too easy to drop a module
   * into the blueprint while trying to read one, and it now has to coexist with
   * dragging a row to reorder it. Enter/Space still works for keyboard users. */
  const drag = inBlueprint ? {
    draggable: true,
    ondragstart: e => {
      dragId = m.id;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', m.id);   // Firefox needs a payload
      e.currentTarget.classList.add('dragging');
    },
    ondragend: e => {
      dragId = null;
      e.currentTarget.classList.remove('dragging');
      clearDropMarks();
    },
    ondragover: e => {
      if (!dragId || dragId === m.id) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const box = e.currentTarget.getBoundingClientRect();
      const before = e.clientY < box.top + box.height / 2;
      e.currentTarget.classList.toggle('drop-before', before);
      e.currentTarget.classList.toggle('drop-after', !before);
    },
    ondragleave: e => e.currentTarget.classList.remove('drop-before', 'drop-after'),
    ondrop: e => {
      e.preventDefault();
      const box = e.currentTarget.getBoundingClientRect();
      const before = e.clientY < box.top + box.height / 2;
      const id = dragId || e.dataTransfer.getData('text/plain');
      clearDropMarks();
      if (id) S.moveModule(id, m.id, before);
    },
  } : {};

  return el('div', {
    class: `mod type-${m.type.toLowerCase()} ${inBlueprint ? 'in-bp' : ''} ${added ? 'added' : ''}`,
    tabIndex: 0,
    role: 'button',
    'aria-label': `${(inBlueprint || added) ? 'Remove' : 'Add'} ${m.name}`,
    title: inBlueprint
      ? 'Double-click to remove · drag to reorder'
      : added ? 'In this blueprint — double-click to remove' : 'Double-click to add',
    ondblclick: act,
    onkeydown: e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }
    },
    ...drag,
  },
    // The name is the thing you are scanning for, so it leads; type and phase
    // sit right-aligned and quiet.
    el('div', { class: 'mod-top' },
      el('span', { class: 'mod-name' }, m.name),
      m.active && el('span', { class: 'flag', title: 'Can be activated manually' }, 'ACTIVE'),
      el('span', { class: 'mod-where' }, m.type, el('span', { class: 'sep' }, m.phase)),
    ),
    el('div', { class: 'mod-tags' },
      m.tags.map(t => el('span', {
        class: `tag ${S.state.tags_.has(t) ? 'on' : ''}`,
        title: `Filter by #${t}`,
        onclick: e => { e.stopPropagation(); S.toggleIn('tags_', t); },
        // Otherwise a quick double-tap on a tag also adds or removes the module.
        ondblclick: e => e.stopPropagation(),
      }, t))),
    // Description is revealed on hover only, so the list stays scannable.
    el('div', { class: 'mod-desc' },
      m.location && m.location !== 'N/A' && el('span', { class: 'mod-loc' }, m.location),
      m.description),
  );
}

/* ---------- browser ---------- */

/* Search re-filters 399 cards, each previewing its contract impact. Debouncing
 * keeps typing responsive; the field itself updates immediately because it is a
 * plain uncontrolled input until the next render. */
let searchTimer = null;
function onSearchInput(e) {
  const value = e.target.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => S.set({ search: value }), 140);
}

function filterBar() {
  const s = S.state;

  /* Phases are independent toggles, all on by default. Turning Normal and Era off
   * leaves only Inf modules — which is what "only show me the new stuff" means,
   * and it replaces the old phase-picker plus "this phase only" checkbox. */
  const phaseSeg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Phase' },
    S.PHASES.map(p => el('button', {
      class: `seg-btn ${s.phases.has(p) ? 'on' : ''}`,
      onclick: () => S.toggleIn('phases', p),
      title: s.phases.has(p) ? `Hide ${p} modules` : `Show ${p} modules`,
    }, p)));

  /* The full grid is ~35 chips and eats half the panel, so it folds away. Chips
   * that are switched on stay visible when folded — a hidden active filter is
   * how you end up staring at an empty list wondering why. */
  const tagButton = t => el('button', {
    class: `chip-btn ${s.tags_.has(t) ? 'on' : ''}`,
    onclick: () => S.toggleIn('tags_', t),
  }, t);

  const tagToggle = el('button', {
    class: `chip-btn toggle ${s.tagsOpen ? 'on' : ''}`,
    onclick: () => S.set({ tagsOpen: !s.tagsOpen }),
  }, s.tagsOpen ? '▾ Tags' : '▸ Tags', s.tags_.size ? ` (${s.tags_.size})` : '');

  const tagChips = s.tagsOpen
    ? Object.entries(TAG_GROUPS).map(([group, tags]) =>
        el('div', { class: 'tag-group' },
          el('span', { class: 'tag-group-label' }, group),
          tags.filter(t => s.tags.includes(t)).map(tagButton)))
    : [...s.tags_].map(tagButton);

  return el('div', { class: 'filters' },
    el('input', {
      id: 'f-search',
      class: 'search wide', type: 'search',
      placeholder: 'Search modules…  #fire #area for tags',
      value: s.search, oninput: onSearchInput,
    }),
    el('div', { class: 'filter-row' },
      phaseSeg,
      el('div', { class: 'seg' },
        TYPES.map(t => el('button', {
          class: `seg-btn ${s.types.has(t) ? 'on' : ''}`,
          onclick: () => S.toggleIn('types', t),
        }, t))),
    ),
    el('div', { class: 'filter-row wrap' }, tagToggle, tagChips),
  );
}

function browserPanel() {
  const list = S.visibleModules();
  const total = S.state.all.filter(S.inPhase).length;

  return el('section', { class: 'panel col-browser' },
    el('div', { class: 'panel-head' },
      el('h2', {}, 'Modules'),
      el('span', { class: 'meta' },
        `${list.length} of ${total}`,
        S.filterCount() > 0 && frag(' · ', el('button', {
          class: 'linklike', onclick: () => S.clearFilters(),
        }, 'clear filters'))),
    ),
    filterBar(),
    el('div', { id: 'scroll-modules', class: 'panel-body flush scroll' },
      list.length
        ? list.map(m => moduleCard(m, { inBlueprint: false }))
        : el('p', { class: 'empty' }, S.state.phases.size
            ? 'No modules match these filters.'
            : 'Every phase is switched off — turn one on to see modules.'),
    ),
  );
}

/* ---------- blueprint ---------- */

function blueprintPanel() {
  const bp = S.active();
  const mods = S.activeModules();
  const over = mods.length >= S.MAX_MODULES;

  const byType = {};
  for (const m of mods) byType[m.type] = (byType[m.type] || 0) + 1;

  return el('section', { class: 'panel col-bp' },
    el('div', { class: 'panel-head' },
      el('h2', {}, 'Blueprint'),
      el('span', { class: `meta ${over ? 'warn' : ''}` }, `${mods.length} / ${S.MAX_MODULES}`),
    ),
    el('div', { class: 'bp-name-row' },
      el('input', {
        id: 'f-bp-name',
        class: 'bp-name', value: bp?.name || '', 'aria-label': 'Blueprint name',
        title: hasRichText(bp?.name)
          ? 'This name contains a game icon tag. Keep it to keep the icon in game.'
          : '',
        onchange: e => S.renameBlueprint(bp.id, e.target.value),
      }),
      hasRichText(bp?.name) && el('span', { class: 'tag', title: 'Renders as an icon in game' }, 'ICON'),
      mods.length ? el('button', {
        class: 'linklike', onclick: () => confirm(`Remove all ${mods.length} modules?`) && S.clearBlueprint(),
      }, 'clear') : null,
    ),
    el('div', { class: 'bp-breakdown' },
      TYPES.filter(t => byType[t]).map(t =>
        el('span', { class: 'count' },
          el('span', { class: `dot t-${t.toLowerCase()}` }), t, ' ', el('b', {}, byType[t]))),
      el('span', { class: 'count' }, 'active ', el('b', {}, mods.filter(m => m.active).length)),
    ),
    el('div', { id: 'scroll-blueprint', class: 'panel-body flush scroll' },
      mods.length
        ? mods.map(m => moduleCard(m, { inBlueprint: true }))
        : el('p', { class: 'empty' },
            'Empty blueprint. Double-click modules on the left to add them, or import a code from the game.'),
    ),
  );
}

/* ---------- contracts ---------- */

/* Deliberately plain: a checkmark, the name, and what the contract asks for.
 * No shortfall buttons, no browser filtering, no "this would break X" warnings —
 * the panel reports status and stays out of the way. */
function contractsPanel() {
  const results = S.contractResults();
  const met = results.filter(c => c.met).length;

  return el('section', { class: 'panel col-contracts' },
    el('div', { class: 'panel-head' },
      el('h2', {}, 'Contracts'),
      el('span', { class: 'meta' }, `${met} / ${results.length}`),
    ),
    el('div', { id: 'scroll-contracts', class: 'panel-body flush scroll' },
      results.map(c => el('div', { class: `contract ${c.met ? 'met' : ''}` },
        el('div', { class: 'contract-top' },
          el('span', { class: 'mark' }, c.met ? '✓' : '○'),
          el('span', { class: 'contract-name' }, c.name),
        ),
        el('div', { class: 'contract-rule' }, c.rule),
      )),
    ),
  );
}

/* ---------- view ---------- */

export function renderBuild(root) {
  mount(root, el('div', { class: 'columns' },
    browserPanel(), blueprintPanel(), contractsPanel()));
}
