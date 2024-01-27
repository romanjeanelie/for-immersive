import Experience from "./Experience/Experience.js";
import CopyButton from "./CopyButton.js";
const experience = new Experience({
  targetElement: document.querySelector(".experience"),
});

const buttonLinks = document.querySelector("#button-links");
new CopyButton({ element: buttonLinks, text: "Links", successText: "Copied!", errorText: "" });
