/*
 * The game names blueprints with TextMeshPro rich text — an export can arrive
 * named "Everything  <sprite=157>", where the tag renders as an icon in game but
 * would show as literal angle brackets here.
 *
 * We strip tags for DISPLAY only and never touch the stored name, so exporting
 * back to the game returns the icon intact. The name input deliberately shows the
 * raw value: that is where you would edit it, and hiding the tag there would let
 * an innocent edit silently delete it.
 */

/* TMP tags: <sprite=157>, <color=#ff0000>, </color>, <b>, <size=120%>, <br> … */
const TAG_SOURCE = '<\\/?[a-zA-Z][^<>]*>';

/** Strip rich-text tags for display. Returns a fallback if nothing survives. */
export function displayName(name, fallback = 'Untitled') {
  const clean = String(name ?? '')
    .replace(new RegExp(TAG_SOURCE, 'g'), ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean || fallback;
}

/** True when the name carries markup, so the UI can explain the difference. */
export const hasRichText = name => new RegExp(TAG_SOURCE).test(String(name ?? ''));
