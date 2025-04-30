const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const osc = require('osc');

const app = express();
const server = http.createServer(app); // pass app here!
const io = socketIo(server);

// 1) Set up OSC UDP port to communicate with VRChat
const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121, // can be any unused port
    remoteAddress: "127.0.0.1",
    remotePort: 9000  // VRChat's default OSC port
});

udpPort.open();

udpPort.on("ready", () => {
    console.log("OSC Port ready to send messages to VRChat.");
});

// 2) WebSocket connection with frontend
io.on("connection", (socket) => {
    console.log("Frontend connected via WebSocket.");

    // 3) Listen for color updates
    socket.on("color-change", (data) => {
        const { r, g, b } = data;

        // 4) Construct OSC messages for each parameter
        const oscMessages = [
            { address: "/avatar/parameters/paramRed", args: [{ type: "f", value: r }] },
            { address: "/avatar/parameters/paramGreen", args: [{ type: "f", value: g }] },
            { address: "/avatar/parameters/paramBlue", args: [{ type: "f", value: b }] }
        ];

        // 5) Send each message
        oscMessages.forEach(msg => {
            udpPort.send(msg);
            console.log(`Sent ${msg.address} = ${msg.args[0].value}`);
        });
    });

    socket.on("disconnect", () => {
        console.log("Frontend disconnected.");
    });
});

// Start the server
server.listen(3001, () => {
    console.log("WebSocket + OSC Server running on http://localhost:3001");
});
