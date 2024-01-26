import Experience from "./Experience";
import * as THREE from "three";
import gsap from "gsap";
import projects from "../../projects.json";
export default class Lines {
  constructor() {
    this.projects = projects;
    this.isAnimComplete = false;

    // DOM
    this.domEl = document.querySelector(".dom");

    // Config
    this.amplitudeRotation = { value: 0.3 };
    this.groupConfig = {
      start: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        rotation: { x: 0, y: 4, z: Math.PI * 0 },
      },
      target: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.7, y: 0.9, z: 0.7 },
        rotation: { x: 0, y: 0, z: Math.PI * 0.5 },
      },
    };

    this.numberOfLines = projects.length - 1;
    this.positions = { x: 0, y: 0, z: 0 };
    this.rows = [];
    this.viewportSizes = { x: 0, y: 0 };

    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder("lines");
    }

    // this.debugPlane();
    this.computeViewportSizes();
    this.updateDOM();
    this.setInstance();
    this.startAnim();
  }

  // TODO revert x and y for lines
  updateDOM() {
    this.domEl.style.transform = `scale(${this.groupConfig.target.scale.y}, ${this.groupConfig.target.scale.x})`;

    // Create points
    const points = [];
    this.projects.forEach((row, i) => {
      const pointEl = document.createElement("span");
      pointEl.classList.add("point");

      const distance = this.getDistance(i);
      const scaleY = this.getScaleY(i);

      pointEl.style.top = `${scaleY * 100}%`;
      pointEl.style.left = `${distance * 100}%`;

      this.domEl.appendChild(pointEl);
      points.push(pointEl);
    });
  }

  setInstance() {
    var cylinderColor = "#d0cfcf";

    this.group = new THREE.Group();

    var tubeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);

    var cylinderMaterial = new THREE.MeshBasicMaterial({ color: cylinderColor });

    this.projects.forEach((project, i) => {
      var cylinder = new THREE.Mesh(tubeGeometry, cylinderMaterial);
      cylinder.rotation.z = (90 * Math.PI) / 180;
      cylinder.position.z = this.positions.z;

      this.rows.push({ mesh: cylinder });
      this.group.add(cylinder);
    });
    this.positionLines();

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
      duration: 5,
      ease: "power1.inOut",
    });
    gsap.to(this.group.rotation, {
      z: this.groupConfig.target.rotation.z,
      delay: 0.1,
      duration: 3,
      ease: "power2.inOut",
    });

    // Move
    this.rows.forEach((row, i) => {
      gsap.to(row.mesh.position, {
        y: row.target.position.y,
        delay: 2.6,
        duration: 3,
        ease: "expo.inOut",
        onComplete: () => {
          this.isAnimComplete = true;
        },
      });

      // Scale
      gsap.to(row.mesh.scale, {
        y: this.viewportSizes.y * row.target.scale.y,
        delay: 2,
        duration: 2,
        ease: "power2.inOut",
      });
      // To get on top
      gsap.to(row.mesh.position, {
        x: this.viewportSizes.y / 2 - (this.viewportSizes.y * row.target.scale.y) / 2,
        delay: 2,
        duration: 2,
        ease: "power2.inOut",
      });
    });

    // show points
    gsap.to(".point", {
      opacity: 1,
      delay: 3.4,
      duration: 3,
      stagger: {
        // wrap advanced options in an object
        each: 0.04,
        from: "center",
        grid: "auto",
        ease: "power2.inOut",
      },
    });
  }

  getDistance(i) {
    const projectsByDate = this.projects.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    const firstProject = projectsByDate[0];
    const lastProject = projectsByDate[projectsByDate.length - 1];
    const maxDistanceDate = new Date(lastProject.date) - new Date(firstProject.date);
    const project = this.projects[i];
    const distance = (new Date(project.date) - new Date(projectsByDate[0].date)) / maxDistanceDate;
    return distance;
  }

  getScaleY(i) {
    const project = this.projects[i];
    switch (project.type) {
      case "personal":
        return 0.5;
      case "pro":
        return 0.8;
      case "lab":
        return 0.3;
      case "indicator":
        return 1;
    }
  }

  positionLines() {
    this.rows.forEach((row, i) => {
      const distance = this.getDistance(i);
      const posY = gsap.utils.mapRange(1, 0, -this.viewportSizes.x, this.viewportSizes.x, i / this.numberOfLines) * 0.5;
      const posYTarget = gsap.utils.mapRange(1, 0, -this.viewportSizes.x, this.viewportSizes.x, distance) * 0.5;

      const scaleY = this.getScaleY(i);
      row.targetY = posYTarget;
      row.target = { position: { y: posYTarget }, scale: { y: scaleY } };

      row.mesh.scale.y = this.viewportSizes.y;
      row.mesh.position.y = this.isAnimComplete ? row.targetY : posY;
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
    this.positionLines();
  }

  update() {
    this.rows.forEach((row, i) => {
      row.mesh.rotation.y = i * this.amplitudeRotation.value;
    });
  }

  destroy() {}
}
