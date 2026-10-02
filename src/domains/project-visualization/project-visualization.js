/**
 * BuildWise AI — Project visualization layer
 * Checklist: 682–688
 *
 * Application-owned contracts for 2D, 3D, 360° and 4D visualization.
 * Three.js is used as the rendering engine; project semantics remain BuildWise-owned.
 */

export const VISUALIZATION_CAPABILITIES = Object.freeze({
  elevation2d: "682",
  floorPlan2d: "683",
  scenarios: "684",
  project3d: "685",
  project360: "686",
  multiAngle: "687",
  project4d: "688"
});

export function createElevationSvg({ width = 20, floors = 4, floorHeight = 3, openings = [] } = {}) {
  const safeFloors = Math.max(1, Math.floor(Number(floors) || 1));
  const totalHeight = safeFloors * Number(floorHeight || 3);
  const lines = [];
  lines.push(\`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 \${width} \${totalHeight}" role="img" aria-label="BuildWise elevation">\`);
  lines.push(\`<rect x="0" y="0" width="\${width}" height="\${totalHeight}" fill="none" stroke="currentColor"/>\`);
  for (let i = 1; i < safeFloors; i += 1) {
    const y = i * Number(floorHeight || 3);
    lines.push(\`<line x1="0" y1="\${y}" x2="\${width}" y2="\${y}" stroke="currentColor"/>\`);
  }
  for (const opening of openings) {
    const x = Number(opening.x || 0);
    const y = Number(opening.y || 0);
    const w = Number(opening.width || 1);
    const h = Number(opening.height || 2);
    lines.push(\`<rect x="\${x}" y="\${y}" width="\${w}" height="\${h}" fill="none" stroke="currentColor"/>\`);
  }
  lines.push("</svg>");
  return lines.join("");
}

export function createFloorPlanSvg({ width = 20, depth = 15, rooms = [] } = {}) {
  const svg = [
    \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 \${width} \${depth}" role="img" aria-label="BuildWise floor plan">\`,
    \`<rect x="0" y="0" width="\${width}" height="\${depth}" fill="none" stroke="currentColor"/>\`
  ];
  for (const room of rooms) {
    const x = Number(room.x || 0), y = Number(room.y || 0);
    const w = Number(room.width || 1), h = Number(room.height || 1);
    svg.push(\`<rect x="\${x}" y="\${y}" width="\${w}" height="\${h}" fill="none" stroke="currentColor"/>\`);
    if (room.name) svg.push(\`<text x="\${x + w/2}" y="\${y + h/2}" text-anchor="middle">\${String(room.name).replace(/[<>]/g,"")}</text>\`);
  }
  svg.push("</svg>");
  return svg.join("");
}

export function buildScenarioSet(base, variants = []) {
  return [base, ...variants].map((scenario, index) => ({
    id: scenario.id || \`scenario-\${index + 1}\`,
    ...scenario
  }));
}

export function build4DFrame(tasks = [], progress = 0) {
  const p = Math.max(0, Math.min(100, Number(progress) || 0));
  return tasks.map(task => {
    const start = Number(task.startProgress ?? 0);
    const end = Number(task.endProgress ?? 100);
    const span = Math.max(0.001, end - start);
    return {
      id: task.id,
      visible: p >= start,
      completion: Math.max(0, Math.min(1, (p - start) / span))
    };
  });
}

export async function loadThree() {
  return import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js");
}

export async function create360Texture(url) {
  const THREE = await loadThree();
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export async function createProjectScene({ container, modelFactory } = {}) {
  if (!container) throw new Error("container is required");
  const THREE = await loadThree();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / Math.max(1, container.clientHeight), 0.1, 5000);
  camera.position.set(10, 8, 10);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.replaceChildren(renderer.domElement);
  if (modelFactory) await modelFactory({ THREE, scene });
  renderer.render(scene, camera);
  return { THREE, scene, camera, renderer };
}


export function createMassing({ THREE, scene, width = 20, depth = 15, floors = 5, floorHeight = 3 } = {}) {
  if (!THREE || !scene) throw new Error("THREE and scene are required");
  const geometry = new THREE.BoxGeometry(width, floors * floorHeight, depth);
  const material = new THREE.MeshNormalMaterial({ wireframe: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = (floors * floorHeight) / 2;
  scene.add(mesh);
  return mesh;
}

export function createMultiAngleCameras(THREE, { radius = 40, height = 20, count = 8 } = {}) {
  const cameras = [];
  for (let i = 0; i < Math.max(1, count); i += 1) {
    const angle = (Math.PI * 2 * i) / Math.max(1, count);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 5000);
    camera.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    cameras.push(camera);
  }
  return cameras;
}

export async function create360Scene({ container, panoramaUrl } = {}) {
  if (!container || !panoramaUrl) throw new Error("container and panoramaUrl are required");
  const THREE = await loadThree();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / Math.max(1, container.clientHeight), 0.1, 2000);
  camera.position.set(0, 0, 0.01);
  const texture = await create360Texture(panoramaUrl);
  const geometry = new THREE.SphereGeometry(100, 64, 32);
  geometry.scale(-1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  scene.add(new THREE.Mesh(geometry, material));
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.replaceChildren(renderer.domElement);
  renderer.render(scene, camera);
  return { THREE, scene, camera, renderer, texture };
}
