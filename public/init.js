export let ws;

function init() {
  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }

  ws = new WebSocket("ws://localhost:6969");
  ws.onopen = () => {
    console.log("Socket connetion is opened");
  };

  ws.onclose = function (event) {
    if (event.wasClean) {
      console.log(
        `connection was closed clear. Code: ${event.code}. Reason: ${event.reason}`
      );
    } else {
      console.log("connection was interrupted", event);
    }
  };
}

window.onbeforeunload = function leaveChat() {
  if (hasConnection()) {
    ws.close(1001);
  }
};

export function hasConnection() {
  if (!ws) {
    return false;
  }
  return true;
}

init();
