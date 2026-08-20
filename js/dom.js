/* Tiny DOM helpers. Everything is built from real nodes, never innerHTML with
 * user or module text, so descriptions containing < or & cannot break the page. */

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k in node && k !== 'list') node[k] = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  add(node, children);
  return node;
}

function add(parent, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    parent.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export const frag = (...children) => {
  const f = document.createDocumentFragment();
  add(f, children);
  return f;
};

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export function mount(node, ...children) {
  clear(node);
  add(node, children);
  return node;
}

export const $ = sel => document.querySelector(sel);

/** Copy text, reporting success so the caller can show feedback. */
export async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
