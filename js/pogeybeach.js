window.onload = function(){
	var workBonus = 7;
	var maxWeeks = 45;
	let questions = $("#questions");
	var fillMultiplier = 0;
	var fillTimer = 5000;
	//var fillEvent;
	let passable = {
		work:0,
		workBonus:workBonus,
		questions:questions,
		maxWeeks:maxWeeks,
		fillEvent:0
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

			if(!passable.fillEvent && passable.fillMultiplier > 0){
				//console.log(passable.fillEvent);
				setIntervalEvent(fillTimer, fillMultiplier, passable);
			}
			$("#multiplier").text(passable.work);
			updateBar(passable.work, maxWeeks);
		}
	});
	$("#autoWork").click(function(){
		fillMultiplier++;
		if(passable.fillEvent){
			//clearInterval(passable.fillEvent);
			clearPassableInterval(passable);
		}
		setIntervalEvent(fillTimer, fillMultiplier, passable);
		console.log((fillTimer/fillMultiplier));
		$("#autoFill").text(fillMultiplier);
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

function setIntervalEvent(fillTimer, fillMultiplier, passable){
	let radios = passable.questions.children(":radio");
	passable.fillEvent = setInterval(function(){
		markNextRadio(radios, passable);
	}, (fillTimer/fillMultiplier));
}

function markNextRadio(radios, passable){
	for(var i = 0; i < radios.length; i++){
		if(!radios[i].checked){
			console.log("Marking Next Radio");
			radios[i].checked = true;

			//fix this crap
			if(checkEntries(radios)){
				calculateEarnings(passable);
			}
			break;
		}
	}
}

function clearPassableInterval(passable){
	clearInterval(passable.fillEvent);
	passable.fillEvent = null;
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
