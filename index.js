"use strict";

const DateTime = luxon.DateTime;
const onSocketReceive = window.electronAPI.onSocketReceive;
const socketEmit = window.electronAPI.socketEmit;

const rooms = document.getElementById("rooms");
const chat = document.getElementById("chat");
const users = document.getElementById("users");
const settingsButton = document.getElementById("settingsButton");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");



function createRoom(name) {
    const room = document.createElement("span");
    room.className = "room";
    room.innerHTML = name;
    rooms.appendChild(room);
};

function createMessage(timestamp, nick, color, content) {
    const message = document.createElement("span");
    message.className = "message";

    const messageTimestamp = document.createElement("span");
    messageTimestamp.className = "timestamp";
    messageTimestamp.innerHTML = timestamp;
    message.appendChild(messageTimestamp);

    const messageNick = document.createElement("span");
    messageNick.className = "name";
    messageNick.innerHTML = nick;
    messageNick.style = 'color:' + color + ';';
    message.appendChild(messageNick);

    const messageContent = document.createElement("span");
    messageContent.className = "content";
    messageContent.innerHTML = content;
    message.appendChild(messageContent);

    chat.appendChild(message);
};

function createUser(nick, color, blocked, bot) {
    const user = document.createElement("span");
    user.className = "user";
    user.innerHTML = nick;
    if (color) {
        user.style = "color: " + color + ";";
    };
    if (blocked) {
        user.classList.add("blocked");
    };
    if (bot) {
        user.classList.add("bot");
    };
    users.appendChild(user);
};



onSocketReceive(function (event) {
    if (event.name === "connect") {
        console.log("Connected");
        socketEmit("user joined", "Ruxvania", "lavender", "", "");
    } else if (event.name === "message") {
        const date = DateTime.fromMillis(event.data.date);
        const timestamp = date.toLocaleString(DateTime.TIME_SIMPLE);
        const parsedContent = he.decode(event.data.msg).replace(/(?:\r\n|\r|\n)/g, '<br>');
        createMessage(timestamp, event.data.nick, event.data.color, parsedContent);
        chat.lastChild.scrollIntoView(true);
    } else if (event.name === "update users") {
        users.innerHTML = "";
        for (let user in event.data) {
            let userLocation = event.data[user]
            createUser(userLocation.nick, userLocation.color, false, userLocation.isBot);
        };
        users.firstChild.classList.add("king");
    };
});



chatInput.onkeydown = function (element) {
    if (element.keyCode === 13 && !element.shiftKey) sendChatInput(element);
};

sendButton.onclick = sendChatInput();

sendButton.addEventListener("click", sendChatInput);

function sendChatInput() {
    if (chatInput.value !== '') {
        socketEmit("message", chatInput.value);
        chatInput.value = "";
    };
};