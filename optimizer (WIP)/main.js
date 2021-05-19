const base_dura = 31536000;
let charge_req = 1000000000000;
let charge_dura = base_dura;
let speed_bonus = 0.02; //percent
let speed_dura = base_dura;
let production_bonus = 0.05; //percent
let production_dura = base_dura;
let inf_ext = 1000000;
let inf_spe = 1000000;
let inf_amo = 1000000;
let lvl_charge_req = 0;
let lvl_speed_bonus = 0;
let lvl_production_bonus = 0;
let lvl_charge_dura = 0;
let lvl_speed_dura = 0;
let lvl_production_dura = 0;
let upg_charge_req;
let upg_speed_bonus;
let upg_production_bonus;
let upg_charge_dura;
let upg_speed_dura;
let upg_production_dura;
let lvl_arr = [];
let chr_arr = [];

function optimize() {

	lvl_arr = [lvl_charge_req,lvl_speed_bonus,lvl_production_bonus,lvl_charge_dura,lvl_speed_dura,lvl_production_dura];
	
	for(x = 0; x < 10; x++) { // 600 loops
		for (i = 0; i < lvl_arr.length; i++) {
			if(lvl_arr[i] != 100) {
				lvl_arr[i]++;

				data_lvl();

				reset();
				lvl_arr[i]--;
			}
		}
		// when getting result. Check up against cost and push THAT value to array
		let x = chr_arr.indexOf(Math.min(...chr_arr));
		lvl_arr[x] += 1;
		chr_arr = [];
		console.log(lvl_arr);
	}
}

function reset() {
	inf_ext = 1000000;
	inf_spe = 1000000;
	inf_amo = 1000000;
}

function data_lvl() {
	if(lvl_arr[0] != 100) {
		upg_charge_req = charge_req;
		if (lvl_arr[0] != 0) {
			for (let i = 0; i < lvl_arr[0]; i++) {
				upg_charge_req = upg_charge_req - (upg_charge_req * 0.05);
			}
		}
	}

	if(lvl_arr[1] != 100) {
		upg_speed_bonus = speed_bonus;
		if (lvl_arr[1] != 0) {
			for (let i = 0; i < lvl_arr[1]; i++) {
				upg_speed_bonus += 0.01;
			}
		}
	}

	if(lvl_arr[2] != 100) {
		upg_production_bonus = production_bonus;
		if (lvl_arr[2] != 0) {
			for (let i = 0; i < lvl_arr[2]; i++) {
				upg_production_bonus += 0.025;
			}
		}
	}
	
	if(lvl_arr[3] != 100) {
		inf_ext = base_dura / inf_ext;
		upg_charge_dura = inf_ext;

		if (lvl_arr[3] != 0) {
			for (let i = 0; i < lvl_arr[3]; i++) {
				upg_charge_dura = upg_charge_dura - (upg_charge_dura * 0.1);
			}
		}
	}

	if(lvl_arr[4] != 100) {
		inf_spe = base_dura / inf_spe;
		upg_speed_dura = inf_spe;

		if (lvl_arr[4] != 0) {
			for (let i = 0; i < lvl_arr[4]; i++) {
				upg_speed_dura = upg_speed_dura - (upg_speed_dura * 0.1);
			}
		}
	}

	if(lvl_arr[0] != 100) {
		inf_amo = base_dura / inf_amo;
		upg_production_dura = inf_amo;

		if (lvl_arr[5] != 0) {
			for (let i = 0; i < lvl_arr[5]; i++) {
				upg_production_dura = upg_production_dura - (upg_production_dura * 0.1);
			}
		}
	}
	// console.log(`Infs: ${inf_ext} | ${inf_spe} | ${inf_amo}`);
	calc();
}

function calc() {

	// console.log(`Levels: ${lvl_arr}`);

	let tick = upg_charge_dura;
	let total_ticks = 0;
	let charge_tick = 0;
	let current_charge = 0;

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
	chr_arr.push(total_ticks);
}