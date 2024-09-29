"use strict";

const DateTime = luxon.DateTime;

const rooms = document.getElementById("rooms");
const chat = document.getElementById("chat");
const users = document.getElementById("users");

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

createRoom("chatbot");

createMessage("20:43 PM", 'Lance', "red", "Hello nooblets");

createUser("Nesbott [.]", "gold", false);

window.electronAPI.onSocketReceive((event) => {
    if (event.name === "message") {
        const date = DateTime.fromMillis(event.data.date);
        const timestamp = date.toLocaleString(DateTime.TIME_SIMPLE);
        createMessage(timestamp, event.data.nick, event.data.color, event.data.msg);
    };
    if (event.name === "update users") {
        users.innerHTML = "";
        for (let user in event.data) {
            let userLocation = event.data[user]
            console.log(user);
            console.log(userLocation);
            createUser(userLocation.nick, userLocation.color, false, userLocation.isBot);
        };
    };
});