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
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res)=>{
    res.render("index",{title : "Chess Game"});
});

io.on("connection", function (uniquesocket){//callback function when a new socket connects
    console.log("Connected");

    if(!players.white){
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "W");//telling the player that he is white
    }else if(!players.black){
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "B");//telling the player that he is black
    }
    else{
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("disconnected",function(){
        console.log("Disconnected");
        if(uniquesocket.id === players.white){
            delete players.white;
        }else if(uniquesocket.id === players.black){
            delete players.black;
        }
    });

    uniquesocket.on("move", (move)=>{

        try{
            if(chess.turn() === 'W' && uniquesocket.id !== players.white) return;//if the player is not white and its white's turn, return
            if(chess.turn() === 'B' && uniquesocket.id !== players.black) return;

            const result = chess.move(move);//move the piece
            if(result){
                currentPlayer = chess.turn();//get the current player
                io.emit("move",move); //emit the move to all players to the front-end
                io.emit("boardState",chess.fen());

            }else{
                console.log("Invalid Move:", move);
                uniquesocket.emit("invalidMove", move);//emit the invalid move to the player who made the move   
            }

        }
        catch(err){
            console.log("Error:", err);
            uniquesocket.emit("Invalid Move : ", move);//emit the invalid move to the player who made the move
        }
    });
});

server.listen(3000, function () {
    console.log("Server is running on port 3000");
});