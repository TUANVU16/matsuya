// Finding the DOM elements needed
const btnStopStart = document.querySelector('.btn-stop-game');

const gameContainerEl = document.querySelector('.game-container');
const gameContainerHeadingEl = document.querySelector('.game-container h2');
const gameContainerImgEl = document.querySelector('.game-container img');
const gameContainerList = document.querySelector('.game-container ul');

const resultsContainerEl = document.querySelector('.results-container');
const resultInfoEl = document.querySelector('.result-info');
const btnShowWrongAnswersEl = document.querySelector('#btn-show-wrong-answers');
const wrongGuessesEl = document.querySelector('.wrong-guesses');

// List of students available for the game, including a path file for their image
const students = [
	{
		"name" : "バーベキュータレー",
		"image": "assets/dishes/babecutare.jpg",
	},
	{
		"name" : "カルビタレー",
		"image": "assets/dishes/karubitare.jpg",
	},
	{
		"name" : "ポン酢タレー",
		"image": "assets/dishes/ponzutare.jpg",
	},
	{
		"name" : "ゴマドレッシング",
		"image": "assets/dishes/gomadore.jpg",
	},
	{
		"name" : "フレンチドレッシング",
		"image": "assets/dishes/furenchi.jpg",
	},
	{
		"name" : "ナフキン",
		"image": "assets/dishes/nafkin.jpg",
	},
	{
		"name" : "紅生姜",
		"image": "assets/dishes/binishoga.jpg",
	},
	{
		"name" : "しょう油",
		"image": "assets/dishes/shoju.jpg",
	},
	{
		"name" : "ビール牛焼肉S",
		"image": "assets/main/birugyuyakisetto.jpg",
	},
	//
	{
		"name" : "牛めし野菜S",
		"image": "assets/main/guyyasai.jpg",
	},


];

// Array that will hold all the dishes objects that has not yet been picked as a "secret dish" during a game
let currentGameStudents = [];
// Variable that contains the dish object that the user needs to guess each round
let secretStudent;
// Array that holds information about every round the user has played during a game
let currentGameResult = [];
// Highscore, defined as negative one before any game has been played
let highscore = -1;

// Function that shuffles elements of an array by random
const arrayShuffle = function(arr) {

     for (let i = arr.length -1; i > 0; i--) {
       let j = Math.floor(Math.random() * (i + 1));
       let temp = arr[i];
       arr[i] = arr[j];
       arr[j] = temp;
     }

}

// Function to reset data and begin a new game
const newGame = function() {

	// Get a copy of dish array for the new game
	currentGameStudents = [...students];
	// Randomise dish array for the new game
	arrayShuffle(currentGameStudents);
	// Empty current game result array
	currentGameResult = [];
	// Empty DOM element content
	resultInfoEl.innerHTML = '';
	wrongGuessesEl.innerHTML = '';
	// Show the DOM game container element, and hide the DOM result element
	gameContainerEl.classList.remove('hide');
	resultsContainerEl.classList.remove('show-f');
	btnShowWrongAnswersEl.classList.remove('hide');
	wrongGuessesEl.classList.remove('show');

}

// Function to update data and DOM each round
const newRound = function() {

    // Clean up previous round
	// Array of dishobjects that will be displayed to the user as guessable names
    let currentRoundStudents = [];
    gameContainerList.innerHTML = '';

    // Remove the last dish object in the current game array, and put it in the current round array
    secretStudent = currentGameStudents.pop();
    currentRoundStudents.push(secretStudent);
    
    // Add dish image to DOM
    gameContainerImgEl.setAttribute('src', secretStudent.image);

    // Update the DOM with info about what round the user is on 
    gameContainerHeadingEl.innerText = `問 ${currentGameResult.length + 1} - この物の名前はなんですか？`;

    // Fill in the rest of the dishes used for the current round
    while (currentRoundStudents.length < 4) {
        // Get a random dish object from the dishes array
        let nextPossibleStudent = students[Math.floor(Math.random() * students.length)];

        // Only push the chosen dish to current round array if the name is not already in the current round array
        if (!currentRoundStudents.find( (student) => student.name === nextPossibleStudent.name )) {
            currentRoundStudents.push(nextPossibleStudent);
        }
    }

    // Randomise order of selected dishes
    arrayShuffle(currentRoundStudents);

    // Render the current round array objects to the DOM
    currentRoundStudents.forEach( (student) => {
        gameContainerList.innerHTML += `<li>${student.name}</li>`;
    } );
    
}

// Function to calculate and display the results after finished game
const renderResult = function() {

	// Setting the length of current game result array as the total number of rounds played
	const numOfRounds = currentGameResult.length;
	// Calculating score by length of a filtered current gam result array containing only correct answers
	const score = currentGameResult.filter( (round) => {
		return round.userGuess === round.name;
	} ).length;

	// Filter the game result array to only contain wrong guesses
	currentGameResult = currentGameResult.filter( (round) => {
		return round.userGuess !== round.name;
	});

	// Manipulate the game result array so that each elemnt is an html snippet to be sent to DOM
	currentGameResult = currentGameResult.map( (round) => {
		return `<div class="wrong-guesses-wrapper"><img src="${round.image}"><p>あなたが推測した: ${round.userGuess},<br>正しい答え: ${round.name}</p></div>`
	} );
	
	// Displaying the result array to DOM a single string
	wrongGuessesEl.innerHTML = currentGameResult.join('');

	// Display different messages to the user depending on the score
	if (numOfRounds === 0) {
		resultInfoEl.innerHTML = `<p>もう一回やりたい？?  ボタンを押して</p>`;
		btnShowWrongAnswersEl.classList.add('hide');
	} else if (score === 0) {
		resultInfoEl.innerHTML = `<p>回答は全部違いました <br>点数: ${score}/${numOfRounds} </p>`;
	} else if (score === numOfRounds) {
		resultInfoEl.innerHTML = `<p>おめでとう！全部答えは正しい ${score} 正しい!</p>`;
		btnShowWrongAnswersEl.classList.add('hide');
	} else {
		resultInfoEl.innerHTML = `<p>ありがとう！ あなたが ${score} ／ ${numOfRounds} 点数.</p>`;
	}

	// If the user got a new best score, update and inform user
	if (highscore < 0) {
		highscore = score;
	}else if (score > highscore) {
		resultInfoEl.innerHTML += `<p>New Highscore! Previous highscore: ${highscore}</p>`;
		highscore = score;
	}
	
	// Show the html container for the result, and hide the container for the game
	resultsContainerEl.classList.add('show-f');
	gameContainerEl.classList.add('hide');

}

// Event listener for the UL element
gameContainerList.addEventListener('click', (e) => {
    
    // If the clicked target is an Li element, update info about the current round
    if (e.target.tagName === 'LI') {
		// Add information about the correct student and what the user guessed, to the current game result array
		currentGameResult.push(
		{
			image: secretStudent.image,
			name: secretStudent.name,
			userGuess: e.target.innerText
		}
		);

		// If the current round number is the same as lenth of student array, finish the game
        if (currentGameResult.length === students.length) {
			// Change button text and style
            btnStopStart.classList.add('btn-start-game');
			btnStopStart.classList.remove('btn-stop-game');
			btnStopStart.innerText = "プレイ";
			// Call function to calculate and display the results
			renderResult();
			
        } else {
			// Start a new round
            newRound();
        }    
    }
    
});

// Prevent the user from right-clicking on an image to get the name
gameContainerImgEl.addEventListener('contextmenu', (e) => {

	e.preventDefault();

});

// Event listener for clicks on the start new game & give up button
btnStopStart.addEventListener('click', () => {

	// If the button currently has the class "btn-stop-game"
	if (btnStopStart.classList.contains('btn-stop-game')) {
		// Change button text and style to fit the "start game" style
		btnStopStart.classList.add('btn-start-game');
		btnStopStart.classList.remove('btn-stop-game');
		btnStopStart.innerText = "プレイ";
		// Call the function to finish the game and render result
		renderResult();
	// Otherwise, reverse the style changes and begin a new game
	} else {
		btnStopStart.classList.add('btn-stop-game');
		btnStopStart.classList.remove('btn-start-game');
		btnStopStart.innerText = "辞める";

		// Begin a new game
		newGame();

		// Begin a new round
		newRound();
	}

});

// Eventlistener for the button hiding info about wrong guesses
btnShowWrongAnswersEl.addEventListener('click', () => {

	// If the container for wrong guesses does not have the "show" class, add it
	// Otherwise, remove it
	wrongGuessesEl.classList.toggle('show');

});

// Begin a new game
newGame();

// Begin a new round
newRound();