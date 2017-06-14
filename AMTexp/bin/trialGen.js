
function eList(){

	this.stim   	=[];   // image id  will be a combo code of setNr*10 + picId (101, 102, 103, ... 180, 201,202,..280, 301, 302,..380)
						   // digit 1-4, 6-9 for the filler task
	this.stimCat    =[];   // 1 = natural, 2 = manmade for Stroop task
						   // use to code swProb 75 or 25 in the filler task (this.swProb)
	this.trialType  =[];   // 1 = incongruent, 0 = congruent in Stroop blocks
						   // 1 = switch, 0 = repetition for the filler task
	this.blockType  =[];   // 1 = HARD/incong, 0 = EASY/cong block, others = 99
						   // 1 = Odd/Even, 2 = High/Low for the filler task (this.task)
						   
						   
	this.miniBlock  =[];   // minblock 1-16 alternating HARD EASY	
	this.memCond    =[];   // 1 = old-congruent, 2 = old-incongruent,  3 = new in memory Blocks [coding for memory trials]
	

	this.response   =[];   // correct response for the Stroop task  1=natural, 2=man-made
						   // correct response for the filler task, see 
	this.catchTrial =[];   // insert some catch trail to test the auditory status 
	this.imgFileName=[];
	
	this.runId		=[];
	this.phase      =[]; // code for 1, 2, 3 [Stroop, Filler, Memory]
	// subject response and RT
	
	this.sbjResp	=[];
	this.sbjACC 	=[];
	this.sbjRT  	=[];	
	}
	

	eList.prototype.getDatabyRunId = function(id){
		var subset = new eList;
		var newi   = -1;
		for (var i = 0; i < this.runId.length; i++){
			if(this.runId[i]==id){
				newi++;
				subset.stim [newi]		=this.stim[i];
				subset.stimCat[newi]	=this.stimCat[i];
				subset.trialType[newi]  =this.trialType[i];
				subset.blockType[newi]  =this.blockType[i];
				
				subset.miniBlock[newi]	=this.miniBlock[i];
				subset.memCond[newi] 	=this.memCond[i];
				subset.response[newi]  	=this.response[i];				
				subset.catchTrial[newi] =this.catchTrial[i];	
				subset.imgFileName[newi]=this.imgFileName[i];
				
				subset.runId[newi]		=this.runId[i];
				subset.phase[newi]		=this.phase[i];
				
				subset.sbjResp[newi]	=this.sbjResp[i];
				subset.sbjACC[newi]	    =this.sbjACC[i];
				subset.sbjRT[newi]	    =this.sbjRT[i];
				
			}
		}
		return subset;
	}
	
	eList.prototype.aggregateData = function(newData){	
		var newset = new eList; 
		newset.stim			= this.stim.concat(newData.stim);
		newset.stimCat 		= this.stimCat.concat(newData.stimCat);
		newset.trialType 	= this.trialType.concat(newData.trialType);
		newset.blockType 	= this.blockType.concat(newData.blockType);
		
		newset.miniBlock   	= this.miniBlock.concat(newData.miniBlock);	
		newset.memCond     	= this.memCond.concat(newData.memCond);
		newset.response    	= this.response.concat(newData.response);
		newset.catchTrial   = this.catchTrial.concat(newData.catchTrial);
		newset.imgFileName	= this.imgFileName.concat(newData.imgFileName);

		newset.runId		= this.runId.concat(newData.runId);
		newset.phase		= this.phase.concat(newData.phase);
		
		newset.sbjResp 		= this.sbjResp.concat(newData.sbjResp);
		newset.sbjACC   	= this.sbjACC.concat(newData.sbjACC);
		newset.sbjRT    	= this.sbjRT.concat(newData.sbjRT);
	
		return newset;
	}
	
	eList.prototype.outputData = function(){
		var output = new Array;
		output = [this.runId, this.phase, this.stim, this.stimCat, this.trialType, this.blockType, this.miniBlock, this.memCond, this.response, this.sbjResp, this.sbjACC, this.sbjRT, this.catchTrial];
		return output;
	}
	
	eList.prototype.getLength = function(){
		return this.stim.length;
	}
	

	eList.prototype.randomizeByRow = function (){
		var newset = new eList;   // creating a new eList to return .. so that you don't MODIFIED link the "newset" with "this"
		var seq 	    = randomizearray(createIncArray(0,1,this.getLength()));
		
		newset.stim			= shuffleBySequence(this.stim,		 seq);
		newset.stimCat      = shuffleBySequence(this.stimCat,    seq);
		newset.trialType 	= shuffleBySequence(this.trialType,  seq);
		newset.blockType 	= shuffleBySequence(this.blockType,  seq);
		
		newset.miniBlock     = shuffleBySequence(this.miniBlock,   seq);
		newset.memCond		= shuffleBySequence(this.memCond,    seq);
		newset.response		= shuffleBySequence(this.response,   seq);
		newset.catchTrial   = shuffleBySequence(this.catchTrial, seq);		
		newset.imgFileName	= shuffleBySequence(this.imgFileName,seq);
		
		newset.runId		= shuffleBySequence(this.runId,      seq);
		newset.phase		= shuffleBySequence(this.phase,      seq);
		
 		return newset;
	}
	
function fillerTrialGen(){
	
	var set1=randomizearray([1,3]);
	var set2=randomizearray([2,4]);
	var set3=randomizearray([6,8]);
	var set4=randomizearray([7,9]);
		
	var swProbList=[80,20,80,20,80,20,80,20];

	var pass = 0;
	var SRMappingCode = opener.getRespCode_filler();	
	//SRMappingCode = [1,2,1,2]; // response for [Odd Even >5  <5] respectively

	var stimSet = set1.concat(set2,set3,set4);
	var trPerStim = 30;
	condLabel = new eList;
		
	for(i=0;i<8;i++){
		// for a given stim = stimSet[i];
		var swProb      = swProbList[i];			
		var NrSwTrials  = trPerStim*(swProb/100);
		var NrRepTrials = trPerStim- NrSwTrials;
		var trialType       = newFilledArray(NrSwTrials,1).concat(newFilledArray(NrRepTrials,0));
		condLabel.stim      = condLabel.stim.concat(newFilledArray(trPerStim,stimSet[i]));
		condLabel.trialType = condLabel.trialType.concat(trialType);
		condLabel.stimCat   = condLabel.stimCat.concat(newFilledArray(trPerStim,swProb));			
	}	
	
	do{
			condLabel       = condLabel.randomizeByRow();			
			var firstTask		= randomizearray([1,2]);				
			var currentTask=firstTask[0];		
			for (i=0;i<condLabel.getLength();i++){
				if (condLabel.trialType[i]==1){ // switch trial
					currentTask = 3-currentTask;			
					condLabel.blockType[i]=currentTask;
				}
				else{ // repeat trial
					condLabel.blockType[i]=currentTask;
				}			
			}
			// see how many trials are task1, and task2
			
			var task1CNT=0;
			for (i=0;i<condLabel.getLength();i++){
				if (condLabel.blockType[i]==1){
					task1CNT=task1CNT+1;				
				}
			}
			// figure out correct responses..
			for (i=0;i<condLabel.getLength();i++){
				if (condLabel.blockType[i]==1){  //odd even
					if(condLabel.stim[i]%2==0){   //even
						condLabel.response[i]=SRMappingCode[1];
					}
					else{
						condLabel.response[i]=SRMappingCode[0];
					}
				}
				else{ // >5 < 5 task
					if(condLabel.stim[i]>5){   //> 5
						condLabel.response[i]=SRMappingCode[2];
					}
					else{   // <5
						condLabel.response[i]=SRMappingCode[3];
					}
				}
			}
			// see how many L vs. R responsestask1CNT=0;
			var resp1CNT=0;
			for (i=0;i<condLabel.getLength();i++){
				if (condLabel.response[i]==1){
					resp1CNT=resp1CNT+1;				
				}
			}		
		var stimByTskCNT=[0,0,0,0,0,0,0,0];
		// make sure each stim appear in task1 and task2 equally...
		for (i=0;i<stimSet.length;i++){
			for(j=0;j<condLabel.getLength();j++){
				if (condLabel.stim[j]==stimSet[i] && condLabel.blockType[j]==1){
					stimByTskCNT[i]=stimByTskCNT[i]+1;					
				}
			}			
		}
		var cnt=0;
		var expVal=condLabel.getLength()/8/2;
		for (i=0;i<stimByTskCNT.length;i++){
			var tt=Math.abs(stimByTskCNT[i]-expVal);
			if(tt<=4){
				cnt=cnt+1;				
			}
		}		
		if (resp1CNT==condLabel.getLength()/2 && task1CNT==condLabel.getLength()/2 && cnt==8){
			pass=1;								
		}
	}// end of do statement...		
	while (pass==0);
	
	condLabel.catchTrial    = newFilledArray(condLabel.getLength(),0);
	condLabel.imageFileName = newFilledArray(condLabel.getLength(),0);
	condLabel.memCond       = newFilledArray(condLabel.getLength(),99);
	condLabel.miniBlock     = newFilledArray(condLabel.getLength(),888);
	
	return condLabel;
}	
	

function trialGen(){
	
	var SRMappingCode = opener.getRespCode_Stroop();//SRMappingCode = [1,2]; response code for natural manmade	
	var imageSet = randomizearray([1,2,3]); // INCset, CONset, NEWset

	
	var INCstim_natural = randomizearray(createIncArray(1,1,40));
	var INCstim_manMade = randomizearray(createIncArray(41,1,40));	
	var CONstim_natural = randomizearray(createIncArray(1,1,40));
	var CONstim_manMade = randomizearray(createIncArray(41,1,40));
	var NEWstim_natural = randomizearray(createIncArray(1,1,40));
	var NEWstim_manMade = randomizearray(createIncArray(41,1,40));
	//
	var condLabel = new eList;
	
	 //tt = Math.round(Math.random()*100)%2;  //somehow was not very randomized for a small batch 
	 var tt = Math.round(Math.random()*100000)%2;

	if (tt==1){ // start with INC
		for (var miniBk=1; miniBk<=16; miniBk++){ 
			if(miniBk%2==1){  //odd blocks, 1,3, etc are mostly - INCONGRUENT
				var temp = new eList;
				temp.stim        = INCstim_natural.splice(0,5).concat(INCstim_manMade.splice(0,5));
				temp.stimCat     = newFilledArray(5,1).concat(newFilledArray(5,2));  // 1 = natural, 2 = man-made
				temp.trialType   = randomizearray([1,1,1,1,0]).concat(randomizearray([1,1,1,1,0]));  // 1= incongruent, 0= congruent
				temp.blockType   = newFilledArray(10,1);      // mostly INCONGRUENT
				temp.miniBlock   = newFilledArray(10,miniBk); // 1-16
				temp.memCond     = [4,4,4,4,3,4,4,4,4,3];    // memory condition: 1-5: MC-C, MC-IC, MIC-C, MIC-IC, NEW
				temp.catchTrial  = newFilledArray(10,0);
				temp.imgFileName = newFilledArray(10,imageSet[0]); //put the set id here for now...			
				temp = temp.randomizeByRow();			
				condLabel= condLabel.aggregateData(temp);
			}
			else{ // even blocks, 2,4, etc are mostly - CONGRUENT
				var temp = new eList;
				temp.stim        = CONstim_natural.splice(0,5).concat(CONstim_manMade.splice(0,5));
				temp.stimCat     = newFilledArray(5,1).concat(newFilledArray(5,2));  // 1 = natural, 2 = man-made
				temp.trialType   = randomizearray([0,0,0,0,1]).concat(randomizearray([0,0,0,0,1]));  // 1= incongruent, 0= congruent
				temp.blockType   = newFilledArray(10,0);      // mostly CONGRUENT
				temp.miniBlock   = newFilledArray(10,miniBk); // 1-16
				temp.memCond     = [1,1,1,1,2,1,1,1,1,2];     // memory condition: 1= old-congruent, 2 = old-incongruent,  3 = new in memory Blocks [coding for memory trials]
				temp.catchTrial  = newFilledArray(10,0);
				temp.imgFileName = newFilledArray(10,imageSet[1]); //put the set id here for now...
				temp = temp.randomizeByRow();			
				condLabel= condLabel.aggregateData(temp);
			}
		}
	}
	else { // start with CON
		for (var miniBk=1; miniBk<=16; miniBk++){ 
			if(miniBk%2==0){  // even blocks: 2,4,etc are mostly - INCONGRUENT
				var temp = new eList;
				temp.stim        = INCstim_natural.splice(0,5).concat(INCstim_manMade.splice(0,5));
				temp.stimCat     = newFilledArray(5,1).concat(newFilledArray(5,2));  // 1 = natural, 2 = man-made
				temp.trialType   = randomizearray([1,1,1,1,0]).concat(randomizearray([1,1,1,1,0]));  // 1= incongruent, 0= congruent
				temp.blockType   = newFilledArray(10,1);      // mostly INCONGRUENT
				temp.miniBlock   = newFilledArray(10,miniBk); // 1-16
				temp.memCond     = [4,4,4,4,3,4,4,4,4,3];    // memory condition: 1-5: MC-C, MC-IC, MIC-C, MIC-IC, NEW
				temp.catchTrial  = newFilledArray(10,0);
				temp.imgFileName = newFilledArray(10,imageSet[0]); //put the set id here for now...			
				temp = temp.randomizeByRow();			
				condLabel= condLabel.aggregateData(temp);	
			}
			else{ // odd blocks, 1,3, etc are mostly - CONGRUENT
				var temp = new eList;
				temp.stim        = CONstim_natural.splice(0,5).concat(CONstim_manMade.splice(0,5));
				temp.stimCat     = newFilledArray(5,1).concat(newFilledArray(5,2));  // 1 = natural, 2 = man-made
				temp.trialType   = randomizearray([0,0,0,0,1]).concat(randomizearray([0,0,0,0,1]));  // 1= incongruent, 0= congruent
				temp.blockType   = newFilledArray(10,0);      // mostly CONGRUENT
				temp.miniBlock   = newFilledArray(10,miniBk); // 1-16
				temp.memCond     = [1,1,1,1,2,1,1,1,1,2];     // memory condition: 1= old-congruent, 2 = old-incongruent,  3 = new in memory Blocks [coding for memory trials]
				temp.catchTrial  = newFilledArray(10,0);
				temp.imgFileName = newFilledArray(10,imageSet[1]); //put the set id here for now...
				temp = temp.randomizeByRow();			
				condLabel= condLabel.aggregateData(temp);
			}
		}		
	}
	for(i=0;i<condLabel.getLength();i++){		
		var setId = condLabel.imgFileName[i];
		condLabel.imgFileName[i] = "images/set" + setId + "/"+ condLabel.stim[i] +".jpg";	
		condLabel.stim[i]  =  setId*100 + condLabel.stim[i];
		condLabel.response[i]    = SRMappingCode[condLabel.stimCat[i]-1];   //// 1 = natural, 2 = man-made -> maps to the code of [0] and [1]		
	}

	var temp = new eList;
	
	temp.stim       = NEWstim_natural.splice(0,40).concat(NEWstim_manMade.splice(0,40));
	temp.stimCat    = newFilledArray(40,1).concat(newFilledArray(40,2));	
	temp.memCond    = newFilledArray(80,5);
	temp.catchTrial = newFilledArray(80,0);
	temp.imgFileName= newFilledArray(80,imageSet[2]);
	temp.response   = newFilledArray(80,0); //new pictures, 
	for(i=0;i<temp.getLength();i++){		
			setId = temp.imgFileName[i];
			temp.imgFileName[i] = "images/set" + setId + "/"+ temp.stim[i] +".jpg";		
			temp.stim[i]  =  setId*100 + temp.stim[i];
	}
	temp= temp.randomizeByRow();
	
	
	var E1 = new eList;
	var E3 = new eList;
	var E21 = new eList;
	var E22 = new eList;	
		
	
	E1 = E1.aggregateData(condLabel);   // use aggregate so that condLabel don't get modified if E1 get modified
	E1.phase = newFilledArray(E1.getLength(),1);
	
	E3 = E3.aggregateData(condLabel);	
	E3.response = newFilledArray(E3.getLength(),1); // old pictures
	
	E3 = E3.aggregateData(temp);	
	E3.trialType = newFilledArray(240,99); // memory trials
	E3.blockType = newFilledArray(240,99); // memory trials
	E3.miniBlock = newFilledArray(240,999); // memory trials		
	E3 = E3.randomizeByRow();
	E3.phase = newFilledArray(E3.getLength(),3);
	
	// filler task.. task switching 
	// add some practice trials first 
	E21 = fillerPracticeTrials();
	E21.phase=[];
	E21.phase = newFilledArray(E21.getLength(),2);
	E22 = fillerTrialGen();
	E22.phase=[];
	E22.phase = newFilledArray(E22.getLength(),2);
	
	// All	
	E1 = E1.aggregateData(E21);
	E1 = E1.aggregateData(E22);
	E1 = E1.aggregateData(E3);
		
	var rr=[];
	for (i=0;i<8;i++){	
		if (i==2){
			rr=rr.concat(newFilledArray(48,i));	 // filler task practice // first 16 trials are repetition, 32 mixed
		}
		else if (i==3|i==4){ // filler tasks
			rr=rr.concat(newFilledArray(30*8/2,i));  // 32 trial per stim 32 x 8 total broken down into 2 blocks
		}
		else{ 
			rr=rr.concat(newFilledArray(80,i));
		}
	}
	E1.runId =[];  // initialized it as empty incase weird concatenation issues..
	E1.runId = rr;
	return E1;		
	
}
	

function practiceTrials(){
	var SRMappingCode = opener.getRespCode_Stroop();//SRMappingCode = [1,2]; response code for natural manmade	
	
	var INCstim_natural = randomizearray([1,2,1,2,1,2,1,2,1,2]);
	var INCstim_manMade = randomizearray([5,6,5,6,5,6,5,6,5,6]);	
	var CONstim_natural = randomizearray([3,4,3,4,3,4,3,4,3,4]);
	var CONstim_manMade = randomizearray([7,8,7,8,7,8,7,8,7,8]);
	var condLabel = new eList;
	for (var miniBk=1; miniBk<=4; miniBk++){ 
		if(miniBk%2==1){  //odd blocks, 1,3, etc are mostly - INCONGRUENT
			var temp = new eList;
			temp.stim        = INCstim_natural.splice(0,5).concat(INCstim_manMade.splice(0,5));
			temp.stimCat     = newFilledArray(5,1).concat(newFilledArray(5,2));  // 1 = natural, 2 = man-made
			temp.trialType   = randomizearray([1,1,1,1,0]).concat(randomizearray([1,1,1,1,0]));  // 1= incongruent, 0= congruent
			temp.blockType   = newFilledArray(10,1);      // mostly INCONGRUENT
			temp.miniBlock   = newFilledArray(10,miniBk); // 1-16
			temp.memCond     = [4,4,4,4,3,4,4,4,4,3];    // memory condition: 1-5: MC-C, MC-IC, MIC-C, MIC-IC, NEW
			temp.catchTrial  = newFilledArray(10,0);
			temp.imgFileName = newFilledArray(10,4); //put the set id here for now...			
			temp = temp.randomizeByRow();			
			condLabel= condLabel.aggregateData(temp);
		}
		else{ // even blocks, 2,4, etc are mostly - CONGRUENT
				var temp = new eList;
				temp.stim        = CONstim_natural.splice(0,5).concat(CONstim_manMade.splice(0,5));
				temp.stimCat     = newFilledArray(5,1).concat(newFilledArray(5,2));  // 1 = natural, 2 = man-made
				temp.trialType   = randomizearray([0,0,0,0,1]).concat(randomizearray([0,0,0,0,1]));  // 1= incongruent, 0= congruent
				temp.blockType   = newFilledArray(10,0);      // mostly CONGRUENT
				temp.miniBlock   = newFilledArray(10,miniBk); // 1-16
				temp.memCond     = [1,1,1,1,2,1,1,1,1,2];     // memory condition: 1= old-congruent, 2 = old-incongruent,  3 = new in memory Blocks [coding for memory trials]
				temp.catchTrial  = newFilledArray(10,0);
				temp.imgFileName = newFilledArray(10,4); //put the set id here for now...
				temp = temp.randomizeByRow();			
				condLabel= condLabel.aggregateData(temp);
		}
	}
	for(i=0;i<condLabel.getLength();i++){		
		var setId = condLabel.imgFileName[i];
		condLabel.imgFileName[i] = "images/set" + setId + "/"+ condLabel.stim[i] +".jpg";	
		condLabel.stim[i]  =  setId*100 + condLabel.stim[i];
		condLabel.response[i]    = SRMappingCode[condLabel.stimCat[i]-1];   //// 1 = natural, 2 = man-made -> maps to the code of [0] and [1]		
	}
	var P = new eList;
	P = P.aggregateData(condLabel);
	P.phase = newFilledArray(P.getLength(),1);
	P.runId = newFilledArray(P.getLength(),0);
	return P;	
}
	
	
	
function fillerPracticeTrials(){
			
		var stimSet = [1,2,3,4,6,7,8,9];
		var SRMappingCode = opener.getRespCode_filler();
		//SRMappingCode = [1,2,1,2]; // response for [Odd Even >5  <5] respectively
		
		var condLabel_ST = new eList;
		
		condLabel_ST.stim = randomizearray(stimSet).concat(randomizearray(stimSet));
		condLabel_ST.trialType = newFilledArray(16,0); // all repeat trials
		condLabel_ST.stimCat   = newFilledArray(16,50); 
		condLabel_ST.blockType = newFilledArray(8,2).concat(newFilledArray(8,1));
		for (i=0;i<condLabel_ST.getLength();i++){
			if (condLabel_ST.blockType[i]==1){  //odd even
				if(condLabel_ST.stim[i]%2==0){   //even
					condLabel_ST.response[i]=SRMappingCode[1];
				}
				else{
					condLabel_ST.response[i]=SRMappingCode[0];
				}
			}
			else{ // >5 < 5 task
				if(condLabel_ST.stim[i]>5){   //> 5
					condLabel_ST.response[i]=SRMappingCode[2];
				}
				else{   // <5
					condLabel_ST.response[i]=SRMappingCode[3];
				}
			}
		}
		condLabel_ST.phase = newFilledArray(condLabel_ST.getLength(),0);
		condLabel_ST.runId = newFilledArray(condLabel_ST.getLength(),0);
		
		
		var trPerStim = 4;
		var condLabel = new eList;		
		
		for(i=0;i<8;i++){
			// for a given stim = stimSet[i];
			var swProb = 50;
			var NrSwTrials  = trPerStim*(swProb/100);
			var NrRepTrials = trPerStim*(1-(swProb/100));
			var trialType   = newFilledArray(NrSwTrials,1).concat(newFilledArray(NrRepTrials,0));
			condLabel.stim       = condLabel.stim.concat(newFilledArray(trPerStim,stimSet[i]));
			condLabel.trialType  = condLabel.trialType.concat(trialType);
			condLabel.stimCat    = condLabel.stimCat.concat(newFilledArray(trPerStim,swProb));			
		}
		
		var pass = 0;
		
		do{
			condLabel       = condLabel.randomizeByRow();		
			// figure the task 
			var firstTask		= randomizearray([1,2]);				
			var currentTask = firstTask[0];		
			for (i=0;i<condLabel.getLength();i++){			
				if (condLabel.trialType[i]==1){ // switch trial
					currentTask=3-currentTask;							
					condLabel.blockType[i]=currentTask;
				}
				else{ // repeat trial
					condLabel.blockType[i]=currentTask;
				}			
			}
			// figure out correct responses..
			for (i=0;i<condLabel.getLength();i++){
				if (condLabel.blockType[i]==1){  //odd even
					if(condLabel.stim[i]%2==0){   //even
						condLabel.response[i]=SRMappingCode[1];
					}
					else{
						condLabel.response[i]=SRMappingCode[0];
					}
				}
				else{ // >5 < 5 task
					if(condLabel.stim[i]>5){   //> 5
						condLabel.response[i]=SRMappingCode[2];
					}
					else{   // <5
						condLabel.response[i]=SRMappingCode[3];
					}
				}
			}
			// see how many trials are task1, and task2			
			var task1CNT=0;
			for (i=0;i<condLabel.getLength();i++){
				if (condLabel.blockType[i]==1){
					task1CNT=task1CNT+1;				
				}
			}
			if (task1CNT==condLabel.getLength()/2){
				pass=1;								
			}
		}
		while(pass==0);
		
		
		var E = new eList;
		E = E.aggregateData(condLabel_ST);
		E = E.aggregateData(condLabel);
		
		
		E.catchTrial    = newFilledArray(E.getLength(),0);
		E.imgFileName   = newFilledArray(E.getLength(),0);
		E.memCond       = newFilledArray(E.getLength(),99);
		E.miniBlock     = newFilledArray(E.getLength(),888);
		
		return E;
		
	}