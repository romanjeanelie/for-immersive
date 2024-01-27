// Utils
import { getDistance, getScaleY } from "./Utils/LinesUtils";

import gsap from "gsap";

function addLineBreaks(element, text) {
  // Split the text into lines
  const lines = text.split("\n");

  // Remove the existing content
  element.textContent = "";

  // Add each line as a text node, with a <br> element after it
  lines.forEach((line, index) => {
    element.appendChild(document.createTextNode(line));

    // Don't add a <br> after the last line
    if (index < lines.length - 1) {
      element.appendChild(document.createElement("br"));
    }
  });
}

export default class Point {
  constructor(options) {
    this.options = options;

    this.init();
  }

  init() {
    const { domEl, project, i } = this.options;

    // if (project.type === "indicator") return;
    const distance = getDistance(i);

    const scaleY = getScaleY(i);

    // Container
    this.containerEl = document.createElement("div");
    this.containerEl.classList.add("point-container");

    // Point
    this.pointEl = document.createElement("span");
    this.pointEl.classList.add("point");
    this.pointEl.classList.add("point--" + project.type);

    // Circle
    this.circleEl = document.createElement("span");
    this.circleEl.classList.add("point__circle");
    this.pointEl.appendChild(this.circleEl);

    // Description
    this.descriptionEl = document.createElement("div");
    this.descriptionEl.classList.add("point__description");
    this.descriptionEl.classList.add("point__description--" + project.descriptionDirection);
    this.descriptionEl.classList.add("point__description--" + project.type);

    // this.descriptionEl.textContent = project.title;
    addLineBreaks(this.descriptionEl, project.title);

    this.containerEl.appendChild(this.pointEl);
    this.containerEl.appendChild(this.descriptionEl);

    this.containerEl.style.top = `${scaleY * 100}%`;
    this.containerEl.style.left = `${distance * 100}%`;

    this.pointEl.addEventListener("mouseenter", () => this.onMouseEnter());
    this.pointEl.addEventListener("mouseleave", () => this.onMouseLeave());

    domEl.appendChild(this.containerEl);
  }

  onMouseEnter() {
    // Point
    gsap.killTweensOf(this.pointEl, this.circleEl, this.descriptionEl);
    gsap.to(this.pointEl, {
      scale: 0.6,
      duration: 0.5,
      //   ease: "back.out(1.5)",
    });
    gsap.to(this.circleEl, {
      scale: 6,
      duration: 0.5,
      ease: "back.out(1.5)",
    });

    // Description
    gsap.to(this.descriptionEl, {
      opacity: 1,
    });
  }
  onMouseLeave() {
    gsap.killTweensOf(this.pointEl, this.circleEl, this.descriptionEl);

    // Point
    gsap.to(this.pointEl, {
      scale: 1,
    });
    gsap.to(this.circleEl, {
      scale: 1,
    });

    // Description
    gsap.to(this.descriptionEl, {
      opacity: 0,
    });
  }

  animIn({ delay }) {
    // gsap.to(".point", {
    //   opacity: 1,
    //   delay,
    //   duration: 3,
    //   stagger: {
    //     each: 0.04,
    //     from: "center",
    //     grid: "auto",
    //     ease: "power2.inOut",
    //   },
    // });
  }

  goToFinalPosition() {
    gsap.set([this.pointEl, this.descriptionEl], {
      opacity: 1,
    });
  }
}
