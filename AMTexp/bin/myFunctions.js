function basicPopup(url) {
	popupWindow = window.open(url,'popUpWindow','height=' + screen.height + ',width=' +screen.width+',\
				left=0,top=0,resizable=0,scrollbars=yes,toolbar=no,\
				menubar=no,location=no,directories=no,status=yes');
}
			
function gup( name, tmpURL ){
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( tmpURL );
	if( results == null ){
		return ""
	}
	else{
		return results[1];
	}
}



function randomizearray(t){
    var tt= t;
    var n = 0;
    var a = "";
    var b = "";
    var i = 0;
    for (i=0; i <= t.length-1; i++){
        n = Math.floor(Math.random()*t.length);
        a = tt[i];
        b = tt[n];
        tt[i] = b;
        tt[n] = a;    
    }
    return tt;
}

function newFilledArray(len, val) {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv;
}

function createIncArray(startingVal,increment,howManyElement){
		
	var IncArray = new Array();
	var value = startingVal;
	var inc = increment;
	var cnt=0;
	var setsize = howManyElement;
	
	while (cnt < setsize){		
		IncArray[cnt] = value;
		value=value + inc;
		cnt = cnt+1;
	}
	return IncArray;

 }
 
 
 function nanMean(dataArray){
 
	var cnt=0;
	var sum=0;
	for (var i = 0; i < dataArray.length; i++){
		//if (!Number.isNaN(dataArray[i])){  // this doesn't work for IE
		if (!isNaN(dataArray[i])){
			sum=sum + dataArray[i];
			cnt=cnt+1;
		}	
	}
	var arrayMean = sum/cnt;
	return arrayMean;

 } 
 
 
 function nanMedian(dataArray) {
	var values=[];
	for (var i = 0; i < dataArray.length; i++){
		if (!isNaN(dataArray[i])){
		values=values.concat(dataArray[i]);
		}
	} 
 
	values.sort( function(a,b) {return a - b;});
 
	var half = Math.floor(values.length/2);
 
	if(values.length % 2)
	return values[half];
	else
	return (values[half-1] + values[half]) / 2.0;
}

	
function shuffleBySequence(dataArray,sequence){
	var shuffledArray = new Array();
	for (var i = 0; i < sequence.length; i++){
		shuffledArray[i] = dataArray[sequence[i]];
	}
	return shuffledArray;
}


function createRunId(totalTrials,NrRuns){
	var runIdList=[];
	for (var i = 0; i < NrRuns; i++){
		runIdList=runIdList.concat(newFilledArray(totalTrials/NrRuns, i));	
	}
	return runIdList;
}
 
 