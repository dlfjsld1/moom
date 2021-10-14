const socket = io();//socket.io를 사용하면 port나 ws를 쓸 필요가 없다 io function은 스스로 socket.io를 실행하고 있는 서버를 찾는다

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
    console.log(`The backend days : ${msg}`);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, backendDone);
    input.value = "";
    //socket.emit()에서 첫 번째 매개변수는 이벤트명이다
    //원하는 만큼 매개변수를 보내도 되지만 보내는 function은 반드시 마지막 매개변수여야 한다
    //socket.emit("event이름", payload(object가능), 서버에서 호출하는 callback - front-end임에도 서버에서 호출하는 callback을 가진다!))
    //socket.io에서는 이름에 상관없이 특정한 event를 emit할 수 있다.
    //websocket에선 argument(매개변수)로 object를 보내려면 JSON화를 해야 했지만 socket.io에선 그럴 필요가 없이 바로 object를 보낼 수 있다.
}

form.addEventListener("submit", handleRoomSubmit);

//websocket과 차별되는 socket.io의 장점 
//1. 모든 것이 message일 필요가 없다. client는 어떤 event이든 emit(send아님!)이 가능하다
//2. 전송할 때 string이 아닌 원시 자료형이나 객체를 한 번에 여러 개 전송 가능


//websocket으로 만든 front-end 코드
// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");
// const socket = new WebSocket(`ws://${window.location.host}`)//프론트엔드에서 socket이란 서버로의 연결을 뜻함
// //new WebSocket('주소')로 서버와 연결한다. window.location.host는 브라우저에서 현재 주소를 나타냄
// function makeMessage(type, payload) {
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }

// socket.addEventListener("open", () => {//여기서 쓰는 addEventListener는 JS 함수 문법, 서버의 on은 NodeJS 함수 문법이다!
//     console.log("Connected to Server!");
// });//연결됐을 때

// socket.addEventListener("message", message => {
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
// });//(서버에서)message를 받을 때마다

// socket.addEventListener("close", () => {
//     console.log("Disconnected from Server!")
// })//서버가 offline일 때

// function handleSubmit(event) {
//     event.preventDefault();//submit에서 페이지의 리프레시를 막거나 a태그에서 페이지를 이동시키는 동작을 막는다
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));//socket.send로 백엔드에 메시지를 보낸다
//     const li = document.createElement("li");
//     li.innerText = `나: ${input.value}`;
//     messageList.append(li);
//     input.value = '';//보낸 뒤에 input의 value를 지워준다. 즉, submit하면 입력한 메시지가 사라진다
// }

// function handleNickSubmit(event) {
//     event.preventDefault();//submit에서 페이지의 리프레시를 막거나 a태그에서 페이지를 이동시키는 동작을 막는다
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));//socket.send로 백엔드에 메시지를 보낸다
//     input.value = '';
// }

// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);
