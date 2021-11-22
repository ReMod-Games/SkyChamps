/// <reference lib="dom"/>

onload = function () {
  document.getElementById("create_match")!.addEventListener(
    "click",
    () => {
      const name =
        (document.getElementById("username") as HTMLInputElement).value;
      fetch(`http://localhost:8000/get_code`)
        .then((res) => res.text())
        .then((id) => location.replace(`./lobby/${id}/${name}`));
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
