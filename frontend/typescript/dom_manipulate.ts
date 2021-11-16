export function cancelTimer(id: number) {
  const timer = document.getElementById("timer")!;
  document.removeChild(timer);
  clearInterval(id);
}

export function startTimer(endDate: Date) {
  const timer = document.getElementById("timer")!;
  const stopTimeMs = endDate.getMilliseconds();
  const stopTimS = endDate.getSeconds();
  const id = setInterval(() => {
    const now = new Date();

    if (now.getMilliseconds() < stopTimeMs) {
      timer.innerText = `Time Left: ${(stopTimS - now.getSeconds())}`
    } else cancelTimer(id);

  }, 1000);
}