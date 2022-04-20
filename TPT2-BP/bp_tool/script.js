const tool_name = 'BP Tool';
const tool_ver = 'v1.0.0';
const modarray = [
    {type:"A_atk", name:"attack.basic", display:"Basic Attack", location:"Starting mod", dropinfo:"" }, 
    {type:"A_atk", name:"attack.speed", display:"Attack Speed", location:"Starting mod", dropinfo:"" }, 
    {type:"B_def", name:"foundation.stone", display:"Stone Foundation", location:"Starting mod", dropinfo:"" }, 
    {type:"B_def", name:"regeneration.basic", display:"Basic Regeneration", location:"Starting mod", dropinfo:"" }, 
    {type:"A_atk", name:"attack.bounce", display:"Basic Bouncing", location:"R01:", dropinfo:"Wave 10" }, 
    {type:"A_atk", name:"attack.multishot", display:"Multishot", location:"R01:", dropinfo:"Wave 30" }, 
    {type:"A_atk", name:"attack.naturestouch", display:"Nature's Touch", location:"R01:", dropinfo:"Wave 40" }, 
    {type:"A_atk", name:"attack.fire", display:"Fire Attack", location:"R01:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.fire", display:"Fire Burst", location:"R01:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"attack.nature", display:"Nature Attack", location:"R01:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.nature", display:"Nature Burst", location:"R01:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"attack.earth", display:"Earth Attack", location:"R01:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.earth", display:"Earth Burst", location:"R01:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"crit.natureDmg", display:"Nature Crit", location:"R01:", dropinfo:"Chance: 2%" }, 
    {type:"B_def", name:"resistance.elemental", display:"Elemental Resistance", location:"R01:", dropinfo:"Wave 20" }, 
    {type:"B_def", name:"resistance.fire", display:"Fire Resistance", location:"R01:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.nature", display:"Nature Resistance", location:"R01:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.earth", display:"Earth Resistance", location:"R01:", dropinfo:"Chance: 5%" }, 
    {type:"C_utl", name:"bonus.waveresources", display:"Wave Resources", location:"R01:", dropinfo:"Wave 50" }, 
    {type:"A_atk", name:"attack.light", display:"Light Attack", location:"R02:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.light", display:"Light Burst", location:"R02:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"attack.air", display:"Air Attack", location:"R02:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.air", display:"Air Burst", location:"R02:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"attack.electricity", display:"Electricity Attack", location:"R02:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.electricity", display:"Electricity Burst", location:"R02:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"crit.lightDmg", display:"Light Crit", location:"R02:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.airDmg", display:"Air Crit", location:"R02:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.electricityDmg", display:"Electricity Crit", location:"R02:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.fireDmg", display:"Fire Crit", location:"R02:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"spell.simpleheal", display:"Simple Heal", location:"R02:", dropinfo:"Wave 1" }, 
    {type:"B_def", name:"foundation.granite", display:"Granite Foundation", location:"R02:", dropinfo:"Wave 10" }, 
    {type:"B_def", name:"resistance.light", display:"Light Resistance", location:"R02:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.air", display:"Air Resistance", location:"R02:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.electricity", display:"Electricity Resistance", location:"R02:", dropinfo:"Chance: 5%" }, 
    {type:"C_utl", name:"energy.basic", display:"Energy", location:"R02:", dropinfo:"Wave 1" }, 
    {type:"C_utl", name:"energy.regeneration", display:"Energy Regeneration", location:"R02:", dropinfo:"Wave 1" }, 
    {type:"A_atk", name:"attack.darkness", display:"Darkness Attack", location:"R03:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.darkness", display:"Darkness Burst", location:"R03:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"attack.water", display:"Water Attack", location:"R03:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"burst.water", display:"Water Burst", location:"R03:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"splash.basic", display:"Splash", location:"R03:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"attack.bash", display:"Bash", location:"R03:", dropinfo:"Chance: 0.12%" }, 
    {type:"A_atk", name:"crit.darknessDmg", display:"Darkness Crit", location:"R03:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.waterDmg", display:"Water Crit", location:"R03:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.earthDmg", display:"Earth Crit", location:"R03:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"resistance.darkness", display:"Darkness Resistance", location:"R03:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.water", display:"Water Resistance", location:"R03:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"shield.basic", display:"Basic Shield", location:"R03:", dropinfo:"Wave 50" }, 
    {type:"B_def", name:"shield.boss", display:"Boss shield", location:"R03:", dropinfo:"Chance: 1.2%" }, 
    {type:"C_utl", name:"energy.moon", display:"Moon Energy", location:"R03:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"soul.harvesting", display:"Soul Harvesting", location:"R04:", dropinfo:"Chance: 0.1%" }, 
    {type:"B_def", name:"resistance.abs.darkness", display:"Darkness Armor", location:"R04:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.abs.air", display:"Air Armor", location:"R04:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.abs.earth", display:"Earth Armor", location:"R04:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.abs.nature", display:"Nature Armor", location:"R04:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"defense.shelter", display:"Shelter", location:"R04:", dropinfo:"Chance: 1%" }, 
    {type:"C_utl", name:"bonus.transmute", display:"Transmute", location:"R04:", dropinfo:"Chance: 0.5%" }, 
    {type:"C_utl", name:"bonus.offensive", display:"Offensive Pack", location:"R04:", dropinfo:"Chance: 2%" }, 
    {type:"C_utl", name:"bonus.defensive", display:"Defensive Pack", location:"R04:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"spell.firestorm", display:"Firestorm", location:"R05:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"attack.burn", display:"Burning Attack", location:"R05:", dropinfo:"Chance: 0.1%" }, 
    {type:"B_def", name:"resistance.abs.light", display:"Light Armor", location:"R05:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.abs.fire", display:"Fire Armor", location:"R05:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.abs.water", display:"Water Armor", location:"R05:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"resistance.abs.electricity", display:"Electricity Armor", location:"R05:", dropinfo:"Chance: 5%" }, 
    {type:"B_def", name:"foundation.magma", display:"Magma Foundation", location:"R05:", dropinfo:"Wave 100" }, 
    {type:"A_atk", name:"blessing.divine", display:"Divine Blessing", location:"R06:", dropinfo:"Chance: 0.15%" }, 
    {type:"A_atk", name:"splash.element.light", display:"Light Splash", location:"R06:", dropinfo:"Chance: 0.9%" }, 
    {type:"A_atk", name:"splash.element.fire", display:"Fire Splash", location:"R06:", dropinfo:"Chance: 0.9%" }, 
    {type:"A_atk", name:"splash.element.electricity", display:"Electricity Splash", location:"R06:", dropinfo:"Chance: 0.9%" }, 
    {type:"A_atk", name:"splash.element.air", display:"Air Splash", location:"R06:", dropinfo:"Chance: 2%" }, 
    {type:"B_def", name:"shell.air", display:"Air Shell", location:"R06:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"barrier.air", display:"Air Barrier", location:"R06:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"defense.bulletproof", display:"Bulletproof", location:"R06:", dropinfo:"Chance: 0.9%" }, 
    {type:"B_def", name:"recharger.shield", display:"Shield Recharger", location:"R06:", dropinfo:"Chance: 0.5%" }, 
    {type:"A_atk", name:"spell.lifeleech", display:"Lifeleech", location:"R07:", dropinfo:"Chance: 1.5%" }, 
    {type:"A_atk", name:"splash.element.earth", display:"Earth Splash", location:"R07:", dropinfo:"Chance: 0.9%" }, 
    {type:"A_atk", name:"splash.element.water", display:"Water Splash", location:"R07:", dropinfo:"Chance: 0.9%" }, 
    {type:"A_atk", name:"splash.element.nature", display:"Nature Splash", location:"R07:", dropinfo:"Chance: 2%" }, 
    {type:"A_atk", name:"splash.element.darkness", display:"Darkness Splash", location:"R07:", dropinfo:"Chance: 0.9%" }, 
    {type:"B_def", name:"shell.nature", display:"Nature Shell", location:"R07:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shell.earth", display:"Earth Shell", location:"R07:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shell.water", display:"Water Shell", location:"R07:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"barrier.nature", display:"Nature Barrier", location:"R07:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"barrier.earth", display:"Earth Barrier", location:"R07:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"barrier.water", display:"Water Barrier", location:"R07:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"attack.spark", display:"Sparks", location:"R08:", dropinfo:"Chance: 0.12%" }, 
    {type:"B_def", name:"shell.fire", display:"Fire Shell", location:"R08:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shell.electricity", display:"Electricity Shell", location:"R08:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shell.light", display:"Light Shell", location:"R08:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"barrier.fire", display:"Fire Barrier", location:"R08:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"barrier.electricity", display:"Electricity Barrier", location:"R08:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"barrier.light", display:"Light Barrier", location:"R08:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"foundation.diamond", display:"Diamond Foundation", location:"R08:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"attack.execution", display:"Execution", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"attack.rapidfire", display:"Rapidfire", location:"R09:", dropinfo:"Chance: 0.6%" }, 
    {type:"A_atk", name:"splash.advanced", display:"Advanced Splash", location:"R09:", dropinfo:"Chance: 0.14%" }, 
    {type:"A_atk", name:"spell.multishot", display:"Super Multishot", location:"R09:", dropinfo:"Chance: 0.8%" }, 
    {type:"B_def", name:"barrier.darkness", display:"Darkness Barrier", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.fire", display:"Fire Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.water", display:"Water Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.earth", display:"Earth Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.air", display:"Air Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.nature", display:"Nature Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.electricity", display:"Electricity Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.light", display:"Light Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.darkness", display:"Darkness Exchange", location:"R09:", dropinfo:"Chance: 1%" }, 
    {type:"C_utl", name:"energy.sun", display:"Sun Energy", location:"R09:", dropinfo:"Chance: 5%" }, 
    {type:"A_atk", name:"shards.ice", display:"Ice Shards", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.fire", display:"Fire Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.water", display:"Water Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.earth", display:"Earth Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.air", display:"Air Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.nature", display:"Nature Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.electricity", display:"Electricity Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.light", display:"Light Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"impetus.darkness", display:"Darkness Impetus", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shell.darkness", display:"Darkness Shell", location:"R10:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"aura.frost", display:"Frost Aura", location:"R10:", dropinfo:"Chance: 0.8%" }, 
    {type:"A_atk", name:"boost.neutral", display:"Anti-Neutral Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.fire", display:"Anti-Fire Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.water", display:"Anti-Water Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.earth", display:"Anti-Earth Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.air", display:"Anti-Air Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.electricity", display:"Anti-Electricity Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.nature", display:"Anti-Nature Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.light", display:"Anti-Light Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.darkness", display:"Anti-Darkness Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"boost.universal", display:"Anti-Universal Projectiles", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.neutral", display:"Neutral Exchange", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"exchange.universal", display:"Universal Exchange", location:"R11:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"foundation.marble", display:"Marble Foundation", location:"R11:", dropinfo:"Chance: 0.5%" }, 
    {type:"A_atk", name:"crit.darkness", display:"Anti-Darkness Crit", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.fire", display:"Anti-Fire Crit", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.earth", display:"Anti-Earth Crit", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.water", display:"Anti-Water Crit", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.fire", display:"Fire Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.water", display:"Water Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.earth", display:"Earth Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.air", display:"Air Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.nature", display:"Nature Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.light", display:"Light Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.darkness", display:"Darkness Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"subsistence.electricity", display:"Electricity Subsistence", location:"R12:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.light", display:"Anti-Light Crit", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.nature", display:"Anti-Nature Crit", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.air", display:"Anti-Air Crit", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"crit.electricity", display:"Anti-Electricity Crit", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.fire", display:"Fire Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.water", display:"Water Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.air", display:"Air Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.earth", display:"Earth Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.nature", display:"Nature Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.electricity", display:"Electricity Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.light", display:"Light Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"shield.armor.darkness", display:"Darkness Protection", location:"R13:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.fire", display:"Fire Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.water", display:"Water Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.air", display:"Air Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.electricity", display:"Electricity Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.darkness", display:"Darkness Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.earth", display:"Earth Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.nature", display:"Nature Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"B_def", name:"block.light", display:"Light Block", location:"R14:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.neutral", display:"Neutral Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.fire", display:"Fire Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.water", display:"Water Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.nature", display:"Nature Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.air", display:"Air Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.earth", display:"Earth Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.light", display:"Light Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.darkness", display:"Darkness Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.electricity", display:"Electricity Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"A_atk", name:"focus.universal", display:"Universal Focus", location:"R15:", dropinfo:"Chance: 1%" }, 
    {type:"D_ult", name:"tower.super.1", display:"Super Tower", location:"R15:", dropinfo:"Wave 100" }, 
    {type:"A_atk", name:"taste.fire", display:"Fire Taste", location:"Experiment: Fire", dropinfo:"" }, 
    {type:"A_atk", name:"attack.firebreath", display:"Fire Breath", location:"Experiment: Fire", dropinfo:"" }, 
    {type:"A_atk", name:"attack.combustion", display:"Combustion", location:"Experiment: Fire", dropinfo:"" }, 
    {type:"B_def", name:"shield.fire", display:"Shield of Fire", location:"Experiment: Fire", dropinfo:"" }, 
    {type:"A_atk", name:"fire.incineration", display:"Incineration", location:"Experiment: Fire", dropinfo:"" }, 
    {type:"A_atk", name:"taste.water", display:"Water Taste", location:"Experiment: Water", dropinfo:"" }, 
    {type:"B_def", name:"spell.frostnova", display:"Frost Nova", location:"Experiment: Water", dropinfo:"" }, 
    {type:"B_def", name:"shield.frost", display:"Shield of Frost", location:"Experiment: Water", dropinfo:"" }, 
    {type:"A_atk", name:"attack.shatter", display:"Shatter", location:"Experiment: Water", dropinfo:"" }, 
    {type:"A_atk", name:"water.extinguish", display:"Extinguish", location:"Experiment: Water", dropinfo:"" }, 
    {type:"A_atk", name:"spell.glacier.spikes", display:"Glacier Spikes", location:"Experiment: Water", dropinfo:"" }, 
    {type:"E_spc", name:"tower.absolute.zero", display:"Absolute Zero", location:"Experiment: Water", dropinfo:"" }, 
    {type:"A_atk", name:"taste.nature", display:"Nature Taste", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"B_def", name:"regeneration.relative", display:"Adaptive Regeneration", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"B_def", name:"shield.nature", display:"Shield of Nature", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"A_atk", name:"seeds.violent", display:"Violent Seeds", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"D_ult", name:"nature.rejuvenate", display:"Rejuvenate", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"A_atk", name:"attack.bounce.gaia", display:"Gaia's path", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"A_atk", name:"nature.wrath", display:"Nature's wrath", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"A_atk", name:"nature.daybloom", display:"Daybloom", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"A_atk", name:"spell.vines.gigantic", display:"Gigantic vines", location:"Experiment: Nature", dropinfo:"" }, 
    {type:"A_atk", name:"taste.earth", display:"Earth Taste", location:"Experiment: Earth", dropinfo:"" }, 
    {type:"B_def", name:"foundation.steel", display:"Steel Foundation", location:"Experiment: Earth", dropinfo:"" }, 
    {type:"B_def", name:"earth.gravel", display:"Gravel", location:"Experiment: Earth", dropinfo:"" }, 
    {type:"B_def", name:"hull.titanium", display:"Titanium Hull", location:"Experiment: Earth", dropinfo:"" }, 
    {type:"D_ult", name:"earth.avalanche", display:"Avalanche", location:"Experiment: Earth", dropinfo:"" }, 
    {type:"A_atk", name:"spell.earthquake", display:"Earthquake", location:"Experiment: Earth", dropinfo:"" }, 
    {type:"A_atk", name:"taste.electricity", display:"Electricity Taste", location:"Experiment: Electricity", dropinfo:"" }, 
    {type:"A_atk", name:"spell.lightning", display:"Lightning", location:"Experiment: Electricity", dropinfo:"" }, 
    {type:"B_def", name:"defense.overcharge", display:"Overcharge", location:"Experiment: Electricity", dropinfo:"" }, 
    {type:"B_def", name:"shield.transformator", display:"Transformator", location:"Experiment: Electricity", dropinfo:"" }, 
    {type:"B_def", name:"spell.ward.shocking", display:"Shock ward", location:"Experiment: Electricity", dropinfo:"" }, 
    {type:"A_atk", name:"taste.darkness", display:"Darkness Taste", location:"Experiment: Darkness", dropinfo:"" }, 
    {type:"B_def", name:"aura.heartstopper", display:"Heartstopper Aura", location:"Experiment: Darkness", dropinfo:"" }, 
    {type:"B_def", name:"shield.darkness", display:"Shield of Darkness", location:"Experiment: Darkness", dropinfo:"" }, 
    {type:"B_def", name:"aura.unholy", display:"Unholy Aura", location:"Experiment: Darkness", dropinfo:"" }, 
    {type:"A_atk", name:"missile.unholy", display:"Unholy Missile", location:"Experiment: Darkness", dropinfo:"" }, 
    {type:"A_atk", name:"taste.light", display:"Light Taste", location:"Experiment: Light", dropinfo:"" }, 
    {type:"B_def", name:"spell.dispel", display:"Dispel", location:"Experiment: Light", dropinfo:"" }, 
    {type:"B_def", name:"aura.dryness", display:"Dryness Aura", location:"Experiment: Light", dropinfo:"" }, 
    {type:"C_utl", name:"spell.recharge", display:"Recharge", location:"Experiment: Light", dropinfo:"" }, 
    {type:"A_atk", name:"taste.air", display:"Air Taste", location:"Experiment: Air", dropinfo:"" }, 
    {type:"B_def", name:"shield.air", display:"Shield of Air", location:"Experiment: Air", dropinfo:"" }, 
    {type:"A_atk", name:"splash.air", display:"Air Slice", location:"Experiment: Air", dropinfo:"" }, 
    {type:"B_def", name:"evasion.basic", display:"Simple Evasion", location:"Experiment:", dropinfo:"" }, 
    {type:"A_atk", name:"attack.lifesteal", display:"Lifesteal", location:"Experiment:", dropinfo:"" }, 
    {type:"A_atk", name:"attack.impetus", display:"Impetus", location:"Experiment:", dropinfo:"" }, 
    {type:"B_def", name:"defense.reflect", display:"Reflect", location:"Experiment:", dropinfo:"" }, 
    {type:"B_def", name:"defense.defiance", display:"Defiance", location:"Experiment:", dropinfo:"" }, 
    {type:"A_atk", name:"crit.basic", display:"Critical Strike", location:"Experiment:", dropinfo:"" }, 
    {type:"A_atk", name:"attack.universal", display:"Universal Attack", location:"Experiment: Universal", dropinfo:"" }, 
    {type:"A_atk", name:"crit.emergency", display:"Emergency Critical", location:"Experiment: Universal", dropinfo:"" }, 
    {type:"D_ult", name:"shield.universal", display:"Universal Shield", location:"Experiment: Universal", dropinfo:"" }, 
    {type:"B_def", name:"barrier.temporal", display:"Temporal Barrier", location:"Experiment: Universal", dropinfo:"" }, 
    {type:"D_ult", name:"shot.lucky", display:"Lucky Shot", location:"Experiment: Gems", dropinfo:"" }, 
    {type:"B_def", name:"shield.phasing", display:"Phasing", location:"Experiment: Gems", dropinfo:"" }, 
    {type:"D_ult", name:"shield.division", display:"Division Shield", location:"Experiment: Exotic", dropinfo:"" }, 
    {type:"A_atk", name:"attack.deathwish", display:"Death Wish", location:"Arcade: Lucky Wheel", dropinfo:"" }, 
    {type:"A_atk", name:"spell.desperado", display:"Desperado", location:"Arcade: Lucky Wheel", dropinfo:"" }, 
    {type:"B_def", name:"defense.strikeback", display:"Strike Back", location:"Arcade: Lucky Wheel", dropinfo:"" }, 
    {type:"C_utl", name:"energy.recycling", display:"Energy Recycling", location:"Arcade: Lucky Wheel", dropinfo:"" }, 
    {type:"A_atk", name:"spell.redirect", display:"Redirect", location:"Arcade: Lucky Wheel", dropinfo:"" }, 
    {type:"B_def", name:"", display:"Refined Armor", location:"Arcade: Lucky Wheel", dropinfo:"" }, 
    {type:"D_ult", name:"", display:"Power of the Cat", location:"Arcade: Jumble", dropinfo:"" }, 
    {type:"A_atk", name:"", display:"Fracture", location:"Arcade: Jumble", dropinfo:"" }, 
    {type:"C_utl", name:"", display:"Neutral Response", location:"Arcade: Jumble", dropinfo:"" }, 
    {type:"D_ult", name:"", display:"Void", location:"Arcade: Jumble", dropinfo:"" }, 
    {type:"E_spc", name:"", display:"Reboot", location:"Arcade: Jumble", dropinfo:"" }, 
    {type:"E_spc", name:"", display:"Rak's Curse", location:"Arcade: Secret", dropinfo:"" }, 
    {type:"B_def", name:"defense.daigoparry", display:"Daigoparry", location:"Arcade: Secret", dropinfo:"" }, 
    {type:"C_utl", name:"spell.awareness", display:"Awareness", location:"Mine: Second Floor", dropinfo:"" }, 
    {type:"D_ult", name:"spell.radar", display:"Radar", location:"Mine: Second Floor", dropinfo:"" }, 
    {type:"B_def", name:"aura.checkerboard", display:"Checkerboard Aura", location:"Mine: Second Floor", dropinfo:"" }, 
    {type:"B_def", name:"spell.orbs.magical", display:"Magical Orbs", location:"Mine: Second Floor", dropinfo:"" }, 
    {type:"A_atk", name:"attack.bounce.phoenix", display:"Phoenix Bounce", location:"Challenge: 1-1", dropinfo:"" }, 
    {type:"B_def", name:"defense.stabprevention", display:"Stab Prevention", location:"Challenge: 1-3", dropinfo:"" }, 
    {type:"A_atk", name:"strike.planned", display:"Planned Strike", location:"Challenge: 1-4", dropinfo:"" }, 
    {type:"E_spc", name:"tower.universal", display:"Universal", location:"Challenge: 1-5", dropinfo:"" }, 
    {type:"B_def", name:"gift.forest", display:"Forest Gift", location:"Challenge: 1-6", dropinfo:"" }, 
    {type:"C_utl", name:"energy.flow", display:"Energy Flow", location:"Challenge: 2-2", dropinfo:"" }, 
    {type:"A_atk", name:"offensive.headhunting", display:"Headhunting", location:"Challenge: 2-3", dropinfo:"" }, 
    {type:"B_def", name:"spell.advancedheal", display:"Advanced Heal", location:"Challenge: 2-4", dropinfo:"" }, 
    {type:"B_def", name:"spell.sandstorm", display:"Sandstorm", location:"Challenge: 2-5", dropinfo:"" }, 
    {type:"B_def", name:"gift.desert", display:"Desert Gift", location:"Challenge: 2-6", dropinfo:"" }, 
    {type:"B_def", name:"defense.metalplating", display:"Metal Plating", location:"Artifact: Metal Plating", dropinfo:"" }, 
    {type:"A_atk", name:"spell.firebomb", display:"Fire Bomb", location:"Artifact: Incendiary Device", dropinfo:"" }, 
    {type:"D_ult", name:"defense.bulwark", display:"Bulwark", location:"Era Experiment:", dropinfo:"" }, 
    {type:"D_ult", name:"amplifier.neutral", display:"Neutral Amplifier", location:"Era Experiment:", dropinfo:"" }, 
    {type:"B_def", name:"shield.amplifier", display:"Shield Amplifier", location:"Era Experiment:", dropinfo:"" }, 
    {type:"C_utl", name:"xp.bonus", display:"XP Bonus", location:"Era Experiment:", dropinfo:"" }, 
    {type:"C_utl", name:"bonus.pressurize", display:"Pressurize", location:"Era Experiment:", dropinfo:"" }, 
    {type:"B_def", name:"aura.fiery", display:"Fiery Aura", location:"Era Experiment: Fire", dropinfo:"" }, 
    {type:"A_atk", name:"strike.solar", display:"Solar Strike", location:"Era Experiment: Fire", dropinfo:"" }, 
    {type:"A_atk", name:"attack.icebreath", display:"Ice breath", location:"Era Experiment: Water", dropinfo:"" }, 
    {type:"A_atk", name:"splash.frost", display:"Frost Splash", location:"Era Experiment: Water", dropinfo:"" }, 
    {type:"B_def", name:"spell.tideshift", display:"Tideshift", location:"Era Experiment: Water", dropinfo:"" }, 
    {type:"D_ult", name:"defense.stoneskin", display:"Stoneskin", location:"Era Experiment: Earth", dropinfo:"" }, 
    {type:"B_def", name:"shield.advanced", display:"Advanced Shield", location:"Era Experiment: Earth", dropinfo:"" }, 
    {type:"A_atk", name:"spell.shockwave", display:"Shockwave", location:"Era Experiment: Earth", dropinfo:"" }, 
    {type:"D_ult", name:"nature.growth", display:"Growth", location:"Era Experiment: Nature", dropinfo:"" }, 
    {type:"D_ult", name:"nature.photosynthesis", display:"Photosynthesis", location:"Era Experiment: Nature", dropinfo:"" }, 
    {type:"D_ult", name:"stream.life", display:"Stream of Life", location:"Era Experiment: Nature", dropinfo:"" }, 
    {type:"D_ult", name:"defense.conductor", display:"Conductor", location:"Era Experiment: Electricity", dropinfo:"" }, 
    {type:"A_atk", name:"electricity.relay", display:"Relay", location:"Era Experiment: Electricity", dropinfo:"" }, 
    {type:"D_ult", name:"air.hurricane", display:"Hurricane", location:"Era Experiment: Air", dropinfo:"" }, 
    {type:"A_atk", name:"sacrifice.dark", display:"Dark Sacrifice", location:"Era Experiment: Darkness", dropinfo:"" }, 
    {type:"D_ult", name:"shield.immortality", display:"Immortality Shield", location:"Era Experiment: Light", dropinfo:"" }, 
    {type:"C_utl", name:"spell.refresh", display:"Refresh", location:"Era Experiment: Light", dropinfo:"" }, 
    {type:"B_def", name:"protection.magical", display:"Magical Protection", location:"Era Experiment: Light", dropinfo:"" }, 
    {type:"D_ult", name:"impact.gravity", display:"Gravitational Impact", location:"Era Experiment: Universal", dropinfo:"" }, 
    {type:"D_ult", name:"shield.unfolding", display:"Unfolding", location:"Era Experiment: Universal", dropinfo:"" }, 
    {type:"D_ult", name:"multishot.focused", display:"Focused Multishot", location:"Era Experiment: Universal", dropinfo:"" }, 
    {type:"D_ult", name:"tower.super.2", display:"Super Tower 2", location:"Era Experiment: Universal", dropinfo:"" }, 
    {type:"D_ult", name:"dice.fate", display:"Dice of fate", location:"Artifact: Dice of Fate", dropinfo:"" }, 
    {type:"D_ult", name:"tower.super.3", display:"Super Tower 3", location:"Infinity", dropinfo:"" }, 
    {type:"B_def", name:"conversion.power", display:"Power Conversion", location:"Infinity", dropinfo:"" }, 
    {type:"B_def", name:"fading.quantum", display:"Quantum Fading", location:"Infinity", dropinfo:"" }, 
    {type:"D_ult", name:"wall.eternal", display:"Eternal Wall", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"burst.infinity", display:"Infinity Burst", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"infinity.attack.speed", display:"Quantum Speed", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"synergy.storm", display:"Storm Synergy", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"infinity.splash", display:"Infinity Splash", location:"Infinity", dropinfo:"" }, 
    {type:"E_spc", name:"shield.infinity", display:"Infinity Shield", location:"Infinity", dropinfo:"" }, 
    {type:"E_spc", name:"foundation.infinity", display:"Infinity Foundation", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"attack.infinity", display:"Infinity Attack", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"crit.infinity", display:"Infinity Critical", location:"Infinity", dropinfo:"" }, 
    {type:"D_ult", name:"infinity.range", display:"Infinity Range", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"synergy.void", display:"Void Synergy", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"synergy.gaia", display:"Gaia Synergy", location:"Infinity", dropinfo:"" }, 
    {type:"C_utl", name:"bonus.condense", display:"Condense", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"infinity.impetus", display:"Infinity Impetus", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"synergy.sun", display:"Sun Synergy", location:"Infinity", dropinfo:"" }, 
    {type:"B_def", name:"aura.death", display:"Death Aura", location:"Infinity", dropinfo:"" }, 
    {type:"A_atk", name:"infinity.universal", display:"Universal Infinity", location:"Infinity", dropinfo:"" }, 
    {type:"D_ult", name:"missile.serious", display:"Serious Missile", location:"Infinity", dropinfo:"" }, 
    {type:"B_def", name:"defense.quantum", display:"Quantum Defense", location:"Infinity", dropinfo:"" }, 
    {type:"B_def", name:"infinity.reflect", display:"Infinity Reflect", location:"Infinity", dropinfo:"" }, 
    {type:"D_ult", name:"spell.snapOfDestiny", display:"Snap of Destiny", location:"Infinity", dropinfo:"" },
];

// jQuery function that populates the #sortable1 with list items from modarray
let exportarray = [];

$(function() {

    // Import modarr by default

    // Sort modarray by type
    modarray.sort(function(a, b) {
        if (a.type < b.type) {
            return -1;
        }
        if (a.type > b.type) {
            return 1;
        }
        return 0;
    });

    for (var i = 0; i < modarray.length; i++) {
        var mod = modarray[i];
        var modtype = mod.type;
        var modname = mod.name;
        var moddisplay = mod.display;
        moddisplay = moddisplay.toUpperCase();
        var modlocation = mod.location;
        var moddropinfo = mod.dropinfo;
        var modinfo = modlocation + " " + moddropinfo;
        var modlistitem = "<li class='ui-state-default' id='" + modname + "'><div class='li-top " + modtype + "'>" + moddisplay + "</div><div class='li-bot'>" + modinfo + "</div></li>";
        $("#modtable1").append(modlistitem);
    }

    // Get input from #import on paste into textarea
    $("#import").bind("paste", function(e){

        var text = e.originalEvent.clipboardData.getData('text');
        var decoded = atob(text);

        // Split decoded string at ";"
        var split = decoded.split(";");

        // Find match in "modarr", then display: display, location, dropinfo in outputList as new table row
        for (var i = 0; i < split.length; i++) {
            for (var j = 0; j < modarray.length; j++) {
                if (split[i] == modarray[j].name) {
                    var modtype = modarray[j].type;
                    var modname = modarray[j].name;
                    var moddisplay = modarray[j].display;
                    moddisplay = moddisplay.toUpperCase();
                    var modlocation = modarray[j].location;
                    var moddropinfo = modarray[j].dropinfo;
                    var modinfo = modlocation + " " + moddropinfo;
                    var modlistitem = "<li class='ui-state-default' id='" + modname + "'><div class='li-top " + modtype + "'>" + moddisplay + "</div><div class='li-bot'>" + modinfo + "</div></li>";
                    $("#modtable2").append(modlistitem);
                }
            }
        }
    });

    // Drag and drop functionality
    $( "#modtable1, #modtable2" ).sortable({
        placeholder: "ui-state-highlight",
        connectWith: ".connectedSortable",
        cursor: "move",
    }).disableSelection();

    // Export function
    $("#export").click(function() {
        exportarray = [tool_name + ": " + tool_ver];
        $("#modtable2 li").each(function() {
            exportarray.push($(this).attr("id"));
        });
        exportarray = exportarray.join(";");
        $("#export").val(btoa(exportarray));
        $("#export").select();
    });

    $("#import").click(function() {
        $("#import").select();
    });

});