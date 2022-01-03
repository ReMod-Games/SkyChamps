/// <reference lib="dom"/>

export function setTimer(timeLeft: number, interval: number) {
  const timer = document.getElementById("timer")!;
  let timeRemaining = timeLeft;
  const intervalSecond = interval / 1000;
  const timeout = setInterval(
    () => {
      const time = (timeRemaining - intervalSecond);
      if (time <= 0) clearInterval(timeout);
      timer.innerText = time.toFixed(0);
      timeRemaining = time;
    },
    interval,
  );
}

export function setPlayername(name: string): void {
  const user = document.getElementById("username")!;
  user.innerText = name;
}

export function addGameMessage(message: string) {
  const chat = document.getElementById("chat_box")!;
  chat.innerHTML += `<p class="game_message">${message}</p>`;
}

export function addChatMessage(message: string, player: string) {
  const chat = document.getElementById("chat_box")!;
  chat.innerHTML += `<p>${player}: ${message.replace(/[\r\n]/, "<br>")}</p>`;
}

export function addErrorMessage(message: string) {
  const chat = document.getElementById("chat_box")!;
  chat.innerHTML += `<p class="error">${message}</p>`;
}
