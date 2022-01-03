/// <reference lib="dom"/>

onload = () => {
  document.getElementById("create_match")!.onclick = () => {
    fetch(`${location.origin}/get_code`)
      .then((res) => res.text())
      .then((id) => redirect(`${location.origin}/lobby/${id}`));
  };

  document.getElementById("join_match")!.onclick = () => {
    const id = prompt("Please enter your match id");
    if (id) {
      redirect(`${location.origin}/lobby/${id}`);
    } else {
      alert("Invalid ID");
    }
  };
};

function redirect(url: string) {
  const input = (document.getElementById("username") as HTMLInputElement).value;
  const cookie = parseCookie();
  if (!input && !cookie.username) {
    alert(
      "No username was provided or found from the last session!\nPlease input one",
    );
  } else {
    const name = input.length > 0 ? input : cookie.username;
    document.cookie = `username=${name}`;
    location.replace(url + `/${name}`);
  }
}

function parseCookie(): Record<string, string> {
  return document.cookie.split(";")
    .map((kvPair) => kvPair.split("="))
    .reduce((record, [key, value]) => {
      record[key] = value;
      return record;
    }, {} as Record<string, string>);
}
