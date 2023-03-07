const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", socket => {
    socket.on("newuser", username => {
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", username => {
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat", message => {
        socket.broadcast.emit("chat", message);
    });
    socket.on('userTyping', username => {
        socket.broadcast.emit("userTyping", username + " is typing...");
    })
    socket.on('userStoppedTyping', () => {
        socket.broadcast.emit("userStoppedTyping", '');
    })
});

server.listen(3000, err => {
    if(!err){
        console.log("Server Running Successfully");
    }
    else{
        console.log("Error",err);
    }
})
