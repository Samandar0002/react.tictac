import React, { useState, useEffect } from "react";
import Board from "./components/board";
import "./assets/main.css";

function App() {
  const initialHistory = [{ squares: new Array(9) }];
  const [history, setHistory] = useState(initialHistory);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [finished, setFinished] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  
  useEffect(() => {
    const savedGameState = JSON.parse(localStorage.getItem("ticTacToeGame") || "null");
    if (savedGameState) {
      setHistory(savedGameState.history);
      setStepNumber(savedGameState.stepNumber);
      setXIsNext(savedGameState.xIsNext);
      setFinished(savedGameState.finished);
      setPlayer1Name(savedGameState.player1Name);
      setPlayer2Name(savedGameState.player2Name);
    }
  }, []);

  
  useEffect(() => {
    const gameState = {
      history,
      stepNumber,
      xIsNext,
      finished,
      player1Name,
      player2Name,
    };
    localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
  }, [history, stepNumber, xIsNext, finished, player1Name, player2Name]);

  const handleClick = (i: number) => {
    if (finished) {
      return;
    }
    if (stepNumber >= 9) {
      setFinished(true);
      return;
    }
    const _history = history.slice(0, stepNumber + 1);
    const squares = [..._history[_history.length - 1].squares];

    if (squares[i]) {
      return;
    }
    const winner = calculateWinner(squares);
    if (winner) {
      setFinished(true);
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory([..._history, { squares }]);
    setStepNumber(_history.length);
    setXIsNext(!xIsNext);
  };

  const resetGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Clear local storage on reset
    localStorage.removeItem("ticTacToeGame");
    setHistory(initialHistory);
    setStepNumber(0);
    setXIsNext(true);
    setFinished(false);
  };

  const squares = history[stepNumber].squares;
  const winner = calculateWinner(squares);
  const winnerName =
    winner === "X" ? player1Name : winner === "O" ? player2Name : null;
  const status = winner
    ? "Winner: " + winnerName
    : "Next player: " + (xIsNext ? player1Name : player2Name);

  return (
    <div className="game">
      <Board
        squares={squares}
        finished={finished}
        onClick={(i) => handleClick(i)}
      />
      <div className="game-info">
        <div>{status}</div>
        {finished && <p>Congratulations, {winnerName}!</p>}
        <label>
          Player 1 Name:
          <input
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
          />
        </label>
        <label>
          Player 2 Name:
          <input
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
        </label>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
}

function calculateWinner(squares: Array<string | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const player = squares[a];
    if (player && player === squares[b] && player === squares[c]) {
      return player;
    }
  }
  return null;
}

export default App;
