window.onload = function(){
	var workBonus = 7;
	var maxWeeks = 45;
	let questions = $("#questions");
	//var fillMultiplier = 0;
	//var fillTimer = 5000;
	//var fillEvent;
	let passable = {
		work:0,
		workBonus:workBonus,
		questions:questions,
		maxWeeks:maxWeeks,
		fillEvent:0,
		fillTimer:5000,
		fillMultiplier:0
	};

	$(document).click(function(){
		if(passable.work <= 0){
			questions.hide();
		} else{
			questions.show();
		}
	});
	questions.children(":radio").click(function(){
		let radios = questions.children(":radio");
		if(checkEntries(radios)){
			let currentMon = parseInt($("#myProgress").text());
			currentMon += 400 + (passable.work * workBonus);
			$("#myProgress").text(currentMon);
			questions[0].reset();
			passable.work--;
			$("#multiplier").text(passable.work);
			updateBar(passable.work, maxWeeks);
		}
	});
	$("#doWork").click(function(){
		if(passable.work < maxWeeks){
			passable.work++;
			//console.log(passable.fillEvent);
			//console.log(passable.fillMultiplier);

			if(passable.fillEvent == 0 && passable.fillMultiplier > 0){
				//console.log(passable.fillEvent);
				//console.log(passable.fillMultiplier);
				setIntervalEvent(passable);
			}
			$("#multiplier").text(passable.work);
			updateBar(passable.work, maxWeeks);
		}
	});
	$("#autoWork").click(function(){
		passable.fillMultiplier++;
		if(passable.fillEvent){
			//clearInterval(passable.fillEvent);
			clearPassableInterval(passable);
		}
		setIntervalEvent(passable);
		console.log((passable.fillTimer/passable.fillMultiplier));
		$("#autoFill").text(passable.fillMultiplier);
		updateBar(passable.work, maxWeeks);
	});
}

function updateBar(work, maxWeeks){
	let bar = $("#bar");
	let progressBar = $("#progressBar");
	$("#progressText").text(((((progressBar.width()+4)/maxWeeks)*work)/2).toFixed(0) + "%");
	bar.css("width", function(){return ((progressBar.width())/maxWeeks)*work;});
}

function checkEntries(radios){
	for(var i = 0; i < radios.length; i++){
		if(!radios[i].checked){
			return false;
		}
	}
	return true;
}

function setIntervalEvent(passable){
	let radios = passable.questions.children(":radio");
	passable.fillEvent = setInterval(function(){
		markNextRadio(radios, passable);
	}, (passable.fillTimer/passable.fillMultiplier));
}

function markNextRadio(radios, passable){
	for(var i = 0; i < radios.length; i++){
		if(!radios[i].checked){
			console.log("Marking Next Radio");
			radios[i].checked = true;

			//this'll have to be changed to an else of the parent when a CONFIRM button is added
			if(checkEntries(radios)){
				calculateEarnings(passable);
			}
			break;
		}
	}
}

function clearPassableInterval(passable){
	clearInterval(passable.fillEvent);
	passable.fillEvent = 0;
}

function calculateEarnings(passable){
	let currentMon = parseInt($("#myProgress").text());
	currentMon += 400 + (passable.work * passable.workBonus);
	$("#myProgress").text(currentMon);
	passable.questions[0].reset();
	passable.work--;
	$("#multiplier").text(passable.work);
	updateBar(passable.work, passable.maxWeeks);
	if(passable.work <= 0){
		passable.questions.hide();
		//clearInterval(passable.fillEvent);
		clearPassableInterval(passable);
	}
}
