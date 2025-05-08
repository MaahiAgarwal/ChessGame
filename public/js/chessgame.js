const socket = io(); //for client in the front-end
const chess = new Chess(); //for chessboard
const boardElement = document.querySelector('.chessboard'); //for chessboard
const turnIndicator = document.getElementById('turnIndicator');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null; // Initialize as null

const updateTurnIndicator = () => {
    const currentTurn = chess.turn();
    turnIndicator.textContent = currentTurn === 'w' ? "White's Turn" : "Black's Turn";
    turnIndicator.className = "text-xl font-bold " + (currentTurn === 'w' ? "text-white" : "text-white");
};

const renderBoard = () =>{
    const board = chess.board();
    boardElement.innerHTML = '';

    board.forEach((row, rowInd) => {
        row.forEach((square, squareInd) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square",
                (rowInd + squareInd) % 2 === 0 ? "light" : "dark"
            )

            squareElement.dataset.row = rowInd;
            squareElement.dataset.col = squareInd;

            if(square){
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === 'w' ? 'white' : 'black');
                pieceElement.innerText = getPieceUnicode(square);
                
                // Make piece draggable if it matches player's color
                const isPlayerPiece = playerRole && playerRole === square.color;
                pieceElement.draggable = isPlayerPiece;
                
                if (isPlayerPiece) {
                    pieceElement.classList.add("draggable");
                }

                pieceElement.addEventListener("dragstart",(e)=>{
                    if(pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = {row: rowInd, col: squareInd};
                        e.dataTransfer.setData("text/plain","");
                        pieceElement.classList.add("dragging");
                    }
                })
                pieceElement.addEventListener("dragend",()=>{
                    draggedPiece = null;
                    sourceSquare = null;
                    pieceElement.classList.remove("dragging");
                })

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover",(e)=>{
                e.preventDefault();
                if (draggedPiece) {
                    squareElement.classList.add("highlight");
                }
            });

            squareElement.addEventListener("dragleave", (e) => {
                squareElement.classList.remove("highlight");
            });

            squareElement.addEventListener("drop",(e)=>{
                e.preventDefault();
                squareElement.classList.remove("highlight");
                
                if(draggedPiece && sourceSquare){
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row), 
                        col: parseInt(squareElement.dataset.col)
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });
            boardElement.appendChild(squareElement);
        })  
    })
    boardElement.setAttribute("draggable", "false");
    
    updateTurnIndicator();
}

const handleMove = (source,target) => {
    const move = {
        from: `${String.fromCharCode(97+source.col)}${8-source.row}`,
        to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion: 'q' //always promote to a queen for simplicity
    }
    
    socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
        P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
    }

    return unicodePieces[piece.type] || "";
};

socket.on("playerRole", (role)=>{
    playerRole = role;
    if (playerRole === "b") {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
    socket.emit("getInitialState"); // Request initial state from server
    renderBoard();
})

socket.on("spectatorRole",() =>{
    playerRole = null;
    renderBoard();
})

socket.on("boardState", (fen) => {
    chess.load(fen);
    updateTurnIndicator();
    renderBoard();
})

socket.on("move", (move) => {
    chess.move(move);
    updateTurnIndicator();
    renderBoard();
})

socket.on("invalidMove", () => {
    chess.undo(); // Revert the move
    updateTurnIndicator();
    renderBoard(); // Re-render the board
});

renderBoard()

