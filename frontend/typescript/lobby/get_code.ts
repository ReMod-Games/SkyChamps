/// <reference lib="dom"/>

onload = async () => {
  const id = await fetch(`http://localhost:8001/get_code`, {mode: "no-cors"}).then((res) =>
    res.text()
  );
  location.replace(`${location.origin}/lobby/${id}`);
};
