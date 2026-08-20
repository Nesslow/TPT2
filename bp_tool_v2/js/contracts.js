/*
 * Contracts — bonuses to resources gained, granted when a blueprint meets a rule.
 *
 * Each contract is a list of requirements built from a small set of primitives, so
 * the engine can do more than say pass/fail: it reports the exact shortfall, and
 * knows which modules would close it (used to filter the browser on click).
 *
 * Two counting rules matter, and the data was corrected to make them reliable:
 *   - category rules count the `type` field, NOT a same-named tag. Low Tide and
 *     High Tide carry an ULTIMATE tag but are Utility modules.
 *   - `active` is the module's Active field, NOT the ACTIVE tag. Toggleable
 *     modules are active but tagged TOGGLE, and Aura Enhancement carries the
 *     ACTIVE tag without being activatable.
 */

export const ELEMENTS = [
  'FIRE', 'WATER', 'EARTH', 'AIR', 'NATURE', 'ELECTRICITY', 'LIGHT', 'DARKNESS',
];

/* ---------- requirement primitives ---------- */

const minType = (type, min) => ({
  kind: 'minType', type, min,
  count: s => s.type[type] || 0,
  met: s => (s.type[type] || 0) >= min,
  label: s => `${min > 1 ? `${min} ` : ''}${type}${min > 1 ? ' modules' : ''}`,
  short: s => `${s.type[type] || 0}/${min} ${type}`,
  helps: m => m.type === type,
});

const maxType = (type, max) => ({
  kind: 'maxType', type, max,
  count: s => s.type[type] || 0,
  met: s => (s.type[type] || 0) <= max,
  label: () => `at most ${max} ${type}`,
  short: s => `${s.type[type] || 0}/${max} ${type} (max)`,
  helps: () => false,          // nothing you can ADD fixes an over-cap rule
  brokenBy: m => m.type === type,
});

const minTag = (tag, min) => ({
  kind: 'minTag', tag, min,
  count: s => s.tag[tag] || 0,
  met: s => (s.tag[tag] || 0) >= min,
  label: () => `${min} #${tag}`,
  short: s => `${s.tag[tag] || 0}/${min} #${tag}`,
  helps: m => m.tags.includes(tag),
});

const rangeTag = (tag, min, max) => ({
  kind: 'rangeTag', tag, min, max,
  count: s => s.tag[tag] || 0,
  met: s => (s.tag[tag] || 0) >= min && (s.tag[tag] || 0) <= max,
  label: () => `between ${min} and ${max} #${tag}`,
  short: s => `${s.tag[tag] || 0} #${tag} (need ${min}–${max})`,
  helps: m => m.tags.includes(tag),
  brokenBy: m => m.tags.includes(tag),
});

const minActive = (min) => ({
  kind: 'minActive', min,
  count: s => s.active,
  met: s => s.active >= min,
  label: () => `${min} active modules`,
  short: s => `${s.active}/${min} active`,
  helps: m => m.active,
});

/* Every listed type must have a different count from every other. */
const pairwiseDistinct = (types) => ({
  kind: 'pairwiseDistinct', types,
  met: s => {
    const counts = types.map(t => s.type[t] || 0);
    return new Set(counts).size === counts.length;
  },
  label: () => `a different count of ${types.join(', ')}`,
  short: s => {
    const clash = [];
    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        if ((s.type[types[i]] || 0) === (s.type[types[j]] || 0)) {
          clash.push(`${types[i]} = ${types[j]} = ${s.type[types[i]] || 0}`);
        }
      }
    }
    return clash.length ? clash.join(', ') : types.map(t => `${t} ${s.type[t] || 0}`).join(', ');
  },
  helps: m => types.includes(m.type),
});

const greaterType = (a, b) => ({
  kind: 'greaterType', a, b,
  met: s => (s.type[a] || 0) > (s.type[b] || 0),
  label: () => `more ${a} than ${b}`,
  short: s => `${a} ${s.type[a] || 0} vs ${b} ${s.type[b] || 0}`,
  helps: m => m.type === a,
  brokenBy: m => m.type === b,
});

/* ---------- the contracts ---------- */

export const CONTRACTS = [
  {
    id: 'glass-cannon', name: 'Glass Cannon',
    rule: 'Have 1 or fewer Defensive modules',
    reqs: [maxType('Defensive', 1)],
  },
  {
    id: 'pacifist', name: 'Pacifist',
    rule: 'Have 1 or fewer Offensive modules',
    reqs: [maxType('Offensive', 1)],
  },
  {
    id: 'unequalizer', name: 'Unequalizer',
    rule: 'Have a different number of Offensive, Defensive and Utility modules',
    reqs: [pairwiseDistinct(['Offensive', 'Defensive', 'Utility'])],
  },
  {
    id: 'colorful', name: 'Colorful',
    rule: 'Have at least 1 Offensive, Defensive, Utility and Ultimate module',
    reqs: [minType('Offensive', 1), minType('Defensive', 1), minType('Utility', 1), minType('Ultimate', 1)],
  },
  {
    id: 'utilitarian', name: 'Utilitarian',
    rule: 'Have more Utility than Ultimate, and at least 1 Ultimate',
    reqs: [greaterType('Utility', 'Ultimate'), minType('Ultimate', 1)],
  },
  {
    id: 'activist', name: 'Activist',
    rule: 'Have at least 4 active modules',
    reqs: [minActive(4)],
  },
  {
    id: 'elementalist', name: 'Elementalist',
    rule: 'Have at least 1 module of every element',
    reqs: ELEMENTS.map(e => minTag(e, 1)),
  },
  {
    id: 'neutralist', name: 'Neutralist',
    rule: 'Have at least 3 and at most 15 #NEUTRAL modules',
    reqs: [rangeTag('NEUTRAL', 3, 15)],
  },
  {
    id: 'trickster', name: 'Trickster',
    rule: 'Have at least 1 each of #BUFF, #AURA, #REACTIVE and #CHANCE',
    reqs: [minTag('BUFF', 1), minTag('AURA', 1), minTag('REACTIVE', 1), minTag('CHANCE', 1)],
  },
  {
    id: 'annihilist', name: 'Annihilist',
    rule: 'Have at least 5 #UNIVERSAL, 3 #AREA and 5 Ultimate modules',
    reqs: [minTag('UNIVERSAL', 5), minTag('AREA', 3), minType('Ultimate', 5)],
  },
  {
    id: 'communicator', name: 'Communicator',
    rule: 'Have at least 3 #COMMUNITY modules',
    reqs: [minTag('COMMUNITY', 3)],
  },
];

export const CONTRACTS_BY_ID = new Map(CONTRACTS.map(c => [c.id, c]));

/* ---------- evaluation ---------- */

/** Tally a blueprint once; every requirement reads from this. */
export function statsOf(modules) {
  const s = { type: {}, tag: {}, active: 0, total: modules.length };
  for (const m of modules) {
    s.type[m.type] = (s.type[m.type] || 0) + 1;
    if (m.active) s.active++;
    for (const t of m.tags) s.tag[t] = (s.tag[t] || 0) + 1;
  }
  return s;
}

/**
 * Evaluate every contract against a blueprint.
 * @returns {Array<{id, name, rule, met, reqs: Array<{met, text, req}>, missing: string[]}>}
 */
export function evaluate(modules) {
  const s = statsOf(modules);
  return CONTRACTS.map(c => {
    const reqs = c.reqs.map(r => ({ req: r, met: r.met(s), text: r.short(s) }));
    const unmet = reqs.filter(r => !r.met);
    return {
      id: c.id, name: c.name, rule: c.rule,
      met: unmet.length === 0,
      reqs,
      missing: unmet.map(r => r.text),
    };
  });
}

/** Contract ids currently satisfied. */
export const metIds = modules => new Set(evaluate(modules).filter(c => c.met).map(c => c.id));

const diff = (before, after) => ({
  gain: [...after].filter(id => !before.has(id)),
  lose: [...before].filter(id => !after.has(id)),
});

/**
 * What adding `candidate` would do to your contracts.
 * Simulating the add is more trustworthy than reasoning per-requirement, and it
 * catches the cases where one module both gains and loses you something.
 *
 * `baseline` is the current met-set. The browser previews every visible module
 * against the same blueprint, so passing it in once avoids recomputing it
 * hundreds of times per render.
 *
 * @returns {{gain: string[], lose: string[]}}
 */
export function previewAdd(modules, candidate, baseline = metIds(modules)) {
  return diff(baseline, metIds([...modules, candidate]));
}

/** What removing the module at `index` would do. */
export function previewRemove(modules, index, baseline = metIds(modules)) {
  return diff(baseline, metIds(modules.filter((_, i) => i !== index)));
}

/**
 * Modules that would advance an unmet requirement — powers "click a shortfall to
 * filter the browser". Excludes anything already in the blueprint.
 */
export function candidatesFor(req, allModules, current = []) {
  const have = new Set(current.map(m => m.id));
  return allModules.filter(m => !have.has(m.id) && req.helps?.(m));
}

/*
 * Contracts that cannot all hold at once.
 *
 * Derived by search over the category requirements rather than hardcoded, so it
 * stays correct when a contract is edited. Conflicts are not always pairs — the
 * smallest real one here needs four contracts (Glass Cannon + Pacifist + Colorful
 * pin Offensive and Defensive to 1 each, which Unequalizer then forbids), so this
 * looks for MINIMAL infeasible sets rather than only checking pairs.
 *
 * Only category arithmetic is considered. Tag and active rules are treated as
 * always satisfiable, because a tag can sit on a module of any category — so a
 * reported conflict is genuine, while a pair reported as compatible may still be
 * hard to build from the real module pool.
 */

/** Category constraints of a contract as a predicate over a count vector. */
function categoryPredicate(c) {
  const relevant = c.reqs.filter(r =>
    ['minType', 'maxType', 'pairwiseDistinct', 'greaterType'].includes(r.kind));
  if (!relevant.length) return null;    // purely tag/active based — never conflicts
  return v => relevant.every(r => r.met({ type: v, tag: {}, active: 99, total: 0 }));
}

/* Every threshold in play is <= 5, and distinctness needs at most a few apart, so
 * a solution above BOUND per category never exists when one below it does not. */
const BOUND = 12;

function categoriesFeasible(preds) {
  for (let o = 0; o <= BOUND; o++)
    for (let d = 0; d <= BOUND; d++)
      for (let u = 0; u <= BOUND; u++)
        for (let t = 0; t <= BOUND; t++) {
          if (o + d + u + t > 51) continue;
          const v = { Offensive: o, Defensive: d, Utility: u, Ultimate: t };
          if (preds.every(p => p(v))) return v;
        }
  return null;
}

/**
 * @param {number} maxSize largest conflicting set to look for
 * @returns {Array<{ids: string[], names: string[]}>} minimal impossible combinations
 */
export function conflicts(maxSize = 4) {
  const usable = CONTRACTS.map(c => ({ c, p: categoryPredicate(c) })).filter(x => x.p);
  const found = [];

  const isMinimal = ids => !found.some(f => f.ids.every(id => ids.includes(id)));

  const search = (start, chosen) => {
    if (chosen.length >= 2) {
      const ids = chosen.map(x => x.c.id);
      if (isMinimal(ids) && !categoriesFeasible(chosen.map(x => x.p))) {
        found.push({ ids, names: chosen.map(x => x.c.name) });
        return;                     // supersets of this are conflicting but not minimal
      }
    }
    if (chosen.length === maxSize) return;
    for (let i = start; i < usable.length; i++) search(i + 1, [...chosen, usable[i]]);
  };
  search(0, []);
  return found;
}
