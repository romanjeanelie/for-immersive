import projects from "../../projects.json";

import Experience from "./Experience";
import Line from "./Line";
import Years from "./Years";
import Point from "./Point";

// Shader
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import { lineColorStart } from "@/scss/variables/_colors.module.scss";

import * as THREE from "three";
import gsap from "gsap";
export default class Lines {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.projects = projects;

    // DOM
    this.domEl = document.querySelector(".dom");

    // Config
    this.lineColor = "#d0cfcf";
    this.amplitudeRotation = { value: 0.3 };
    this.groupConfig = {
      start: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 3.9, z: 1 },
        rotation: { x: 0, y: 2, z: Math.PI * 0 },
      },
      target: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.7, y: 0.9, z: 0.7 },
        rotation: { x: 0, y: 0, z: Math.PI * 0.5 },
      },
    };

    this.numberOfLines = projects.length - 1;
    this.positions = { x: 0, y: 0, z: 0 };
    this.viewportSizes = { x: 0, y: 0 };

    this.linesInstances = [];
    this.points = [];

    if (this.debug) {
      this.debugFolder = this.debug.addFolder("lines");
    }

    this.computeViewportSizes();

    this.setYears();
    this.setPoints();
    this.setInstance();

    // this.startAnim();
    this.goToFinalPosition();
  }

  // TODO revert x and y for lines
  setPoints() {
    this.domEl.style.width = `${100 * this.groupConfig.target.scale.y}%`;
    this.domEl.style.height = `${100 * this.groupConfig.target.scale.x}%`;

    // transform = `scale(${this.groupConfig.target.scale.y}, ${this.groupConfig.target.scale.x})`;

    // Create points
    this.points = this.projects.map((project, i) => new Point({ project, i, domEl: this.domEl }));
  }

  setYears() {
    this.years = new Years({ domEl: this.domEl });
  }

  setInstance() {
    this.group = new THREE.Group();

    var tubeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    // var cylinderMaterial = new THREE.MeshBasicMaterial({ color: this.lineColor });
    var cylinderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColorStart: { value: new THREE.Color(lineColorStart) },
        uColor: { value: new THREE.Color(0xffffff) },
        uColorProgress: { value: 0 },
        uOpacity: { value: 1 },
      },
      transparent: true,
    });

    this.projects.forEach((project, i) => {
      const line = new Line({
        index: i,
        geometry: tubeGeometry,
        material: cylinderMaterial,
        viewportSizes: this.viewportSizes,
        group: this.group,
        numberOfLines: this.numberOfLines,
        project,
      });

      line.create();

      this.linesInstances.push(line);
    });

    this.group.scale.set(
      this.groupConfig.start.scale.x,
      this.groupConfig.start.scale.y,
      this.groupConfig.start.scale.z
    );
    this.group.rotation.set(
      this.groupConfig.start.rotation.x,
      this.groupConfig.start.rotation.y,
      this.groupConfig.start.rotation.z
    );

    this.scene.add(this.group);
  }

  startAnim() {
    // Anim group
    gsap.to(this.amplitudeRotation, {
      value: 0,
      delay: 0.1,
      duration: 7.3,
      ease: "power2.out",
    });
    gsap.to(this.group.scale, {
      ...this.groupConfig.target.scale,
      delay: 0.1,
      duration: 3,
      ease: "power1.inOut",
    });
    gsap.to(this.group.rotation, {
      x: this.groupConfig.target.rotation.x,
      y: this.groupConfig.target.rotation.y,
      duration: 3,
      ease: "power1.inOut",
    });
    gsap.to(this.group.rotation, {
      z: this.groupConfig.target.rotation.z,
      delay: 0.1,
      duration: 2,
      ease: "power2.inOut",
    });

    // Anim Lines
    this.linesInstances.forEach((line, i) => {
      line.animIn();
    });

    // Anim points
    gsap.fromTo(
      ".point",
      { scale: 0 },
      {
        opacity: 1,
        scale: 1,
        delay: 4.5,
        duration: 2,
        ease: "back.out(4)",
        stagger: {
          each: 0.15,
          from: "center",
          grid: "auto",
        },
      }
    );

    // Anim years
    this.years.animIn({ delay: 2.7 });

    // Anim indicator
    gsap.fromTo(
      ".point__description--indicator",
      { opacity: 0, xPercent: -10 },
      {
        xPercent: 0,
        opacity: 1,
        delay: 4,
        duration: 3,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    // Anim legends
    gsap.fromTo(
      ".bottom",
      { opacity: 0, yPercent: 100 },
      {
        yPercent: 0,
        opacity: 1,
        delay: 5,
        duration: 2,
        ease: "expo.inOut",
      }
    );
  }

  goToFinalPosition() {
    this.group.scale.set(
      this.groupConfig.target.scale.x,
      this.groupConfig.target.scale.y,
      this.groupConfig.target.scale.z
    );
    this.group.rotation.set(
      this.groupConfig.target.rotation.x,
      this.groupConfig.target.rotation.y,
      this.groupConfig.target.rotation.z
    );
    this.amplitudeRotation.value = 0;

    this.linesInstances.forEach((line, i) => {
      line.goToFinalPosition();
    });

    this.points.forEach((point, i) => {
      point.goToFinalPosition();
    });
  }

  computeViewportSizes() {
    const distance = Math.abs(this.positions.z - this.camera.instance.position.z);
    const verticalFOV = this.camera.instance.fov * (Math.PI / 180);
    const y = 2 * Math.tan(verticalFOV / 2) * distance;
    const x = y * this.camera.instance.aspect;

    this.viewportSizes = {
      x,
      y,
    };
  }

  resize() {
    this.computeViewportSizes();
    this.linesInstances.forEach((line, i) => {
      line.resize(this.viewportSizes);
    });
  }

  update() {
    this.linesInstances.forEach((line, i) => {
      line.update(this.amplitudeRotation.value);
    });
  }

  destroy() {}
}
