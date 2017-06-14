	
$(window).resize(function(){
		window.resizeTo(1024,768);
});
	
$(document).ready(function(){
		
		hideAll();
		$("#indicator").text('Please fill out a quick demographic survey:');
		$("#demographicDone").text('Click after demographic survey')
		$("#warning").text('Initializing, Please wait...It may take up to 1 minute..');		
		$("#endTaskButton").text('Click to finish this part');
		$("#nextBlockButton").text('Click to advance to the next block');
		
		
		snd_natural = new Audio('audio/natural.mp3');
		snd_manMade = new Audio('audio/manmade.mp3');
		
		// for memory task
		reminderFile = ['images/T3_RespMapping0.jpg','images/T3_RespMapping1.jpg'];
		var loadedObjs2 = $({}).imageLoader({
			images: reminderFile,
			async: true,
			allcomplete: function(e, ui) {
			}
		});
		reminder = loadedObjs2.imageLoader('getData');
		
		
		//initExp();  	//  <<<<<<<<<<<<<< UNCOMMENT THIS WHEN RUNNING IN offline mode[2]
		
		
		trial    = -1;
		bkId     = -1;
		
		fixDur   	  =   500;
		stimDur   	  =  1000;
		feedbackDur   =   500;
		memoryProbDur =  2200;
		
		var countdown_sec = 3;  // <<<<<<< or 5 sec
					
		hasResponse    = -1;		
		practiceMode   = opener.getPracticeTag();  // 0 or 1 		

		
		instructionSet  = opener.getInstruction();  // [T11,T21,T22]
		keys2OldNewCode = opener.getVBNM();   //1= NEW, 4 =OLD -> T3_RespMapping0.jpg (v=1, b=2, n=3, m=4)
		
		taskColorSet   = opener.getTaskColor(); 
		
		
		
		/////////////////////////////////////
		$("#hitId").val(opener.getHitId);		
		$("#workerId").val(opener.getWorkerId());
		$("#assignmentId").val(opener.getAssignmentId());
		/////////////////////////////////////
		
		
		if(keys2OldNewCode[0]==4){
			$("#T3RSmapping").html(reminder[1].img);  //-> T3_RespMapping1.jpg (v=4, b=3, n=2, m=1)
		}
		else if(keys2OldNewCode[0]==1){
			$("#T3RSmapping").html(reminder[0].img);  //1= NEW, 4 =OLD -> T3_RespMapping0.jpg (v=1, b=2, n=3, m=4)
		}
				
				
				
		// initialization 
		accuracy=[];
		meanRT=[];
		sbjData = new eList;
		repeatPractice = 0;
		
		
	
		if (practiceMode == 1){			
			E = practiceTrials();
			NrBlocks=1;
			runRuns();			
		}
		else{
			$("#indicator").show();					
			showDemoform();
			$("#demographicDone").show();
		}
		
		
		
		function runRuns() {
			bkId++;
			if (bkId < NrBlocks){
				hideAll();
				hasResponse = -1;				
				bkData = E.getDatabyRunId(bkId);
				bkData.sbjACC    = newFilledArray(bkData.getLength(), 0/0);
				bkData.sbjRT     = newFilledArray(bkData.getLength(), 0/0);
				bkData.sbjResp   = newFilledArray(bkData.getLength(), 0/0);								
				if(bkData.phase[0]==1){  // Stroop Task
					audioType = newFilledArray(bkData.getLength(), 0/0);				
					// create a list of audio file to play				
					for (i=0;i<bkData.getLength();i++){
						if(bkData.trialType[i]==0){ // congruent
							if(bkData.stimCat[i]==1){ // NATURAL category
								audioType[i]=1;  //natural
							}
							else{ // man-made
								audioType[i]=2;							
							}					
						}
						else{ //incongruent
							if(bkData.stimCat[i]==1){ // natural
								audioType[i]=2;
							}
							else{ // man-made
								audioType[i]=1;							
							}						
						}
					}
				}
		
				$("#warning").show();
				if(bkData.phase[0]==2){  
					$("#warning").hide();
					ShowBlockInstruction(bkId);
				}
				else{ // Stroop Task and memory task, load images
					imageFileNames = bkData.imgFileName;				
					var loadedObjs = $({}).imageLoader({
						images: imageFileNames,
						async: true,
						allcomplete: function(e, ui) {
							$("#warning").hide();
							ShowBlockInstruction(bkId);
						}
					});
					imgs = loadedObjs.imageLoader('getData');	
				}
			}
			else{
				hideAll();
				// end exp stuff				
				hasResponse = -1;
				overallAccuracy = parseInt(nanMean(accuracy));
				if (practiceMode == 0){									
					sbjData_output = sbjData.outputData();															
					///////////////////
					$("#RTs").val(sbjData_output.join(","));  // <<<<<<<<<<<<<< [4] for debugging use
					///////////////////
					
					//$("#RTs").show();                         // <<<<<<<<<<<<<< [4] for debugging use					
					$("#RTs", opener.window.document).val(sbjData_output.join(","));
					$("#ACC", opener.window.document).val(overallAccuracy);
					$("#runFeedback").html('End of Experiment. Click the button below to returning to the main menu.');
					$("#runFeedback").show();
					$("#submitButton").show();
					opener.updateMainMenu(4);
				}
				else{ // practice...				
					if (overallAccuracy<80){
						$("#runFeedback").html('You will have to repeat the practice, <br/>and try to obtain accuracy of > 80% <br/>in order to advance to the main task.');				
						$("#runFeedback").css("color","#580000");
						$("#nextBlockButton").text('Repeat Practice');	
						$("#nextBlockButton").show();
						repeatPractice=1;
					}
					else{
						$("#runFeedback").html('End of Practice. Your accuracy was ' + overallAccuracy +' %');
						$("#runFeedback").css("color","#ff0066");
						$("#endTaskButton").text('Click to finish this part');	
						$("#endTaskButton").show();
					}
					$("#runFeedback").show();					
				}
			}
		}
		
		// Show instruction
		function ShowBlockInstruction(bkId){				
			if(bkData.phase[0]==1){
				$("#tsk1").css('color',"#000000");
				$("#tsk1").html(instructionSet[0]);			
				$("#tsk1").show();
				$("#tsk2").show();
			}
			else if(bkData.phase[0]==2){
				$("#tsk3").css('color',"#000000");
				$("#tsk3").html('In this block, you will categorize digits(1-9). <br\> The categorization task is indicated by the color of the digit');
				$("#tsk1").css('color',taskColorSet[0]);
				$("#tsk1").html('<br\>' +instructionSet[1]);
				$("#tsk2").css('color',taskColorSet[1]);
				$("#tsk2").html(instructionSet[2]);					
				$("#tsk1").show();
				$("#tsk2").show();			
				$("#tsk3").show();			
			}
			else if(bkData.phase[0]==3){
				$("#tsk1").css('color',"#000000");
				$("#tsk1").html('In this block, you will judge whether you have seen this image before (in this experiment) or not.');
				$("#tsk2").css('color',"#000000");
				$("#tsk2").html('This response mapping will stay on the screen.');
				$("#tsk1").show();
				$("#tsk2").show();
				$("#T3RSmapping").show();
			}			
			if (practiceMode == 1){
				$("#startExpButton").text("Start the practice");
			}
			else if(practiceMode == 0){				
				$("#startExpButton").text("Start block # " + (bkId+1) + " of " + NrBlocks + " blocks");
			}
			$("#startExpButton").show();
		}		
		
		
		// when user finished the demographic survey
		$("#demographicDone").click(function(){
			tt = document.getElementById('age').value;
			
			E = trialGen();
			NrBlocks = E.runId[E.getLength()-1]+1;  //max taskId +1.. 
			runRuns();							
		});
		
		
		
		
		
		// when user click the startExp button
		$("#startExpButton").click(function(){
			$("#startExpButton").hide();
			CountDown(countdown_sec);
		});
		
		function CountDown(t_sec) {
			if (t_sec > 0){
				hideAll();	
				$("#indicator").text(t_sec);
				$("#indicator").css('color','#000000');
				$("#indicator").show();
				setTimeout(function(){CountDown(t_sec-1)},1000);
			}
			else if(t_sec <= 0){
				$("#indicator").hide();
				trial=-1;
				setTimeout(runTrials,1000);
				currentMiniBk = 99;
			}
		}
		$("#T3RSmapping").hide();
		// hide all buttons and form, text, etc
		function hideAll(){
			//text
			$("#warning").hide();		
			$("#tsk1").hide();		
			$("#tsk2").hide();
			$("#tsk3").hide();
			$("#indicator").hide();	
			$("#miniBkInstruction").hide();
			$("#stimulus").hide();	
			$("#runFeedback").hide();
			
			
			//action buttons
			$("#endTaskButton").hide();
			$("#nextBlockButton").hide();
			$("#startExpButton").hide();
			$("#demographicDone").hide();
			
			// other form stuff			
			$("EgnerServer_form").hide();
			$("#submitButton").hide();		
			// demographic information
			$("#age").hide();	
			$("#gender").hide();											
			$("#ethnicity").hide();			
			$("#race").hide();			
			$("#demo1").hide();	
			$("#demo2").hide();	
			$("#demo3").hide();	
			$("#demo4").hide();				

		}
		function showDemoform(){
			// form stuff		
			$("#age").show();			
			$("#gender").show();			
			$("#ethnicity").show();		
			$("#race").show();		
			$("#demo1").show();		
			$("#demo2").show();	
			$("#demo3").show();	
			$("#demo4").show();				
		}

		
		
		
		$("#nextBlockButton").click(function(){
			hideAll();
			$("#nextBlockButton").hide();
			if(repeatPractice==1){
				E = practiceTrials();
				NrBlocks=1;
				repeatPractice=0;
				bkId     = -1;
				accuracy=[];
				meanRT=[];				
			}
			runRuns();
		});

		function clearIns(){
			$("#miniBkInstruction").hide();
			$("#stimulus").html(imgs[trial].img);				
			$("#stimulus").show();
			hasResponse = 0;  // start collecting responses..
			StimOnset = new Date();
			if(audioType[trial]==1){
				snd_natural.play();											
			}
			else{
				snd_manMade.play();
			}
			timeOutHandle = setTimeout(showFeedback, stimDur);	
		}
		
		function runTrials() {
			trial=trial+1;
			hideAll();
			
			//////////////////////////////
			
			NrTrials = bkData.getLength(); 		
			
			//////////////////////////////

			if(trial < NrTrials){                          //  <<<<<<<<<<<<<<   [3]				
			
				if(bkData.phase[trial]==1){  // stroop task min-block 1-16, need block instruction				
					if(bkData.miniBlock[trial]!=currentMiniBk){  
						currentMiniBk = bkData.miniBlock[trial];
						// Block instruction EASY vs. HARD every first trial in the mini block						
						if(bkData.blockType[trial]==1){ // HARD
							$("#miniBkInstruction").text("HARD");
						}
						else if (bkData.blockType[trial]==0){
							$("#miniBkInstruction").text("EASY");
						}				
						$("#miniBkInstruction").show();
						setTimeout(clearIns, 2000);
					}  // all other trials in the mini block
					else{
						$("#stimulus").html(imgs[trial].img);
						$("#stimulus").show();	
						StimOnset = new Date();										
						hasResponse = 0;  // start collecting responses..
						if(audioType[trial]==1){
							snd_natural.play();											
						}
						else{
							snd_manMade.play();
						}
						timeOutHandle = setTimeout(showFeedback, stimDur);	
					}				
				}
				else if (bkData.phase[trial]==2){                  // filler  task 
				    //////////// TASK COLOR //////////////////
					if (bkData.blockType[trial]==1){  // coding for task, 1 = Odd/even, 2 = high/low
						textColor = taskColorSet[0]; 
					}
					else{
						textColor = taskColorSet[1];
					}				
					$("#stimulus").css('color',textColor);	
					$("#stimulus").css('font-size',"50px");	
					$("#stimulus").text(bkData.stim[trial]);
					$("#stimulus").show();						
					StimOnset = new Date();										
					hasResponse = 0; 
					timeOutHandle = setTimeout(showFeedback, stimDur);				
				}
				else if (bkData.miniBlock[trial]==999){                  // memory task
					$("#stimulus").html(imgs[trial].img);
					$("#stimulus").show();	
					$("#T3RSmapping").show();
					StimOnset = new Date();
					hasResponse = 0;  // start collecting responses..
					timeOutHandle = setTimeout(showFeedback, memoryProbDur);
				}
			}
			else{  
				// Now it's lastTrial +1...so .. need to minus ONE to find out the block type
				
				$("#T3RSmapping").hide();			
				sbjData = sbjData.aggregateData(bkData);									
				accuracy[bkId] = parseInt(nanMean(bkData.sbjACC)*100);
				meanRT[bkId]   = parseInt(nanMean(bkData.sbjRT));					
				if (accuracy[bkId]>=85){
					runFB='Your accuracy was ' + accuracy[bkId] + '%.<br/>Your RT was ' + meanRT[bkId] + ' ms.<br/>\
					Good job!';
				}
				else{
					runFB='Your accuracy was ' + accuracy[bkId] + '%.<br/>Your RT was ' + meanRT[bkId] + ' ms.<br/>\
					Try to be more accurate (>85%)!';
				}
				$("#indicator").html(runFB);
				
				if(bkData.miniBlock[trial-1]!=999){
					$("#indicator").show();					
				}
				else{
					$("#indicator").html('Good job');					
					$("#indicator").show();					
				}
				
				$("#nextBlockButton").text('Click to advance');
				$("#nextBlockButton").show();  
			}
		}

		
		
		function showFeedback(){
			hideAll();
			bkData.sbjACC[trial]=0;
			if (hasResponse == 0){   // no response registered so far..
				hasResponse = -1;    // disable response checking...
				bkData.sbjResp[trial]=99; // subject failed to make a response in time...
			}
			
			// calculate accuracy
			if (bkData.phase[trial]<=2){
				if (bkData.response[trial] == bkData.sbjResp[trial]) {  
					bkData.sbjACC[trial]=1;  // else default =0/0
					$("#indicator").text('Correct');					
				}
				else{
					$("#indicator").text('Incorrect');					
				}
			}
			
			if (bkData.sbjResp[trial] ==888){
				$("#indicator").html('You have pressed an incorrect key.');
			}
			if (bkData.sbjResp[trial] ==99){
				$("#indicator").html('No response');
			}
			
			if(practiceMode==1){   // feedback only for the practice				
				$("#indicator").show();
			}
			else{ // Main task
				if (bkData.phase[trial]==2){  // filler task.. show feedback in case people are still learning
					$("#indicator").show();
				}
				else{   // no feedback for Main task's phase 1 and 3
					$("#indicator").text('+');
					$("#indicator").show();
				}
			}
			timeOutHandle = setTimeout(showFixation, feedbackDur);
		}

		
		
		function showFixation(){
			hasResponse = -1; // don't check for response
			hideAll();
			$("#indicator").text('+');
			$("#indicator").css('color','#000000');
			$("#indicator").show();
			timeOutHandle = setTimeout(runTrials, fixDur);
		}
		
		
		$("body").keypress(function(event){
		    if (hasResponse == 0) {  //make sure the keypress was detected during legitimate window, e.g. from face onset to end of blank
			    hasResponse = 1;
 		        d2 = new Date();
				keyPressed   = String.fromCharCode(event.which);
				bkData.sbjResp[trial]  = 888; // initialize as invalid keys				
				bkData.sbjRT[trial]    = d2-StimOnset.getTime();
								
				if(bkData.phase[trial]<=2){					// Stroop Task, filler task
					if (keyPressed == 'g'||keyPressed == 'G'){
						bkData.sbjResp[trial] = 1;
					}
					else if (keyPressed == 'j'||keyPressed == 'J'){
						bkData.sbjResp[trial] = 2;
					}
				}
				else if(bkData.phase[trial]==3){   		// Memory task
					if(keyPressed == 'v'||keyPressed == 'V'){ 
						bkData.sbjResp[trial] =keys2OldNewCode[0];
					}
					else if(keyPressed == 'b'||keyPressed == 'B'){
						bkData.sbjResp[trial] =keys2OldNewCode[1];
					}
					else if(keyPressed == 'n'||keyPressed == 'N'){
						bkData.sbjResp[trial] =keys2OldNewCode[2];
					}
					else if(keyPressed == 'm'||keyPressed == 'M'){
						bkData.sbjResp[trial] =keys2OldNewCode[3];
					}					
				}
				// hideAll(); // should the image disapper once a response is made???		if not.. take out this line...							
				// nothing after response is detected... so the trial length is fixed
			}
		});
		
		
		
		$("#endTaskButton").click(function(){
			if (practiceMode == 0){				
				opener.updateMainMenu(4);   // 4 starts the demographic
			}
			else{
				opener.updateMainMenu(3);  // 3 starts the main task
			}
			JavaScript:window.close();
		});


		function gup( name, tmpURL ){
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec( tmpURL );
			if( results == null ){
				return "";
			}
			else{
				return results[1];
			}
		}
		
		
		// NEED TO FIND OUT WHAT THIS IS FOR>>>>>>>>>>>>>>>>>>>>>>>
		function initExp() {
		    var flag = true;			
			$("#indicator").html("Please do not copy & paste this link to your web browser.<br>In order to do this task properly,<br>close this page and restart by clicking the link on MTurk.");			
			if (typeof window.opener != 'undefined') {
			    var aId = gup('assignmentId', window.opener.document.referrer);					    
			    if (aId == "ASSIGNMENT_ID_NOT_AVAILABLE" || aId == "") {
				    flag = false;
				} else {
				    flag = true;
				}
			} else {
			    flag = false;
			}
			if (flag) {
			    $("#indicator").text("Ready?");
			} else {
				$("#indicator").html("Please do not copy & paste this link to your web browser.<br>In order to do this task properly,<br>close this page and restart by clicking the link on MTurk.");			
			}
		} 
		
		
		//Function To stop backspace presses 8, and spaces 32 
		$(function(){
		/*
		 * this swallows backspace keys on any non-input element.
		 * stops backspace -> back
		 */
			var rx = /INPUT|SELECT|TEXTAREA/i;
			$(document).bind("keydown keypress", function(e){
				if( e.which == 32 ||e.which == 8 ){ // 8 == backspace
					if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
						e.preventDefault();
					}
				}
			});
		});
		
		

		
});