import { hasConnection, ws } from "./init.js";

document.querySelector("#login").onsubmit = function (event) {
  event.preventDefault();
  if (hasConnection()) {
    ws.send(
      JSON.stringify({
        type: "login",
        payload: document.querySelector("#username").value,
      })
    );
  }
};

ws.onmessage = (event) => {
  const eventObject = JSON.parse(event.data);
  if (eventObject.type === "login") {
    sessionStorage.setItem("userId", eventObject.user.id);
    location.replace("./chat.html");
  }
};
