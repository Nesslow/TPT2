const base_dura = 31536000;
let charge_req = 1000000000000;
let charge_dura = base_dura;
let speed_bonus = 0.02; //percent
let speed_dura = base_dura;
let production_bonus = 0.05; //percent
let production_dura = base_dura;
let inf_ext = 0;
let inf_spe = 0;
let inf_amo = 0;
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
let cost_upg_1 = 0;
let cost_upg_2 = 0;
let cost_upg_3 = 0;
let cost_upg_4 = 0;
let cost_upg_5 = 0;
let cost_upg_6 = 0;
let sci_no = false;

function sci_toggle() {
	if (document.getElementById("sci_no_toggle").checked == true) {
		sci_no = true;
		console.log(`sci_enabled: ${sci_no}`);
		update_data();
	} else if (document.getElementById("sci_no_toggle").checked == false) {
		sci_no = false;
		console.log(`sci_enabled: ${sci_no}`);
		update_data();
	}
}

function update_data() {
	data_1_lvl();
	data_2_lvl();
	data_3_lvl();
	data_4_lvl();
	data_5_lvl();
	data_6_lvl();
}

function set_min() {
	document.getElementById("inf_ext").value = 1;
	document.getElementById("inf_spe").value = 1;
	document.getElementById("inf_amo").value = 1;
	document.getElementById("lvl_charge_req").value = 0;
	document.getElementById("lvl_speed_bonus").value = 0;
	document.getElementById("lvl_production_bonus").value = 0;
	document.getElementById("lvl_charge_dura").value = 0;
	document.getElementById("lvl_speed_dura").value = 0;
	document.getElementById("lvl_production_dura").value = 0;
	update_data();
}

function set_max() {
	document.getElementById("inf_ext").value = 99999999999;
	document.getElementById("inf_spe").value = 99999999999;
	document.getElementById("inf_amo").value = 99999999999;
	document.getElementById("lvl_charge_req").value = 100;
	document.getElementById("lvl_speed_bonus").value = 100;
	document.getElementById("lvl_production_bonus").value = 100;
	document.getElementById("lvl_charge_dura").value = 100;
	document.getElementById("lvl_speed_dura").value = 100;
	document.getElementById("lvl_production_dura").value = 100;
	update_data();
}

function data_1_lvl() {
	lvl_charge_req = document.getElementById("lvl_charge_req").value;
	upg_charge_req = charge_req;
	cost_upg_1 = 25;
	if (lvl_charge_req != 0) {
		for (let i = 0; i < lvl_charge_req; i++) {
			upg_charge_req = upg_charge_req - (upg_charge_req * 0.05);
		}
		if (lvl_charge_req == 100) {
			document.getElementById("cost_1").innerHTML = "Max.";
		} else {
			for (let x = 0; x < lvl_charge_req; x++) {
				cost_upg_1 = cost_upg_1 * 1.1;
				if (cost_upg_1 > 9999 && sci_no == true) {
					document.getElementById("cost_1").innerHTML = cost_upg_1.toExponential(3);
				} else {
					document.getElementById("cost_1").innerHTML = cost_upg_1.toFixed(0);
				}
			}
		}
	} else {
		document.getElementById("cost_1").innerHTML = cost_upg_1.toFixed(0);
	}
	if (upg_charge_req > 9999 && sci_no == true) {
		document.getElementById("data_1").innerHTML = upg_charge_req.toExponential(3);
	} else {
		document.getElementById("data_1").innerHTML = upg_charge_req.toFixed(0);
	}
}

function data_2_lvl() {
	lvl_speed_bonus = document.getElementById("lvl_speed_bonus").value;
	upg_speed_bonus = speed_bonus;
	cost_upg_2 = 10;
	if (lvl_speed_bonus != 0) {
		for (let i = 0; i < lvl_speed_bonus; i++) {
			upg_speed_bonus += 0.01;
		}
		if (lvl_speed_bonus == 100) {
			document.getElementById("cost_2").innerHTML = "Max.";
		} else {
			for (let x = 0; x < lvl_speed_bonus; x++) {
				cost_upg_2 = cost_upg_2 * 1.22;
				if (cost_upg_2 > 9999 && sci_no == true) {
					document.getElementById("cost_2").innerHTML = cost_upg_2.toExponential(3);
				} else {
					document.getElementById("cost_2").innerHTML = cost_upg_2.toFixed(0);
				}
			}
		}
	} else {
		document.getElementById("cost_2").innerHTML = cost_upg_2.toFixed(0);
	}
	document.getElementById("data_4").innerHTML = upg_speed_bonus.toFixed(2);
}

function data_3_lvl() {
	lvl_production_bonus = document.getElementById("lvl_production_bonus").value;
	upg_production_bonus = production_bonus;
	cost_upg_3 = 8;
	if (lvl_production_bonus != 0) {
		for (let i = 0; i < lvl_production_bonus; i++) {
			upg_production_bonus += 0.025;
		}
		if (lvl_production_bonus == 100) {
			document.getElementById("cost_3").innerHTML = "Max.";
		} else {
			for (let x = 0; x < lvl_production_bonus; x++) {
				cost_upg_3 = cost_upg_3 * 1.15;
				if (cost_upg_3 > 9999 && sci_no == true) {
					document.getElementById("cost_3").innerHTML = cost_upg_3.toExponential(3);
				} else {
					document.getElementById("cost_3").innerHTML = cost_upg_3.toFixed(0);
				}
			}
		}
	} else {
		document.getElementById("cost_3").innerHTML = cost_upg_3.toFixed(0);
	}
	document.getElementById("data_6").innerHTML = upg_production_bonus.toFixed(3);
}

function data_4_lvl() {
	lvl_charge_dura = document.getElementById("lvl_charge_dura").value;
	inf_ext = document.getElementById("inf_ext").value;
	cost_upg_4 = 15;
	if (inf_ext == 0) {
		inf_ext = base_dura;
	} else {
		inf_ext = base_dura / inf_ext;
	}
	upg_charge_dura = inf_ext;
	if (lvl_charge_dura != 0) {
		for (let i = 0; i < lvl_charge_dura; i++) {
			upg_charge_dura = upg_charge_dura - (upg_charge_dura * 0.1);
		}
		if (lvl_charge_dura == 100) {
			document.getElementById("cost_4").innerHTML = "Max.";
		} else {
			for (let x = 0; x < lvl_charge_dura; x++) {
				cost_upg_4 = cost_upg_4 * 1.17;
				if (cost_upg_4 > 9999 && sci_no == true) {
					document.getElementById("cost_4").innerHTML = cost_upg_4.toExponential(3);
				} else {
					document.getElementById("cost_4").innerHTML = cost_upg_4.toFixed(0);
				}
			}
		}
	} else {
		document.getElementById("cost_4").innerHTML = cost_upg_4.toFixed(0);
	}
	document.getElementById("data_2").innerHTML = upg_charge_dura.toFixed(4);
}

function data_5_lvl() {
	lvl_speed_dura = document.getElementById("lvl_speed_dura").value;
	inf_spe = document.getElementById("inf_spe").value;
	cost_upg_5 = 30;
	if (inf_spe == 0) {
		inf_spe = base_dura;
	} else {
		inf_spe = base_dura / inf_spe;
	}
	upg_speed_dura = inf_spe;
	if (lvl_speed_dura != 0) {
		for (let i = 0; i < lvl_speed_dura; i++) {
			upg_speed_dura = upg_speed_dura - (upg_speed_dura * 0.1);
		}
		if (lvl_speed_dura == 100) {
			document.getElementById("cost_5").innerHTML = "Max.";
		} else {
			for (let x = 0; x < lvl_speed_dura; x++) {
				cost_upg_5 = cost_upg_5 * 1.22;
				if (cost_upg_5 > 9999 && sci_no == true) {
					document.getElementById("cost_5").innerHTML = cost_upg_5.toExponential(3);
				} else {
					document.getElementById("cost_5").innerHTML = cost_upg_5.toFixed(0);
				}
			}
		}
	} else {
		document.getElementById("cost_5").innerHTML = cost_upg_5.toFixed(0);
	}
	document.getElementById("data_3").innerHTML = upg_speed_dura.toFixed(4);
}

function data_6_lvl() {
	lvl_production_dura = document.getElementById("lvl_production_dura").value;
	inf_amo = document.getElementById("inf_amo").value;
	cost_upg_6 = 10;
	if (inf_amo == 0) {
		inf_amo = base_dura;
	} else {
		inf_amo = base_dura / inf_amo;
	}
	upg_production_dura = inf_amo;
	if (lvl_production_dura != 0) {
		for (let i = 0; i < lvl_production_dura; i++) {
			upg_production_dura = upg_production_dura - (upg_production_dura * 0.1);
		}
		if (lvl_production_dura == 100) {
			document.getElementById("cost_6").innerHTML = "Max.";
		} else {
			for (let x = 0; x < lvl_production_dura; x++) {
				cost_upg_6 = cost_upg_6 * 1.15;
				if (cost_upg_6 > 9999 && sci_no == true) {
					document.getElementById("cost_6").innerHTML = cost_upg_6.toExponential(3);
				} else {
					document.getElementById("cost_6").innerHTML = cost_upg_6.toFixed(0);
				}
			}
		}
	} else {
		document.getElementById("cost_6").innerHTML = cost_upg_6.toFixed(0);
	}
	document.getElementById("data_5").innerHTML = upg_production_dura.toFixed(4);
}

function calc() {
	update_data();
	let levels = [lvl_charge_req, lvl_speed_bonus, lvl_production_bonus, lvl_charge_dura, lvl_speed_dura, lvl_production_dura];
	console.log(`Upgrades: ${levels}`);
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
	if (total_ticks > 3600) {
		hours = Math.floor(total_ticks / 3600);
		total_ticks %= 3600;
		minutes = Math.floor(total_ticks / 60);
		seconds = total_ticks % 60;
		seconds = seconds.toFixed(4);
		total_ticks = hours + "h " + minutes + "m " + seconds + "s";
		document.getElementById("result").innerHTML = total_ticks;
	} else {
		document.getElementById("result").innerHTML = total_ticks.toFixed(4) + "s";
	}
	console.log(`Charged in: ${total_ticks}`);
}