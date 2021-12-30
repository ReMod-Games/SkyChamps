/// <reference lib="dom"/>
import type { CardJson } from "../../../types/card.ts";
export function setTimer(timeLeft: number, interval: number): number {
  const timer = document.getElementById("timer")!;
  let timeRemaining = timeLeft;

  return setInterval(
    () => timer.innerText = (timeRemaining -= interval).toString(),
    interval,
  );
}

export function setPlayername(name: string): void {
  const user = document.getElementById("username")!;
  user.innerText = name;
}

export function addChatMessage(message: string, player: string) {
  const chat = document.getElementById("chat_box")!;
  chat.innerHTML += `<p>${player}: ${message.replace(/[\r\n]/, "<br>")}</p>`;
}

export function addErrorMessage(message: string) {
  const chat = document.getElementById("chat_box")!;
  chat.innerHTML += `<p class="error">${message}</p>`;
}

export function addToDeck(player: "opp"): void;
export function addToDeck(player: "self", card: CardJson): void;
export function addToDeck(player: "self" | "opp", card?: CardJson): void {
  const deck = document.getElementById(player + "_deck");
  if (!deck) return;
  const cardDiv = document.createElement("div");
  if (card) {
    cardDiv.innerHTML = Object.entries(card)
      .reduce((str, [key, value]) => str += `${key}: ${value}<br/>`, "");
  } else cardDiv.innerHTML = "hidden";

  deck.appendChild(cardDiv);
}
