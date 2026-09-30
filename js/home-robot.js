import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const canvas = document.getElementById("home-robot");
if (canvas && document.body.classList.contains("page-home")) {
  initHomeRobot(canvas);
}

function initHomeRobot(canvas) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.08, 30);
  camera.position.set(0.02, 0.86, 5.05);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0xf7f7f8,
    roughness: 0.22,
    metalness: 0.04,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.65,
  });
  const jointMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a30,
    roughness: 0.34,
    metalness: 0.82,
  });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x101014,
    roughness: 0.12,
    metalness: 0.7,
  });

  const robot = new THREE.Group();
  robot.position.set(0.18, 0, 0);
  robot.rotation.y = -0.42;
  scene.add(robot);

  const point = (x, y, z) => new THREE.Vector3(x, y, z);

  function add(parent, mesh) {
    parent.add(mesh);
    return mesh;
  }

  function capsule(parent, start, end, radius, material) {
    const delta = new THREE.Vector3().subVectors(end, start);
    const length = Math.max(0.02, delta.length() - radius * 0.85);
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 16), material);
    mesh.position.copy(start).lerp(end, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
    return add(parent, mesh);
  }

  function ball(parent, position, radius, material) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 18), material);
    mesh.position.copy(position);
    return add(parent, mesh);
  }

  function limb(start, end, radius, joinStart = false, startScale = 1, endScale = 1) {
    capsule(robot, start, end, radius * 0.38, jointMat);
    capsule(robot, start, end, radius, shellMat);
    if (joinStart) ball(robot, start, radius * 0.7 * startScale, jointMat);
    ball(robot, end, radius * 0.62 * endScale, jointMat);
  }

  const hip = point(0, 0.46, 0);
  const chest = point(0, 0.7, 0.02);
  const collar = point(0, 0.86, 0.03);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.2, 36, 28), shellMat);
  torso.position.set(0, 0.66, 0.01);
  torso.scale.set(1.2, 1.05, 0.92);
  add(robot, torso);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 20), shellMat);
  belly.position.set(0, 0.5, 0.03);
  belly.scale.set(1.15, 0.85, 0.9);
  add(robot, belly);

  const chestJoint = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.014, 10, 28), jointMat);
  chestJoint.rotation.x = Math.PI / 2;
  chestJoint.position.set(0, 0.575, 0.09);
  add(robot, chestJoint);
  const hipJoint = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.013, 10, 24), jointMat);
  hipJoint.rotation.x = Math.PI / 2;
  hipJoint.position.set(0, 0.43, 0.07);
  add(robot, hipJoint);

  ball(robot, collar, 0.045, jointMat);
  capsule(robot, chest, collar, 0.04, jointMat);

  const logo = makeChestLogo();
  logo.position.set(0, 0.71, 0.21);
  robot.add(logo);

  const arms = [createArm(1), createArm(-1)];

  const hipL = point(0.09, 0.44, 0.01);
  const kneeL = point(0.1, 0.24, 0.03);
  const ankleL = point(0.1, 0.12, 0.03);
  limb(hip, hipL, 0.04);
  limb(hipL, kneeL, 0.048, true, 1, 0.35);
  limb(kneeL, ankleL, 0.04, true, 0.35, 1);
  addKneeLine(kneeL);
  addFoot(ankleL);

  const hipR = point(-0.09, 0.44, 0.01);
  const kneeR = point(-0.1, 0.24, 0.03);
  const ankleR = point(-0.1, 0.12, 0.03);
  limb(hip, hipR, 0.04);
  limb(hipR, kneeR, 0.048, true, 1, 0.35);
  limb(kneeR, ankleR, 0.04, true, 0.35, 1);
  addKneeLine(kneeR);
  addFoot(ankleR);

  const neck = new THREE.Group();
  neck.position.copy(collar);
  robot.add(neck);
  const head = new THREE.Group();
  head.rotation.order = "YXZ";
  neck.add(head);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.15, 40, 32), shellMat);
  helmet.position.set(0, 0.16, 0.01);
  helmet.scale.set(1, 1.04, 0.86);
  add(head, helmet);

  const visor = new THREE.Mesh(new RoundedBoxGeometry(0.17, 0.09, 0.05, 4, 0.022), visorMat);
  visor.position.set(0, 0.145, 0.145);
  add(head, visor);

  addEar(head, 0.13);
  addEar(head, -0.13);
  addDesk();

  scene.add(new THREE.HemisphereLight(0xffffff, 0xf7f7f7, 0.85));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(1.4, 2.6, 2.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xf0f0f0, 0.7);
  fill.position.set(-1.8, 1.2, 1.6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(-0.6, 1.5, -2.2);
  scene.add(rim);

  let targetYaw = 0;
  let targetPitch = 0;
  let pointerAt = performance.now();
  let typing = 0;
  let elapsed = 0;
  const clock = new THREE.Clock();

  function resize() {
    const stage = canvas.parentElement;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (width < 2 || height < 2) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function drawFrame() {
    const dt = clock.getDelta();
    elapsed += dt;
    if (!reducedMotion) {
      head.rotation.y = THREE.MathUtils.damp(head.rotation.y, targetYaw, 7, dt);
      head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetPitch, 7, dt);
      const idle = performance.now() - pointerAt > 2000;
      typing = THREE.MathUtils.damp(typing, idle ? 1 : 0, 4.5, dt);
      arms.forEach((arm) => poseArm(arm, typing, elapsed));
    }
    camera.lookAt(0.02, 0.64, 0);
    renderer.render(scene, camera);
  }

  function loop() {
    resize();
    drawFrame();
    requestAnimationFrame(loop);
  }

  window.addEventListener("pointermove", (event) => {
    pointerAt = performance.now();
    if (reducedMotion) return;
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    targetYaw = THREE.MathUtils.clamp(x * 0.55, -0.6, 0.6);
    targetPitch = THREE.MathUtils.clamp(y * 0.32, -0.34, 0.38);
  });

  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();
  requestAnimationFrame(loop);
  pmrem.dispose();

  document.fonts.ready.then(() => {
    paintLogo(logo.material.map);
    logo.material.map.needsUpdate = true;
  });

  function createArm(side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.2, 0.75, 0.02);
    robot.add(shoulder);
    const elbow = new THREE.Group();
    elbow.position.set(side * 0.05, -0.2, 0.01);
    shoulder.add(elbow);
    capsule(shoulder, point(0, 0, 0), elbow.position, 0.04, shellMat);
    ball(shoulder, point(0, 0, 0), 0.03, jointMat);
    ball(elbow, point(0, 0, 0), 0.026, jointMat);
    const wrist = new THREE.Group();
    wrist.position.set(side * 0.012, -0.24, 0.05);
    elbow.add(wrist);
    capsule(elbow, point(0, 0, 0), wrist.position, 0.032, shellMat);
    ball(wrist, point(0, 0, 0), 0.02, jointMat);
    addHand(wrist, point(0, 0, 0), side, point(side * 0.08, -1, 0.15));
    return { side, shoulder, elbow, wrist };
  }

  function poseArm(arm, amount, time) {
    const { side, shoulder, elbow, wrist } = arm;
    shoulder.rotation.order = "YXZ";
    shoulder.rotation.y = THREE.MathUtils.lerp(0, -side * 0.4, amount);
    shoulder.rotation.x = THREE.MathUtils.lerp(0.04, -0.88, amount);
    shoulder.rotation.z = side * THREE.MathUtils.lerp(0.08, -0.16, amount);
    elbow.rotation.x = THREE.MathUtils.lerp(0.02, -0.12, amount);
    const tap = Math.sin(time * (side > 0 ? 11 : 14.5));
    wrist.rotation.x = THREE.MathUtils.lerp(0.05, -0.1, amount) + amount * Math.max(0, tap) * 0.05;
  }

  function addDesk() {
    const desk = new THREE.Group();
    desk.position.set(0.04, 0, 0.52);
    robot.add(desk);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.016, 40), shellMat);
    top.position.y = 0.5;
    desk.add(top);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.48, 14), jointMat);
    leg.position.y = 0.25;
    desk.add(leg);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.012, 24), jointMat);
    foot.position.y = 0.01;
    desk.add(foot);
    const laptop = new THREE.Group();
    laptop.position.set(0, 0.514, -0.05);
    desk.add(laptop);
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.012, 0.14, 2, 0.004), shellMat);
    laptop.add(base);
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 10), jointMat);
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, 0.008, 0.062);
    laptop.add(hinge);
    const bezel = new THREE.Mesh(new RoundedBoxGeometry(0.19, 0.125, 0.008, 2, 0.003), shellMat);
    bezel.position.set(0, 0.072, 0.055);
    bezel.rotation.x = 0.55;
    laptop.add(bezel);
    const display = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.1),
      new THREE.MeshBasicMaterial({ map: makeCodeTexture() })
    );
    display.position.set(0, 0.074, 0.048);
    display.rotation.order = "YXZ";
    display.rotation.y = Math.PI;
    display.rotation.x = 0.55;
    laptop.add(display);
    return laptop;
  }

  function addHand(parent, origin, side, direction) {
    const dir = direction.clone().normalize();
    const palm = origin.clone().addScaledVector(dir, 0.055);
    capsule(parent, origin, palm, 0.02, shellMat);
    ball(parent, origin, 0.024, jointMat);
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.028, 0.04, 2, 0.01), shellMat);
    plate.position.copy(palm);
    add(parent, plate);
    for (let i = 0; i < 3; i += 1) {
      const spread = (i - 1) * 0.016;
      const base = palm.clone().add(point(spread, -0.006, 0.012));
      const tip = base.clone().addScaledVector(dir, 0.03).add(point(spread * 0.2, 0, 0));
      ball(parent, base, 0.008, jointMat);
      capsule(parent, base, tip, 0.007, shellMat);
    }
    const thumbA = palm.clone().add(point(side * 0.028, 0.004, 0.004));
    const thumbB = thumbA.clone().add(point(side * 0.016, -0.012, 0.016));
    capsule(parent, palm, thumbA, 0.007, shellMat);
    capsule(parent, thumbA, thumbB, 0.006, shellMat);
  }

  function addKneeLine(position) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.0018, 8, 20), jointMat);
    band.rotation.x = Math.PI / 2;
    band.position.set(position.x, position.y, position.z + 0.02);
    add(robot, band);
  }

  function addFoot(origin) {
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.11, 0.1, 0.14, 3, 0.03), shellMat);
    foot.position.set(origin.x, 0.05, origin.z + 0.01);
    add(robot, foot);
    const band = new THREE.Mesh(new RoundedBoxGeometry(0.116, 0.016, 0.146, 2, 0.005), jointMat);
    band.position.set(origin.x, 0.012, origin.z + 0.01);
    add(robot, band);
  }

  function addEar(parent, x) {
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.034, 24), jointMat);
    pod.position.set(x, 0.17, 0.02);
    pod.rotation.z = Math.PI / 2;
    add(parent, pod);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), shellMat);
    cap.position.set(x + Math.sign(x) * 0.016, 0.17, 0.02);
    add(parent, cap);
  }
}

function makeCodeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#101014";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const widths = [0.72, 0.4, 0.58, 0.33, 0.66, 0.28, 0.5];
  widths.forEach((width, index) => {
    ctx.fillStyle = index % 3 === 0 ? "#f2f2f4" : "#8d8d94";
    ctx.fillRect(16 + (index % 2) * 10, 16 + index * 18, 210 * width, 6);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeChestLogo() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  paintLogo(texture);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.075), material);
}

function paintLogo(texture) {
  const canvas = texture.image;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1c1c1c";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 118px 'Instrument Sans', sans-serif";
  const text = "AcrossTool";
  const maxWidth = canvas.width * 0.92;
  let size = 118;
  while (size > 48 && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    ctx.font = `600 ${size}px 'Instrument Sans', sans-serif`;
  }
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);
}
