import projects from "../../projects.json";
import gsap from "gsap";
import { getDistanceBetweenTwoYears, getDistanceProjectByYear } from "./Utils/LinesUtils";

export default class Years {
  constructor(options) {
    this.years = ["2021", "2022", "2023", "2024"];

    this.domEl = options.domEl;
    this.projects = projects;
    this.yearsEl = document.querySelector(".years");

    this.domEl.appendChild(this.yearsEl);
    this.numberOfSmallLines = 13;
    this.widthTarget = 0;

    this.init();
  }

  init() {
    this.years.forEach((year, i) => {
      this.addYear(year, i);
    });
  }

  addYear(year, i) {
    const container = document.createElement("div");
    container.classList.add("year");
    this.createSmallLines(container);

    // Main
    const main = document.createElement("div");
    main.classList.add("year__main");

    const line = document.createElement("div");
    line.classList.add("year__line");

    const yearLabel = document.createElement("h2");
    yearLabel.classList.add("year__label");
    yearLabel.textContent = year;

    main.appendChild(yearLabel);
    main.appendChild(line);
    container.appendChild(main);

    this.yearsEl.appendChild(container);
    this.positionYears();
  }

  createSmallLines(container) {
    const smallLineContainer = document.createElement("div");
    smallLineContainer.classList.add("year__small-line-container");

    for (let i = 0; i < this.numberOfSmallLines; i++) {
      const smallLine = document.createElement("span");
      smallLine.classList.add("year__small-line");
      smallLineContainer.appendChild(smallLine);
    }
    container.appendChild(smallLineContainer);
  }

  positionYears() {
    const distanceFrom2021 = getDistanceProjectByYear("2021");
    const offset = gsap.utils.mapRange(0, 1, 0, 100, distanceFrom2021);

    const distanceBetweenTwoYears = getDistanceBetweenTwoYears("2022", "2021");
    const actualDistance = 100 / this.years.length / 100;
    const factorWidth = distanceBetweenTwoYears / actualDistance;
    const newWidth = factorWidth * 100;

    this.yearsEl.style.left = `${offset}%`;
    this.widthTarget = newWidth;
  }

  animIn({ delay }) {
    console.log(this.widthTarget);
    gsap.fromTo(
      ".years",
      {
        opacity: 0,
        yPercent: -50,
        width: "100%",
      },
      {
        width: `${this.widthTarget}%`,
        opacity: 1,
        yPercent: 0,
        delay,
        duration: 2.5,
        ease: "power2.inOut",
      }
    );
  }
}
