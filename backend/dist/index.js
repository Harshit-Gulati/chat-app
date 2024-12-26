"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const roomSocketMap = new Map();
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        const roomId = parsedMessage.payload.roomId;
        if (parsedMessage.type === "join") {
            if (!roomSocketMap.has(roomId)) {
                roomSocketMap.set(roomId, new Set());
            }
            roomSocketMap.get(roomId).add(socket);
            socket.on("close", () => {
                const roomSockets = roomSocketMap.get(roomId);
                if (roomSockets) {
                    roomSockets.delete(socket);
                    if (roomSockets.size === 0) {
                        roomSocketMap.delete(roomId);
                    }
                }
            });
        }
        if (parsedMessage.type === "chat") {
            const roomSockets = roomSocketMap.get(roomId);
            if (roomSockets) {
                roomSockets.forEach((x) => {
                    x.send(JSON.stringify({
                        message: parsedMessage.payload.message,
                        username: parsedMessage.payload.username,
                        timestamp: new Date(),
                    }));
                });
            }
        }
    });
});
