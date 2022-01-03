import type { CardJson } from "../../../types/card.ts";

export function createCard(card?: CardJson): HTMLDivElement {
  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");
  if (card) {
    cardDiv.innerHTML = Object.entries(card)
      .filter(([key]) => key.toLowerCase().includes("name"))
      .reduce((str, [key, value]) => str += `${key}: ${value}<br/>`, "");
  } else cardDiv.innerHTML = "hidden";
  return cardDiv;
}
