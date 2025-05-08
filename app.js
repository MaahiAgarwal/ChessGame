const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);
const chess = new Chess();

let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res)=>{
    res.render("index",{title : "Chess Game"});
});

io.on("connection", function (uniquesocket){
    if(!players.white){
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    }else if(!players.black){
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    }else{
        uniquesocket.emit("spectatorRole");
    }

    // Send initial board state to new connection
    uniquesocket.emit("boardState", chess.fen());

    uniquesocket.on("disconnect", function(){
        if(uniquesocket.id === players.white){
            delete players.white;
        }else if(uniquesocket.id === players.black){
            delete players.black;
        }
    });

    uniquesocket.on("move", (move)=>{
        try{
            // Check if it's the player's turn
            if(chess.turn() === 'w' && uniquesocket.id !== players.white) {
                console.log("Current turn: White's turn");
                return;
            }
            if(chess.turn() === 'b' && uniquesocket.id !== players.black) {
                console.log("Current turn: Black's turn");
                return;
            }

            const result = chess.move(move);
            if(result){
                currentPlayer = chess.turn();
                console.log("Turn changed to:", currentPlayer === 'w' ? "White" : "Black");
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            }else{
                uniquesocket.emit("invalidMove", move);
            }
        }
        catch(err){
            uniquesocket.emit("invalidMove", move);
        }
    });
});

server.listen(3000, function () {
    console.log("Server is running on port 3000");
});