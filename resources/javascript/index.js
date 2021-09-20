onload = function () {
  document.getElementById("join_match").addEventListener(
    "click",
    () => window.location.replace(createID()),
  );
};

function createID() {
  const u8 = new Uint8Array(3);
  crypto.getRandomValues(u8);
  let buff = "";

  for (const num of u8.values()) {
    buff += num.toString(16);
  }
  return buff;
}
