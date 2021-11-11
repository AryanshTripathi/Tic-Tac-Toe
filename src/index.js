import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Board from "./board";
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      this.ok = true;
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      if (desc === "Go to game start") {
        return (
          <button
            onClick={() => {
              this.jumpTo(move);
              this.ok = false;
            }}
            className="main-button"
          >
            {desc}
          </button>
        );
      } else {
        return (
          <li key={move}>
            <button
              onClick={() => {
                this.jumpTo(move);
                this.ok = false;
              }}
              className="list-buttons"
            >
              {desc}
            </button>
          </li>
        );
      }
    });
    let status;
    if (winner) {
      status = "Winner: " + winner;
      this.ok = true;
    } else {
      let check = false;
      for (let i = 0; i < 9; i++) {
        if (current.squares[i] === null) {
          check = true;
        }
      }
      if (check) {
        status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
      } else {
        status = "Draw";
      }
    }
    // console.log(status);
    return (
      <div className="game">
        <div className={this.ok ? "game-over" : "game-status"}>
          <div className={this.ok ? "game-over-msg" : "game-going-on"}>
            {status}
          </div>
        </div>

        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>

        <div className="game-info">
          <ul className={this.check ? "main-button" : "list-buttons"}>
            {moves}
          </ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
