var PERK = true;
var CURRENT_VIEW = "overview";

/* DETAILED_REGIONS is persisted; REGIONS_FILTER is not. */
var DETAILED_REGIONS = true;
var REGIONS_FILTER = null;

var UPGRADE_LABELS = {
  u1_chargeRequired: "Charge required",
  u2_speedPerTick: "Speed Bonus / Tick",
  u3_amountPerTick: "Production Bonus / Tick",
  u4_extractionTick: "Charge Duration",
  u5_speedTick: "Speed Tick Duration",
  u6_amountTick: "Production Tick Duration",
  u7_extractionPerInf: "% Extraction / base infPower"
};

var ROLE_ABBR = { extraction: "Ext", speed: "Spd", amount: "Amt" };
var ROLE_LABEL = { extraction: "Extraction", speed: "Speed", amount: "Amount" };
var DIFFS = ["easy", "medium", "hard", "insane", "nightmare", "impossible"];

/* Per-difficulty cap. */
var MAX_INFS = 99999999999;

/* Private to the Testing stone. */
var TEST_REGIONS = {
  T1: { name: "Test Extraction", infs: { easy: 0, medium: 0, hard: 0, insane: 0, nightmare: 0, impossible: 0 } },
  T2: { name: "Test Speed",      infs: { easy: 0, medium: 0, hard: 0, insane: 0, nightmare: 0, impossible: 0 } },
  T3: { name: "Test Amount",     infs: { easy: 0, medium: 0, hard: 0, insane: 0, nightmare: 0, impossible: 0 } }
};

function allRegions() {
  return Object.assign({}, REGIONS, TEST_REGIONS);
}

function realStones() {
  var out = {};
  for (var id in STONES) if (STONES.hasOwnProperty(id) && !STONES[id].isTestStone) out[id] = STONES[id];
  return out;
}

/* ===========================================================================
 * PERSISTENCE
 * ======================================================================== */

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (e) {
    console.warn("Stone Console: ignoring unreadable " + key, e);
    return null;
  }
}

function readFlag(key, fallback) {
  try {
    var v = localStorage.getItem(key);
    return v === null ? fallback : v === "true";
  } catch (e) {
    return fallback;
  }
}

function mergeInfs(saved) {
  var out = {};
  DIFFS.forEach(function (d) {
    var n = saved ? parseCount(saved[d], MAX_INFS) : null;
    out[d] = n === null ? 0 : n;
  });
  return out;
}

function mergeUpgrades(saved) {
  var out = {};
  Object.keys(StoneCalc.UPGRADES).forEach(function (key) {
    var n = saved ? parseCount(saved[key], StoneCalc.UPGRADES[key].cap) : null;
    out[key] = n === null ? 0 : n;
  });
  return out;
}

function loadPersisted() {
  var savedRegions = readJSON("stoneConsole.regions");
  if (savedRegions) {
    for (var rid in REGIONS) {
      if (savedRegions[rid] && savedRegions[rid].infs) REGIONS[rid].infs = mergeInfs(savedRegions[rid].infs);
    }
  }

  var savedStones = readJSON("stoneConsole.stones");
  if (savedStones) {
    for (var sid in STONES) {
      if (savedStones[sid] && savedStones[sid].upgrades) STONES[sid].upgrades = mergeUpgrades(savedStones[sid].upgrades);
    }
  }

  var savedTestRegions = readJSON("stoneConsole.testRegions");
  if (savedTestRegions) {
    for (var trid in TEST_REGIONS) {
      if (savedTestRegions[trid] && savedTestRegions[trid].infs) TEST_REGIONS[trid].infs = mergeInfs(savedTestRegions[trid].infs);
    }
  }

  PERK = readFlag("stoneConsole.perk", PERK);
  DETAILED_REGIONS = readFlag("stoneConsole.detailedRegions", DETAILED_REGIONS);
}

function persist(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn("Stone Console: couldn't save " + key, e);
    toast("Couldn't save — browser storage is full or blocked. Your edits are live but won't survive a refresh.");
    return false;
  }
}

function saveRegions() {
  var out = {};
  for (var rid in REGIONS) out[rid] = { infs: REGIONS[rid].infs };
  persist("stoneConsole.regions", JSON.stringify(out));
}

function saveStones() {
  var out = {};
  for (var sid in STONES) out[sid] = { upgrades: STONES[sid].upgrades };
  persist("stoneConsole.stones", JSON.stringify(out));
}

function saveTestRegions() {
  var out = {};
  for (var trid in TEST_REGIONS) out[trid] = { infs: TEST_REGIONS[trid].infs };
  persist("stoneConsole.testRegions", JSON.stringify(out));
}

function savePerk() {
  persist("stoneConsole.perk", String(PERK));
}

function saveDetailedRegions() {
  persist("stoneConsole.detailedRegions", String(DETAILED_REGIONS));
}

function applyPerkToAllStones() {
  for (var sid in STONES) STONES[sid].doublePerk = PERK;
}

/* ===========================================================================
 * NUMBER INPUT
 * ======================================================================== */

var LOCALE_SEPARATORS = (function () {
  var group = ",", decimal = ".";
  try {
    new Intl.NumberFormat().formatToParts(1234567.8).forEach(function (part) {
      if (part.type === "group") group = part.value;
      if (part.type === "decimal") decimal = part.value;
    });
  } catch (e) { /* pre-Intl fallback: en-US conventions */ }
  return { group: group, decimal: decimal };
})();

function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripGroupSeparator(s, sep) {
  if (!sep) return s;
  return s.replace(new RegExp(escapeForRegex(sep) + "(?=\\d{3}(?!\\d))", "g"), "");
}

function parseNumberInput(raw) {
  if (typeof raw === "number") return isFinite(raw) ? raw : null;

  var s = String(raw === null || raw === undefined ? "" : raw).trim();
  if (!s) return null;

  s = stripGroupSeparator(s, LOCALE_SEPARATORS.group);
  s = s.replace(/[\s  ]/g, "");
  if (LOCALE_SEPARATORS.decimal !== ".") {
    s = s.split(LOCALE_SEPARATORS.decimal).join(".");
  }

  var n = Number(s);
  return isFinite(n) ? n : null;   // rejects NaN and Infinity alike
}

function parseCount(raw, max) {
  var n = parseNumberInput(raw);
  return n === null ? null : Math.max(0, Math.min(max, Math.floor(n)));
}

function rejectEdit(rawValue, keptValue) {
  toast('"' + String(rawValue).trim() + '" isn\'t a number — kept ' +
    (typeof keptValue === "number" ? keptValue.toLocaleString() : keptValue) + ".");
}

var TOAST_TIMER = null;

function toast(message) {
  var el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(TOAST_TIMER);
  TOAST_TIMER = setTimeout(function () { el.classList.remove("show"); }, 4000);
}

/* ===========================================================================
 * FORMATTING
 * ======================================================================== */

function fmtTimeUI(sec) {
  if (!isFinite(sec)) return "∞";
  if (sec < 1) return sec.toFixed(6) + "s";
  if (sec < 60) return sec.toFixed(3) + "s";
  var h = Math.floor(sec / 3600);
  var m = Math.floor((sec % 3600) / 60);
  var s = sec % 60;
  return (h ? h + "h " : "") + (h || m ? m + "m " : "") + s.toFixed(1) + "s";
}

function fmtRate(n) {
  if (!isFinite(n)) return "∞";
  if (n >= 100) return n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return n.toFixed(4);
}

function fmtGems(n) {
  return Math.round(n).toLocaleString();
}

function inputValue(n) {
  return (typeof n === "number" && isFinite(n)) ? n : 0;
}

function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}


/* Per-upgrade "Effect" column text. */
function upgradeEffectText(key, stats) {
  switch (key) {
    case "u1_chargeRequired":   return fmtGems(stats.chargeRequired) + " charge";
    case "u2_speedPerTick":     return "+" + (stats.speedBonusPerTick * 100).toFixed(2) + "%";
    case "u3_amountPerTick":    return "+" + (stats.amountBonusPerTick * 100).toFixed(2) + "%";
    case "u4_extractionTick":   return Math.round(stats.baseDurations.extBaseDur) + "s base";
    case "u5_speedTick":        return Math.round(stats.baseDurations.spdBaseDur) + "s base";
    case "u6_amountTick":       return Math.round(stats.baseDurations.amtBaseDur) + "s base";
    case "u7_extractionPerInf": return "+" + (stats.u7Bonus * 100).toFixed(1) + "%";
  }
}

/* ===========================================================================
 * NAV
 * ======================================================================== */

function buildRail() {
  var html = "", testHtml = "";
  for (var id in STONES) {
    if (!STONES.hasOwnProperty(id)) continue;
    var link = '<button class="rail-link" data-view="' + id + '" onclick="showView(\'' + id + '\')">' +
      '<span class="dot' + (STONES[id].isTestStone ? " dot-test" : "") + '" style="background:' +
      STONES[id].color + '"></span>' + STONES[id].name + "</button>";
    if (STONES[id].isTestStone) testHtml += link; else html += link;
  }
  document.getElementById("rail-stones").innerHTML = html;
  document.getElementById("rail-test").innerHTML = testHtml;
}

function showView(name) {
  CURRENT_VIEW = name;
  document.querySelectorAll(".rail-link").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("data-view") === name);
  });

  if (name === "overview") { document.getElementById("crumb").innerHTML = "Overview"; renderOverview(); }
  else if (name === "regions") { document.getElementById("crumb").innerHTML = "Regions"; renderRegions(); }
  else if (name === "data") { document.getElementById("crumb").innerHTML = "Import / export"; renderData(); }
  else if (name === "guide") { document.getElementById("crumb").innerHTML = "Guide"; renderGuide(); }
  else if (STONES[name]) { document.getElementById("crumb").innerHTML = "Stones / <b>" + STONES[name].name + "</b>"; renderStone(name); }

  window.scrollTo(0, 0);
}

function togglePerk() {
  PERK = !PERK;
  applyPerkToAllStones();
  savePerk();
  updatePerkSwitch();
  showView(CURRENT_VIEW);
}

function updatePerkSwitch() {
  document.getElementById("perk-switch").classList.toggle("on", PERK);
}

/* Charges/sec. */
var BATCH = { crossTerm: 0.122 / 10000, speedLin: 0.06 / 100, amountLin: 1.525 / 100, exponent: 0.3 };

function batchEffectiveInf(bonusPerTick, tickDuration, maxBonusPerTick) {
  if (!isFinite(tickDuration) || tickDuration <= 0) return 0;
  return (bonusPerTick / maxBonusPerTick) * (100 / tickDuration);
}

/* FPS selector. */
var BATCH_REFERENCE_FPS = 240;

function batchChargesPerSecond(cfg) {
  var stats = StoneCalc.deriveStats(cfg);
  var result = StoneCalc.simulateCharge(cfg);
  if (result.extractionTicks !== 1) return result.chargesPerSecond;

  var leading = (1 / stats.extractionTickDuration) * (1 + stats.u7Bonus) / stats.chargeRequired;
  var effSpd = batchEffectiveInf(stats.speedBonusPerTick, stats.speedTickDuration, 0.11);
  var effAmt = batchEffectiveInf(stats.amountBonusPerTick, stats.amountTickDuration, 3.05);

  var frameSeconds = 1 / BATCH_REFERENCE_FPS;
  var bracket = BATCH.crossTerm * effSpd * effAmt * frameSeconds * frameSeconds +
    (BATCH.speedLin * effSpd + BATCH.amountLin * effAmt) * frameSeconds + 1;
  var energyPerFrame = leading * bracket * frameSeconds;

  var rate = Math.pow(energyPerFrame, BATCH.exponent) / frameSeconds;
  // Safety net only.
  return Math.min(rate, result.chargesPerSecond * 100);
}

function batchTimeSeconds(cfg) {
  var r = batchChargesPerSecond(cfg);
  return r > 0 ? 1 / r : Infinity;
}

function chargesPerSecTooltip() {
  return '<span class="info-tip"><span class="q">?</span><span class="bubble">Below 1-tick this is exact. Once a ' +
    "stone is 1-tick, this is an <b>estimate</b> - FPS has a drastic effect on real throughput, and at high " +
    "speeds the actual number can land above or below what's shown. I am refining this with more testing. " +
    "Either way, a change that moves this number up or down has the same effect in game, just by a slightly " +
    "different amount.</span></span>";
}

/* ===========================================================================
 * OVERVIEW
 * ======================================================================== */

function renderOverview() {
  var rows = StoneCalc.simulateAllStones(realStones(), allRegions());

  var html = '<div class="page-head"><h1>Overview</h1><div class="sub">All ' + rows.length +
    " stones, sorted by time per charge</div></div>";
  html += '<div class="panel"><div class="panel-body flush"><table><thead><tr>' +
    '<th class="num" style="width:32px">#</th><th>Stone</th><th class="num">Time / charge</th>' +
    '<th class="num">Charges / sec' + chargesPerSecTooltip() + "</th>" +
    '<th class="num">Charges / hr</th></tr></thead><tbody>';

  rows.forEach(function (r, i) {
    var stone = STONES[r.id];
    var cps = batchChargesPerSecond(r.cfg);
    html += '<tr class="stone-row linked" onclick="showView(\'' + r.id + '\')">' +
      '<td class="num dim">' + (i + 1) + "</td>" +
      '<td class="name"><span class="dot" style="background:' + stone.color + '"></span>' + stone.name + "</td>" +
      '<td class="num">' + fmtTimeUI(r.timeSeconds) + "</td>" +
      '<td class="num">' + fmtRate(cps) + "</td>" +
      '<td class="num">' + fmtRate(cps * 3600) + "</td></tr>";
  });

  html += "</tbody></table></div></div>";
  document.getElementById("view-container").innerHTML = html;
}

/* ===========================================================================
 * REGIONS
 * ======================================================================== */

function regionFeeds(regionId) {
  var feeds = [];
  for (var sid in STONES) {
    var sd = STONES[sid];
    for (var role in sd.regions) {
      if (sd.regions[role] === regionId) feeds.push({ stoneId: sid, stoneName: sd.name, color: sd.color, role: role });
    }
  }
  return feeds;
}

function openRegions() {
  REGIONS_FILTER = null;
  showView("regions");
}

function filterRegionsByStone(stoneId) {
  REGIONS_FILTER = REGIONS_FILTER === stoneId ? null : stoneId;
  renderRegions();
}

function clearRegionsFilter() {
  REGIONS_FILTER = null;
  renderRegions();
}

function toggleDetailed() {
  DETAILED_REGIONS = !DETAILED_REGIONS;
  saveDetailedRegions();
  renderRegions();
}

function updateRegionInf(regionId, diff, rawValue) {
  var n = parseCount(rawValue, MAX_INFS);
  if (n === null) { rejectEdit(rawValue, REGIONS[regionId].infs[diff]); renderRegions(); return; }
  REGIONS[regionId].infs[diff] = n;
  saveRegions();
  renderRegions();
}

function inverseDifficultyInfPower(targetFactor, diffIndex) {
  if (targetFactor <= 1) return 0;
  var hi = 1e6;
  while (StoneCalc.difficultyInfPower(hi, diffIndex) < targetFactor && hi < 1e300) hi *= 100;
  var lo = 0;
  for (var i = 0; i < 200; i++) {
    var mid = (lo + hi) / 2;
    var p = StoneCalc.difficultyInfPower(mid, diffIndex);
    if (p < targetFactor) lo = mid; else hi = mid;
  }
  return Math.min(MAX_INFS, Math.round(lo));
}

/* Simple-mode edit. */
var SIMPLE_SPLIT_ORDER = ["impossible", "nightmare", "insane", "hard", "medium", "easy"];

function updateRegionInfPowerSimple(regionId, rawValue) {
  var parsed = parseNumberInput(rawValue);
  if (parsed === null) {
    rejectEdit(rawValue, fmtRate(StoneCalc.regionInfPower(REGIONS[regionId].infs, PERK).effective));
    renderRegions();
    return;
  }
  var targetEffective = Math.max(0, parsed);
  var targetBase = Math.max(1, PERK ? targetEffective / 2 : targetEffective);

  var infs = { easy: 0, medium: 0, hard: 0, insane: 0, nightmare: 0, impossible: 0 };
  var remaining = targetBase;

  SIMPLE_SPLIT_ORDER.forEach(function (d, i) {
    var slotsLeft = SIMPLE_SPLIT_ORDER.length - i;
    var fairShare = Math.pow(remaining, 1 / slotsLeft);
    var lvl = inverseDifficultyInfPower(fairShare, StoneCalc.DIFF_INDEX[d]);
    infs[d] = lvl;
    var achieved = StoneCalc.difficultyInfPower(lvl, StoneCalc.DIFF_INDEX[d]);
    remaining = Math.max(1, remaining / achieved);
  });

  REGIONS[regionId].infs = infs;
  saveRegions();
  renderRegions();
}

function renderRegions() {
  var visibleIds = Object.keys(REGIONS).filter(function (rid) {
    return !REGIONS_FILTER || regionFeeds(rid).some(function (f) { return f.stoneId === REGIONS_FILTER; });
  });

  var html = '<div class="page-head-row"><div class="page-head"><h1>Regions</h1><div class="sub">' +
    visibleIds.length + " of " + Object.keys(REGIONS).length + " regions - every stone " +
    "that references a region picks it up automatically</div></div>";
  html += '<button class="perk-toggle" onclick="toggleDetailed()">Detailed<div class="switch' +
    (DETAILED_REGIONS ? " on" : "") + '"></div></button></div>';

  if (!DETAILED_REGIONS) {
    html += '<div class="mode-hint" style="text-align:left;margin:-10px 0 14px;">Editing infPower directly ' +
      "replaces that region's per-difficulty numbers with an even split across all six.<br>Turn Detailed back on at " +
      "any time to enter a specific per-difficulty spread again.</div>";
  }

  html += '<div class="panel">';

  if (REGIONS_FILTER && STONES[REGIONS_FILTER]) {
    html += '<div class="filter-banner">Showing regions that feed <b>' + STONES[REGIONS_FILTER].name +
      '</b><button class="clear-filter" onclick="clearRegionsFilter()">Clear &times;</button></div>';
  }

  html += '<div class="panel-body flush" style="overflow-x:auto"><table><thead><tr><th>Region</th>';
  html += DETAILED_REGIONS
    ? "<th class=\"num\">Easy</th><th class=\"num\">Medium</th><th class=\"num\">Hard</th>" +
      '<th class="num">Insane</th><th class="num">Nightmare</th><th class="num">Impossible</th><th class="num">infPower</th>'
    : '<th class="num">infPower</th>';
  html += "<th>Feeds</th></tr></thead><tbody>";

  visibleIds.forEach(function (rid) {
    var region = REGIONS[rid];
    var power = StoneCalc.regionInfPower(region.infs, PERK);
    var feeds = regionFeeds(rid);

    html += '<tr><td class="region-name-cell name"><span class="rname">' + region.name +
      '</span><span class="rid">' + rid + "</span></td>";

    if (DETAILED_REGIONS) {
      DIFFS.forEach(function (d) {
        html += '<td class="num"><input class="diff-input" value="' + inputValue(region.infs[d]) +
          '" onfocus="this.select()" onchange="updateRegionInf(\'' + rid + "','" + d + "', this.value)\"></td>";
      });
      html += '<td class="num" style="color:var(--accent)">' + fmtRate(power.effective) + "</td>";
    } else {
      html += '<td class="num"><input class="infpower-input" value="' + power.effective.toFixed(4) +
        '" onfocus="this.select()" onchange="updateRegionInfPowerSimple(\'' + rid + "', this.value)\" style=\"color:var(--accent)\"></td>";
    }

    html += "<td><div class=\"feeds\">" + feeds.map(function (f) {
      var isActive = f.stoneId === REGIONS_FILTER;
      return '<button class="feed-badge' + (isActive ? " active" : "") + '" tabindex="-1" onclick="filterRegionsByStone(\'' +
        f.stoneId + '\')"><span class="fdot" style="background:' + f.color + '"></span>' + f.stoneName +
        " &middot; " + ROLE_ABBR[f.role] + "</button>";
    }).join("") + "</div></td></tr>";
  });

  html += "</tbody></table></div></div>";
  document.getElementById("view-container").innerHTML = html;
}

/* ===========================================================================
 * STONE DETAIL
 * ======================================================================== */

function updateUpgradeLevel(stoneId, key, rawValue) {
  var lvl = parseCount(rawValue, StoneCalc.UPGRADES[key].cap);
  if (lvl === null) { rejectEdit(rawValue, STONES[stoneId].upgrades[key]); renderStone(stoneId); return; }
  STONES[stoneId].upgrades[key] = lvl;
  saveStones();
  renderStone(stoneId);
}

function applyBuyOrderThrough(stoneId, index) {
  var cfg = StoneCalc.resolveStoneConfig(STONES[stoneId], allRegions());
  var buyOrder = StoneCalc.optimalBuyOrder(cfg, batchTimeSeconds);
  buyOrder.order.slice(0, index + 1).forEach(function (step) {
    STONES[stoneId].upgrades[step.upgrade] = step.level;
  });
  saveStones();
  renderStone(stoneId);
}

function renderUpgradeRow(stoneId, key, level, stats) {
  var u = StoneCalc.UPGRADES[key];
  var atCap = level >= u.cap;
  return '<tr><td class="name">' + UPGRADE_LABELS[key] + '<span class="cap">cap ' + u.cap + " &middot; " +
    (u.per > 0 ? "+" : "") + u.per + " / lvl</span></td>" +
    '<td><div class="lvl-cell"><input class="lvl-input" value="' + inputValue(level) + '" onfocus="this.select()" onchange="updateUpgradeLevel(\'' +
    stoneId + "','" + key + "', this.value)\">" +
    '<button class="max-btn"' + (atCap ? " disabled" : "") + ' onclick="updateUpgradeLevel(\'' + stoneId + "','" +
    key + "', " + u.cap + ')">MAX</button></div></td>' +
    '<td class="num">' + (atCap ? "&mdash;" : fmtGems(StoneCalc.upgradeCost(key, level + 1))) + "</td>" +
    '<td class="num">' + upgradeEffectText(key, stats) + "</td></tr>";
}

function renderBuyRow(stoneId, step, index) {
  var levelText = step.level - step.fromLevel > 1
    ? "lvl " + step.fromLevel + " &rarr; " + step.level
    : "&rarr; lvl " + step.level;
  return '<tr class="buy-row" onclick="applyBuyOrderThrough(\'' + stoneId + "', " + index + ')">' +
    '<td class="name"><span class="step-badge">' + (index + 1) + "</span>" + UPGRADE_LABELS[step.upgrade] +
    " " + levelText + '<span class="apply-hint">click to buy through here</span></td>' +
    '<td class="num">' + fmtGems(step.gemCost) + "</td>" +
    '<td class="num pos">' + fmtTimeUI(step.secondsSaved) + "</td>" +
    '<td class="num">' + step.timeSavedPerGem.toFixed(6) + "</td>" +
    '<td class="num dim">' + fmtGems(step.cumulativeGems) + "</td></tr>";
}

/* ---------- Testing stone's private regions ---------- */

function updateTestRegionInf(regionId, diff, rawValue) {
  var n = parseCount(rawValue, MAX_INFS);
  if (n === null) { rejectEdit(rawValue, TEST_REGIONS[regionId].infs[diff]); renderStone("testing"); return; }
  TEST_REGIONS[regionId].infs[diff] = n;
  saveTestRegions();
  renderStone("testing");
}

function resetTestRegions() {
  for (var trid in TEST_REGIONS) {
    TEST_REGIONS[trid].infs = { easy: 0, medium: 0, hard: 0, insane: 0, nightmare: 0, impossible: 0 };
  }
  saveTestRegions();
  renderStone("testing");
}

function resetTestUpgrades() {
  STONES.testing.upgrades = { u1_chargeRequired: 0, u2_speedPerTick: 0, u3_amountPerTick: 0,
    u4_extractionTick: 0, u5_speedTick: 0, u6_amountTick: 0, u7_extractionPerInf: 0 };
  saveStones();
  renderStone("testing");
}

/* ---------- Regions panel (every stone gets one, real or test) ---------- */

/* Same REGIONS state as the Regions page; just re-renders the stone. */
function updateRegionInfFromStone(stoneId, regionId, diff, rawValue) {
  var n = parseCount(rawValue, MAX_INFS);
  if (n === null) { rejectEdit(rawValue, REGIONS[regionId].infs[diff]); renderStone(stoneId); return; }
  REGIONS[regionId].infs[diff] = n;
  saveRegions();
  renderStone(stoneId);
}

function renderStoneRegionsPanel(id, stoneDef, regions) {
  var isTest = !!stoneDef.isTestStone;
  var roles = ["extraction", "speed", "amount"];

  var html = '<div class="panel"><div class="panel-head"><h2>' + (isTest ? "Test regions" : "Regions") + "</h2>" +
    (isTest
      ? '<button class="max-btn" onclick="resetTestRegions()">RESET</button>'
      : '<button class="max-btn" onclick="openRegions()">ALL REGIONS &rarr;</button>') +
    "</div>" +
    '<div class="panel-body flush"><table><thead><tr><th>Role</th>' +
    '<th class="num">Easy</th><th class="num">Medium</th><th class="num">Hard</th>' +
    '<th class="num">Insane</th><th class="num">Nightmare</th><th class="num">Impossible</th>' +
    '<th class="num">infPower</th>' + (isTest ? "" : "<th>Also feeds</th>") + "</tr></thead><tbody>";

  roles.forEach(function (r) {
    var regionId = stoneDef.regions[r];
    var region = (isTest ? TEST_REGIONS : REGIONS)[regionId];
    var power = StoneCalc.regionInfPower(region.infs, PERK);
    var onChange = isTest
      ? "updateTestRegionInf('" + regionId + "','"
      : "updateRegionInfFromStone('" + id + "','" + regionId + "','";

    html += '<tr><td class="name">' + ROLE_LABEL[r] + '<span class="cap">' + region.name +
      (isTest ? "" : ' <span class="rid">' + regionId + "</span>") + "</span></td>";
    DIFFS.forEach(function (d) {
      html += '<td class="num"><input class="diff-input" value="' + inputValue(region.infs[d]) +
        '" onfocus="this.select()" onchange="' + onChange + d + "', this.value)\"></td>";
    });
    html += '<td class="num" style="color:var(--accent)">' + fmtRate(power.effective) + "</td>";

    if (!isTest) {
      var feeds = regionFeeds(regionId).filter(function (f) { return f.stoneId !== id; });
      html += "<td><div class=\"feeds\">" + (feeds.length
        ? feeds.map(function (f) {
            return '<span class="feed-badge static"><span class="fdot" style="background:' +
              f.color + '"></span>' + f.stoneName + " &middot; " + ROLE_ABBR[f.role] + "</span>";
          }).join("")
        : '<span class="tag-dim">only this stone</span>') + "</div></td>";
    }
    html += "</tr>";
  });

  html += "</tbody></table></div>" +
    (isTest
      ? '<div class="panel-foot">Private to this stone &mdash; not shared with your real regions, and not shown on the Regions page.</div>'
      : "") +
    "</div>";
  return html;
}

/* ---------- Where to farm next ---------- */

function farmSensitivityTooltip() {
  return '<span class="info-tip"><span class="q">?</span><span class="bubble">Each row tests +10% more infs on ' +
    "that one difficulty, holding everything else fixed (or a small probe if you haven't started that difficulty " +
    "yet). This ranks where farming has the most leverage right now. It doesn't consider how long that " +
    "farming would actually take you, since your rate depends on your setup. There's no reliable way to size an " +
    "absolute amount for everyone, so treat it as inspiration, not a plan.</span></span>";
}

function regionFarmSensitivity(stoneId) {
  var stoneDef = STONES[stoneId];
  var regions = allRegions();
  var baseline = batchTimeSeconds(StoneCalc.resolveStoneConfig(stoneDef, regions));
  var roles = ["extraction", "speed", "amount"];
  var rows = [];

  roles.forEach(function (role) {
    var regionId = stoneDef.regions[role];
    var region = regions[regionId];
    if (!region) return;

    DIFFS.forEach(function (diff) {
      var current = region.infs[diff] || 0;
      if (current >= MAX_INFS) return; // nothing left to farm here

      var started = current > 0;
      var testValue = Math.min(MAX_INFS, started ? Math.round(current * 1.10) : 1000);

      var testInfs = Object.assign({}, region.infs);
      testInfs[diff] = testValue;
      var testRegions = Object.assign({}, regions);
      testRegions[regionId] = Object.assign({}, region, { infs: testInfs });

      var testTime = batchTimeSeconds(StoneCalc.resolveStoneConfig(stoneDef, testRegions));
      var secondsSaved = baseline - testTime;
      var pctFaster = baseline > 0 ? (secondsSaved / baseline) * 100 : 0;

      rows.push({
        role: role, regionId: regionId, regionName: region.name, diff: diff,
        current: current, testValue: testValue, started: started,
        secondsSaved: secondsSaved, pctFaster: pctFaster
      });
    });
  });

  rows.sort(function (a, b) { return b.pctFaster - a.pctFaster; });
  return { baseline: baseline, rows: rows };
}

function renderFarmRow(r) {
  var diffLabel = r.diff.charAt(0).toUpperCase() + r.diff.slice(1);
  return "<tr><td class=\"name\">" + r.regionName + " &middot; " + diffLabel +
    '<span class="cap">' + ROLE_LABEL[r.role] + " &middot; " + r.regionId + "</span></td>" +
    '<td class="num dim">' + r.current.toLocaleString() + "</td>" +
    '<td class="num">' + r.testValue.toLocaleString() + (r.started ? "" : ' <span class="tag-dim">probe</span>') + "</td>" +
    '<td class="num pos">' + fmtTimeUI(Math.max(0, r.secondsSaved)) + "</td>" +
    '<td class="num">' + r.pctFaster.toFixed(3) + "%</td></tr>";
}

function renderFarmPanel(stoneId, stoneDef, regions) {
  var result = regionFarmSensitivity(stoneId);
  return '<div class="panel"><div class="panel-head"><h2>Where to farm next' + farmSensitivityTooltip() + "</h2>" +
    '<span class="meta">+10% per difficulty</span></div><div class="panel-body' +
    (result.rows.length ? " flush" : "") + '">' +
    (result.rows.length
      ? '<table><thead><tr><th>Region &middot; difficulty</th><th class="num">Current</th><th class="num">Test</th>' +
        '<th class="num">Time saved</th><th class="num">% faster</th></tr></thead><tbody>' +
        result.rows.map(renderFarmRow).join("") + "</tbody></table>"
      : '<p style="padding:14px 0;color:var(--text-3);font-size:13px;">All difficulties on all regions are already maxed.</p>') +
    "</div></div>";
}

function renderStone(id) {
  var stoneDef = STONES[id];
  var regions = allRegions();
  var cfg = StoneCalc.resolveStoneConfig(stoneDef, regions);
  var stats = StoneCalc.deriveStats(cfg);
  var result = StoneCalc.simulateCharge(cfg);
  var buyOrder = StoneCalc.optimalBuyOrder(cfg, batchTimeSeconds);
  var cps = batchChargesPerSecond(cfg);

  var html = '<div class="hero"><div class="hero-title">' +
    '<div class="swatch" style="background:' + stoneDef.color + "; box-shadow:0 0 10px " +
    hexToRgba(stoneDef.color, 0.5) + '"></div><div><h1>' + stoneDef.name + "</h1>" +
    (stoneDef.isTestStone ? '<span class="test-pill">Test</span>' : "") +
    "</div></div>";

  html += '<div class="stat-row">' +
    '<div class="stat"><div class="label">Extraction ticks</div><div class="value">' + result.extractionTicks.toLocaleString() + "</div></div>" +
    '<div class="stat"><div class="label">Charges / sec' + chargesPerSecTooltip() +
      '</div><div class="value">' + fmtRate(cps) + "</div></div>" +
    '<div class="stat"><div class="label">Charges / hour</div><div class="value">' + fmtRate(cps * 3600) + "</div></div>" +
    '<div class="stat primary"><div class="label">Time per charge</div><div class="value">' + fmtTimeUI(result.timeSeconds) + "</div></div>" +
    "</div></div>";

  html += renderStoneRegionsPanel(id, stoneDef, regions);

  html += '<div class="panel"><div class="panel-head"><h2>Upgrades</h2>' +
    (stoneDef.isTestStone
      ? '<button class="max-btn" onclick="resetTestUpgrades()">RESET</button>'
      : '<span class="meta">7 tracks</span>') +
    '</div><div class="panel-body"><table><thead><tr><th>Upgrade</th><th>Level</th><th class="num">Next lvl cost</th>' +
    '<th class="num">Effect</th></tr></thead><tbody>' +
    Object.keys(StoneCalc.UPGRADES).map(function (key) {
      return renderUpgradeRow(id, key, stoneDef.upgrades[key], stats);
    }).join("") + "</tbody></table></div></div>";

  var shown = buyOrder.order.slice(0, 30);
  html += '<div class="panel"><div class="panel-head"><h2>Optimal buy order</h2><span class="meta">' +
    (buyOrder.order.length ? "step 1–" + shown.length + " of " + buyOrder.order.length : "all maxed") +
    "</span></div><div class=\"panel-body\">" +
    (buyOrder.order.length
      ? '<table><thead><tr><th>Purchase</th><th class="num">Gem cost</th><th class="num">Time saved</th>' +
        '<th class="num">Saved / gem</th><th class="num">Cumulative gems</th></tr></thead><tbody>' +
        shown.map(function (step, i) { return renderBuyRow(id, step, i); }).join("") + "</tbody></table>"
      : '<p style="padding:14px 0;color:var(--text-3);font-size:13px;">Every upgrade is already maxed.</p>') +
    "</div>" +
    (buyOrder.order.length > 30
      ? '<div class="panel-foot">' + (buyOrder.order.length - 30) + " more purchases to fully max - clicking a row, buys everything up through it.</div>"
      : "") +
    "</div>";

  html += renderFarmPanel(id, stoneDef, regions);

  document.getElementById("view-container").innerHTML = html;
}

/* ===========================================================================
 * GUIDE
 * ======================================================================== */

function renderGuide() {
  var html = '<div class="page-head"><h1>Guide</h1><div class="sub">How the calculator works, and what\'s worth ' +
    "knowing</div></div>";

  html += '<div class="panel"><div class="panel-head"><h2>Quick start</h2></div><div class="panel-body flush">' +
    "<table><tbody>" +
    '<tr><td class="num dim" style="width:26px">1</td><td>Fastest start: open ' +
    '<a href="#" onclick="showView(\'data\'); return false;">Import / export</a>, copy the script into ' +
    'TPT2, press <b style="color:var(--text-1)">K</b>, then paste your worker names back here. That fills in all ' +
    "90 inf counts in one go.</td></tr>" +
    '<tr><td class="num dim">2</td><td>Or by hand: open a stone from the sidebar and enter its three ' +
    'regions\' infs in the panel or edit from the ' +
    '<a href="#" onclick="openRegions(); return false;">Regions</a> page, if you want to see all 15 at once.' +
    "</td></tr>" +
    '<tr><td class="num dim">3</td><td>Set upgrade levels directly, or click a row in <b style="color:var(--text-1)">' +
    "Optimal buy order</b> to buy through that step instantly.</td></tr>" +
    '<tr><td class="num dim">4</td><td>Use <b style="color:var(--text-1)">Where to farm next</b> as inspiration for ' +
    "which region and difficulty is worth farming at that specific state of the infinity stone.</td></tr>" +
    '<tr><td class="num dim">5</td><td>Toggle off <b style="color:var(--text-1)">Twin Singularity</b> at the top-right ' +
    "if you haven't unlocked the perk yet.</td></tr>" +
    '<tr><td class="num dim">6</td><td>Use the ' +
    '<b style="color:var(--text-1)">Testing</b> stone in the Sandbox section for messing around without ' +
    "interfering with your actual stones.</td></tr>" +
    "</tbody></table></div></div>";

  html += '<div class="panel"><div class="panel-head"><h2>Key concepts</h2></div><div class="panel-body flush">' +
    '<table class="guide-table"><tbody>' +
    '<tr><td class="name">Importing from the game</td><td>The ' +
    '<a href="#" onclick="showView(\'data\'); return false;">Import / export</a> page has a small script you ' +
    "paste into TPT2. Pressing <b style=\"color:var(--text-1)\">K</b> in game reads every " +
    "region and difficulty's inf count and packs them into your workers names. " +
    "Copy those names in order, paste them back here. " +
    '<b style="color:var(--text-1)"> It will overwrite your workers names</b>.</td></tr>' +
    '<tr><td class="name">Back up your data</td><td>Everything lives in this browser\'s local storage, so clearing ' +
    "site data wipes it. The Import / export page dumps the lot to a JSON file and reads it back again. " +
    "</td></tr>" +
    '<tr><td class="name">Detailed vs. Simple</td><td>The Regions page can show either all six ' +
    "difficulties per region, or a single editable infPower number. Simple mode lets you type an infPower value " +
    "directly. It spreads that evenly across all six difficulties, replacing whatever was there before.</td></tr>" +
    '<tr><td class="name">Optimal buy order</td><td><b style="color:var(--text-1)">Optimal buy order</b> ' +
    'answers "what should I buy next, in general" - it re-checks every option after each purchase, and also ' +
    "checks whether several cheaper levels of one upgrade beats a single pricier level.</td></tr>" +
    '<tr><td class="name">Where to farm next</td><td>Ranks every (region, difficulty) that feeds a stone by what ' +
    "roughly +10% more infs there would do.</td></tr>" +
    '<tr><td class="name">Charges/sec is an estimate</td><td>Below 1-tick this figure is exact. Once a stone ' +
    "reaches 1-tick, your FPS has a drastic effect on real in-game throughput, and i'm getting close to get the " +
    "displayed number - but at high speeds the real number can land either above or below what's shown. " +
    "I will keep tightening this with more testing. In the meantime, a change that increases or decreases " +
    "Charges/sec has the same effect in game either way, just by a slightly different amount than " +
    "shown.</td></tr>" +
    "</tbody></table></div></div>";

  document.getElementById("view-container").innerHTML = html;
}

/* ===========================================================================
 * INIT
 * ======================================================================== */

function initApp() {
  loadPersisted();
  applyPerkToAllStones();
  buildRail();
  updatePerkSwitch();
  showView("overview");
}

document.addEventListener("DOMContentLoaded", initApp);
