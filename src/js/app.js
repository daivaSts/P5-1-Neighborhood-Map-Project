var $accordeonElem = $("#accordion");
var name, placeInfo;
for (var i = 0; i < loca.resorts.length; i++){


	$accordeonElem.append("<div class='panel panel-warning'><div class='panel-heading'>"+
		"<h4 class='panel-title'><a data-toggle='collapse' data-parent='#accordion' href='#accordion"+i+"'>"+
		"<b>"+loca.resorts[i].placeNickname+"</b></a></h4></div><div id='accordion"+i+"' class='panel-collapse collapse'>"+
		"<div class='panel-body'><ul id='placeInfo"+i+"'></ul></div></div></div>")
	placeInfo = "#placeInfo"+i;
	name = loca.resorts[i].placeNickname;
	loadData(name, placeInfo)
}