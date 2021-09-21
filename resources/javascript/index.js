onload = function () {
  document.getElementById("create_match").addEventListener(
    "click",
    async () => {
      const id = await getID();
      location.replace(`${location.origin}/lobby/${id}`);
    },
  );
  document.getElementById("join_match").addEventListener("click", () => {
    const id = prompt("Please enter your match id");
    if (id) {
      location.replace(`${location.origin}/lobby/${id}`);
    } else {
      alert("Invalid ID");
    }
  });
};

async function getID() {
  return await fetch(`${location.origin}/lobby/get_code`).then((x) => x.text());
}
