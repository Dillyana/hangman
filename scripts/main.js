$(function() {
    HangMan.readJsonWordsFile();
    HangMan.startGame();
});

var HangMan = {
	mistakesNum : 0,
	wordsData : {},

	readJsonWordsFile : function() {
		// read json with jquery ajax
		    $.ajax({
		        url: 'data/words.json',
		        dataType: "json",
		        async: false
		    }).done(function(result) {
		    	//assing the result json object th Hangman.wordsData
		        HangMan.wordsData = result;
		    });	
	},

	startGame : function() {
		
		this.currentCategory = this.getRandomCategory();
		this.showCategoryName();
		this.currentTitle = this.getRandomTitle();
		this.showTitleDescription();
		this.titleWords = this.splitTitleNameToWords();
		this.splitEachWordToChar();
		this.showCharPlaceholders();
		this.listenForUserInput();
		$("#userInput").focus();
		// debugger;



		// 10. Call showmistake
		// 11. reveal all characters either fail or win
		// 12. 
	},

	restartGame : function() {
		this.mistakesNum = 0;
		this.startGame();
	},

	winGame : function() {
		console.log("Win");
	},

	loseGame : function() {
		console.warn("Lose");
	},

	getRandomCategory: function(){
		var randomNum = this.getRandomNum(0, this.wordsData.categories.length - 1);
		return this.wordsData.categories[randomNum];
	},

	showCategoryName : function() {
		$("#categoryName").text(this.currentCategory.name);
	},

	showTitleDescription : function() {
		$("#description").text(this.currentTitle.description);
	},

	getRandomTitle: function(){
		var randomNum = this.getRandomNum(0, this.currentCategory.titles.length - 1);
		this.currentTitleName = this.currentCategory.titles[randomNum].name;
		return this.currentCategory.titles[randomNum];
	},

	getRandomNum : function(min, max) {
		// find random function once for categories, once for words
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	splitTitleNameToWords : function() {
		return this.currentTitle.name.split(" ");
	},

	splitEachWordToChar : function() {
		$.each(HangMan.titleWords, function( index, word ) {
  			HangMan.titleWords[index] = word.split("");
		});
	},

	showCharPlaceholders : function() {

		var lettersContainer = $("#lettersContainer");

		$.each(HangMan.titleWords, function(index, word) {

			var buttonGroup = $('<div class="btn-group">');
			buttonGroup.appendTo(lettersContainer);

			$.each(word, function(index, letter) {

				var button = $('<div class="btn btn-primary disabled">');
				var buttonText = "_";
				if(index === 0 || index === (word.length - 1)){
					buttonText = letter;
				}
				button.text(buttonText);
				button.appendTo(buttonGroup);
			});
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
					HangMan.revealLetter(wordIndex, letterIndex);
				}
			} while(letterIndex > -1) 

		});

		if(!matchFound) {
			this.showMistake();
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
		this.mistakesNum++;

		console.warn( this.mistakesNum + " mistake");

		if(this.mistakesNum === 5) {
			this.loseGame();
		}
		
	},

	evaluateUserInput : function(input ) {

	}

};

