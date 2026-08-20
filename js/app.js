/* Bootstrap: rail, view routing, render loop. */

import { el, mount, $ } from './dom.js';
import * as S from './store.js';
import { displayName } from './rich-text.js';
import { renderBuild } from './view-build.js';
import { renderLibrary, renderIO } from './view-io.js';

const VIEWS = [
  { id: 'build', label: 'Build', glyph: '◧', render: renderBuild },
  { id: 'library', label: 'Library', glyph: '≡', render: renderLibrary },
  { id: 'io', label: 'Import / export', glyph: '⇅', render: renderIO },
];

function renderRail() {
  const bp = S.active();
  mount($('#rail-nav'),
    VIEWS.map(v => el('button', {
      class: `rail-link ${S.state.view === v.id ? 'active' : ''}`,
      onclick: () => S.set({ view: v.id }),
    }, el('span', { class: 'glyph' }, v.glyph), v.label)),
    el('div', { class: 'rail-group-label' }, 'Editing'),
    el('div', { class: 'rail-current' },
      el('div', { class: 'rail-current-name', title: bp?.name || '' },
        bp ? displayName(bp.name) : '—'),
      el('div', { class: 'rail-current-meta' }, `${bp?.ids.length || 0} / ${S.MAX_MODULES} modules`)),
  );
}

function renderNotice() {
  const n = S.state.notice;
  mount($('#notice'), n ? el('div', { class: `notice ${n.kind}` }, n.text) : null);
}

/* Every render rebuilds its subtree, which would drop focus and caret position
 * mid-keystroke. Any field the user can type in carries a stable id, and we put
 * them back exactly as they were. */
function captureFocus() {
  const a = document.activeElement;
  if (!a?.id || !('value' in a)) return null;
  return { id: a.id, start: a.selectionStart, end: a.selectionEnd };
}

function restoreFocus(f) {
  if (!f) return;
  const node = document.getElementById(f.id);
  if (!node) return;
  node.focus();
  try { node.setSelectionRange(f.start, f.end); } catch { /* not all inputs support it */ }
}

/* Rebuilding a subtree resets its scroll to the top. Adding a module, removing
 * one, or clicking a tag would throw you back to the start of a 399-row list,
 * which makes editing near the bottom unusable. Scroll containers carry a stable
 * id so their position can be put back. */
function captureScroll() {
  return [...document.querySelectorAll('[id^="scroll-"]')]
    .map(n => [n.id, n.scrollTop]);
}

function restoreScroll(saved) {
  for (const [id, top] of saved) {
    const node = document.getElementById(id);
    // Clamped by the browser if the list got shorter, which is the behaviour we want.
    if (node) node.scrollTop = top;
  }
}

function render() {
  if (!S.state.ready) return;
  const focus = captureFocus();
  const scroll = captureScroll();

  renderRail();
  renderNotice();
  const view = VIEWS.find(v => v.id === S.state.view) || VIEWS[0];
  $('#crumb').textContent = view.label;
  view.render($('#view'));

  restoreScroll(scroll);
  restoreFocus(focus);
}

S.subscribe(render);

S.load().catch(err => {
  mount($('#view'), el('div', { class: 'notice error' },
    el('b', {}, 'Could not start. '), err.message,
    el('div', { class: 'sub' },
      'This app loads data/modules.json, which browsers block over file://. ' +
      'Serve the folder over http (for example: python -m http.server) and reload.')));
});
