import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;

app.use(bodyParser.json());

interface GameState {
  history: { squares: (string | null)[] }[];
  stepNumber: number;
  xIsNext: boolean;
  finished: boolean | string;
  player1Name: string;
  player2Name: string;
}

let gameState: GameState = {
  history: [{ squares: new Array(9).fill(null) }],
  stepNumber: 0,
  xIsNext: true,
  finished: false,
  player1Name: "Player 1",
  player2Name: "Player 2",
};


app.post('/makeMove', (req: Request, res: Response) => {
  const { index, player1Name, player2Name }: { index: number; player1Name: string; player2Name: string } = req.body;

  
  if (!player1Name || !player2Name) {
    return res.status(400).json({ error: 'Player names are required.' });
  }

 
  if (gameState.finished) {
    return res.status(400).json({ error: 'The game is already finished.' });
  }

  
  const _history = gameState.history.slice(0, gameState.stepNumber + 1);
  const squares = [..._history[_history.length - 1].squares];

  
  if (squares[index]) {
    return res.status(400).json({ error: 'Invalid move. Square is already taken.' });
  }

  
  const winner = calculateWinner(squares);
  if (winner) {
    gameState.finished = true;
    return res.json({ success: true, winner: winner });
  }

  squares[index] = gameState.xIsNext ? 'X' : 'O';

  gameState = {
    history: [..._history, { squares }],
    stepNumber: _history.length,
    xIsNext: !gameState.xIsNext,
    finished: calculateWinner(squares) || gameState.stepNumber + 1 === 9,
    player1Name: gameState.player1Name,
    player2Name: gameState.player2Name,
  };

  return res.json({ success: true, gameState });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function calculateWinner(squares: (string | null)[]): string | null {
  const lines: number[][] = [
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
