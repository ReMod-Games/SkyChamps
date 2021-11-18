/// <reference lib="dom"/>

fetch(`http://localhost:8001/get_code`, { mode: "no-cors" })
  .then((res) => res.headers)
  .then((id) => {
    console.log(id);
    location.replace(`../lobby/${id}`)
  }
    );
