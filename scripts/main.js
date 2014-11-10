$(function() {
    HangMan.startGame();
});

var HangMan = {

	totalLettersToGuess : 0,
	mistakesCounter : 0,
	wordsData : null,
	currentCategory : null,
	currentTitle : null,
	currentTitleName : null,
	titleWords : null,
	userInput : null,

	
// this fuction starts the game by calling every moethod and var that is necessary for the game to begin
	startGame : function() {
		console.log("start game");
		this.readJsonWordsFile();
		this.totalLettersToGuess = 0;
		this.initDialog();
		this.currentCategory = this.getRandomCategory();
		this.showCategoryName();
		this.currentTitle = this.getRandomTitle();
		this.showTitleDescription();
		this.titleWords = this.splitTitleNameToWords();
		this.splitEachWordToChar();
		this.showLetterPlaceholders();
		this.listenForUserInput();
		$("#userInput").focus(); 
	},

	// restart of the game is done by clearing the containers of lettlers of the previous word; 
// setting the mistakeCounter to zero as well as the counter of the letters guessed and calls the startGame function
	restartGame : function() {
		$("#lettersContainer").html("");
		$(".mistakeImg").hide();
		this.mistakesCounter = 0;
		this.totalLettersToGuess = 0;
		this.startGame();
	},

	readJsonWordsFile : function() {
		// read json with jquery ajax
		if(!this.wordsData){
		    $.ajax({
		        url: 'data/words.json',
		        dataType: "json",
		        async: false
		    }).done(function(result) {
		    	//adding the result json object th Hangman.wordsData
		        HangMan.wordsData = result;
		    });	
		}
	},	
// calls a dialog box which fills with the vars title and body and then restarts the game
	winGame : function() {
		console.log("win game");
		var title = "<h2>Честито!</h2>";
		var body = "<h4>Вие спечелихте играта! Вашата дума беше: </h4>";
		this.fillDialogContent(title, body);
		this.dialogBox.modal("show");

		this.restartGame();
	},
// calls a dialog box which fills with the vars title and body and then restarts the game
	loseGame : function() {
		console.log("lose game");
		var title = "<h2>:(</h2>";
		var body = "<h4>Вие загубихте играта! Вашата дума беше: </h4>";
		this.fillDialogContent(title, body);
		this.dialogBox.modal("show");
		
		this.restartGame();
	},
// function concerning the initial set up of the dialog box
	initDialog : function() {
		this.dialogBox = $('#dialogBox');
		// initial show of the dialog box is set to false
		this.dialogBox.modal({
		  show: false
		});
		// these two functions tell the dialog box twhen to hide
		this.dialogBox.on('hide.bs.modal', function () {
			HangMan.restartGame();
		});
		$('#dialogButton').on('click', function () {
		    HangMan.dialogBox.modal("hide");
		});
	},
// tells the dialog box what to use as title and body
	fillDialogContent : function(titleHtml, bodyHtml) {
		this.dialogBox.find("#dialogTitle").html(titleHtml);
		this.dialogBox.find("#dialogBody").html(bodyHtml);
	},
// gets category in a random manner (there are only two categories but it will work for n cat.)
	getRandomCategory: function(){
		var randomNum = this.getRandomNum(0, this.wordsData.categories.length - 1);
		return this.wordsData.categories[randomNum];
	},
// shows the randomly chosen category name to the user
	showCategoryName : function() {
		$("#categoryName").text(this.currentCategory.name);
	},
// gets a random name from the title object of the current category
	getRandomTitle: function(){
		var randomNum = this.getRandomNum(0, this.currentCategory.titles.length - 1);
		this.currentTitleName = this.currentCategory.titles[randomNum].name;
		return this.currentCategory.titles[randomNum];
	},
// shows the desciption of the name in the current title object
	showTitleDescription : function() {
		$("#description").text(this.currentTitle.description);
	},
// random function which is used to find first - radnom category, and then random title
	getRandomNum : function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
// splits the name into separates words (because the name in the title object could be two or more words)
	splitTitleNameToWords : function() {
		return this.currentTitle.name.split(" ");
	},
// splits the words into characters in arrays
	splitEachWordToChar : function() {
		$.each(HangMan.titleWords, function( index, word ) {
  			HangMan.titleWords[index] = word.split("");
		});
	},
// shows the placeholders for the characters using jQuery to create the placeholders(buttons) in the 
// #lettersContainer. 
	showLetterPlaceholders : function() {

		var lettersContainer = $("#lettersContainer");
		// iterates over the words(because it could be more then one) in the name 
		$.each(HangMan.titleWords, function(index, word) {
			// appends buttons to the #lettersContainer
			var buttonGroup = $('<div class="btn-group">');
			buttonGroup.appendTo(lettersContainer);
			// iterates over each letter of the word 
			$.each(word, function(index, letter) {
				// setting initial value of the placeholder button to "_" and if it is the
				// first letter or the last, it shows the letter instead
				var button = $('<div class="btn btn-primary disabled">');
				var buttonText = "_";
				if(index === 0 || index === (word.length - 1)){
					buttonText = letter;
				}
				button.text(buttonText);
				button.appendTo(buttonGroup);
				// 
				HangMan.totalLettersToGuess++;
			});
			// 
			HangMan.totalLettersToGuess -= 2;

		});
	},

	listenForUserInput : function() {
		$("#submitInput").click(function(){
			HangMan.getUserInput();
			$("#userInput").focus();
		});

		$("#userInput").keypress(function(evt){
			if(evt.which === 13) {
				HangMan.getUserInput();
			}
		});
	},

	getUserInput : function(){
		this.userInput = $.trim($("#userInput").val()).toUpperCase();
		if(this.userInput.length > 1) {
			this.guessWholeWord();
		} else {
			this.checkUserInput();
		}
		
		this.cleanUpInputField();
	},

	cleanUpInputField : function() {
		$("#userInput").val("");
	},

	checkUserInput : function() {
		var matchFound = false;
		var letterIndex = -1;

		$.each(this.titleWords, function(wordIndex, word) {

			do{
				letterIndex = $.inArray(HangMan.userInput, word, letterIndex + 1);
				if(letterIndex > -1) {
					matchFound = true;
					HangMan.totalLettersToGuess--;
					HangMan.revealLetter(wordIndex, letterIndex);
				}
			} while(letterIndex > -1) 

		});

		if(matchFound) {
			this.checkLettersLeft();
		} else {
			this.showMistake();
		}
	},

	checkLettersLeft : function() {
		console.log("letter left " + this.totalLettersToGuess);
		if(this.totalLettersToGuess === 0) {
			this.winGame();
		}
	},

	revealLetter : function(wordIndex, letterIndex) {
		var buttonGroup = $($(".btn-group")[wordIndex]);
		var button = $(buttonGroup.find(".btn")[letterIndex]);
		button.text(this.userInput);
	},

	guessWholeWord : function() {
		if(this.userInput === this.currentTitleName) {
			this.winGame();
		} else {
			this.loseGame();
		}
	},

	showMistake : function() {
		this.mistakesCounter++;
		console.warn("mistake count " + this.mistakesCounter);
		$("#mistake" + this.mistakesCounter).show();

		if(this.mistakesCounter === 5) {
			this.loseGame();
		}	
	},
};

