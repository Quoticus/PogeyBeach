window.onload = function(){
	var workBonus = 7;
	var maxWeeks = 45;
	let questions = $("#questions");
	//Creating a data object for ease of being passed through functions.
	let passable = {
		work:0,
		workBonus:workBonus,
		questions:questions,
		maxWeeks:maxWeeks,
		fillEvent:0,
		fillTimer:5000,
		fillMultiplier:0
	};

	/**
		Hides/Shows the question field for the nnnYn questions based on if there's "Work"
	*/
	$(document).click(function(){
		if(passable.work <= 0){
			questions.hide();
		} else{
			questions.show();
		}
	});

	/**
		Checks the questions radios when they're clicked.
	*/
	questions.children(":radio").click(function(){
		let radios = questions.children(":radio");
		if(checkEntries(radios)){
			calculateEarnings(passable);
		}
	});

	/**
		Executes when the "Work" button is activated
	*/
	$("#doWork").click(function(){
		if(passable.work < maxWeeks){
			passable.work++;
			if(passable.fillEvent == 0 && passable.fillMultiplier > 0){
				setIntervalEvent(passable);
			}
			$("#multiplier").text(passable.work);
			updateBar(passable.work, maxWeeks);
		}
	});

	/**
		Executes when the "Auto-Work" button is activated
	*/
	$("#autoWork").click(function(){
		passable.fillMultiplier++;
		if(passable.fillEvent){
			clearPassableInterval(passable);
		}
		setIntervalEvent(passable);
		$("#autoFill").text(passable.fillMultiplier);
		updateBar(passable.work, maxWeeks);
	});
}

/**
	Updates the Progress Bar based on currently available values.
*/
function updateBar(work, maxWeeks){
	let bar = $("#bar");
	let progressBar = $("#progressBar");
	$("#progressText").text(((((progressBar.width()+4)/maxWeeks)*work)/2).toFixed(0) + "%");
	bar.css("width", function(){return ((progressBar.width())/maxWeeks)*work;});
}

/**
	Iterates through the input array of radios. Only returns true if all are "Checked".
*/
function checkEntries(radios){
	for(var i = 0; i < radios.length; i++){
		if(!radios[i].checked){
			return false;
		}
	}
	return true;
}

/**
	Creates the interval timer.

	It may be worth changing this to a setTimeout instead, and building in recursion
	in order to make sure the process completes even if the button is used multiple times.
*/
function setIntervalEvent(passable){
	let radios = passable.questions.children(":radio");
	passable.fillEvent = setInterval(function(){
		markNextRadio(radios, passable);
	}, (passable.fillTimer/passable.fillMultiplier));
}

/**
	Timer activated function, marks the next "false" set Radio to "true"
	If all are checked, calls the function to reset the questions.
*/
function markNextRadio(radios, passable){
	for(var i = 0; i < radios.length; i++){
		if(!radios[i].checked){
			radios[i].checked = true;
			//this'll have to be changed to an else of the parent when a CONFIRM button is added
			if(checkEntries(radios)){
				calculateEarnings(passable);
			}
			break;
		}
	}
}

/**
	Clears the currently set Interval, so that a new one can be set.
*/
function clearPassableInterval(passable){
	clearInterval(passable.fillEvent);
	passable.fillEvent = 0;
}

/**
	Resets the questions, and calculates the new earnings values
*/
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
		clearPassableInterval(passable);
	}
}
