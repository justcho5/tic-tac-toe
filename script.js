const createPlayer = (name, sign) => {
  const getSign = () => {
    return sign;
  };
  return { name, getSign };
};
const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setValue = (index, sign) => {
    board[index] = sign;
  };

  const getValue = (index) => {
    return board[index];
  };

  const resetValues = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  const printBoard = () => {
    for (let i = 0; i < 3; i++) {
      console.log(
        `${board[3 * i]} | ${board[3 * i + 1]} | ${board[3 * i + 2]}`
      );
    }
  };

  return { setValue, getValue, resetValues, printBoard };
})();

const gameController = (() => {
  // create players (can make this interactive later)
  const p1 = createPlayer("Player X", "X");
  const p2 = createPlayer("Player O", "O");

  let round = 1,
    isOver = false,
    result = false;

  const getCurrentPlayer = () => {
    return round % 2 === 1 ? p1 : p2;
  };

  const checkWinner = (index) => {
    winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombos
      .filter((combo) => combo.includes(index))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getValue(index) === getCurrentPlayer().getSign()
        )
      );
  };

  // play a round
  const playRound = (index) => {
    gameBoard.setValue(index, getCurrentPlayer().getSign());
    gameBoard.printBoard();
    result = checkWinner(index);

    // check if game over
    if (result) {
      screenController.setGameOverMessage(getCurrentPlayer().name);
      isOver = true;
      return;
    }

    // check if game over
    if (round >= 9) {
      screenController.setGameOverMessage("Draw");

      isOver = true;
      return;
    }

    round++;
    screenController.setalertElement(`${getCurrentPlayer().name}'s turn`);
  };

  const resetGame = () => {
    isOver = false;
    result = false;
    round = 1;
  };

  const getIsOver = () => {
    return isOver;
  };

  return { playRound, resetGame, getIsOver, getCurrentPlayer };
})();

// UI
const screenController = (() => {
  const boxElements = document.querySelectorAll(".box");
  const alertElement = document.getElementById("alert");
  alertElement.textContent = `${gameController.getCurrentPlayer().name}'s turn`;
  const restartButton = document.getElementById("restart-button");

  // event listener for boxes
  boxElements.forEach((box) =>
    box.addEventListener("click", (e) => {
      console.log(`hit ${e.target.dataset.index}`);
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      const idx = parseInt(e.target.dataset.index);
      console.log(idx);
      gameController.playRound(idx);
      box.textContent = gameBoard.getValue(idx);
    })
  );

  //event listener for restart
  restartButton.addEventListener("click", (e) => {
    gameBoard.resetValues();
    gameController.resetGame();
    resetgameBoard();
    setalertElement(`${gameController.getCurrentPlayer().name}'s turn`);
  });

  // restart
  const resetgameBoard = () => {
    for (let i = 0; i < boxElements.length; i++) {
      boxElements[i].textContent = gameBoard.getValue(i);
    }
  };

  // result
  const setGameOverMessage = (winner) => {
    if (winner === "Draw") {
      setalertElement("It's a draw!");
    } else {
      setalertElement(`${winner} has won!`);
    }
  };

  // setting messages
  const setalertElement = (message) => {
    alertElement.textContent = message;
  };

  return { setGameOverMessage, setalertElement };
})();
