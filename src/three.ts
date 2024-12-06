import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Get the canvas element
const canvas = document.getElementById("renderCanvas");

if (!canvas) {
  throw new Error("Canvas not found");
}

// Create renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create scene
const scene = new THREE.Scene();

// Create camera (similar starting point as ArcRotateCamera)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
// Position the camera back to simulate "radius"
camera.position.set(0, 0, 500);

// Add hemisphere light (similar to Babylon HemisphericLight)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
hemiLight.position.set(0, 1, 0);
scene.add(hemiLight);

// OrbitControls to mimic ArcRotateCamera behavior
const controls = new OrbitControls(camera, renderer.domElement);
// Set limits similar to lowerRadiusLimit and upperRadiusLimit
controls.minDistance = 400;
controls.maxDistance = 600;

// Invert rotation: by default dragging left rotates left. To invert, adjust rotateSpeed:
controls.rotateSpeed = -1; // Negative value inverts the direction of rotation

// Load the panoramic texture
const loader = new THREE.TextureLoader();
loader.load(
  "/CAM03834G0-PR0013-PAN001-layout.jpg",
  (texture) => {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // To simulate flipping horizontally and vertically as done by texture.uAng = Math.PI and texture.vAng = Math.PI,
    // we can simply flip both axes by setting repeat to -1, -1.
    texture.center.set(0.5, 0.5);
    texture.rotation = 0; // no rotation
    texture.repeat.set(1, 1); // no flipping

    // Or, if you want a rotation approach, you can do:
    // texture.center.set(0.5, 0.5);
    // texture.rotation = Math.PI; // rotate by 180 degrees

    // Create a sphere geometry
    const geometry = new THREE.SphereGeometry(1000, 64, 64);
    // Render on the inside
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide, // This makes the inside of the sphere visible.
    });

    const skySphere = new THREE.Mesh(geometry, material);
    scene.add(skySphere);
  },
  undefined,
  (error) => {
    console.error("Error loading texture", error);
  }
);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
