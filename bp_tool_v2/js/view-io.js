/* Library and Import / Export views. */

import { el, mount, frag, copy } from './dom.js';
import * as S from './store.js';
import { decodeExport, encodeExport, resolveBlueprint, BlueprintFormatError } from './codec.js';
import { evaluate } from './contracts.js';
import { toReadableTextAll } from './share-text.js';
import { displayName, hasRichText } from './rich-text.js';

/* ---------- library ---------- */

export function renderLibrary(root) {
  const rows = S.state.blueprints.map(bp => {
    const mods = bp.ids.map(id => S.state.byId.get(id)).filter(Boolean);
    const met = evaluate(mods).filter(c => c.met);
    const isActive = bp.id === S.state.activeId;

    return el('tr', { class: isActive ? 'on' : '' },
      el('td', { class: 'name' },
        el('button', { class: 'linklike strong', onclick: () => { S.selectBlueprint(bp.id); go('build'); },
          title: bp.name }, displayName(bp.name)),
        isActive && el('span', { class: 'cap' }, 'editing'),
      ),
      el('td', { class: 'num' }, `${bp.ids.length} / ${S.MAX_MODULES}`),
      el('td', {}, met.length
        ? el('div', { class: 'chips' }, met.map(c => el('span', { class: 'chip gain' }, c.name)))
        : el('span', { class: 'dim' }, 'no contracts met')),
      el('td', { class: 'actions' },
        el('button', { class: 'linklike', onclick: () => rename(bp) }, 'rename'),
        el('button', { class: 'linklike', onclick: () => S.duplicateBlueprint(bp.id) }, 'duplicate'),
        el('button', {
          class: 'linklike danger',
          onclick: () => confirm(`Delete "${displayName(bp.name)}"? This cannot be undone.`) && S.deleteBlueprint(bp.id),
        }, 'delete'),
      ),
    );
  });

  mount(root, el('section', { class: 'panel wide' },
    el('div', { class: 'panel-head' },
      el('h2', {}, 'Blueprint library'),
      el('span', { class: 'meta' },
        el('button', { class: 'linklike', onclick: () => { S.createBlueprint(); go('build'); } }, '+ new blueprint')),
    ),
    el('div', { class: 'panel-body flush' },
      el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Name'), el('th', { class: 'num' }, 'Modules'),
          el('th', {}, 'Contracts met'), el('th', {}, ''))),
        el('tbody', {}, rows))),
    el('div', { class: 'panel-foot' },
      'Saved in this browser only. Use ',
      el('button', { class: 'linklike', onclick: () => go('io') }, 'Import / export'),
      ' to move blueprints in and out of the game.'),
  ));
}

function rename(bp) {
  // Raw value on purpose: rich-text tags are editable here, not silently dropped.
  const name = prompt('Blueprint name', bp.name);
  if (name != null) S.renameBlueprint(bp.id, name);
}

const go = view => S.set({ view });

/* ---------- import / export ---------- */

let importText = '';
let importResult = null;   // { blueprints: [{resolved, selected}] } or { error }
let exportText = '';
let exportScope = 'active';
let exportFormat = 'code';       // 'code' = game import string, 'text' = chat friendly
let textWithModules = true;

export function renderIO(root) {
  mount(root, frag(importPanel(), exportPanel()));
}

function importPanel() {
  return el('section', { class: 'panel wide' },
    el('div', { class: 'panel-head' }, el('h2', {}, 'Import from the game')),
    el('div', { class: 'panel-body' },
      el('p', { class: 'hint' },
        'Paste a blueprint code exported from The Perfect Tower II. ',
        'One code can contain several blueprints — pick which to import.'),
      el('textarea', {
        id: 'f-import',
        class: 'code-area', rows: 4, placeholder: 'Paste blueprint code…',
        value: importText,
        // Decode on any input, not just paste: drag-and-drop text and autofill
        // never fire a paste event, and a code that arrived that way used to sit
        // there looking ignored until you found the button.
        oninput: e => { importText = e.target.value; scheduleImport(); },
      }),
      el('div', { class: 'btn-row' },
        el('button', {
          class: 'btn ghost',
          onclick: () => { clearTimeout(importTimer); importText = ''; importResult = null; S.set({}); },
        }, 'Clear'),
      ),
      importResult && importReport(),
    ),
  );
}

/* A code is ~200-2900 characters, so anything shorter is someone mid-keystroke
 * rather than a real code. Staying quiet until then avoids flashing "that does
 * not look like a blueprint code" at every character. */
const LOOKS_LIKE_A_CODE = 24;
let importTimer = null;

function scheduleImport() {
  clearTimeout(importTimer);
  importTimer = setTimeout(() => {
    if (importText.trim().length >= LOOKS_LIKE_A_CODE) doImport();
    else if (importResult) { importResult = null; S.set({}); }
  }, 200);
}

async function doImport() {
  // Read the field itself rather than a cached copy, so autofill, drag-and-drop
  // and anything else that sets the value without firing `input` still works.
  importText = document.querySelector('#f-import')?.value ?? importText;
  try {
    const decoded = await decodeExport(importText);
    importResult = {
      blueprints: decoded.map(bp => ({
        resolved: resolveBlueprint(bp, S.state.byId),
        selected: true,
      })),
    };
  } catch (e) {
    importResult = { error: e instanceof BlueprintFormatError ? e.message : String(e) };
  }
  S.set({});
}

function importReport() {
  if (importResult.error) {
    return el('div', { class: 'notice error' }, importResult.error);
  }

  const items = importResult.blueprints;
  return frag(
    el('div', { class: 'import-list' },
      items.map((item, i) => {
        const r = item.resolved;
        const problems = [];
        if (r.unknown.length) {
          problems.push(el('div', { class: 'notice warn small' },
            el('b', {}, `${r.unknown.length} unrecognised module${r.unknown.length > 1 ? 's' : ''}: `),
            r.unknown.join(', '),
            el('div', { class: 'sub' },
              'These will be skipped. The module data in this tool needs updating — ' +
              'the game has modules it does not know about yet.')));
        }
        if (r.duplicates.length) {
          problems.push(el('div', { class: 'notice warn small' },
            `${r.duplicates.length} duplicate entr${r.duplicates.length > 1 ? 'ies' : 'y'} collapsed.`));
        }
        if (r.modules.length > S.MAX_MODULES) {
          problems.push(el('div', { class: 'notice error small' },
            `${r.modules.length} modules exceeds the ${S.MAX_MODULES} limit — the extras will be dropped.`));
        }

        const met = evaluate(r.modules).filter(c => c.met);
        return el('div', { class: 'import-item' },
          el('label', { class: 'check' },
            el('input', {
              type: 'checkbox', checked: item.selected,
              onchange: e => { items[i].selected = e.target.checked; S.set({}); },
            }),
            el('b', { title: r.name }, displayName(r.name)),
            el('span', { class: 'dim' },
              ` — ${r.modules.length} module${r.modules.length === 1 ? '' : 's'}`)),
          met.length ? el('div', { class: 'chips' },
            met.map(c => el('span', { class: 'chip gain' }, c.name))) : null,
          problems,
        );
      })),
    el('div', { class: 'btn-row' },
      el('button', { class: 'btn primary', onclick: commitImport },
        `Add ${items.filter(i => i.selected).length} to library`),
    ),
  );
}

function commitImport() {
  const chosen = importResult.blueprints.filter(i => i.selected);
  if (!chosen.length) return S.notify('error', 'Nothing selected to import.');

  let last = null;
  for (const { resolved } of chosen) {
    last = S.createBlueprint(resolved.name, resolved.modules.map(m => m.id));
  }
  const skipped = chosen.reduce((n, c) => n + c.resolved.unknown.length, 0);
  S.notify('info',
    `Imported ${chosen.length} blueprint${chosen.length > 1 ? 's' : ''}` +
    (skipped ? `, skipping ${skipped} unrecognised module${skipped > 1 ? 's' : ''}.` : '.'));

  importText = '';
  importResult = null;
  if (last) S.selectBlueprint(last.id);
  go('build');
}

function exportPanel() {
  const readable = exportFormat === 'text';

  return el('section', { class: 'panel wide' },
    el('div', { class: 'panel-head' }, el('h2', {}, 'Export')),
    el('div', { class: 'panel-body' },
      el('div', { class: 'btn-row' },
        el('div', { class: 'seg' },
          el('button', {
            class: `seg-btn ${!readable ? 'on' : ''}`,
            onclick: () => { exportFormat = 'code'; exportText = ''; S.set({}); },
          }, 'Game code'),
          el('button', {
            class: `seg-btn ${readable ? 'on' : ''}`,
            onclick: () => { exportFormat = 'text'; exportText = ''; S.set({}); },
          }, 'Readable text')),
        el('div', { class: 'seg' },
          el('button', {
            class: `seg-btn ${exportScope === 'active' ? 'on' : ''}`,
            onclick: () => { exportScope = 'active'; exportText = ''; S.set({}); },
          }, 'Current blueprint'),
          el('button', {
            class: `seg-btn ${exportScope === 'all' ? 'on' : ''}`,
            onclick: () => { exportScope = 'all'; exportText = ''; S.set({}); },
          }, `All ${S.state.blueprints.length}`)),
        readable && el('label', { class: 'check', title: 'Leave off for a three-line summary' },
          el('input', {
            type: 'checkbox', checked: textWithModules,
            onchange: e => { textWithModules = e.target.checked; doExport(); },
          }), 'list modules'),
        el('button', { class: 'btn primary', onclick: doExport },
          readable ? 'Generate text' : 'Generate code'),
        exportText && el('button', {
          class: 'btn',
          onclick: async () => S.notify(...(await copy(exportText)
            ? ['info', readable ? 'Text copied.' : 'Blueprint code copied.']
            : ['error', 'Could not reach the clipboard — select the text and copy it manually.'])),
        }, 'Copy'),
      ),
      el('textarea', {
        class: `code-area ${readable ? 'prose' : ''}`,
        rows: readable ? 16 : 4, readOnly: true,
        placeholder: readable ? 'Generated text appears here…' : 'Generated code appears here…',
        value: exportText,
        onclick: e => e.target.select(),
      }),
      el('p', { class: 'hint' }, readable
        ? charCountHint()
        : 'Paste this into the game’s blueprint import box.'),
    ),
  );
}

/* Discord rejects messages over 2000 characters, so say where you stand. */
function charCountHint() {
  if (!exportText) return 'Plain text for pasting into a chat. Nothing to format yet.';
  const n = exportText.length;
  const over = n > 2000;
  return `${n} characters — ${over
    ? 'over Discord’s 2000 limit; turn off “list modules” or split it up.'
    : 'fits in a single Discord message.'}`;
}

async function doExport() {
  const list = exportScope === 'all' ? S.state.blueprints : [S.active()];

  if (exportFormat === 'text') {
    const entries = list.map(bp => ({
      blueprint: bp,
      modules: bp.ids.map(id => S.state.byId.get(id)).filter(Boolean),
    }));
    exportText = toReadableTextAll(entries, { includeModules: textWithModules, max: S.MAX_MODULES });
    return S.set({});
  }

  try {
    exportText = await encodeExport(list.map(bp => ({ name: bp.name, ids: bp.ids })));
  } catch (e) {
    exportText = '';
    S.notify('error', e instanceof BlueprintFormatError ? e.message : String(e));
  }
  S.set({});
}
