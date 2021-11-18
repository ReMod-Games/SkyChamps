/// <reference lib="dom"/>

import * as WebsocketConnection from "./websocket.js";

onload = () => {
  const chatInput = document.getElementById("chat_input")! as HTMLInputElement;
  
  chatInput.addEventListener("click", () => {
    WebsocketConnection.send({
      type: "chat_message",
      message: chatInput.innerText,
      user: WebsocketConnection.identity,
    });
    chatInput.innerText = "";
  });
};

export function sendMessage(evt: MouseEvent): void {
  evt.button;
}
