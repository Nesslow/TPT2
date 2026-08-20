/*
 * Human-readable blueprint export — for pasting into a chat.
 *
 * Optimised for Discord: plain text (no markdown tables, which Discord will not
 * render), wrapped to a comfortable width, and short enough that a full
 * 51-module build stays well inside the 2000-character message limit.
 */

import { evaluate } from './contracts.js';
import { displayName } from './rich-text.js';

/* Game order — matches the in-game module list and the app's own sorting. */
const TYPE_ORDER = ['Offensive', 'Defensive', 'Utility', 'Ultimate', 'Special', 'Legendary'];
const PHASE_ORDER = ['Normal', 'Era', 'Inf'];

const WRAP = 72;

/**
 * Wrap a comma-separated list without breaking a name across lines.
 * `label` is prefixed to the first line and counts toward its width;
 * continuation lines are indented to line up under it.
 */
function wrapList(items, { label = '', indent = '', width = WRAP } = {}) {
  const lines = [];
  let line = label;
  let atStart = true;

  for (let i = 0; i < items.length; i++) {
    const piece = items[i] + (i < items.length - 1 ? ',' : '');
    if (atStart) { line += piece; atStart = false; continue; }
    if (line.length + 1 + piece.length <= width) { line += ' ' + piece; continue; }
    lines.push(line);
    line = indent + piece;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * @param {{name: string}} blueprint
 * @param {Array} modules resolved module objects, in blueprint order
 * @param {{includeModules?: boolean, max?: number}} opts
 */
export function toReadableText(blueprint, modules, { includeModules = true, max = 51 } = {}) {
  const out = [];

  // Highest phase reached tells the reader whether they can build it at all.
  const phase = modules.reduce(
    (hi, m) => PHASE_ORDER.indexOf(m.phase) > PHASE_ORDER.indexOf(hi) ? m.phase : hi,
    'Normal');

  out.push(`${displayName(blueprint.name)} — ${modules.length}/${max} modules (${phase})`);

  // Just the score. The per-category counts that used to sit here are already
  // in the "(18)" beside each group heading below.
  const results = evaluate(modules);
  out.push(`Contracts: ${results.filter(c => c.met).length}/${results.length}`);

  const byType = {};
  for (const m of modules) (byType[m.type] ||= []).push(m);

  if (includeModules && modules.length) {
    for (const type of TYPE_ORDER) {
      const group = byType[type];
      if (!group) continue;
      out.push('');
      out.push(`${type} (${group.length})`);
      // Alphabetical inside a group reads better than blueprint insertion order.
      out.push(...wrapList([...group].map(m => m.name).sort((a, b) => a.localeCompare(b))));
    }
  }

  return out.join('\n');
}

/** Several blueprints in one message, separated by a rule. */
export function toReadableTextAll(entries, opts) {
  return entries
    .map(({ blueprint, modules }) => toReadableText(blueprint, modules, opts))
    .join('\n\n' + '─'.repeat(40) + '\n\n');
}
