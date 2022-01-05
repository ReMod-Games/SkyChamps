/// <reference lib="dom"/>

import type { CardJson } from "../../../types/card.ts";

const EXCLUDELIST = ["description", "abilityname", "critchance"];

export function createCard(card?: CardJson): HTMLDivElement {
  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");

  if (card) updateCard(cardDiv, card);
  else cardDiv.innerHTML = "hidden";
  return cardDiv;
}

export function updateCard(element: HTMLDivElement, card?: CardJson) {
  if (element.innerHTML === "hidden" || !card) return;
  element.innerHTML = Object.entries(card)
    .filter(([key]) => !EXCLUDELIST.includes(key.toLowerCase()))
    .reduce((str, [key, value]) => str += `${key}: ${value}<br/>`, "");
}
