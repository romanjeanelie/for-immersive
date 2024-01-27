import Experience from "./Experience/Experience.js";
import CopyButton from "./CopyButton.js";
import projects from "@root/projects.json";

const experience = new Experience({
  targetElement: document.querySelector(".experience"),
});

const textToCopy = projects
  .map((project) => {
    if (!project.url) return null;
    return `[${project.title}](${project.url}) -  [ ${project.type} ]`;
  })
  .filter(Boolean)
  .join("\n\n");

const buttonLinks = document.querySelector("#button-links");
new CopyButton({ element: buttonLinks, text: textToCopy, successText: "COPIED", errorText: "" });
console.log(textToCopy);
