import projects from "../../projects.json";

export default class Years {
  constructor() {
    this.projects = projects;
    this.years = [];
    this.yearsEl = document.querySelector(".years");
    // this.yearsEl.innerHTML = "";
  }
}
