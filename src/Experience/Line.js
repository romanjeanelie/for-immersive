import * as THREE from "three";
import gsap from "gsap";

// Utils
import { getDistance, getScaleY } from "./Utils/LinesUtils";

export default class Line {
  constructor(options) {
    this.options = options;
    this.viewportSizes = this.options.viewportSizes;

    // Config
    this.lineConfig = {
      start: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 2, z: (90 * Math.PI) / 180 },
      },
      target: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
      },
    };
    this.isAnimComplete = false;
  }

  create() {
    const { geometry, material } = this.options;
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.z = (90 * Math.PI) / 180;

    this.options.group.add(this.mesh);
    this.positionLine();
  }

  positionLine() {
    const { index, numberOfLines } = this.options;
    const distance = getDistance(index);
    const posY = gsap.utils.mapRange(1, 0, -this.viewportSizes.x, this.viewportSizes.x, index / numberOfLines) * 0.5;
    const posYTarget = gsap.utils.mapRange(1, 0, -this.viewportSizes.x, this.viewportSizes.x, distance) * 0.5;

    const scaleY = getScaleY(index);
    this.targetY = posYTarget;
    this.target = { position: { y: posYTarget }, scale: { y: scaleY } };

    this.mesh.scale.y = this.viewportSizes.y;
    this.mesh.position.y = this.isAnimComplete ? this.targetY : posY;
  }

  animIn() {
    gsap.to(this.mesh.position, {
      y: this.target.position.y,
      delay: 2.6,
      duration: 3,
      ease: "expo.inOut",
      onComplete: () => {
        this.isAnimComplete = true;
      },
    });

    // Scale
    gsap.to(this.mesh.scale, {
      y: this.viewportSizes.y * this.target.scale.y,
      delay: 2,
      duration: 2,
      ease: "power2.inOut",
    });
    // To get on top
    gsap.to(this.mesh.position, {
      x: this.viewportSizes.y / 2 - (this.viewportSizes.y * this.target.scale.y) / 2,
      delay: 2,
      duration: 2,
      ease: "power2.inOut",
    });
  }

  goToFinalPosition() {
    this.mesh.position.set(
      this.viewportSizes.y / 2 - (this.viewportSizes.y * this.target.scale.y) / 2,
      this.target.position.y,
      0
    );

    this.mesh.scale.y = this.viewportSizes.y * this.target.scale.y;
  }

  resize(viewportSizes) {
    this.viewportSizes = viewportSizes;
    this.positionLine();
  }

  update(amplitudeRotation) {
    this.mesh.rotation.y = this.options.index * amplitudeRotation;
  }
}
