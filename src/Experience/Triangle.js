import * as THREE from "three";
import Experience from "./Experience";

// Shaders
import vertex from "./shaders/vertex.glsl?raw";
import fragment from "./shaders/fragment.glsl?raw";

export default class Triangle {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "triangle",
        expanded: true,
      });
    }

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.TetrahedronGeometry(1);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
