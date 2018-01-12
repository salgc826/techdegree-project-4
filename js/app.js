(function() {

  // Selectors
  const start = document.querySelector("#start");
  const board = document.querySelector("#board");
  const finish = document.querySelector("#finish");
  const startButton = document.querySelector("#start .button");
  const newGame = document.querySelector("#finish .button");
  const xImg = "url('img/x.svg')";
  const oImg = "url('img/o.svg')";
  const player1 = document.querySelector("#player1");
  const player2 = document.querySelector("#player2");
  const boxes = document.querySelector(".boxes");
  const box = document.querySelectorAll(".box");
  const message = document.querySelector(".message");
  const gameAlt = document.querySelector("#gameAlternatives");

  // Variable to keep track of the game type:
  // - 2-player or computer game
  let isTwoPlayer = true;

  // Prompt the user for a name
  // Appends the name under player1 in the board screen
  let playerName;
  let player2Name;

  // The player variables and their symbol
  let human = 'O';
  let computer = 'X';

  /* let boardArray = ['O',1,2,3,4,5,6,7,8];
  let testMinimax = minimax(boardArray, computer);
  console.log("testMinimax: " + testMinimax); */

  // Keep track of the next player/turn
  // Will toggle between 1 and 2
  let whoIsNext = 1;
  player1.classList.add("active");

  // Disable the bord and finish HTML before game is started
  board.style.display = "none";
  finish.style.display = "none";

  // When the start game button is clicked: Switch from start to board screen
  startButton.onclick = function () {

    // Get the inputted names from the start screen and show..
    // .. them on the board screen
    playerName = document.querySelector("#name1").value;
    document.querySelector("#playerName1").textContent = playerName;
    if (isTwoPlayer) {
      player2Name = document.querySelector("#name2").value;
      document.querySelector("#playerName2").textContent = player2Name;
    }
    start.style.display = "none";
    board.style.display = "block";
  };

  // Register what type of game is to be play, against human or computer
  // If human, add another name input text box
  gameAlt.onchange = function (event) {
    if (event.target.value === "friend") {
      isTwoPlayer = true;
      document.querySelector("#name2").classList.remove("is-hidden");
    } else if (event.target.value === "computer") {
      isTwoPlayer = false;
      document.querySelector("#name2").classList.add("is-hidden");
    } else {
      document.querySelector("#name2").classList.add("is-hidden");
    }
  }

  // When the user hovers over an empty box: change the backgroundImage..
  // .. to the player's symbol
  boxes.onmouseover = function(event) {
    if (!event.target.classList.contains("box-filled-1") && !event.target.classList.contains("box-filled-2")) {
      event.target.style.backgroundImage = (whoIsNext == 1 ? oImg : xImg);
    }
  };

  // When the mouse leaves the empty box: change the background back to normal
  boxes.onmouseout = function(event) {
    if (!event.target.classList.contains("box-filled-1") && !event.target.classList.contains("box-filled-2")) {
      event.target.style.backgroundImage = "";
    }
  };

  // When a box is clicked: Fill it with the correct symbol of the player..
  // .. and change who's next
  boxes.onclick = function(event) {

    // Checks to see if the box is already filled
    if (!event.target.classList.contains("box-filled-1") && !event.target.classList.contains("box-filled-2")) {

      // Fills the box with the player's symbol
      event.target.classList.add("box-filled-" + whoIsNext);

      // Changes which player is next and the current active
      changePlayer();
    }

    // If next player is the computer
    if (whoIsNext == 2 && !isGameWon() && !isTwoPlayer) {

      // Array to store the current boxes and their input
      let currentBoard = [];

      // Loops through the boxes and pushes their value/input or index..
      // .. to the currentBoard array
      for (let i = 0; i < box.length; i++) {
        if (box[i].classList.contains("box-filled-1")) {
          currentBoard.push('O');
        } else if (box[i].classList.contains("box-filled-2")) {
          currentBoard.push('X');
        } else { currentBoard.push(i); }
      }

      // Calculates the computer's choice based on the current board
      let computerChoice = minimax(currentBoard, computer);

      // Marks the computer's choice
      box[computerChoice.index].classList.add("box-filled-2");

      // Change the active player
      changePlayer();
    }

    // Checks if the game is won/lost/drawn
    isGameWon();

  };

  // Changes which player is next and the current active
  function changePlayer() {
    if (whoIsNext == 1) {
      player1.classList.remove("active");
      player2.classList.add("active");
      whoIsNext++;
    } else {
      player2.classList.remove("active");
      player1.classList.add("active");
      whoIsNext--;
    }
  }

  // Display the winner screen
  function finishScreen() {
    board.style.display = "none";
    finish.style.display = "block";
  }

  // Reset the active player to player1
  function setPlayer1() {
    whoIsNext = 1;
    player1.classList.add("active");
    player2.classList.remove("active");
  }

  // Check if the game is a draw
  function isGameDraw() {
    for (let i = 0; i < box.length; i++) {
      if (!box[i].classList.contains("box-filled-1") &&
          !box[i].classList.contains("box-filled-2")) {
            return true;
            if (i == box.length - 1) {
              return false;
            }
      }
    }
  }

  // Check if the game is over
  function isGameWon() {

    // All possible "3 in a row"
    let lines = [
      [0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[0,4,8],
			[1,4,7],
			[2,5,8],
			[2,4,6]
    ];

    // If any of the lines is filled with O's (player1)
    for (let i = 0; i < lines.length; i++) {
      if (box[lines[i][0]].classList.contains("box-filled-1") &&
          box[lines[i][1]].classList.contains("box-filled-1") &&
          box[lines[i][2]].classList.contains("box-filled-1")) {

            // Display the winner screen
            finishScreen();
            finish.classList.add("screen-win-one")
            message.innerHTML = playerName + " is the winner";
            setPlayer1();
            return;
      }

      // If any of the lines is filled with X's (player2)
      else if (box[lines[i][0]].classList.contains("box-filled-2") &&
               box[lines[i][1]].classList.contains("box-filled-2") &&
               box[lines[i][2]].classList.contains("box-filled-2")) {

                 // Display the winner screen
                 finishScreen();
                 finish.classList.add("screen-win-two")
                 if (isTwoPlayer) {
                   message.innerHTML = player2Name + " is the winner";
                 } else {
                   message.innerHTML = "Winner";
                 }
                 setPlayer1();
                 return;

      // If no lines are complete and board is full
      } else if (!isGameDraw()) {
        finishScreen();
        finish.classList.add("screen-win-tie")
        message.innerHTML = "It's a tie!";
        setPlayer1();
      }
    }
  }

  // Start a new game from the finish screen
  newGame.onclick = function() {
    for (let i = 0; i < box.length; i++) {
      box[i].classList.remove("box-filled-1", "box-filled-2");
      box[i].style.backgroundImage = "";
    }

    // Resets the finish screen html classes
    finish.classList.remove("screen-win-tie", "screen-win-one",
                            "screen-win-two");

    // Removes the finish screen and displays the board
    finish.style.display = "none";
    board.style.display = "block";
  };

  //
  // Implement the minimax algorithm as the computer-player:
  // - Recursive function that will help the computer pick boxes
  // - The computer-player is guaranteed to not lose
  // - Will draw against a perfect player
  //
  function minimax(newBoard, player) {

    // Which boxes are available for the computer to pick
    let availableBoxes = emptyBoxes(newBoard);

    // Values to symbolise a loss, win and draw for a move
    if (winning(newBoard, human)) {
      return {score:-10};
    }
    else if (winning(newBoard, computer)) {
      return {score:10};
	  }
    else if (availableBoxes.length === 0) {
  	  return {score:0};
    }

    // Array to store the potential moves in
    let moves = [];

    // Loops through the potential moves and calculates their outcome
    for (let i = 0; i < availableBoxes.length; i++) {

      // Object to store outcome/score of the potential moves
      let move = {};

      move.index = newBoard[availableBoxes[i]];

      // Sets the available box to the current player
      newBoard[availableBoxes[i]] = player;

      // Calculates the best moves for the opponent of the current player
      if (player == computer) {
        let result = minimax(newBoard, human);
        move.score = result.score;
      }
      else {
        let result = minimax(newBoard, computer);
        move.score = result.score;
      }

      // Resets/empty the box
      newBoard[availableBoxes[i]] = move.index;

      // Pushes the move object to the moves array
      moves.push(move);
    }

    // Variable to store the best possible box/move index
    let bestMove;

    // Find the move with the highest score if the current player is..
    // .. the computer player
    if (player === computer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }

    // Find the move with the lowest score if the current player is..
    // .. the human player
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    // Returns the best move object
    return moves[bestMove];
  }

  // Loops though the boxes and finds who is not an O or an X
  function emptyBoxes(board){
    return  board.filter(s => s != "O" && s != "X");
  }

  // Checks if the board is a won position
  function winning(board, player){
   if ((board[0] == player && board[1] == player && board[2] == player) ||
       (board[3] == player && board[4] == player && board[5] == player) ||
       (board[6] == player && board[7] == player && board[8] == player) ||
       (board[0] == player && board[3] == player && board[6] == player) ||
       (board[1] == player && board[4] == player && board[7] == player) ||
       (board[2] == player && board[5] == player && board[8] == player) ||
       (board[0] == player && board[4] == player && board[8] == player) ||
       (board[2] == player && board[4] == player && board[6] == player)) {
          return true;
      } else {
          return false;
      }
  }

}());
