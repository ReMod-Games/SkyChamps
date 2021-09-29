class HP extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.hp = document.createElement("div");
    this.hp.style = {
      "background-color": "white",
    };
    shadow.appendChild();
  }
}
