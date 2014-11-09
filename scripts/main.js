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

		// 1. Choose cat. by random 
		// 2. Choose word in cat by random
		// 3. Show cat name and descr in UI
		// 3.1 Split name to words (into arrays)
		// 3.2 Split each word into letters (chars into arrays) 
		// 4. Visualize placeholder for chars
		// 5. Show first and last char of each word
		// 6. Get user input
		// 7. Validate user input by finding jquery inArray (for each words)
		// 7.1 cases (if more than one word - guess word or lose game)
		// 8. Display correct chars into possition
		// 9. MistakeCount++ 
		// 10. Call showmistake
		// 11. 
	},

	restartGame : function() {
		this.mistakesNum = 0;
		this.startGame();
	},

	gameOverWin : function() {

	},

	gameOverLose : function() {

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
		return this.currentCategory.titles[randomNum];
	},

	getRandomNum : function(min, max) {
		// find random function once for categories, once for words
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	showMistake : function() {
		// 
	},

	evaluateUserInput : function(input ) {

	}

};
$(function() {
    HangMan.readJsonWordsFile();
    HangMan.startGame();
});
