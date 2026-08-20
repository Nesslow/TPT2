/*
 * TPT2 blueprint export format.
 *
 *   base64( raw-deflate( JSON ) )
 *   JSON = { "blueprints": [ "<name>;<id>;<id>;…", … ] }
 *
 * Raw deflate means no zlib/gzip header (windowBits -15). One string can carry
 * many blueprints, so import/export moves your whole collection at once.
 *
 * The v2 app assumed plain base64 of "name;id;id" with no compression and no
 * JSON wrapper, which is why import/export no longer worked against the game.
 */

const HAS_CS = typeof CompressionStream !== 'undefined';

/* ---------- base64 <-> bytes ---------- */
function bytesFromBase64(b64) {
  const bin = atob(b64.trim().replace(/\s+/g, ''));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function base64FromBytes(bytes) {
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

/* ---------- deflate ---------- */
async function pipe(bytes, stream) {
  const buf = await new Response(
    new Blob([bytes]).stream().pipeThrough(stream)
  ).arrayBuffer();
  return new Uint8Array(buf);
}

const inflateRaw = bytes => pipe(bytes, new DecompressionStream('deflate-raw'));
const deflateRaw = bytes => pipe(bytes, new CompressionStream('deflate-raw'));

/* ---------- public API ---------- */

export class BlueprintFormatError extends Error {}

function assertSupported() {
  if (!HAS_CS) {
    throw new BlueprintFormatError(
      'This browser cannot read blueprint codes (no CompressionStream support). ' +
      'Use a current Chrome, Edge, Firefox or Safari.'
    );
  }
}

/**
 * Decode an export string into blueprints.
 * @returns {Promise<Array<{name: string, ids: string[]}>>}
 */
export async function decodeExport(text) {
  assertSupported();
  if (!text || !text.trim()) throw new BlueprintFormatError('Nothing to import.');

  let json;
  try {
    const inflated = await inflateRaw(bytesFromBase64(text));
    json = JSON.parse(new TextDecoder().decode(inflated));
  } catch (e) {
    throw new BlueprintFormatError(
      "That does not look like a blueprint code. Copy the whole string from the game's export box."
    );
  }

  if (!json || !Array.isArray(json.blueprints)) {
    throw new BlueprintFormatError('Blueprint code is missing its "blueprints" list.');
  }

  return json.blueprints.map((entry, i) => {
    const parts = String(entry).split(';');
    const name = parts.shift() || `Blueprint ${i + 1}`;
    return { name, ids: parts.filter(Boolean) };
  });
}

/**
 * Encode blueprints back into an export string the game accepts.
 * @param {Array<{name: string, ids: string[]}>} blueprints
 */
export async function encodeExport(blueprints) {
  assertSupported();
  if (!blueprints.length) throw new BlueprintFormatError('No blueprints to export.');

  for (const bp of blueprints) {
    if (bp.name.includes(';')) {
      throw new BlueprintFormatError(`Blueprint name "${bp.name}" cannot contain a semicolon.`);
    }
  }

  const payload = {
    blueprints: blueprints.map(bp => [bp.name, ...bp.ids].join(';')),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return base64FromBytes(await deflateRaw(bytes));
}

/**
 * Resolve decoded ids against the module table.
 * Unknown ids are reported, never silently dropped (the v2 app dropped them).
 */
export function resolveBlueprint(bp, modulesById) {
  const modules = [], unknown = [], duplicates = [];
  const seen = new Set();

  for (const id of bp.ids) {
    if (seen.has(id)) { duplicates.push(id); continue; }
    seen.add(id);
    const m = modulesById.get(id);
    if (m) modules.push(m); else unknown.push(id);
  }
  return { name: bp.name, modules, unknown, duplicates };
}
