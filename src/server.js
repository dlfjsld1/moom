import http from "http";
import SocketIO from "socket.io"; //웹소켓일 경우 import WebSocket from "ws";
import express from "express";

const app = express();
const port = 3000;
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`app listening on ws://localhost:${port} and http://localhost:${port} and http://localhost:${port}/socket.io/socket.io.js`)
//app.listen(port, handleListen);
const httpServer = http.createServer(app);//http서버임
const wsServer = SocketIO(httpServer); //socket.io 서버를 http 서버 위에 올린다

wsServer.on("connection", socket => {
    socket.onAny((event) => {//모든 이벤트에 console.log를 사용할 수 있다
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {//socket.on("event이름", front-end에서 받은 함수, 실행할 시간(ms))
        //console.log를 찍어보면 user의 socket id는 user가 있는 room의 id와 같다. 
        //왜냐면 socket.IO에서 모든 socket은 user와 server 사이에 private room이 있기 때문
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
        //socket.to("방이름").emit("message")는 자신을 제외한 다른 사람에게 메시지를 보낸다!
        //back-end에서 front-end에서 (반드시)마지막 argument로 받은 함수를 실행시키면 front-end에서 실행된다
        //front-end에서 실행될 done() 함수에 back-end에서 매개변수를 담아 front-end에서 실행하게 만들 수 있다!
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye"));
    })
});



//websocket으로 만든 코드

// const wss = new WebSocket.Server({ server });//같은 포트에 http서버가 필요 없다면 WebSocket.server()에 {server} 안 넣어도 됨
// //http 서버 위에 webSocket 서버를 만든 것이다. http서버가 필요한 이유는 views, static files, home, redirection을 원하기 때문
// const sockets = [];//임시적으로 서버 역할을 하는 배열

// wss.on("connection", (socket) => {//socket이란 연결된 사람, 연결된 브라우저와의 contact(연락)라인을 뜻한다. 여기서 socket은 연결된 브라우저이다.
//     sockets.push(socket);
//     socket["nickname"] = "익명";//socket은 객체이므로 속성을 추가할 수 있다
//     console.log("Connected to Browser");
//     socket.on("close", () => console.log("Client Browser Closed."))//웹소켓 서버에서 close 이벤트는 브라우저가 닫혔을 때.
//     socket.on("message", msg => {
//         const message = JSON.parse(msg.toString('utf8'));//브라우저에서 오는 message가 버퍼로 와서 utf8로 인코딩 해 주었다.
//         switch(message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${aSocket.nickname}: ${message.payload}`));
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;//익명을 프론트엔드에서 받은 닉네임으로 변경
//                 break;
//         }
//     })
// });

httpServer.listen(port, handleListen);
