import { hasConnection, ws } from "./init.js";

document.addEventListener("DOMContentLoaded", function loadParticipants() {
  const participantsRequest = fetch("/participants", {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  participantsRequest
    .then((response) => response.json())
    .then((participants) => showParticipants(participants));

  const messagesHistoryRequest = fetch("/chat-history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  messagesHistoryRequest
    .then((response) => response.json())
    .then((messagesHistory) => {
      messagesHistory.forEach((message) => showMessage(message));
    });
});

function showParticipants(participants) {
  participants.forEach((part) => {
    const participantBlock = document.createElement("div");
    participantBlock.classList.add("participant");
    participantBlock.innerHTML = `<span class="participant-name">${part.name}</span>`;
    if (sessionStorage.getItem("userId") === part.id) {
      participantBlock.innerHTML += `<span class="participant-indicator">Это ты</span>`;
    }
    document.querySelector("#participants").append(participantBlock);
  });
}

document.querySelector("#send-message").onsubmit = function (event) {
  event.preventDefault();
  if (hasConnection()) {
    ws.send(
      JSON.stringify({
        type: "message",
        senderId: sessionStorage.getItem("userId"),
        payload: document.querySelector("#message-input").value,
      })
    );
    document.querySelector("#send-message").reset();
  }
};

ws.onmessage = (event) => {
  const eventObject = JSON.parse(event.data);

  if (eventObject.type === "login") {
    return showParticipants([eventObject.user]);
  }

  if (eventObject.type === "message") {
    return showMessage(eventObject);
  }
};

function showMessage(message) {
  const messageBox = document.createElement("div");
  messageBox.classList.add("message-single");
  if (message.sender.id === sessionStorage.getItem("userId")) {
    messageBox.classList.add("my-message");
  }
  messageBox.innerHTML = `<div class="message-sender">${message.sender.name}</div>
                          <div class="message-content">${message.message}</div>`;
  document.querySelector("#messages-area").append(messageBox);
}
