var IMPORT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var IMPORT_BASE = 31;
var IMPORT_REGION_IDS = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10","R11","R12","R13","R14","R15"];

function decodePayload(text) {
  var s = String(text || "").replace(/\s+/g, "");
  if (!s) throw new Error("Nothing pasted.");

  var values = [], acc = 0, started = false;
  for (var i = 0; i < s.length; i++) {
    var d = IMPORT_ALPHABET.indexOf(s.charAt(i));
    if (d < 0) throw new Error('Unexpected character "' + s.charAt(i) + '" at position ' + (i + 1) + ".");
    if (d < IMPORT_BASE) { acc = acc * IMPORT_BASE + d; started = true; }
    else { values.push(acc * IMPORT_BASE + (d - IMPORT_BASE)); acc = 0; started = false; }
  }
  if (started) throw new Error("Payload ends mid-number - the last chunk looks incomplete.");
  return values;
}

function parseImport(text, expectedChars) {
  var s = String(text || "").replace(/\s+/g, "");
  if (expectedChars !== undefined && expectedChars !== null && expectedChars !== "") {
    var want = Number(expectedChars);
    if (isFinite(want) && s.length !== want) {
      throw new Error("Expected " + want + " characters but got " + s.length +
        " - a chunk is missing, duplicated, or out of order.");
    }
  }

  var values = decodePayload(s);
  var need = IMPORT_REGION_IDS.length * DIFFS.length;
  if (values.length !== need) {
    throw new Error("Expected " + need + " values but decoded " + values.length + ".");
  }

  var out = {}, k = 0;
  IMPORT_REGION_IDS.forEach(function (rid) {
    var infs = {};
    DIFFS.forEach(function (d) {
      var v = values[k++];
      if (v > MAX_INFS) throw new Error("Value " + v + " exceeds the game's cap for " + rid + " " + d + ".");
      infs[d] = v;
    });
    out[rid] = infs;
  });
  return out;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { decodePayload: decodePayload, parseImport: parseImport, IMPORT_ALPHABET: IMPORT_ALPHABET };
}
