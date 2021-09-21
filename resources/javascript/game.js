// Hacky but it works
const gameID = document.location.pathname.split("/").pop();
const ws = new WebSocket(`ws://${document.location.host}/game/${gameID}/`);

ws.onopen = console.log;
ws.onclose = console.log; // Possibly Add this to chat?
ws.onmessage = messageHandler;

function messageHandler(evt) {
  switch (evt.type) {
    case "chat":
      // Log to chat
      break;
    case "opponent_play_card":
      // Opponent plays a card
      // Play animation
      break;
    case "opponent_attack":
      // Opponent does attack card of you
      // Get card they attacked
      // Change values
      break;
    case "opponent_ability":
    case "self_play_card":
    case "self_attack":
    case "self_ability":
      break;
  }
}
