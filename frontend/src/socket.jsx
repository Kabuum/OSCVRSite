import { io } from "socket.io-client";

const socket = io("wss://oscvrsite.onrender.com", {
    autoConnect: false // optional: only connect when needed
});

let connectionCount = 0;

function connect(){
    if(connectionCount === 0){
        socket.connect();
        console.log("[socket.js] Connected");
    }
    connectionCount++;
}
function disconnect() {
    connectionCount--;
    if (connectionCount <= 0) {
        socket.disconnect();
        connectionCount = 0; // Just to be safe
        console.log("[socket.js] Disconnected");
    }
}
export { socket as default, connect, disconnect };