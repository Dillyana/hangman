var HangMan = {
	mistakesNum : 0,
	words : {},

	bootstrap : function() {
		// read json with jquery ajax
		    var word = '';
		    $.ajax({
		        url: 'scripts/words.json',
		        async: false
		    }).done(function(data) {
		        for (word in data) {
		            wordlist.push(data[word]);
		        }
		    }, 'json');	
	},

	startGame : function() {
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

	getRandomNum : function(min, max) {
		// find random function once for categories, once for words
		targetWord = wordlist[Math.floor(Math.random() * wordlist.length)];
	},

	showMistake : function() {
		// 
	},

	evaluateUserInput : function(input, ) {

	},

};
$(function() {
    console.log( "ready!" );
});