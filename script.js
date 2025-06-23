// === Show/hide game sections ===
function showGame(name) {
    const games = document.querySelectorAll(".game");
    games.forEach(g => {
      g.style.display = "none";
    });
    if (name) {
      document.getElementById(name).style.display = "block";
    }
  }
  
  // ==================== TIC TAC TOE =====================
  
  const tttBoardEl = document.getElementById("ttt-board");
  const tttStatusEl = document.getElementById("ttt-status");
  const tttScoreEl = document.getElementById("ttt-score");
  const tttModeSelect = document.getElementById("ttt-mode");
  
  let tttBoard = [];
  let tttCurrentPlayer = "X";
  let tttGameOver = false;
  let tttScores = { X: 0, O: 0 };
  
  function startTicTacToe() {
    tttBoard = Array(9).fill("");
    tttCurrentPlayer = "X";
    tttGameOver = false;
    updateTttScore();
    updateTttStatus(`Player ${tttCurrentPlayer}'s turn`);
    renderTttBoard();
  }
  
  function renderTttBoard() {
    tttBoardEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "ttt-cell";
      cell.textContent = tttBoard[i];
      cell.addEventListener("click", () => tttCellClicked(i));
      tttBoardEl.appendChild(cell);
    }
  }
  
  function tttCellClicked(i) {
    if (tttGameOver || tttBoard[i] !== "") return;
  
    tttBoard[i] = tttCurrentPlayer;
    renderTttBoard();
  
    if (checkTttWin(tttCurrentPlayer)) {
      tttScores[tttCurrentPlayer]++;
      updateTttStatus(`Player ${tttCurrentPlayer} wins! 🎉`);
      updateTttScore();
      tttGameOver = true;
      return;
    }
  
    if (tttBoard.every(cell => cell !== "")) {
      updateTttStatus(`It's a Draw!`);
      tttGameOver = true;
      return;
    }
  
    if (tttModeSelect.value === "single" && tttCurrentPlayer === "X") {
      tttCurrentPlayer = "O";
      updateTttStatus(`Computer's turn (O)`);
      setTimeout(computerMove, 500);
    } else {
      tttCurrentPlayer = tttCurrentPlayer === "X" ? "O" : "X";
      updateTttStatus(`Player ${tttCurrentPlayer}'s turn`);
    }
  }
  
  function computerMove() {
    if (tttGameOver) return;
  
    // Simple AI: first empty cell
    let move = -1;
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (tttBoard[i] === "") {
        tttBoard[i] = "O";
        if (checkTttWin("O")) {
          move = i;
          tttBoard[i] = "";
          break;
        }
        tttBoard[i] = "";
      }
    }
    // Try to block X
    if (move === -1) {
      for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === "") {
          tttBoard[i] = "X";
          if (checkTttWin("X")) {
            move = i;
            tttBoard[i] = "";
            break;
          }
          tttBoard[i] = "";
        }
      }
    }
    // Otherwise first empty
    if (move === -1) {
      move = tttBoard.findIndex(c => c === "");
    }
  
    if (move >= 0) {
      tttBoard[move] = "O";
    }
    renderTttBoard();
  
    if (checkTttWin("O")) {
      tttScores["O"]++;
      updateTttStatus(`Computer (O) wins! 🎉`);
      updateTttScore();
      tttGameOver = true;
      return;
    }
  
    if (tttBoard.every(cell => cell !== "")) {
      updateTttStatus(`It's a Draw!`);
      tttGameOver = true;
      return;
    }
  
    tttCurrentPlayer = "X";
    updateTttStatus(`Player ${tttCurrentPlayer}'s turn`);
  }
  
  function checkTttWin(player) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diagonals
    ];
  
    return wins.some(combo => combo.every(i => tttBoard[i] === player));
  }
  
  function updateTttStatus(text) {
    tttStatusEl.textContent = text;
  }
  
  function updateTttScore() {
    tttScoreEl.textContent = `Score - Player X: ${tttScores.X} | Player O: ${tttScores.O}`;
  }
  
  // Start game when page loads if TicTacToe shown
  tttModeSelect.addEventListener("change", () => {
    startTicTacToe();
  });
  
  // ==================== MEMORY MATCHING =====================
  
  const memoryBoardEl = document.getElementById("memory-board");
  const memoryStatusEl = document.getElementById("memory-status");
  const memoryScoreEl = document.getElementById("memory-score");
  const memoryModeSelect = document.getElementById("memory-mode");
  
  const memoryImages = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"];
  let memoryCards = [];
  let flippedCards = [];
  let matchedCardsCount = 0;
  let memoryPlayerTurn = 1;
  let memoryScores = {1: 0, 2: 0};
  let memoryGameOver = false;
  
  function initMemoryGame() {
    memoryPlayerTurn = 1;
    memoryScores = {1: 0, 2: 0};
    matchedCardsCount = 0;
    memoryGameOver = false;
    flippedCards = [];
  
    let images = memoryImages.slice(0, 8);
    memoryCards = images.concat(images); // pairs
    shuffleArray(memoryCards);
  
    renderMemoryBoard();
    updateMemoryStatus(`Player 1's turn`);
    updateMemoryScore();
  }
  
  function renderMemoryBoard() {
    memoryBoardEl.innerHTML = "";
    memoryCards.forEach((img, i) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.index = i;
  
      const cardInner = document.createElement("div");
      cardInner.className = "memory-card-inner";
  
      const cardFront = document.createElement("div");
      cardFront.className = "memory-card-front";
      cardFront.textContent = "?";
  
      const cardBack = document.createElement("div");
      cardBack.className = "memory-card-back";
      cardBack.textContent = img;
  
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
  
      card.appendChild(cardInner);
  
      card.addEventListener("click", () => memoryCardClicked(i));
  
      memoryBoardEl.appendChild(card);
    });
  }
  
  function memoryCardClicked(i) {
    if (memoryGameOver) return;
    const cardsElems = memoryBoardEl.children;
    const cardElem = cardsElems[i];
    const cardInner = cardElem.querySelector(".memory-card-inner");
  
    // Already matched or flipped
    if (cardInner.classList.contains("flipped")) return;
    if (flippedCards.length === 2) return;
  
    // Flip card
    cardInner.classList.add("flipped");
    flippedCards.push(i);
  
    if (flippedCards.length === 2) {
      setTimeout(checkMemoryMatch, 1000);
    }
  }
  
  function checkMemoryMatch() {
    const [first, second] = flippedCards;
    const cardsElems = memoryBoardEl.children;
  
    if (memoryCards[first] === memoryCards[second]) {
      // Match found
      memoryScores[memoryPlayerTurn]++;
      // Hide matched cards
      cardsElems[first].style.visibility = "hidden";
      cardsElems[second].style.visibility = "hidden";
      matchedCardsCount += 2;
      updateMemoryStatus(`Player ${memoryPlayerTurn} found a match! Go again.`);
    } else {
      // No match: flip back cards
      cardsElems[first].querySelector(".memory-card-inner").classList.remove("flipped");
      cardsElems[second].querySelector(".memory-card-inner").classList.remove("flipped");
      if (memoryModeSelect.value === "multi") {
        memoryPlayerTurn = memoryPlayerTurn === 1 ? 2 : 1;
        updateMemoryStatus(`No match. Player ${memoryPlayerTurn}'s turn.`);
      } else {
        updateMemoryStatus(`No match. Try again.`);
      }
    }
  
    updateMemoryScore();
    flippedCards = [];
  
    // Check if all matched
    if (matchedCardsCount === memoryCards.length) {
      memoryGameOver = true;
      if (memoryScores[1] > memoryScores[2]) {
        updateMemoryStatus(`Player 1 wins with ${memoryScores[1]} points! 🎉`);
      } else if (memoryScores[2] > memoryScores[1]) {
        updateMemoryStatus(`Player 2 wins with ${memoryScores[2]} points! 🎉`);
      } else {
        updateMemoryStatus(`It's a draw!`);
      }
    }
  }
  
  function updateMemoryStatus(text) {
    memoryStatusEl.textContent = text;
  }
  
  function updateMemoryScore() {
    if (memoryModeSelect.value === "multi") {
      memoryScoreEl.textContent = `Score - Player 1: ${memoryScores[1]} | Player 2: ${memoryScores[2]}`;
    } else {
      memoryScoreEl.textContent = `Score: ${memoryScores[1]}`;
    }
  }
  
  function shuffleArray(arr) {
    for(let i = arr.length -1; i > 0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Initialize when page loads
  window.onload = () => {
    showGame(null); // show none initially
    startTicTacToe();
    initMemoryGame();
  };
  