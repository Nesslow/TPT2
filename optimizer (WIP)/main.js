const base_dura = 31536000;
let charge_req = 1000000000000;
let charge_dura = base_dura;
let speed_bonus = 0.02; //percent
let speed_dura = base_dura;
let production_bonus = 0.05; //percent
let production_dura = base_dura;
let total_ticks = 0;
let total_start_cost = 0;
let total_upg_cost = 0;
const inf_ext = 8491398;
const inf_spe = 2016004;
const inf_amo = 10127004;
let lvl_charge_req = 100;
let lvl_speed_bonus = 60;
let lvl_production_bonus = 89;
let lvl_charge_dura = 74;
let lvl_speed_dura = 54;
let lvl_production_dura = 87;
let upg_charge_req;
let upg_speed_bonus;
let upg_production_bonus;
let upg_charge_dura;
let upg_speed_dura;
let upg_production_dura;
let cost_upg_1 = 0;
let cost_upg_2 = 0;
let cost_upg_3 = 0;
let cost_upg_4 = 0;
let cost_upg_5 = 0;
let cost_upg_6 = 0;
let cost_total = 0;
let lvl_arr = [];
let cost_arr = [];

function optimize() {

	let result_area = document.getElementById("result_area");
	upgrades_array = ["Charge Req","Speed Bonus","Production Bonus","Charge Dura","Speed Dura","Production Dura"];
	lvl_arr = [lvl_charge_req,lvl_speed_bonus,lvl_production_bonus,lvl_charge_dura,lvl_speed_dura,lvl_production_dura];

	// Get amount of loops
	let loops = lvl_arr.reduce(function(a, b) {
		return a + b;
	}, 0);
	loops = 600 - loops;
	
	for(x = 0; x < loops; x++) {

		for(i = 0; i < lvl_arr.length; i++) {
			cost_total = 0;
			if(lvl_arr[i] === 100) {
				cost_arr.push(9007199254740991);
			} else {
				lvl_arr[i]++;
				data_lvl();
				calc();
				lvl_arr[i]--;	
			}
		}
		let x = cost_arr.indexOf(Math.min(...cost_arr));
		lvl_arr[x] += 1;
		cost_arr = [];
		let row = result_area.insertRow(-1);
		let cell1 = row.insertCell(0);
		let cell2 = row.insertCell(1);
		let cell3 = row.insertCell(2);
		let cell4 = row.insertCell(3);

		cell1.innerHTML = lvl_arr;
		cell2.innerHTML = upgrades_array[x];
		cell3.innerHTML = total_ticks;
		cell4.innerHTML = cost_total;

		console.log(`${lvl_arr} | [${x+1}] ${upgrades_array[x]}`);
	}
}

function data_lvl() {
	upg_charge_req = charge_req;
	cost_upg_1 = 25;
	if (lvl_arr[0] != 0) {
		for (let i = 1; i < lvl_arr[0]; i++) {
			upg_charge_req = upg_charge_req - (upg_charge_req * 0.05);
			cost_upg_1 = cost_upg_1 * 1.1;
		}
	}
	cost_total += cost_upg_1;

	upg_speed_bonus = speed_bonus;
	cost_upg_2 = 10;
	if (lvl_arr[1] != 0) {
		for (let i = 1; i < lvl_arr[1]; i++) {
			upg_speed_bonus += 0.01;
			cost_upg_2 = cost_upg_2 * 1.22;
		}
	}
	cost_total += cost_upg_2;

	upg_production_bonus = production_bonus;
	cost_upg_3 = 8;
	if (lvl_arr[2] != 0) {
		for (let i = 1; i < lvl_arr[2]; i++) {
			upg_production_bonus += 0.025;
			cost_upg_3 = cost_upg_3 * 1.15;
		}
	}
	cost_total += cost_upg_3;

	let inf_ext_new = base_dura / inf_ext;
	upg_charge_dura = inf_ext_new;
	cost_upg_4 = 15;
	if (lvl_arr[3] != 0) {
		for (let i = 1; i < lvl_arr[3]; i++) {
			upg_charge_dura = upg_charge_dura - (upg_charge_dura * 0.1);
			cost_upg_4 = cost_upg_4 * 1.17;
		}
	}
	cost_total += cost_upg_4;

	let inf_spe_new = base_dura / inf_spe;
	upg_speed_dura = inf_spe_new;
	cost_upg_5 = 30;
	if (lvl_arr[4] != 0) {
		for (let i = 1; i < lvl_arr[4]; i++) {
			upg_speed_dura = upg_speed_dura - (upg_speed_dura * 0.1);
			cost_upg_5 = cost_upg_5 * 1.22;
		}
	}
	cost_total += cost_upg_5;

	let inf_amo_new = base_dura / inf_amo;
	upg_production_dura = inf_amo_new;
	cost_upg_6 = 10;
	if (lvl_arr[5] != 0) {
		for (let i = 1; i < lvl_arr[5]; i++) {
			upg_production_dura = upg_production_dura - (upg_production_dura * 0.1);
			cost_upg_6 = cost_upg_6 * 1.15;
		}
	}
	cost_total += cost_upg_6;
}

function calc() {

	let tick = upg_charge_dura;
	let charge_tick = 0;
	let current_charge = 0;
	total_ticks = 0;

	while (current_charge < upg_charge_req) {
		total_ticks += tick;
		let speed_tick = (upg_speed_bonus / upg_speed_dura) * total_ticks;
		let extraction_tick = 0.01 * (upg_production_bonus / upg_production_dura) * total_ticks;
		let extraction_dura = upg_charge_dura / (speed_tick);
		charge_tick += extraction_tick * (tick / extraction_dura);
		current_charge = charge_tick;
		if (current_charge < upg_charge_req / 1000) {
			tick *= 1.01;
		}
	}
	let tick_value = charge_tick / upg_charge_req;
	let r = cost_total / tick_value;
	cost_arr.push(r);
}