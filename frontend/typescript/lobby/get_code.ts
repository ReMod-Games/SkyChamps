fetch(`http://localhost:8000/get_code`)
  .then((res) => res.text())
  .then((id) => location.replace("../lobby/" + id));
