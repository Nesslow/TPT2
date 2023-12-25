function cacheDOM() {

	resArea = document.getElementById("result_area");
	inf_arr.push(document.getElementById("inf_1").valueAsNumber);
	inf_arr.push(document.getElementById("inf_2").valueAsNumber);
	inf_arr.push(document.getElementById("inf_3").valueAsNumber);
	lvl_arr.push(document.getElementById("lvl_upg_1").valueAsNumber);
	lvl_arr.push(document.getElementById("lvl_upg_2").valueAsNumber);
	lvl_arr.push(document.getElementById("lvl_upg_3").valueAsNumber);
	lvl_arr.push(document.getElementById("lvl_upg_4").valueAsNumber);
	lvl_arr.push(document.getElementById("lvl_upg_5").valueAsNumber);
	lvl_arr.push(document.getElementById("lvl_upg_6").valueAsNumber);
}

const baseChargeDura = 31536000;
const baseChargeReq = 1000000000000;

let chargeDura = baseChargeDura;
let speedBonus = 0.02;
let speedDura = baseChargeDura;
let productionBonus = 0.05;
let productionDura = baseChargeDura;

const baseCostUpg1 = 25;
const baseCostUpg2 = 10;
const baseCostUpg3 = 8;
const baseCostUpg4 = 15;
const baseCostUpg5 = 30;
const baseCostUpg6 = 10;

let totalTicks;
let totalCost;
let remCost;

let result_area;
let loops;
let optUpgradeCost;

let inf1;
let inf2;
let inf3;
let lvlUpg1;
let lvlUpg2;
let lvlUpg3;
let lvlUpg4;
let lvlUpg5;
let lvlUpg6;

let inf_arr = [];
let lvl_arr = [];
let cost_arr = [];
let tick_arr = [];
let data_arr = [];
let value_arr = [];

cacheDOM();

function update() {
	inf_arr = [];
	lvl_arr = [];
	cacheDOM();
	updateCost();
	updateData();
}

function updateCost() {
	totalCost = 0;
	upgCost1();
	upgCost2();
	upgCost3();
	upgCost4();
	upgCost5();
	upgCost6();
}

function updateData() {
	upgData1();
	upgData2();
	upgData3();
	upgData4();
	upgData5();
	upgData6();
}

function convertTime(time) {
	if (time > 60) {
		hours = Math.floor(time / 3600);
		time %= 3600;
		minutes = Math.floor(time / 60);
		seconds = time % 60;
		seconds = Math.floor(seconds);
		seconds = seconds.toFixed(0);
		time = hours + "h " + minutes + "m " + seconds + "s";
		return time;
	} else {
		return time.toFixed(4) + "s";
	}
}

function add_100(x) {
	document.getElementById(x).value = 100;
	update();
}

function upg_to_stone(v) {
	let lvl_arr = [];
	lvl_arr = v.split(",");
	console.log(v);
	document.getElementById("lvl_upg_1").value = lvl_arr[0];
	document.getElementById("lvl_upg_2").value = lvl_arr[1];
	document.getElementById("lvl_upg_3").value = lvl_arr[2];
	document.getElementById("lvl_upg_4").value = lvl_arr[3];
	document.getElementById("lvl_upg_5").value = lvl_arr[4];
	document.getElementById("lvl_upg_6").value = lvl_arr[5];

	document.body.scrollTop = 0; // safari support (please swap)
  	document.documentElement.scrollTop = 0;

	calc();
}

function getLoops() {
	loops = lvl_arr.reduce(function(a, b) {
		return a + b;
	}, 0);
	loops = 600 - loops;
}

function upgCost1() {
	let costUpg1 = baseCostUpg1;
	let a = lvl_arr[0];
	totalCost += baseCostUpg1;
	if (a == -1) {
		totalCost -= baseCostUpg1;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			costUpg1 = costUpg1 * 1.1;
			totalCost += costUpg1;
		}
		document.getElementById("cost_upg_1").innerHTML = "Max.";
	} else {
		for (let i = 0; i < a; i++) { 
			costUpg1 = costUpg1 * 1.1;
			totalCost += costUpg1;
		}
		if (costUpg1 > 9999) {
			document.getElementById("cost_upg_1").innerHTML = costUpg1.toExponential(3);
		} else {
			document.getElementById("cost_upg_1").innerHTML = costUpg1.toFixed(0);
		}
	}
	cost_arr.splice(0, 1, costUpg1);
}

function upgCost2() {
	let costUpg2 = baseCostUpg2;
	let a = lvl_arr[1];
	totalCost += baseCostUpg2;
	if (a == -1) {
		totalCost -= baseCostUpg2;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			costUpg2 = costUpg2 * 1.22;
			totalCost += costUpg2;
		}
		document.getElementById("cost_upg_2").innerHTML = "Max.";
	} else {
		for (let i = 0; i < a; i++) { 
			costUpg2 = costUpg2 * 1.22;
			totalCost += costUpg2;
		}
		if (costUpg2 > 9999) {
			document.getElementById("cost_upg_2").innerHTML = costUpg2.toExponential(3);
		} else {
			document.getElementById("cost_upg_2").innerHTML = costUpg2.toFixed(0);
		}
	}
	cost_arr.splice(1, 1, costUpg2);
}

function upgCost3() {
	let costUpg3 = baseCostUpg3;
	let a = lvl_arr[2];
	totalCost += baseCostUpg3;
	if (a == -1) {
		totalCost -= baseCostUpg3;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			costUpg3 = costUpg3 * 1.15;
			totalCost += costUpg3;
		}
		document.getElementById("cost_upg_3").innerHTML = "Max.";
	} else {
		for (let i = 0; i < a; i++) { 
			costUpg3 = costUpg3 * 1.15;
			totalCost += costUpg3;
		}
		if (costUpg3 > 9999) {
			document.getElementById("cost_upg_3").innerHTML = costUpg3.toExponential(3);
		} else {
			document.getElementById("cost_upg_3").innerHTML = costUpg3.toFixed(0);
		}
	}
	cost_arr.splice(2, 1, costUpg3);
}

function upgCost4() {
	let costUpg4 = baseCostUpg4;
	let a = lvl_arr[3];
	totalCost += baseCostUpg4;
	if (a == -1) {
		totalCost -= baseCostUpg4;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			costUpg4 = costUpg4 * 1.17;
			totalCost += costUpg4;
		}
		document.getElementById("cost_upg_4").innerHTML = "Max.";
	} else {
		for (let i = 0; i < a; i++) { 
			costUpg4 = costUpg4 * 1.17;
			totalCost += costUpg4;
		}
		if (costUpg4 > 9999) {
			document.getElementById("cost_upg_4").innerHTML = costUpg4.toExponential(3);
		} else {
			document.getElementById("cost_upg_4").innerHTML = costUpg4.toFixed(0);
		}
	}
	cost_arr.splice(3, 1, costUpg4);
}

function upgCost5() {
	let costUpg5 = baseCostUpg5;
	let a = lvl_arr[4];
	totalCost += baseCostUpg5;
	if (a == -1) {
		totalCost -= baseCostUpg5;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			costUpg5 = costUpg5 * 1.22;
			totalCost += costUpg5;
		}
		document.getElementById("cost_upg_5").innerHTML = "Max.";
	} else {
		for (let i = 0; i < a; i++) { 
			costUpg5 = costUpg5 * 1.22;
			totalCost += costUpg5;
		}
		if (costUpg5 > 9999) {
			document.getElementById("cost_upg_5").innerHTML = costUpg5.toExponential(3);
		} else {
			document.getElementById("cost_upg_5").innerHTML = costUpg5.toFixed(0);
		}
	}
	cost_arr.splice(4, 1, costUpg5);
}

function upgCost6() {
	let costUpg6 = baseCostUpg6;
	let a = lvl_arr[5];
	totalCost += baseCostUpg6;
	if (a == -1) {
		totalCost -= baseCostUpg6;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			costUpg6 = costUpg6 * 1.15;
			totalCost += costUpg6;
		}
		document.getElementById("cost_upg_6").innerHTML = "Max.";
	} else {
		for (let i = 0; i < a; i++) { 
			costUpg6 = costUpg6 * 1.15;
			totalCost += costUpg6;
		}
		if (costUpg6 > 9999) {
			document.getElementById("cost_upg_6").innerHTML = costUpg6.toExponential(3);
		} else {
			document.getElementById("cost_upg_6").innerHTML = costUpg6.toFixed(0);
		}
	}
	cost_arr.splice(5, 1, costUpg6);
}

function upgData1() {
	let upgData1 = baseChargeReq;
	let a = lvl_arr[0];
	if (a == 0) {
		upgData1 = baseChargeReq;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			upgData1 = upgData1 - (upgData1 * 0.05);
		}
	} else {
		for (let i = 0; i < a; i++) { 
			upgData1 = upgData1 - (upgData1 * 0.05);
		}
	}
	document.getElementById("data_upg_1").innerHTML = upgData1.toExponential(3);
	data_arr.splice(0, 1, upgData1);
}

function upgData2() {
	let upgData2 = speedBonus;
	let a = lvl_arr[1];
	if (a == 0) {
		upgData2 = speedBonus;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			upgData2 = upgData2 += 0.01;
		}
	} else {
		for (let i = 0; i < a; i++) { 
			upgData2 = upgData2 += 0.01;
		}
	}
	x = upgData2 * 100;
	document.getElementById("data_upg_2").innerHTML = x.toFixed(0) + "%";
	data_arr.splice(1, 1, upgData2);
}

function upgData3() {
	let upgData3 = productionBonus;
	let a = lvl_arr[2];
	if (a == 0) {
		upgData3 = productionBonus;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			upgData3 = upgData3 += 0.025;
		}
	} else {
		for (let i = 0; i < a; i++) { 
			upgData3 = upgData3 += 0.025;
		}
	}
	x = upgData3 * 100;
	document.getElementById("data_upg_3").innerHTML = x.toFixed(1) + "%";
	data_arr.splice(2, 1, upgData3);
}

function upgData4() {
	if (inf_arr[0] == 0) {
		inf_arr[0] = 1;
	}
	data4inf =  inf_arr[0];
	if (document.getElementById("infx2").checked) {
		data4inf *= 2;
	}
	let upgData4 = baseChargeDura / data4inf;
	let a = lvl_arr[3];
	if (a == 0) {
		upgData4 = baseChargeDura / data4inf;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			upgData4 = upgData4 - (upgData4 * 0.1);
		}
	} else {
		for (let i = 0; i < a; i++) { 
			upgData4 = upgData4 - (upgData4 * 0.1);
		}
	}
	if (upgData4 >= 100) {
		document.getElementById("data_upg_4").innerHTML = upgData4.toFixed(0);
	} else {
		document.getElementById("data_upg_4").innerHTML = upgData4.toFixed(4);
	}
	data_arr.splice(3, 1, upgData4);
}

function upgData5() {
	if (inf_arr[1] == 0) {
		inf_arr[1] = 1;
	}
	data5inf =  inf_arr[1];
	if (document.getElementById("infx2").checked) {
		data5inf *= 2;
	}
	let upgData5 = baseChargeDura / data5inf;
	let a = lvl_arr[4];
	if (a == 0) {
		upgData5 = baseChargeDura / data5inf;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			upgData5 = upgData5 - (upgData5 * 0.1);
		}
	} else {
		for (let i = 0; i < a; i++) { 
			upgData5 = upgData5 - (upgData5 * 0.1);
		}
	}
	if (upgData5 >= 100) {
		document.getElementById("data_upg_5").innerHTML = upgData5.toFixed(0);
	} else {
		document.getElementById("data_upg_5").innerHTML = upgData5.toFixed(4);
	}
	data_arr.splice(4, 1, upgData5);
}

function upgData6() {
	if (inf_arr[2] == 0) {
		inf_arr[2] = 1;
	}
	data6inf =  inf_arr[2];
	if (document.getElementById("infx2").checked) {
		data6inf *= 2;
	}
	let upgData6 = baseChargeDura / data6inf;
	let a = lvl_arr[5];
	if (a == 0) {
		upgData6 = baseChargeDura / data6inf;
	} else if (a >= 100) {
		for (let i = 0; i < 100; i++) { 
			upgData6 = upgData6 - (upgData6 * 0.1);
		}
	} else {
		for (let i = 0; i < a; i++) { 
			upgData6 = upgData6 - (upgData6 * 0.1);
		}
	}
	if (upgData6 >= 100) {
		document.getElementById("data_upg_6").innerHTML = upgData6.toFixed(0);
	} else {
		document.getElementById("data_upg_6").innerHTML = upgData6.toFixed(4);
	}
	data_arr.splice(5, 1, upgData6);
}

function calcData() {
	
	let cReq = data_arr[0];
	let tick = data_arr[3];
	let CPT = 0;
	let cCur = 0;
	totalTicks = 0;

	while (cCur < cReq) {
		totalTicks += tick;
		let speed_tick = (data_arr[1] / data_arr[4]) * totalTicks;
		let extraction_tick = 0.01 * (data_arr[2] / data_arr[5]) * totalTicks;
		let extraction_dura = data_arr[3] / (speed_tick);
		CPT += extraction_tick * (tick / extraction_dura);
		cCur = CPT;
	}
	let tickValue = CPT / cReq;
	let value = totalCost / tickValue;
	tick_arr.push(totalTicks);
	value_arr.push(value);
}

function optimize() {
	getLoops();
	resArea.deleteTHead();

	if (loops != 0) {
		// Generate table header
		let th = resArea.createTHead();
		let thRow = th.insertRow(0);
		let thCell0 = thRow.insertCell(0);
		let thCell1 = thRow.insertCell(1);
		let thCell2 = thRow.insertCell(2);
		let thCell3 = thRow.insertCell(3);
		let thCell4 = thRow.insertCell(4);
		let thCell5 = thRow.insertCell(5);

		thCell0.setAttribute("class", "calc-input-wrap heading w20-input ");
		thCell1.setAttribute("class", "calc-input-wrap heading w20-input");
		thCell2.setAttribute("class", "calc-input-wrap heading w20-input number-container");
		thCell3.setAttribute("class", "calc-input-wrap heading w20-input number-container");
		thCell4.setAttribute("class", "calc-input-wrap heading w20-input number-container");
		thCell5.setAttribute("class", "calc-input-wrap heading w20-input number-container");

		thCell0.innerHTML = "Upgrade name";
		thCell1.innerHTML = "Charge time";
		thCell2.innerHTML = "Upgrade cost";
		thCell3.innerHTML = "Cost total";
		thCell4.innerHTML = "Upgrades list";
		thCell5.innerHTML = "Apply";

		let upgArr = ["Charge Req","Speed Bonus","Production Bonus","Charge Dura","Speed Dura","Production Dura"];
		let upgTotalCost = 0;

		for(let i = 0; i < loops; i++) {
			value_arr = [];
			tick_arr = [];
			for(let x = 0; x < lvl_arr.length; x++) {
				if(lvl_arr[x] == 100) {
					value_arr.push(9007199254740991);
					tick_arr.push(9007199254740991);
					updateCost();
					updateData();
				} else {
					lvl_arr[x]++;
					updateCost();
					updateData();
					calcData();
					lvl_arr[x]--;
				}
			}
			let bestValue = value_arr.indexOf(Math.min(...value_arr));

			// Generate table cells, attach to end
			let row = resArea.insertRow(-1);
			let cell0 = row.insertCell(0);
			let cell1 = row.insertCell(1);
			let cell2 = row.insertCell(2);
			let cell3 = row.insertCell(3);
			let cell4 = row.insertCell(4);
			let cell5 = row.insertCell(5);
			cell0.setAttribute("class", "text bold");
			cell1.setAttribute("class", "text ");
			cell2.setAttribute("class", "text bold number-container");
			cell3.setAttribute("class", "text number-container");
			cell4.setAttribute("class", "text number-container");
			cell5.setAttribute("class", "text number-container upg_btn");

			// Populate table cells
			optUpgradeCost += cost_arr[bestValue];
			lvl_arr[bestValue] += 1;

			cell0.innerHTML = upgArr[bestValue];
			cell1.innerHTML = convertTime(tick_arr[bestValue]);
			if (cost_arr[bestValue] > 9999) {
				cell2.innerHTML = cost_arr[bestValue].toExponential(3);
			} else {
				cell2.innerHTML = cost_arr[bestValue].toFixed(0);
			}
			upgTotalCost += cost_arr[bestValue];
			if (upgTotalCost > 9999) {
				cell3.innerHTML = upgTotalCost.toExponential(3);
			} else {
				cell3.innerHTML = upgTotalCost.toFixed(0);
			}
			cell4.innerHTML = lvl_arr.join(",");
			cell5.innerHTML = "<input type='button' id='upg_btn_"+ i +"' class='calc-button input' value='+' name='"+ lvl_arr +"' onclick='upg_to_stone(this.name)'>";
		}
	}
}

function calc() {

	// Optimize
	update();

	if (document.getElementById("fast_mode").checked == false) {
		optimize();
	}

	// Calculate current
	update();
	calcData();

	document.getElementById("js_result_1").innerHTML = convertTime(totalTicks);

	// Total Cost & Remaining Cost
	for (i = 0; i < lvl_arr.length; i++) {
		lvl_arr[i] -= 1;
	}
	updateCost();

	remCost = Math.round(79361244616.8 - totalCost);
	if (totalCost > 9999) {
		document.getElementById("js_result_3").innerHTML = totalCost.toExponential(3);
	} else {
		document.getElementById("js_result_3").innerHTML = totalCost.toFixed(0);;
	}
	if (remCost > 9999) {
		document.getElementById("js_result_4").innerHTML = remCost.toExponential(3);
	} else {
		document.getElementById("js_result_4").innerHTML = remCost.toFixed(0);
	}

	update();
}

function saveData1() {
	localStorage.setItem('infs1', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls1', JSON.stringify(lvl_arr));
}
function saveData2() {
	localStorage.setItem('infs2', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls2', JSON.stringify(lvl_arr));
}
function saveData3() {
	localStorage.setItem('infs3', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls3', JSON.stringify(lvl_arr));
}
function saveData4() {
	localStorage.setItem('infs4', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls4', JSON.stringify(lvl_arr));
}
function saveData5() {
	localStorage.setItem('infs5', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls5', JSON.stringify(lvl_arr));
}
function saveData6() {
	localStorage.setItem('infs6', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls6', JSON.stringify(lvl_arr));
}
function saveData7() {
	localStorage.setItem('infs7', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls7', JSON.stringify(lvl_arr));
}
function saveData8() {
	localStorage.setItem('infs8', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls8', JSON.stringify(lvl_arr));
}
function saveData9() {
	localStorage.setItem('infs9', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls9', JSON.stringify(lvl_arr));
}
function saveData10() {
	localStorage.setItem('infs10', JSON.stringify(inf_arr));
	localStorage.setItem('upgLvls10', JSON.stringify(lvl_arr));
}

function loadData1() {
	inf_arr = JSON.parse(localStorage.getItem('infs1'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls1'));
	document.getElementById("headStone1").style.color = "#47FFFF";
	document.getElementById("headStone2").style.color = "#47FFFF";
	loadMaster();
}
function loadData2() {
	inf_arr = JSON.parse(localStorage.getItem('infs2'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls2'));
	document.getElementById("headStone1").style.color = "#BA00FF";
	document.getElementById("headStone2").style.color = "#BA00FF";
	loadMaster();
}
function loadData3() {
	inf_arr = JSON.parse(localStorage.getItem('infs3'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls3'));
	document.getElementById("headStone1").style.color = "#CC863E";
	document.getElementById("headStone2").style.color = "#CC863E";
	loadMaster();
}
function loadData4() {
	inf_arr = JSON.parse(localStorage.getItem('infs4'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls4'));
	document.getElementById("headStone1").style.color = "#FFFF00";
	document.getElementById("headStone2").style.color = "#FFFF00";
	loadMaster();
}
function loadData5() {
	inf_arr = JSON.parse(localStorage.getItem('infs5'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls5'));
	document.getElementById("headStone1").style.color = "#FF0000";
	document.getElementById("headStone2").style.color = "#FF0000";
	loadMaster();
}
function loadData6() {
	inf_arr = JSON.parse(localStorage.getItem('infs6'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls6'));
	document.getElementById("headStone1").style.color = "#FFFF9D";
	document.getElementById("headStone2").style.color = "#FFFF9D";
	loadMaster();
}
function loadData7() {
	inf_arr = JSON.parse(localStorage.getItem('infs7'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls7'));
	document.getElementById("headStone1").style.color = "#00FF47";
	document.getElementById("headStone2").style.color = "#00FF47";
	loadMaster();
}
function loadData8() {
	inf_arr = JSON.parse(localStorage.getItem('infs8'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls8'));
	document.getElementById("headStone1").style.color = "#FFFFFF";
	document.getElementById("headStone2").style.color = "#FFFFFF";
	loadMaster();
}
function loadData9() {
	inf_arr = JSON.parse(localStorage.getItem('infs9'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls9'));
	document.getElementById("headStone1").style.color = "#2C2C2C";
	document.getElementById("headStone2").style.color = "#2C2C2C";
	loadMaster();
}
function loadData10() {
	inf_arr = JSON.parse(localStorage.getItem('infs10'));
	lvl_arr = JSON.parse(localStorage.getItem('upgLvls10'));
	document.getElementById("headStone1").style.color = "#0075FF";
	document.getElementById("headStone2").style.color = "#0075FF";
	loadMaster();
}
function loadMaster() {
	document.getElementById("inf_1").value = inf_arr[0];
	document.getElementById("inf_2").value = inf_arr[1];
	document.getElementById("inf_3").value = inf_arr[2];
	document.getElementById("lvl_upg_1").value = lvl_arr[0];
	document.getElementById("lvl_upg_2").value = lvl_arr[1];
	document.getElementById("lvl_upg_3").value = lvl_arr[2];
	document.getElementById("lvl_upg_4").value = lvl_arr[3];
	document.getElementById("lvl_upg_5").value = lvl_arr[4];
	document.getElementById("lvl_upg_6").value = lvl_arr[5];
	calc();
}