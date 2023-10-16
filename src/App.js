import { useState } from "react";

function Square({value, onSquareClick, winLine, id}) {
  if(winLine==null){
    return (
      <button className="square" onClick={onSquareClick}>
          {value}
      </button>);
  }else {
    console.log("co win");
    for (let i=0; i<3; i++){
      if (id === lines[winLine][i]){
        console.log("win ne");
        return (
          <button className="squareWin" onClick={onSquareClick}>
              {value}
          </button>);
      }
    }
    return (
      <button className="square" onClick={onSquareClick}>
          {value}
      </button>);
  }
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return; 
    }
    const nextSquares = squares.slice();
    if (xIsNext){
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    
    onPlay(nextSquares, i);
  }
  let winLine;
  const winner = calculateWinner(squares);
  
  let status;
  if (winner) {
    status = "Winner: " + winner;
    winLine = findWinLine(squares);
    //console.log("Win line la: ", winLine);
  } else if (currentMove === 9){
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // return (
  //   <>
  //     <div className="status">{status}</div>
  //     <div className="board-row">
  //       <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
  //       <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
  //       <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
  //       <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
  //       <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
  //       <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
  //       <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
  //     </div>
  //   </>
  // );
  const row = [0, 1, 2];
  const column = [0, 1, 2];
  return (
    <>
      <div className="status">{status}</div>
      {row.map(i => (
        <div className="board-row" key={i}>
          {column.map(j => (
              <Square key={3*i+j} value={squares[3 * i + j]} onSquareClick={() => handleClick(3 * i + j)} winLine={winLine} id={3*i+j}/>
          ))}
        </div>
      ))}
    </>
  );
}
const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
function calculateWinner(squares) {
    for (let i = 0; i < lines.length; i++){
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
        //console.log("tinh ra win ");
        return squares[a];
      }
    }
    return null;
}
function findWinLine(squares) {
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
      return i;
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setAscending] = useState(true);
  const [moveList, setMoveList] = useState([null]);
  function handlePlay(nextSquares, nextMovePlace) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextMoveList = [...moveList.slice(0, currentMove + 1), nextMovePlace];
    setMoveList(nextMoveList);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function changeOrder() {
    setAscending(!isAscending);
  }

  const moves = history.map((squares, exactMove) => {
    // let description;
    // if (move > 0) {
    //   description = 'Go to move #' + move;
    // } else {
    //   description = 'Go to game start';
    // }
    // return (
    //   <li key={move}>
    //     <button onClick={() => jumpTo(move)}>{description}</button>
    //   </li>
    // );
    let move = isAscending?exactMove:history.length-exactMove-1;
    if (move === 0 && move === currentMove) {
      return (
        <li key={move}>
         <p>You are at the game start</p>
        </li>
      )
    } else if (move === 0 && move !== currentMove) {
      return (
        <li key={move}>
         <button onClick={() => jumpTo(move)}>Go to the game start</button>
        </li>
      )
    } else if (move !== 0 && move === currentMove) {
      return (
        <li key={move}>
         <p>You are at move #{move}</p>
        </li>
      )
    } else {
      return (
        <li key={move}>
         <button onClick={() => jumpTo(move)}>Go to move #{move}</button>
        </li>
      )
    }
  });
  const showMovesList = moveList.map(i => {
    if (i==null) {
      return;
    // } else if (xIsNext){
    }else
      return(
        <li key={i}>
         <p>Go to place #{i}</p>
        </li>
      )
    // } else{
    //   return(
    //     <li key={i}>
    //      <p>Go to place #{i}</p>
    //     </li>
    //   )
    // }    
  });
  
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>

      <div className="game-info">
        <ol> {moves} </ol>
      </div>

      <div>
        <button onClick={changeOrder}>Change order</button>
      </div>
      
      <div className="game-info">
        <p>Move list</p>
        <ol> {showMovesList} </ol>
      </div>
    </div>
  );   
}