/// <reference lib="dom"/>

onload = function () {
  document.getElementById("create_match")!.addEventListener(
    "click",
    () => {
      location.replace(`${location.origin}/lobby/`);
    },
  );
  document.getElementById("join_match")!.addEventListener("click", () => {
    const id = prompt("Please enter your match id");
    if (id) {
      location.replace(`${location.origin}/lobby/${id}`);
    } else {
      alert("Invalid ID");
    }
  });
};
