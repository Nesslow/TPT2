(function (root) {
  "use strict";

  var DIFF_INDEX = {
    easy: 2, medium: 3.5, hard: 5, insane: 6.5, nightmare: 8, impossible: 9.5
  };

  var BASE = {
    chargeRequired: 200,
    energyPerExtraction: 1,
    extractionTickDuration: 600,
    speedTickDuration: 600,
    amountTickDuration: 600,
    speedBonusPerTick: 0.02,
    amountBonusPerTick: 0.05
  };

  var UPGRADES = {
    u1_chargeRequired:   { cap: 150, per: -1,    unit: "charge required" },
    u2_speedPerTick:     { cap: 90,  per: 0.001, unit: "speed % per speed tick" },
    u3_amountPerTick:    { cap: 150, per: 0.02,  unit: "amount % per amount tick" },
    u4_extractionTick:   { cap: 100, per: -5,    unit: "sec off base extraction tick" },
    u5_speedTick:        { cap: 100, per: -5,    unit: "sec off base speed tick" },
    u6_amountTick:       { cap: 100, per: -5,    unit: "sec off base amount tick" },
    u7_extractionPerInf: { cap: 20,  per: 0.001, unit: "extraction % per base infPower" }
  };

  var COSTS = {
    u1_chargeRequired:   { base: 25, mult: 1.15 },
    u2_speedPerTick:     { base: 10, mult: 1.26 },
    u3_amountPerTick:    { base: 8,  mult: 1.15 },
    u4_extractionTick:   { base: 15, mult: 1.25 },
    u5_speedTick:        { base: 30, mult: 1.25 },
    u6_amountTick:       { base: 10, mult: 1.25 },
    u7_extractionPerInf: { base: 25, mult: 2.5 }
  };

  var EMPTY_REGION = { easy: 0, medium: 0, hard: 0, insane: 0, nightmare: 0, impossible: 0 };
  var ZERO_UPGRADES = {
    u1_chargeRequired: 0, u2_speedPerTick: 0, u3_amountPerTick: 0,
    u4_extractionTick: 0, u5_speedTick: 0, u6_amountTick: 0, u7_extractionPerInf: 0
  };

  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (!src) continue;
      for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) target[k] = src[k];
    }
    return target;
  }

  function upgradeCost(key, level) {
    var c = COSTS[key];
    return Math.floor(c.base * Math.pow(c.mult, level - 1));
  }

  /* ===========================================================================
   * INFINITY POWER
   * ======================================================================== */

  function difficultyInfPower(infs, diffIndex) {
    if (!isFinite(infs) || infs <= 0) return 1;
    var exponent = 1.2 - diffIndex * 0.04;
    return 1 + Math.log10(1 + 99999999999 * Math.pow(infs / 1e11, exponent));
  }

  /* Region infPower is the product across all six difficulties. Returns base
   * and effective separately because upgrade 7 is specified against base. */
  function regionInfPower(infsObj, doublePerk) {
    infsObj = infsObj || {};
    var perDifficulty = {};
    var base = 1;
    for (var diff in DIFF_INDEX) {
      if (!Object.prototype.hasOwnProperty.call(DIFF_INDEX, diff)) continue;
      var p = difficultyInfPower(infsObj[diff] || 0, DIFF_INDEX[diff]);
      perDifficulty[diff] = p;
      base *= p;
    }
    return { base: base, effective: doublePerk ? base * 2 : base, perDifficulty: perDifficulty };
  }

  function regionHasInfs(infsObj) {
    infsObj = infsObj || {};
    for (var diff in DIFF_INDEX) {
      if (Object.prototype.hasOwnProperty.call(DIFF_INDEX, diff) && (infsObj[diff] || 0) > 0) return true;
    }
    return false;
  }

  function resolveU7Base(cfg) {
    var ext = regionInfPower(cfg.infExtraction, cfg.doublePerk);
    var spd = regionInfPower(cfg.infSpeed, cfg.doublePerk);
    var amt = regionInfPower(cfg.infAmount, cfg.doublePerk);
    switch (cfg.u7Source) {
      case "speed":        return spd.effective;
      case "amount":       return amt.effective;
      case "sumOfAll":     return ext.effective + spd.effective + amt.effective;
      case "productOfAll": return ext.effective * spd.effective * amt.effective;
      default:             return ext.effective;
    }
  }

  /* ===========================================================================
   * CONFIG
   * ======================================================================== */

  function makeConfig(overrides) {
    overrides = overrides || {};
    var cfg = assign({
      doublePerk: true,
      infExtraction: assign({}, EMPTY_REGION),
      infSpeed: assign({}, EMPTY_REGION),
      infAmount: assign({}, EMPTY_REGION),
      u7Source: "extraction"
    }, overrides);
    cfg.upgrades = assign({}, ZERO_UPGRADES, overrides.upgrades);
    return cfg;
  }

  function resolveStoneConfig(stoneDef, regions) {
    regions = regions || {};
    function infsFor(regionId) {
      var region = regions[regionId];
      return (region && region.infs) ? region.infs : EMPTY_REGION;
    }
    return makeConfig({
      doublePerk: stoneDef.doublePerk,
      upgrades: stoneDef.upgrades,
      u7Source: stoneDef.u7Source,
      infExtraction: infsFor(stoneDef.regions.extraction),
      infSpeed: infsFor(stoneDef.regions.speed),
      infAmount: infsFor(stoneDef.regions.amount)
    });
  }

  function clampLevels(levels) {
    levels = levels || {};
    var out = {};
    for (var key in UPGRADES) {
      if (!Object.prototype.hasOwnProperty.call(UPGRADES, key)) continue;
      var lvl = Math.floor(levels[key] || 0);
      out[key] = Math.min(Math.max(lvl, 0), UPGRADES[key].cap);
    }
    return out;
  }

  /* ===========================================================================
   * DERIVED STATS  (constant for the duration of one charge)
   * ======================================================================== */

  function deriveStats(cfg) {
    var lv = clampLevels(cfg.upgrades);

    var ext = regionInfPower(cfg.infExtraction, cfg.doublePerk);
    var spd = regionInfPower(cfg.infSpeed, cfg.doublePerk);
    var amt = regionInfPower(cfg.infAmount, cfg.doublePerk);

    // Upgrades 4/5/6 reduce the base duration; region power divides after.
    var extBaseDur = Math.max(1e-9, BASE.extractionTickDuration + UPGRADES.u4_extractionTick.per * lv.u4_extractionTick);
    var spdBaseDur = Math.max(1e-9, BASE.speedTickDuration      + UPGRADES.u5_speedTick.per      * lv.u5_speedTick);
    var amtBaseDur = Math.max(1e-9, BASE.amountTickDuration     + UPGRADES.u6_amountTick.per     * lv.u6_amountTick);

    var u7Base = resolveU7Base(cfg);

    return {
      levels: lv,
      power: { extraction: ext, speed: spd, amount: amt },

      chargeRequired: Math.max(1, BASE.chargeRequired + UPGRADES.u1_chargeRequired.per * lv.u1_chargeRequired),

      extractionTickDuration: extBaseDur / ext.effective,
      speedTickDuration:      regionHasInfs(cfg.infSpeed)  ? spdBaseDur / spd.effective : Infinity,
      amountTickDuration:     regionHasInfs(cfg.infAmount) ? amtBaseDur / amt.effective : Infinity,

      speedBonusPerTick:  BASE.speedBonusPerTick  + UPGRADES.u2_speedPerTick.per  * lv.u2_speedPerTick,
      amountBonusPerTick: BASE.amountBonusPerTick + UPGRADES.u3_amountPerTick.per * lv.u3_amountPerTick,

      energyPerExtraction: BASE.energyPerExtraction,
      u7Bonus: UPGRADES.u7_extractionPerInf.per * lv.u7_extractionPerInf * u7Base,
      u7PowerUsed: u7Base,
      energyOnFirstTick: BASE.energyPerExtraction *
        (1 + UPGRADES.u7_extractionPerInf.per * lv.u7_extractionPerInf * u7Base),

      baseDurations: { extBaseDur: extBaseDur, spdBaseDur: spdBaseDur, amtBaseDur: amtBaseDur }
    };
  }

  /* ===========================================================================
   * SIMULATION  (exact, event-driven)
   * ======================================================================== */

  function energyPerExtraction(s, amountStacks) {
    return s.energyPerExtraction * ((1 + amountStacks * s.amountBonusPerTick) + s.u7Bonus);
  }

  function simulateCharge(cfg, options) {
    options = options || {};
    var maxSeconds = options.maxSeconds || 1e12;
    var maxEvents = options.maxEvents || 5e7;
    var trace = !!options.trace;

    var s = deriveStats(cfg);

    var t = 0, progress = 0;
    var speedStacks = 0, amountStacks = 0;
    var extractionTicks = 0, energyProduced = 0;
    var timeline = [];
    var EPS = 1e-12;
    var events = 0;

    function pack(completed, reason) {
      return {
        stats: s,
        completed: completed,
        reason: reason || null,
        timeSeconds: t,
        extractionTicks: extractionTicks,
        speedStacks: speedStacks,
        amountStacks: amountStacks,
        energyProduced: energyProduced,
        wastedEnergy: energyProduced - s.chargeRequired,
        finalSpeedMultiplier: 1 + speedStacks * s.speedBonusPerTick,
        finalAmountMultiplier: 1 + amountStacks * s.amountBonusPerTick,
        finalExtractionInterval: s.extractionTickDuration / (1 + speedStacks * s.speedBonusPerTick),
        chargesPerSecond: t > 0 ? 1 / t : Infinity,
        chargesPerHour: t > 0 ? 3600 / t : Infinity,
        chargesPerDay: t > 0 ? 86400 / t : Infinity,
        timeline: timeline
      };
    }

    while (energyProduced < s.chargeRequired) {
      if (++events > maxEvents || t > maxSeconds) return pack(false, "exceeded limits");

      var rate = (1 + speedStacks * s.speedBonusPerTick) / s.extractionTickDuration;
      var timeToExtract = (1 - progress) / rate;

      var nextSpeedAt = (speedStacks + 1) * s.speedTickDuration;
      var nextAmountAt = (amountStacks + 1) * s.amountTickDuration;
      var nextBoundaryAt = Math.min(nextSpeedAt, nextAmountAt);
      var timeToBoundary = nextBoundaryAt - t;

      if (timeToExtract <= timeToBoundary + EPS) {
        t += timeToExtract;
        progress = 0;
        var gained = energyPerExtraction(s, amountStacks);
        energyProduced += gained;
        extractionTicks++;
        if (trace) timeline.push({ t: t, type: "extract", gained: gained, charge: energyProduced, speedStacks: speedStacks, amountStacks: amountStacks });
      } else {
        progress += rate * timeToBoundary;
        t = nextBoundaryAt;
        if (Math.abs(t - nextSpeedAt) < EPS)  { speedStacks++;  if (trace) timeline.push({ t: t, type: "speed",  speedStacks: speedStacks }); }
        if (Math.abs(t - nextAmountAt) < EPS) { amountStacks++; if (trace) timeline.push({ t: t, type: "amount", amountStacks: amountStacks }); }
      }
    }

    return pack(true);
  }

  /* ===========================================================================
   * UPGRADE VALUE
   * ======================================================================== */

  function cumulativeUpgradeCost(key, fromLevelExclusive, toLevelInclusive) {
    var sum = 0;
    for (var level = fromLevelExclusive + 1; level <= toLevelInclusive; level++) sum += upgradeCost(key, level);
    return sum;
  }

  /** Furthest level reachable from curLevel on a given gem budget. */
  function levelsWithinBudget(key, curLevel, cap, budget) {
    var level = curLevel, spent = 0;
    while (level < cap) {
      var nextCost = upgradeCost(key, level + 1);
      if (spent + nextCost > budget) break;
      spent += nextCost;
      level++;
    }
    return level;
  }

  /**
   * timeOf defaults to the exact per-charge model. Callers can inject an
   * alternative (e.g. one that accounts for the per-frame batching effect on
   * a 1-tick stone) to rank purchases by real-world time instead - the
   * greedy search itself doesn't care what "time" means, only that lower is
   * better, so this is a pure injection point with no change to the
   * algorithm or to default behavior when omitted.
   */
  function optimalBuyOrder(cfg, timeOf) {
    timeOf = timeOf || function (c) { return simulateCharge(c).timeSeconds; };
    var workingUpgrades = assign({}, clampLevels(cfg.upgrades));
    var startTime = timeOf(assign({}, cfg, { upgrades: workingUpgrades }));
    var currentTime = startTime;
    var totalGems = 0;
    var order = [];
    var MAX_BUDGET_DOUBLINGS = 6;

    while (true) {
      var candidates = [];
      var best = null;

      for (var key in UPGRADES) {
        if (!Object.prototype.hasOwnProperty.call(UPGRADES, key)) continue;
        var curLevel = workingUpgrades[key];
        var cap = UPGRADES[key].cap;
        if (curLevel >= cap) continue;

        var nextLevel = curLevel + 1;
        var testUpgrades = assign({}, workingUpgrades);
        testUpgrades[key] = nextLevel;
        var t = timeOf(assign({}, cfg, { upgrades: testUpgrades }));

        var secondsSaved = currentTime - t;
        var gemCost = upgradeCost(key, nextLevel);
        var value = gemCost > 0 ? secondsSaved / gemCost : (secondsSaved > 0 ? Infinity : -Infinity);

        var cand = { upgrade: key, level: nextLevel, gemCost: gemCost, value: value, newTime: t, secondsSaved: secondsSaved };
        candidates.push(cand);
        if (!best || value > best.value) best = cand;
      }

      if (!best) break;

      var budget = candidates.reduce(function (m, c) { return Math.min(m, c.gemCost); }, Infinity);
      for (var d = 0; d < MAX_BUDGET_DOUBLINGS; d++) {
        for (var key2 in UPGRADES) {
          if (!Object.prototype.hasOwnProperty.call(UPGRADES, key2)) continue;
          var curLevel2 = workingUpgrades[key2];
          var cap2 = UPGRADES[key2].cap;
          if (curLevel2 >= cap2) continue;

          var reachLevel = levelsWithinBudget(key2, curLevel2, cap2, budget);
          if (reachLevel <= curLevel2) continue;

          var bundleCost = cumulativeUpgradeCost(key2, curLevel2, reachLevel);
          var bundleUpgrades = assign({}, workingUpgrades);
          bundleUpgrades[key2] = reachLevel;
          var bt = timeOf(assign({}, cfg, { upgrades: bundleUpgrades }));
          var bundleSecondsSaved = currentTime - bt;
          var bundleValue = bundleCost > 0 ? bundleSecondsSaved / bundleCost : (bundleSecondsSaved > 0 ? Infinity : -Infinity);

          if (bundleValue > best.value) {
            best = { upgrade: key2, level: reachLevel, gemCost: bundleCost, value: bundleValue, newTime: bt, secondsSaved: bundleSecondsSaved };
          }
        }
        budget *= 2;
      }

      var fromLevel = workingUpgrades[best.upgrade];
      workingUpgrades[best.upgrade] = best.level;
      totalGems += best.gemCost;
      order.push({
        step: order.length + 1,
        upgrade: best.upgrade,
        fromLevel: fromLevel,
        level: best.level,
        secondsSaved: best.secondsSaved,
        pctFaster: (best.secondsSaved / currentTime) * 100,
        gemCost: best.gemCost,
        cumulativeGems: totalGems,
        timeAfter: best.newTime,
        pctFasterVsStart: ((startTime - best.newTime) / startTime) * 100,
        timeSavedPerGem: best.value
      });
      currentTime = best.newTime;
    }

    return { startTime: startTime, finalTime: currentTime, totalGems: totalGems, order: order };
  }

  function minCostForOneTick(cfg) {
    var lv = clampLevels(cfg.upgrades);

    var firstTickTrace = simulateCharge(cfg, { trace: true }).timeline;
    var firstExtract = null;
    for (var i = 0; i < firstTickTrace.length; i++) {
      if (firstTickTrace[i].type === "extract") { firstExtract = firstTickTrace[i]; break; }
    }
    if (!firstExtract) {
      return { feasible: false, reason: "No extraction tick ever fired." };
    }

    var s = deriveStats(cfg);
    var amountMultAtFirstTick = 1 + firstExtract.amountStacks * s.amountBonusPerTick;

    var u7Base = resolveU7Base(cfg);
    var u1Cap = UPGRADES.u1_chargeRequired.cap;
    var u7Cap = UPGRADES.u7_extractionPerInf.cap;
    var u7BonusPerLevel = UPGRADES.u7_extractionPerInf.per * u7Base;

    var best = null;
    for (var u1Level = lv.u1_chargeRequired; u1Level <= u1Cap; u1Level++) {
      var chargeRequired = Math.max(1, BASE.chargeRequired + UPGRADES.u1_chargeRequired.per * u1Level);
      var neededBonus = chargeRequired - amountMultAtFirstTick;

      var u7Level;
      if (neededBonus <= 0) {
        u7Level = lv.u7_extractionPerInf;
      } else if (u7BonusPerLevel <= 0) {
        continue;
      } else {
        u7Level = Math.max(lv.u7_extractionPerInf, Math.ceil(neededBonus / u7BonusPerLevel));
      }
      if (u7Level > u7Cap) continue;

      var cost = cumulativeUpgradeCost("u1_chargeRequired", lv.u1_chargeRequired, u1Level) +
                 cumulativeUpgradeCost("u7_extractionPerInf", lv.u7_extractionPerInf, u7Level);

      if (!best || cost < best.cost) best = { u1Level: u1Level, u7Level: u7Level, cost: cost };
    }

    if (!best) {
      return {
        feasible: false,
        reason: "Even u1 and u7 both maxed can't reach 1 tick (amount bar contributes " +
          firstExtract.amountStacks + " stack(s) at the first tick; would need u3/u6/inf changes too)."
      };
    }

    var testUpgrades = assign({}, cfg.upgrades);
    testUpgrades.u1_chargeRequired = best.u1Level;
    testUpgrades.u7_extractionPerInf = best.u7Level;
    var r = simulateCharge(makeConfig(assign({}, cfg, { upgrades: testUpgrades })));

    if (r.completed && r.extractionTicks === 1) {
      return {
        feasible: true,
        gemCost: best.cost,
        upgrades: { u1_chargeRequired: best.u1Level, u7_extractionPerInf: best.u7Level },
        validated: true
      };
    }

    return {
      feasible: null,
      reason: "Closed form predicted 1 tick but the simulator got " + r.extractionTicks +
        ". Treat the result as unverified.",
      closedFormGuess: { u1Level: best.u1Level, u7Level: best.u7Level, cost: best.cost },
      validated: false
    };
  }

  function simulateAllStones(stones, regions) {
    var rows = [];
    for (var id in stones) {
      if (!Object.prototype.hasOwnProperty.call(stones, id)) continue;
      var cfg = resolveStoneConfig(stones[id], regions);
      var r = simulateCharge(cfg);
      rows.push({
        id: id,
        name: stones[id].name || id,
        timeSeconds: r.timeSeconds,
        chargesPerHour: r.chargesPerHour,
        extractionTicks: r.extractionTicks,
        cfg: cfg,
        result: r
      });
    }
    rows.sort(function (a, b) { return a.timeSeconds - b.timeSeconds; });
    return rows;
  }

  root.StoneCalc = {
    DIFF_INDEX: DIFF_INDEX,
    BASE: BASE,
    UPGRADES: UPGRADES,
    COSTS: COSTS,
    upgradeCost: upgradeCost,
    difficultyInfPower: difficultyInfPower,
    regionInfPower: regionInfPower,
    regionHasInfs: regionHasInfs,
    makeConfig: makeConfig,
    resolveStoneConfig: resolveStoneConfig,
    clampLevels: clampLevels,
    deriveStats: deriveStats,
    simulateCharge: simulateCharge,
    optimalBuyOrder: optimalBuyOrder,
    minCostForOneTick: minCostForOneTick,
    simulateAllStones: simulateAllStones
  };

})(typeof window !== "undefined" ? window : globalThis);
