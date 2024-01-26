import * as THREE from "three";
import Experience from "./Experience.js";
import Triangle from "./Triangle.js";
import Lines from "./Lines.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setLines();
      }
    });
  }

  setLines() {
    this.lines = new Lines();
  }

  resize() {
    if (this.lines) this.lines.resize();
  }

  update() {
    if (this.lines) this.lines.update();
  }

  destroy() {}
}
