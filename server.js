const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const port = 6969;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const chatParticipants = [];
const messagesHistory = [];

app.use(express.static("public"));

app.get("/participants", (req, res) => {
  res.status(200).json(chatParticipants);
});

app.get("/chat-history", (req, res) => {
  res.status(200).json(messagesHistory);
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    const dataObject = JSON.parse(data);
    let responseEvent = {};
    if (dataObject.type === "login") {
      const user = {
        name: dataObject.payload,
        id: uuidv4(),
      };
      chatParticipants.push(user);
      responseEvent = {
        type: "login",
        user: {
          ...user,
        },
      };
    }

    if (dataObject.type === "message") {
      const { type, senderId, payload } = dataObject;
      responseEvent = {
        type,
        sender: chatParticipants.find(
          (participant) => participant.id === senderId
        ),
        message: payload,
      };
      messagesHistory.push(responseEvent);
    }

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(responseEvent));
      }
    });
  });
});

wss.on("close", function close() {
  console.log("connection closed");
});

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
