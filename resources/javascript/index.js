onload = function () {
  document.getElementById("create_match").addEventListener(
    "click",
    async () => window.location.replace(`./lobby/${await getID()}`),
  );
};

async function getID() {
  return await fetch(`./lobby/get_code`).then((x) => x.text());
}
