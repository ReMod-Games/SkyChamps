/// <reference lib="dom"/>

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
  chat.innerHTML += `<p>${player}: ${message.replace(/[\r-\n]/, "<br>")}</p>`;
}

export function addErrorMessage(message: string) {
  const chat = document.getElementById("chat_box")!;
  chat.innerHTML += `<p class="error">${message}</p>`;
}
