// class BoggleGame {
//     /* make a new game at this DOM id */
  
//     constructor(boardId, secs = 60) {
//       this.secs = secs; // game length
//       this.showTimer();
  
//       this.score = 0;
//       this.words = new Set();
//       this.board = $("#" + boardId);
  
//       // every 1000 msec, "tick"
//       this.timer = setInterval(this.tick.bind(this), 1000);
  
//       $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
//     }
  
//     /* show word in list of words */
  
//     showWord(word) {
//       $(".words", this.board).append($("<li>", { text: word }));
//     }
  
//     /* show score in html */
  
//     showScore() {
//       $(".score", this.board).text(this.score);
//     }
  
//     /* show a status message */
  
//     showMessage(msg, cls) {
//       $(".msg", this.board)
//         .text(msg)
//         .removeClass()
//         .addClass(`msg ${cls}`);

//         if (cls === "final-score") {
//             $(".msg", this.board).css("color", "white"); // Change the color here (e.g., white)
//           }
//     }
  
//     /* handle submission of word: if unique and valid, score & show */
  
//     async handleSubmit(evt) {
//       evt.preventDefault();
//       const $word = $(".word", this.board);
  
//       let word = $word.val();
//       if (!word) return;
  
//       if (this.words.has(word)) {
//         this.showMessage(`Whoops you already found ${word}!`, "err");
//         return;
//       }
  
//       // check server for validity
//       const resp = await axios.get("/check-word", { params: { word: word }});
//       if (resp.data.result === "not-word") {
//         this.showMessage(`Sorry, ${word} is not found in our dictionary`, "err");
//       } else if (resp.data.result === "not-on-board") {
//         this.showMessage(`${word} is not a valid word on this board`, "err");
//       } else {
//         this.showWord(word);
//         this.score += word.length;
//         this.showScore();
//         this.words.add(word);
//         this.showMessage(`Nice find! Added: ${word}`, "ok");
//       }
  
//       $word.val("").focus();
//     }
  
//     /* Update timer in DOM */
  
//     showTimer() {
//       $(".timer", this.board).text(this.secs);
//     }
  
//     /* Tick: handle a second passing in game */
  
//     async tick() {
//       this.secs -= 1;
//       this.showTimer();
  
//       if (this.secs === 0) {
//         clearInterval(this.timer);
//         await this.scoreGame();
//       }
//     }
  
//     /* end of game: score and update message. */
  
//     async scoreGame() {
//       $(".add-word", this.board).hide();
//       const resp = await axios.post("/post-score", { score: this.score });
//       if (resp.data.brokeRecord) {
//         this.showMessage(`YAY! CONGRATS! You set a New High Record: ${this.score}!!!`, "final-score");
//       } else {
//         this.showMessage(`Final Score: ${this.score}`, "final-score");
//       }
//     }
//   }

class BoggleGame {
    /* Create a new Boggle game at the specified DOM element (boardId), with an optional timer (secs) */
    constructor(boardId, secs = 60) {
      // Set the initial game timer (default to 60 seconds)
      this.secs = secs;
      // Display the initial timer on the page
      this.showTimer();
  
      // Initialize the score to 0 and a set to keep track of found words
      this.score = 0;
      this.words = new Set();
      // Select the game board from the DOM by its ID
      this.board = $("#" + boardId);
  
      // Set an interval that calls the `tick` method every 1000 milliseconds (1 second)
      this.timer = setInterval(this.tick.bind(this), 1000);
  
      // Add an event listener for the form submission to add words (bind `this` to the event handler)
      $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }
  
    /* Display the word in the list of found words */
    showWord(word) {
      // Append the found word to the list of words in the DOM as a new <li> element
      $(".words", this.board).append($("<li>", { text: word }));
    }
  
    /* Display the current score in the HTML */
    showScore() {
      // Update the score element in the DOM with the current score
      $(".score", this.board).text(this.score);
    }
  
    /* Show a status message (e.g., error or success) */
    showMessage(msg, cls) {
      // Update the message element in the DOM with the new message text and CSS class (for styling)
      $(".msg", this.board)
        .text(msg)
        .removeClass()    // Remove any previous message class (e.g., error or success)
        .addClass(`msg ${cls}`); // Add the new class for this message
  
      // If the message class is "final-score", change the text color (e.g., to white)
      if (cls === "final-score") {
        $(".msg", this.board).css("color", "white"); // Adjust color based on the final score condition
      }
    }
  
    /* Handle the submission of a word: check if it's valid and update score if necessary */
    async handleSubmit(evt) {
      evt.preventDefault(); // Prevent the default form submission behavior
  
      // Get the value of the word input field from the form
      const $word = $(".word", this.board);
      let word = $word.val();
      
      // If the input is empty, do nothing
      if (!word) return;
  
      // If the word has already been found, show an error message
      if (this.words.has(word)) {
        this.showMessage(`Whoops you already found ${word}!`, "err");
        return;
      }
  
      // Send a GET request to the server to check if the word is valid
      const resp = await axios.get("/check-word", { params: { word: word }});
      
      // Handle different results based on the server response
      if (resp.data.result === "not-word") {
        // Word is not found in the dictionary
        this.showMessage(`Sorry, ${word} is not found in our dictionary`, "err");
      } else if (resp.data.result === "not-on-board") {
        // Word is not valid on this board
        this.showMessage(`${word} is not a valid word on this board`, "err");
      } else {
        // Word is valid: show it, update the score, and add it to the set of found words
        this.showWord(word);
        this.score += word.length; // Increase score based on word length
        this.showScore(); // Update the displayed score
        this.words.add(word); // Add the word to the set of found words
        this.showMessage(`Nice find! Added: ${word}`, "ok");
      }
  
      // Clear the word input field and set focus back to it for the next word entry
      $word.val("").focus();
    }
  
    /* Display the timer countdown in the DOM */
    showTimer() {
      // Update the timer element with the remaining seconds
      $(".timer", this.board).text(this.secs);
    }
  
    /* Tick: handle the countdown every second */
    async tick() {
      this.secs -= 1; // Decrease the remaining seconds by 1
      this.showTimer(); // Update the displayed timer
  
      // When time runs out, stop the timer and end the game
      if (this.secs === 0) {
        clearInterval(this.timer); // Stop the timer
        await this.scoreGame(); // End the game and handle the final score
      }
    }
  
    /* End of game: score the game and update the message */
    async scoreGame() {
      // Hide the word submission form after the game ends
      $(".add-word", this.board).hide();
      
      // Send the player's score to the server and await the response
      const resp = await axios.post("/post-score", { score: this.score });
      
      // Check if the player broke the high score record and display a message accordingly
      if (resp.data.brokeRecord) {
        this.showMessage(`YAY! CONGRATS! You set a New High Record: ${this.score}!!!`, "final-score");
      } else {
        // Display the final score if no record was broken
        this.showMessage(`Final Score: ${this.score}`, "final-score");
      }
    }
  }
  