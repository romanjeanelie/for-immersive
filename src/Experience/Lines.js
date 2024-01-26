import Experience from "./Experience";
import * as THREE from "three";
import gsap from "gsap";

export default class Lines {
  constructor() {
    this.numberOfLines = 20;
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
    this.setInstance();
  }

  setInstance() {
    var cylinderColor = 0x2e50ac;

    this.group = new THREE.Group();

    var tubeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 32);
    var cylinderMaterial = new THREE.MeshBasicMaterial({ color: cylinderColor });

    for (var i = 0; i <= this.numberOfLines; i++) {
      var cylinder = new THREE.Mesh(tubeGeometry, cylinderMaterial);
      //   cylinder.rotation.y = Math.PI * 0.5;
      //   cylinder.rotation.y = (30 * i * Math.PI) / 180;
      cylinder.rotation.z = (90 * Math.PI) / 180;
      //   cylinder.position.x = 0;

      cylinder.position.z = this.positions.z;
      //   cylinder.position.y =
      //     gsap.utils.mapRange(0, this.numberOfLines, -this.viewportSizes.x, this.viewportSizes.x, i) * 0.5;

      this.rows.push(cylinder);
      this.group.add(cylinder);
    }
    this.positionLines();
    this.scene.add(this.group);

    // TEMP final position
    this.amplitudeRotation.value = 0;
    this.group.rotation.z = Math.PI * 0.5;

    // gsap.to(this.amplitudeRotation, {
    //   value: 0,
    //   delay: 0.1,
    //   duration: 3,
    //   ease: "power.inOut()",
    // });
    // gsap.to(this.group.rotation, {
    //   z: Math.PI * 0.5,
    //   delay: 0.1,
    //   duration: 3,
    //   ease: "power2.inOut",
    // });
  }

  positionLines() {
    this.rows.forEach((row, i) => {
      row.position.y = gsap.utils.mapRange(0, this.numberOfLines, -this.viewportSizes.x, this.viewportSizes.x, i) * 0.5;
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
      row.rotation.y = i * this.amplitudeRotation.value;
    });
  }

  destroy() {}
}
