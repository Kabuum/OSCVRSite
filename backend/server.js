const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const osc = require('osc');
const path = require('path');

const app = express();

const cert = {
    key: fs.readFileSync(path.join(__dirname, 'PEMkeys', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'PEMkeys', 'certificate.crt'))
};

const server = https.createServer(cert,app);

const io = socketIo(server, {
    cors: {
        origin: "https://Kabuum.github.io", //frontend address
        methods: ["GET", "POST"]
    }
});


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
        console.log('color change received');
        const { r, g, b } = data;

        // 4) Construct OSC messages for each parameter
        const oscMessages = [
            { address: "/avatar/parameters/paramRed", args: [{ type: "f", value: r }] },
            { address: "/avatar/parameters/paramGreen", args: [{ type: "f", value: g }] },
            { address: "/avatar/parameters/paramBlue", args: [{ type: "f", value: b }] }
        ];

        // 5) Send each message
        oscMessages.forEach(msg => {
            console.log('sent message: ' + msg);
            udpPort.send(msg);
            console.log(`Sent ${msg.address} = ${msg.args[0].value}`);
        });
    });

    socket.on("disconnect", () => {
        console.log("Frontend disconnected.");
    });
});

// Start the server
server.listen(3478, () => {
    console.log("WebSocket + OSC Server running on http://localhost:3478");
});
