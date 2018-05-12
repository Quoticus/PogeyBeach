window.onload = function(){
	let work = 0;
	let workBonus = 7;
	let maxWeeks = 45;
	let questions = $("#questions");
	$(document).click(function(){
		if(work <= 0){
			questions.hide();
		} else{
			questions.show();
		}
	});
	questions.children(":radio").click(function(){
		let radios = questions.children(":radio");
		if(checkEntries(radios)){
			let currentMon = parseInt($("#myProgress").text());
			currentMon += 400 + (work * workBonus);
			
			$("#myProgress").text(currentMon);
			questions[0].reset();
			work--;
			$("#multiplier").text(work);
			updateBar(work, maxWeeks);
		}
	});
	$("#doWork").click(function(){
		if(work < maxWeeks){
			work++;
			$("#multiplier").text(work);
			updateBar(work, maxWeeks);
		}
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