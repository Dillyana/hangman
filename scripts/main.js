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

	readJsonWordsFile : function() {
		// read json with jquery ajax
		if(!this.wordsData){
		    $.ajax({
		        url: "data/words.json",
		        dataType: "json",
		        async: false
		    }).done(function(result) {
		    	//adding the result json object th Hangman.wordsData
		        HangMan.wordsData = result;
		    });	
		}
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
		this.dialogBox = $("#dialogBox");
		// initial show of the dialog box is set to false
		this.dialogBox.modal({
		  show: false
		});
		// these two functions tell the dialog box twhen to hide
		this.dialogBox.on("hide.bs.modal", function () {
			HangMan.restartGame();
		});
		$("#dialogButton").on("click", function () {
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
				// keeps count of every letter that we iterate so to know how many letter we have to guess 
				// to win 
				HangMan.totalLettersToGuess++;
			});
			// extracts 2 letters since we have initially provided the first and the last(two letters)
			HangMan.totalLettersToGuess -= 2;

		});
	},
// listener function that watches for either the event of pressing the Enter key or the button submitInput,
// and focuses back to the input field 
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
// gets the input of the user and strips it of any spaces and converts them to upper case letters
// and then checks of the input is longer than 1 letter, if it is, checks guessWholeWord()
// else checks checkUserInput(); then clears the input field
	getUserInput : function(){
		this.userInput = $.trim($("#userInput").val()).toUpperCase();
		if(this.userInput.length > 1) {
			this.guessWholeWord();
		} else {
			this.checkUserInput();
		}
		
		this.cleanUpInputField();
	},
// function that takes care of clearing up the input field by setting the value to empty string
	cleanUpInputField : function() {
		$("#userInput").val("");
	},

	checkUserInput : function() {
		var matchFound = false;
		var letterIndex = 0;

		$.each(this.titleWords, function(wordIndex, word) {
			// checks at least once the user input in the array of letters, starting from the second
			do{
				letterIndex = $.inArray(HangMan.userInput, word, letterIndex + 1);
				if(letterIndex > 0) {
					matchFound = true;
					HangMan.totalLettersToGuess--;
					HangMan.revealLetter(wordIndex, letterIndex);
				}
			} while(letterIndex > 0) 
		});
		// if a match is found, checks how many letters to guess are left, else shows mistake
		if(matchFound === true) {
			this.checkLettersLeft();
		} else {
			this.showMistake();
		}
	},
// checks how many letters to guess are left, if the value is equal to 0, than we have win game
	checkLettersLeft : function() {
		console.log("letter left " + this.totalLettersToGuess);
		if(this.totalLettersToGuess === 0) {
			this.winGame();
		}
	},
// reveals the letters in the correct index field and uses the user input
	revealLetter : function(wordIndex, letterIndex) {
		var buttonGroup = $($(".btn-group")[wordIndex]);
		var button = $(buttonGroup.find(".btn")[letterIndex]);
		button.text(this.userInput);
	},
// checks if the user input(which from getUserInput() we know is more than one letter) is equal to the current name
	guessWholeWord : function() {
		if(this.userInput === this.currentTitleName) {
			this.winGame();
		} else {
			this.loseGame();
		}
	},
// this function takes care of counting the mistakes and showing the hangMan
// and when that counter reaches 5 - lose game
	showMistake : function() {
		this.mistakesCounter++;
		console.warn("mistake count " + this.mistakesCounter);
		$("#mistake" + this.mistakesCounter).show();

		if(this.mistakesCounter === 5) {
			this.loseGame();
		}	
	},
};

