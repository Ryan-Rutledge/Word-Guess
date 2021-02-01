class WordGuessGame {
	// Begin a new game
	start(maxMisses=6) {
		this.matches = 0;
		this.misses = 0;
		this.maxMisses = maxMisses;
		this.word = null;
		this.description = null;
		this.fetchWord();
		
		// Display game status
		$('#misses').text(0);
		$('#max_misses').text(maxMisses);
		$('body').attr('data-status', null);
		$('.guess').prop('disabled', false);
	}
	
	// Submit an unsuccessful letter guess
	badGuess(guess) {
		$('#misses').text(++this.misses);  // Display miss count
		if (this.misses >= this.maxMisses) {
			this.end('lose');
		}
	}
	
	// Submit a successful letter guess
	goodGuess(guess) {
		var lastIndex = -1;
		
		do {
			lastIndex = this.word.indexOf(guess, lastIndex+1);
			
			// Show letter when match is found
			if (lastIndex >=0) {
				this.matches++;
				$('#word .letter').eq(lastIndex).text(guess);
			}
		} while (lastIndex >= 0);
		
		// The game is won when all blank letters are replaced
		if (this.matches >= this.word.length) {
			this.end('win');
		}
	}
	
	// Evaluate a letter guess
	guess(guess) {		
		if (this.word.includes(guess)) {
			this.goodGuess(guess);
		}
		else {
			this.badGuess(guess);
		}
	}
	
	setWord(data) {
		this.word = data[0]['word'].toUpperCase();
		this.letters = ' '.repeat(this.word.length).split(''); // Display word starts blank
		
		$('#hint').text(data[0]['definition']);
		
		// Create blanks for each letter
		$('#word').empty();
		this.letters.forEach(_ => {
			$('#word').append(
				$('<span>').addClass('letter').text(' ')
			);
		});

	}
	
	// Retrieve word from external API
	fetchWord() {
		fetch('https://random-words-api.vercel.app/word')
		.then(response => response.json())
		.then(data => this.setWord(data));
	}
	
	// End the game
	end(status) {
		$('body').attr('data-status', status);
		$('.guess').prop('disabled', true);  // Stop user from making more guesses
		
		// Reveal the full word
		for (var i = 0; i < this.word.length; i++) {
			$('#word .letter').eq(i).text(this.word[i]);
		}
	}
}

// Initialize a word guess game
function createGame() {
	var wordGuessGame = new WordGuessGame();
	$('.guess').click(e => {
		$(e.target).prop('disabled', true);  // Allow each letter to be guessed once
		wordGuessGame.guess($(e.target).val())  // Guess value of clicked button
	});
	$('#reset').click(_ => wordGuessGame.start());
	wordGuessGame.start();
}