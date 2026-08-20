var INGAME_SCRIPT = "zVnbcts2EP0Vhg95qaSKVOKkniip46S52XEbO73K0wGBJYmIXMgAKFkNMn3t5/Qf8mMdkvJUocgUpKRpXjgUCC0Ods9Z7oLvXUUln2nlHv723iVUc4H5vTuRiaAkGXDUAwV6ElCBShPUk2w4HN4prh5Whv3iOty8uj23uIEIECSng0howcPav9+tN+J5VKQzIrkSOFBacoyKh+FCyCnIAZIUBhHodeCRLfBy2B+Pa8cL+Hb+KDZJJNdxCprTfPoWgLyvaj3kbefgpijBmoO3xP2guvDHvxoxe8NynTKmjc715cb4n6GQoLRhoEBqs+CoQZoMGchIigyZmYuEEhQm5lGcigw14WjeZRglYFLQJEk4lRlHZQIgNDaCAkGDkGlJEsOInEogSWpiIHNAkyGfg1RgaEyEMi03wDbG+0DU0qTAeJaamEhmOCqCYJBHsU6JBMPTmVCKBwm0XY4E1fGHQ88f3bl7cO/+NySgDMIo5u+mSYpidiWVzuaL6+UfR4+Pnzz97tnzFy9fnZy+Pvv+hzfnF29//OnnX35tt/5IZPUPbNXky1mb9GKjT7lrg1elcFau4Mjg+iyscVKTfmpIXRo2Nurz5axlTCREE62y4N/82QKoHaLOKfCqfrjfwhOWrNoxwlZJ2gYi2znx2RdH/M1k2Ib4rEp8JrIggWa882Kyn78HFBUSBhxDjlwvW2DeQj3MTj3sf1IPs1bP7hHuWj1ebdHjhfUGW+ROQNr8PmtpJ785oAIp0R0ZRYLaQBQrMJ8Xpry1h6VAaiTTGK95PfxUVJPJqCmZrF8ffdsUfhvu1BeyNSRpI2dAuhWnPtPo2KelcDUlTISQe4ua93W3mLVoKzybvm1X+/EfVjs1qw19/PtRhyJ2Xawt6LX66x7YyDrn4Kp099hmek1R6NJmNuDeaDPLWHV/d8jOnq22Fvts4IMderYBd71nG16iNp49mciVAhLASMctlWS7DN91obtoe8T1yXmUsjyPWnSrAoocY2O/qAeG9/I5Kd84tXOa+NRBBydb1KEetw9zV3xVgjTptMYn9pTpCq5Ktj0lkVsN8Q7X8kcgRNI5qTQ4+cEWDPJv3+4Mp8GtdnDwpmLwokQEny8ZtKK/w/VMyI2i4T/v69Y+oDGRalxKnfuqo/u0U6aktpZWPNYgkcjl+pn7l8EJjzkXb96+Pj66ePqkj0I7gCKL4pvdNqG3/pBgmfjr6Toeb5HSbVdum9S7y2/knL2qPhg5py/OT48ujp/3c585IYeEOSTRIIE5OgZHw7XuOUw4eXS0zJR2L3suFcj4zYemy57L01mWKCg+O01hOZjmk3KL7qFbqsntuTNCpyTKh861QDgWqEQCbs8NMhaBdg/7Xs/NFDxe/dQygw+XH/4B";

var IMPORT_PENDING = null;

function renderData() {
  var html = '<div class="page-head"><h1>Import / export</h1><div class="sub">Pull your inf counts ' +
    "straight out of the game, or back everything up to a file</div></div>";

  html += '<div class="panel"><div class="panel-head"><h2>1 &middot; In-game script</h2>' +
    '<span class="meta">paste into TPT2</span></div><div class="panel-body">' +
    '<p class="hint-block">Copy this and import it as a script in game, then press ' +
    "<b>K</b> to run it. It writes your infinity counts into your workers' names. <b>It will overwrite workers names</b></p>" +
    '<textarea class="paste-box" rows="3" readonly spellcheck="false" onfocus="this.select()" ' +
    'aria-label="Compiled in-game script">' + INGAME_SCRIPT + '</textarea>' +
    '<div class="import-row"><button class="max-btn" onclick="copyScript()">COPY SCRIPT</button>' +
    '<span class="tag-dim">37 lines &middot; runs on K</span></div></div></div>';

  html += '<div class="panel"><div class="panel-head"><h2>2 &middot; Import from game</h2>' +
    '<span class="meta">base31 payload</span></div><div class="panel-body">' +
    '<p class="hint-block">Run <b>StoneConsole:export</b> in game, then copy each worker\'s name ' +
    "in order and paste them here end to end (no spaces).</p>" +
    '<textarea id="import-text" class="paste-box" rows="4" spellcheck="false" ' +
    'placeholder="Paste the worker-name chunks here, in order"></textarea>' +
    '<div class="import-row">' +
    '<label class="import-label">chars=<input id="import-chars" class="lvl-input" style="width:76px" ' +
    'placeholder="284" aria-label="Expected character count"></label>' +
    '<button class="max-btn" onclick="previewImport()">PREVIEW</button></div>' +
    '<div id="import-result"></div></div></div>';

  html += '<div class="panel"><div class="panel-head"><h2>3 &middot; Backup &amp; restore</h2>' +
    '<span class="meta">' + Object.keys(REGIONS).length + " regions &middot; " +
    Object.keys(STONES).length + " stones</span></div><div class=\"panel-body\">" +
    '<p class="hint-block">Everything the calculator stores: region infs, test regions and upgrade levels.<p> ' +
    '<div class="import-row"><button class="max-btn" onclick="downloadBackup()">DOWNLOAD .JSON</button>' +
    '<button class="max-btn" onclick="copyBackup()">COPY</button>' +
    '<span class="tag-dim">' + buildBackup().length.toLocaleString() + " characters</span></div>" +
    '<textarea id="backup-text" class="paste-box" rows="3" spellcheck="false" ' +
    'placeholder="...or paste a backup here to restore it"></textarea>' +
    '<div class="import-row"><button class="max-btn" onclick="restoreBackup()">RESTORE FROM PASTE</button></div>' +
    '<div id="backup-result"></div></div></div>';

  document.getElementById("view-container").innerHTML = html;
}

function copyScript() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(INGAME_SCRIPT).then(
      function () { toast("Script copied — import it in game, then press K."); },
      function () { selectScriptBox(); }
    );
  } else {
    selectScriptBox();
  }
}

function selectScriptBox() {
  var ta = document.querySelector("#view-container .paste-box[readonly]");
  if (ta) { ta.focus(); ta.select(); }
  toast("Couldn't copy automatically — the script is selected, hit Ctrl+C.");
}

/* ---------- import from game ---------- */

function importError(message) {
  return '<div class="onetick bad" style="padding:12px 0"><div class="icon">&times;</div><div class="body">' +
    '<div class="headline">Can\'t read that</div><div class="sub">' + message + "</div></div></div>";
}

function previewImport() {
  var box = document.getElementById("import-result");
  var parsed;
  try {
    parsed = parseImport(document.getElementById("import-text").value,
                         document.getElementById("import-chars").value);
  } catch (e) {
    IMPORT_PENDING = null;
    box.innerHTML = importError(e.message);
    return;
  }

  IMPORT_PENDING = parsed;

  var changed = 0, rows = "";
  Object.keys(parsed).forEach(function (rid) {
    if (!REGIONS[rid]) return;
    var cells = "";
    DIFFS.forEach(function (d) {
      var cur = REGIONS[rid].infs[d] || 0, next = parsed[rid][d];
      if (cur === next) {
        cells += '<td class="num dim">' + next.toLocaleString() + "</td>";
      } else {
        changed++;
        cells += '<td class="num"><span class="dim">' + cur.toLocaleString() + "</span> &rarr; <b>" +
          next.toLocaleString() + "</b></td>";
      }
    });
    rows += '<tr><td class="region-name-cell name"><span class="rname">' + REGIONS[rid].name +
      '</span><span class="rid">' + rid + "</span></td>" + cells + "</tr>";
  });

  box.innerHTML = '<div class="import-summary">' +
    (changed
      ? "<b>" + changed + "</b> of " + (IMPORT_REGION_IDS.length * DIFFS.length) + " values will change."
      : "Nothing would change &mdash; this matches what you already have.") +
    '</div><div style="overflow-x:auto"><table><thead><tr><th>Region</th>' +
    DIFFS.map(function (d) { return '<th class="num">' + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"; }).join("") +
    "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
    '<div class="import-row"><button class="max-btn" onclick="applyImport()">APPLY</button>' +
    '<button class="max-btn" onclick="cancelImport()">CANCEL</button></div>';
}

function applyImport() {
  if (!IMPORT_PENDING) return;
  Object.keys(IMPORT_PENDING).forEach(function (rid) {
    if (REGIONS[rid]) REGIONS[rid].infs = mergeInfs(IMPORT_PENDING[rid]);
  });
  IMPORT_PENDING = null;
  saveRegions();
  toast("Imported — region infs updated.");
  showView("regions");
}

function cancelImport() {
  IMPORT_PENDING = null;
  document.getElementById("import-result").innerHTML = "";
}

/* ---------- JSON backup ---------- */

function buildBackup() {
  var regions = {}, testRegions = {}, stones = {};
  for (var rid in REGIONS) regions[rid] = REGIONS[rid].infs;
  for (var trid in TEST_REGIONS) testRegions[trid] = TEST_REGIONS[trid].infs;
  for (var sid in STONES) stones[sid] = STONES[sid].upgrades;
  return JSON.stringify({
    format: "stoneConsole.backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    perk: PERK,
    regions: regions,
    testRegions: testRegions,
    stones: stones
  }, null, 1);
}

function downloadBackup() {
  var name = "stone-console-" + new Date().toISOString().slice(0, 10) + ".json";
  var url = URL.createObjectURL(new Blob([buildBackup()], { type: "application/json" }));
  var a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  toast("Saved " + name);
}

function copyBackup() {
  var text = buildBackup();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      function () { toast("Backup copied to clipboard."); },
      function () { fallbackCopy(text); }
    );
  } else {
    fallbackCopy(text);
  }
}

/* Deprecated, but the only thing that works without clipboard permission. */
function fallbackCopy(text) {
  var ta = document.getElementById("backup-text");
  ta.value = text;
  ta.select();
  try {
    document.execCommand("copy");
    toast("Backup copied to clipboard.");
  } catch (e) {
    toast("Couldn't copy automatically — it's in the box below, selected and ready for Ctrl+C.");
  }
}

function restoreBackup() {
  var box = document.getElementById("backup-result");
  var data;
  try {
    data = JSON.parse(document.getElementById("backup-text").value);
  } catch (e) {
    box.innerHTML = importError("That isn't valid JSON.");
    return;
  }
  if (!data || data.format !== "stoneConsole.backup") {
    box.innerHTML = importError("That JSON isn't a Stone Console backup.");
    return;
  }

  var rid, trid, sid;
  if (data.regions) for (rid in REGIONS) if (data.regions[rid]) REGIONS[rid].infs = mergeInfs(data.regions[rid]);
  if (data.testRegions) for (trid in TEST_REGIONS) if (data.testRegions[trid]) TEST_REGIONS[trid].infs = mergeInfs(data.testRegions[trid]);
  if (data.stones) for (sid in STONES) if (data.stones[sid]) STONES[sid].upgrades = mergeUpgrades(data.stones[sid]);
  if (typeof data.perk === "boolean") {
    PERK = data.perk;
    applyPerkToAllStones();
    savePerk();
    updatePerkSwitch();
  }

  saveRegions();
  saveTestRegions();
  saveStones();
  toast("Backup restored.");
  showView("overview");
}