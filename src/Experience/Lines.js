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
    this.scaleTarget = { x: 0.7, y: 0.9, z: 0.7 };

    this.numberOfLines = projects.length - 1;
    this.positions = { x: 0, y: 0, z: 0 };
    this.rows = [];
    this.amplitudeRotation = { value: 0.5 };
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
  }

  // TODO revert x and y for lines
  updateDOM() {
    this.domEl.style.transform = `scale(${this.scaleTarget.y}, ${this.scaleTarget.x})`;

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
    // tubeGeometry.translate(0, 0.5, 0);
    // Compute the bounding box of the geometry
    // tubeGeometry.computeBoundingBox();
    // Get the height (y dimension) of the bounding box
    // let height = tubeGeometry.boundingBox.max.y - tubeGeometry.boundingBox.min.y;
    // Translate the tubeGeometry so that the origin is at the bottom
    // tubeGeometry.translate(0, height / 2, 0);

    var cylinderMaterial = new THREE.MeshBasicMaterial({ color: cylinderColor });

    this.projects.forEach((project, i) => {
      var cylinder = new THREE.Mesh(tubeGeometry, cylinderMaterial);
      cylinder.rotation.z = (90 * Math.PI) / 180;
      cylinder.position.z = this.positions.z;

      this.rows.push({ mesh: cylinder });
      this.group.add(cylinder);
    });
    this.positionLines();
    this.group.scale.set(0.9, 0.9, 0.9);
    this.group.rotation.z = -Math.PI * 0.01;
    this.scene.add(this.group);

    // TEMP final position
    // this.amplitudeRotation.value = 0;
    // this.group.scale.x = 0.7;
    // this.group.scale.y = 0.9;
    // this.group.scale.z = 0.7;
    // this.group.rotation.z = Math.PI * 0.5;

    gsap.to(this.amplitudeRotation, {
      value: 0,
      delay: 0.1,
      duration: 7.3,
      ease: "power2.out",
    });
    gsap.to(this.group.scale, {
      ...this.scaleTarget,
      delay: 0.1,
      duration: 3,
      ease: "power1.inOut",
    });
    gsap.to(this.group.rotation, {
      x: 0,
      y: 0,
      duration: 5,
      ease: "power1.inOut",
    });
    gsap.to(this.group.rotation, {
      z: Math.PI * 0.5,
      delay: 0.1,
      duration: 3,
      ease: "power2.inOut",
    });

    // Move
    this.rows.forEach((row, i) => {
      gsap.to(row.mesh.position, {
        y: row.target.position.y,
        delay: 1.6,
        duration: 3,
        ease: "expo.inOut",
        onComplete: () => {
          this.isAnimComplete = true;
          //   this.domEl.classList.add("show");
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
    // this.holder.rotation.x += 0.0;
    // this.holder.rotation.y += 0.01;
    this.rows.forEach((row, i) => {
      row.mesh.rotation.y = i * this.amplitudeRotation.value;
    });
  }

  destroy() {}
}
