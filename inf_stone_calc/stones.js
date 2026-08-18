var ZERO_UPGRADES = {
  u1_chargeRequired: 0, u2_speedPerTick: 0, u3_amountPerTick: 0,
  u4_extractionTick: 0, u5_speedTick: 0, u6_amountTick: 0, u7_extractionPerInf: 0
};

var STONES = {
  neutral: {
    name: "Neutral",
    color: "#9CA3AF",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R1", speed: "R13", amount: "R11" }
  },
  fire: {
    name: "Fire",
    color: "#E2622B",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R5", speed: "R12", amount: "R4" }
  },
  water: {
    name: "Water",
    color: "#3B8FC4",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R10", speed: "R9", amount: "R3" }
  },
  nature: {
    name: "Nature",
    color: "#5C9A5C",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R7", speed: "R2", amount: "R1" }
  },
  earth: {
    name: "Earth",
    color: "#9C7148",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R4", speed: "R14", amount: "R6" }
  },
  electricity: {
    name: "Electricity",
    color: "#D9B23C",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R8", speed: "R14", amount: "R5" }
  },
  air: {
    name: "Air",
    color: "#AEDDE0",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R6", speed: "R13", amount: "R9" }
  },
  darkness: {
    name: "Darkness",
    color: "#8172B0",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R12", speed: "R10", amount: "R4" }
  },
  light: {
    name: "Light",
    color: "#E8D6A0",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R13", speed: "R8", amount: "R2" }
  },
  universal: {
    name: "Universal",
    color: "#4A4B50",
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "R14", speed: "R15", amount: "R11" }
  },

  /* Sandbox stone. Excluded from the Overview ranking; its T1/T2/T3 regions
   * are defined in app.js and are private to its own page. */
  testing: {
    name: "Testing",
    color: "#5B6472",
    isTestStone: true,
    doublePerk: true,
    u7Source: "extraction",
    upgrades: Object.assign({}, ZERO_UPGRADES),
    regions: { extraction: "T1", speed: "T2", amount: "T3" }
  }
};
