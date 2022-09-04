import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(0.7, 64, 64);

// Materials
const textureLoader = new THREE.TextureLoader();
const textureNormal = textureLoader.load("/textures/normal_map_earth.jpeg");
const texture = textureLoader.load("/textures/earth.jpg");

const material = new THREE.MeshStandardMaterial();
material.normalMap = textureNormal;
material.map = texture;

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.05, 24, 24);
  const material = new THREE.MeshStandardMaterial();
  material.emissive = new THREE.Color(0xffffff);
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500)
  .fill()
  .forEach(() => addStar());

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights
const mainDirectional = new THREE.DirectionalLight(0xffffff, 2);
mainDirectional.position.x = 10;
mainDirectional.position.y = 5;
mainDirectional.position.z = 0;
scene.add(mainDirectional);

const secDirectional = new THREE.DirectionalLight(0xffffff, 0.1);
secDirectional.position.set(-10, -3, 10);
scene.add(secDirectional);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// Render
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scroll
const paralax = (event) => {
  //   sphere.position.y = window.scrollY * 0.003;
  //   sphere.position.z = window.scrollY * 0.005;

  camera.position.z = 2 + window.scrollY * 0.005;
};

window.addEventListener("scroll", paralax);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
