import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

// Get the canvas element
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Generate the Babylon.js engine
const engine = new Engine(canvas, true);

// Create the scene
const createScene = () => {
  const scene = new Scene(engine);

  // Set up camera
  const camera = new ArcRotateCamera(
    "Camera",
    0,
    Math.PI / 2,
    500,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  camera.invertRotation = true;

  // Set camera limits
  camera.lowerRadiusLimit = 400;
  camera.upperRadiusLimit = 600;

  // Add light
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  // Create a sphere for panoramic mapping
  const skySphere = MeshBuilder.CreateSphere(
    "skySphere",
    { diameter: 1000.0, segments: 64 },
    scene
  );
  skySphere.flipFaces(true); // Render texture on the inside

  // Create material
  const skySphereMaterial = new StandardMaterial("skySphereMaterial", scene);
  skySphereMaterial.backFaceCulling = false;

  // Set the panoramic texture
  const texture = new Texture("/CAM03834G0-PR0013-PAN001-layout.jpg", scene);
  texture.wrapU = Texture.CLAMP_ADDRESSMODE;
  texture.wrapV = Texture.CLAMP_ADDRESSMODE;
  texture.coordinatesMode = Texture.FIXED_EQUIRECTANGULAR_MODE;

  // Flip the texture horizontally and vertically
  texture.uAng = Math.PI;
  texture.vAng = Math.PI;

  // Assign the texture to the material
  skySphereMaterial.diffuseTexture = texture;
  skySphereMaterial.specularColor = new Color3(0, 0, 0);

  // Assign material to the sphere
  skySphere.material = skySphereMaterial;

  return scene;
};

const scene = createScene();

// Render loop
engine.runRenderLoop(() => {
  scene.render();
});

// Resize the engine on window resize
window.addEventListener("resize", () => {
  engine.resize();
});
