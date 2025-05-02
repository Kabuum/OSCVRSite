const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const osc = require('osc');

const app = express();

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("Backend is working");
});


const io = socketIo(server, {
    cors: {
        origin: "https://kabuum.github.io", //frontend address
        methods: ["GET", "POST"]
    }
});

// 2) WebSocket connection with frontend
io.on("connection", (socket) => {
    console.log("Frontend connected via WebSocket.");

    // 3) Listen for color updates
    socket.on("color-change", (data) => {
        console.log('color change received');
        const { r, g, b } = data;
        io.emit("color-change", data);
    });

    socket.on("disconnect", () => {
        console.log("Frontend disconnected.");
    });
});

// Start the server
const PORT = process.env.PORT || 3478;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
