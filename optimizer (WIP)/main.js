const base_charge_dura = 31536000;
const base_charge_req = 1000000000000;

let charge_dura = base_charge_dura;
let speed_bonus = 0.02; //percent
let speed_dura = base_charge_dura;
let production_bonus = 0.05; //percent
let production_dura = base_charge_dura;

let total_ticks = 0;
let total_start_cost = 0;
let total_upg_cost = 0;
let cost_total = 0;

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

let lvl_arr = [];
let cost_arr = [];
let value_arr = [];

let upgrades_array = ["Charge Req","Speed Bonus","Production Bonus","Charge Dura","Speed Dura","Production Dura"];

let result_area = document.getElementById("result_area");

function control_func() {

	// Delete old table so add creation of whole table.

	let th = result_area.createTHead();
	let th_row = th.insertRow(-1);
	let th_cell1 = th_row.insertCell(0);
	let th_cell2 = th_row.insertCell(1);
	let th_cell3 = th_row.insertCell(2);
	let th_cell4 = th_row.insertCell(3);
	let th_cell5 = th_row.insertCell(4);

	th_cell1.innerHTML = "<b>Upgrade</b>";
	th_cell2.innerHTML = "<b>Charge</b>";
	th_cell3.innerHTML = "<b>Cost</b>";
	th_cell4.innerHTML = "<b>Cost total</b>";
	th_cell5.innerHTML = "<b>Upgrades list</b>";

	lvl_arr = [lvl_charge_req,lvl_speed_bonus,lvl_production_bonus,lvl_charge_dura,lvl_speed_dura,lvl_production_dura];

	upgrades_cost();
	total_start_cost = cost_total;
	cost_arr = [];
	optimizer();

}

function optimizer() {

	let loops = lvl_arr.reduce(function(a, b) {
		return a + b;
	}, 0);
	loops = 600 - loops;
	console.log(`Total loops: ${loops}`);
	
	for(x = 0; x < loops; x++) {
		console.log(`Loop ${x+1} start`);
		for(i = 0; i < lvl_arr.length; i++) {
			if(lvl_arr[i] === 100) {
				value_arr.push(9007199254740991);
				cost_arr.push(0)
			} else {
				lvl_arr[i]++;
				upgrades_cost();
				upgrades_data();
				calc();
				lvl_arr[i]--;
			}
		}
		let best_value = value_arr.indexOf(Math.min(...value_arr));
		let row = result_area.insertRow(-1);
		let cell1 = row.insertCell(0);
		let cell2 = row.insertCell(1);
		let cell3 = row.insertCell(2);
		let cell4 = row.insertCell(3);
		let cell5 = row.insertCell(4);

		total_upg_cost += cost_arr[best_value];
		total_start_cost += cost_arr[best_value];
		lvl_arr[best_value] += 1;

		cell1.innerHTML = upgrades_array[best_value];
		cell2.innerHTML = total_ticks.toFixed(4);

		// Add if sci-no enabled else.. 
		cell3.innerHTML = cost_arr[best_value].toExponential(3);
		cell4.innerHTML = total_upg_cost.toExponential(3);

		cell5.innerHTML = lvl_arr.join(" | ");

		value_arr = [];
		cost_arr = [];

		console.log(`Loop ${x+1} end`);
	}
}

function upgrades_cost() {
	
	let cost_upg_1 = 25;
	let cost_upg_2 = 10;
	let cost_upg_3 = 8;
	let cost_upg_4 = 15;
	let cost_upg_5 = 30;
	let cost_upg_6 = 10;
	
	let total_cost_upg_1 = 0;
	let total_cost_upg_2 = 0;
	let total_cost_upg_3 = 0;
	let total_cost_upg_4 = 0;
	let total_cost_upg_5 = 0;
	let total_cost_upg_6 = 0;

	cost_total = 0;

	if (lvl_arr[0] != 0) {
		for (let i = 1; i < lvl_arr[0]; i++) {
			cost_upg_1 = cost_upg_1 * 1.1;
			total_cost_upg_1 += cost_upg_1;
		}
	}
	cost_total += total_cost_upg_1;

	if (lvl_arr[1] != 0) {
		for (let i = 1; i < lvl_arr[1]; i++) {
			cost_upg_2 = cost_upg_2 * 1.22;
			total_cost_upg_2 += cost_upg_2;
		}
	}
	cost_total += total_cost_upg_2;

	if (lvl_arr[2] != 0) {
		for (let i = 1; i < lvl_arr[2]; i++) {
			cost_upg_3 = cost_upg_3 * 1.15;
			total_cost_upg_3 += cost_upg_3;
		}
	}
	cost_total += total_cost_upg_3;

	if (lvl_arr[3] != 0) {
		for (let i = 1; i < lvl_arr[3]; i++) {
			cost_upg_4 = cost_upg_4 * 1.17;
			total_cost_upg_4 += cost_upg_4;
		}
	}
	cost_total += total_cost_upg_4;

	if (lvl_arr[4] != 0) {
		for (let i = 1; i < lvl_arr[4]; i++) {
			cost_upg_5 = cost_upg_5 * 1.22;
			total_cost_upg_5 += cost_upg_5;
		}
	}
	cost_total += total_cost_upg_5;

	if (lvl_arr[5] != 0) {
		for (let i = 1; i < lvl_arr[5]; i++) {
			cost_upg_6 = cost_upg_6 * 1.15;
			total_cost_upg_6 += cost_upg_6;
		}
	}
	cost_total += total_cost_upg_6;
	cost_total -= total_start_cost;

	cost_arr.push(cost_total);
}

function upgrades_data() {
	upg_charge_req = base_charge_req;
	if (lvl_arr[0] != 0) {
		for (let i = 1; i < lvl_arr[0]; i++) {
			upg_charge_req = upg_charge_req - (upg_charge_req * 0.05);
		}
	}

	upg_speed_bonus = speed_bonus;
	if (lvl_arr[1] != 0) {
		for (let i = 1; i < lvl_arr[1]; i++) {
			upg_speed_bonus += 0.01;
		}
	}

	upg_production_bonus = production_bonus;
	if (lvl_arr[2] != 0) {
		for (let i = 1; i < lvl_arr[2]; i++) {
			upg_production_bonus += 0.025;
		}
	}

	let inf_ext_new = base_charge_dura / inf_ext;
	upg_charge_dura = inf_ext_new;
	if (lvl_arr[3] != 0) {
		for (let i = 1; i < lvl_arr[3]; i++) {
			upg_charge_dura = upg_charge_dura - (upg_charge_dura * 0.1);
		}
	}

	let inf_spe_new = base_charge_dura / inf_spe;
	upg_speed_dura = inf_spe_new;
	if (lvl_arr[4] != 0) {
		for (let i = 1; i < lvl_arr[4]; i++) {
			upg_speed_dura = upg_speed_dura - (upg_speed_dura * 0.1);
		}
	}

	let inf_amo_new = base_charge_dura / inf_amo;
	upg_production_dura = inf_amo_new;
	if (lvl_arr[5] != 0) {
		for (let i = 1; i < lvl_arr[5]; i++) {
			upg_production_dura = upg_production_dura - (upg_production_dura * 0.1);
		}
	}
}

function calc() {

	let tick = upg_charge_dura;
	let charge_per_tick = 0;
	let current_charge = 0;
	total_ticks = 0;

	while (current_charge < upg_charge_req) {
		total_ticks += tick;
		let speed_tick = (upg_speed_bonus / upg_speed_dura) * total_ticks;
		let extraction_tick = 0.01 * (upg_production_bonus / upg_production_dura) * total_ticks;
		let extraction_dura = upg_charge_dura / speed_tick;
		charge_per_tick += extraction_tick * (tick / extraction_dura);
		current_charge = charge_per_tick;
		if (current_charge < upg_charge_req / 1000) {
			tick *= 1.01;
		}
	}
	let tick_value = charge_per_tick / upg_charge_req;
	let r = cost_total / tick_value;
	console.log(`${tick_value} | ${cost_total} | ${r}`);
	value_arr.push(r);
	console.log(`${value_arr}`);
}