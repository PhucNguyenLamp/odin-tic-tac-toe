const Player = (name, symbol) => ({ name, symbol });
const GameBoard = (() => {
    let board = Array(9).fill(null);

    const reset = () => {
        board.fill(null);
    }
    const setMove = (index, symbol) => {
        if (!board[index]) board[index] = symbol;
    }
    const getBoard = () => board;
    const display = () => {
        console.log(board.slice(0, 3), board.slice(3, 6), board.slice(6, 9));
    }
    return { reset, setMove, getBoard, display }
})();

const GameController = (() => {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;
    let isGameOver = false;

    const getCurrentPlayer = () => {
        return currentPlayer;
    }
    const switchTurn = () => {
        currentPlayer = currentPlayer == player1 ? player2 : player1;
    }
    const checkWin = () => {
        const board = GameBoard.getBoard();
        const winCombination = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winCombination.some(combination => {
            return combination.every(index => board[index] === currentPlayer.symbol);
        })
    }
    const playRound = (index) => {
        if (isGameOver) return;
        GameBoard.setMove(index, currentPlayer.symbol);
        GameBoard.display();
        if (checkWin()) {
            console.log(`${currentPlayer.name} wins!`);
            isGameOver = true;
            return;
        }
        if (GameBoard.getBoard().every(cell => cell)) {
            console.log('Draw!');
            isGameOver = true;
            return;
        }
        switchTurn();
    };
    const resetGame = () => {
        GameBoard.reset();
        currentPlayer = player1;
        isGameOver = false;
    }
    return { playRound, resetGame, getCurrentPlayer, checkWin }
})();

const button = document.querySelector('button');
button.addEventListener('click', () => {
    GameController.resetGame();
    renderGame();
    con.removeEventListener('mousemove', doIt);
    con.removeEventListener('click', doItHard);
})
const container = document.querySelectorAll('.grid-item')
for (let i = 0; i < 9; i++) {
    container[i].addEventListener('click', () => {
        GameController.playRound(i);
        renderGame();
    })
}
const con = document.querySelector('.container')
const turn = document.querySelector('.turn');
const changeTurn = () => {
    const name = GameController.getCurrentPlayer().name;
    if (GameController.checkWin()) {
        turn.textContent = `${name} Wins❗`;
        con.addEventListener("mousemove", doIt);
        con.addEventListener("click", doItHard);
        return;
    }
    turn.textContent = `${name}'s Turn❗`;
}

changeTurn();

const renderGame = () => {
    const board = GameBoard.getBoard();
    for (let i = 0; i < 9; i++) {
        const symbol = board[i] == 'X' ? '❌' : board[i] == 'O' ? '⭕' : null;
        container[i].textContent = symbol;
    }
    changeTurn();
}




import confetti from "https://cdn.skypack.dev/canvas-confetti";

const doItNow = (evt, hard) => {
    const direction = Math.sign(lastX - evt.clientX);
    lastX = evt.clientX;
    const particleCount = hard ? r(122, 245) : r(2, 15);
    confetti({
        particleCount,
        angle: r(90, 90 + direction * 30),
        spread: r(45, 80),
        origin: {
            x: evt.clientX / window.innerWidth,
            y: evt.clientY / window.innerHeight
        }
    });
};
const doIt = (evt) => {
    doItNow(evt, false);
};

const doItHard = (evt) => {
    doItNow(evt, true);
};
let lastX = 0;

function r(mi, ma) {
    return parseInt(Math.random() * (ma - mi) + mi);
}
