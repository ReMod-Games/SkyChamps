const id = await fetch(`http://localhost:8001/get_code`).then((res) =>
  res.text()
);
location.replace(`${location.origin}/lobby/${id}`);
