import { WebSocketServer, WebSocket } from 'ws';

// create a websocket server on port 8080
const wss = new WebSocketServer({ port:8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {

    // message from postman to terminal
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        
        if (parsedMessage.type === "join") {
            console.log("User joined room:", parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }
        //@ts-ignore
        if (parsedMessage.type === "chat") {
            console.log("User want to chat");
            
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++){
                if (allSockets[i]?.socket === socket){
                    currentUserRoom = allSockets[i]?.room;

                }
            }
            for (let i = 0; i < allSockets.length; i++){
                if (allSockets[i]?.room === currentUserRoom){
                    allSockets[i]?.socket.send(parsedMessage.payload.message);

                }
            }
            

        }
    })
})