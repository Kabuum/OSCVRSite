const { io } = require('socket.io-client');
const osc = require('osc');

const socket = io("wss://oscvrsite.onrender.com");

const udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 57121,
    remoteAddress: "127.0.0.1",
    remotePort: 9000
});

udpPort.open();

socket.on("connect", () => {
    console.log("Connected to backend");
});

socket.on("color-change", ({ r, g, b }) => {
    console.log("Received color-change:", r, g, b);
    udpPort.send({ address: "/avatar/parameters/paramRed", args: [{ type: "f", value: r }] });
    udpPort.send({ address: "/avatar/parameters/paramGreen", args: [{ type: "f", value: g }] });
    udpPort.send({ address: "/avatar/parameters/paramBlue", args: [{ type: "f", value: b }] });
});
