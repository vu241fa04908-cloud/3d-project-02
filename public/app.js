
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const room = document.getElementById("room");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#cfc3b1");

const camera = new THREE.PerspectiveCamera(
    45, room.clientWidth / room.clientHeight, 0.1, 100
);

camera.position.set(9, 7, 11);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(room.clientWidth, room.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

room.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

scene.add(new THREE.HemisphereLight("#fff0d5", "#68513d", 2));

const sunlight = new THREE.DirectionalLight("#ffe0ad", 3);
sunlight.position.set(-5, 10, 7);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
scene.add(sunlight);

const warmLight = new THREE.PointLight("#ffc77b", 35, 20);
warmLight.position.set(0, 4, 0);
scene.add(warmLight);

const objects = {};

const wood = new THREE.MeshStandardMaterial({
    color: "#704323",
    roughness: 0.55
});

const darkWood = new THREE.MeshStandardMaterial({
    color: "#422719",
    roughness: 0.45
});

const gold = new THREE.MeshStandardMaterial({
    color: "#bd9659",
    metalness: 0.55,
    roughness: 0.35
});

const cream = new THREE.MeshStandardMaterial({
    color: "#eee0c9",
    roughness: 0.9
});

const fabric = new THREE.MeshStandardMaterial({
    color: "#b38b65",
    roughness: 1
});

const wallMaterial = new THREE.MeshStandardMaterial({
    color: "#e8d8bd",
    roughness: 0.95
});

const floorMaterial = new THREE.MeshStandardMaterial({
    color: "#80502f",
    roughness: 0.65
});

function box(parent, size, position, material) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...size),
        material
    );

    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);

    return mesh;
}

function cylinder(parent, top, bottom, height, position, material) {
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(top, bottom, height, 24),
        material
    );

    mesh.position.set(...position);
    mesh.castShadow = true;
    parent.add(mesh);

    return mesh;
}

// FLOOR
box(scene, [10, 0.2, 12], [0, -0.1, 0], floorMaterial);

// WALLS
const walls = new THREE.Group();
box(walls, [10, 5, 0.2], [0, 2.5, -6], wallMaterial);
box(walls, [0.2, 5, 12], [-5, 2.5, 0], wallMaterial);
box(walls, [0.2, 5, 12], [5, 2.5, 0], wallMaterial);
scene.add(walls);

// WINDOW
const windowGroup = new THREE.Group();

const glass = new THREE.MeshPhysicalMaterial({
    color: "#9fc9dd",
    transparent: true,
    opacity: 0.5,
    roughness: 0.1
});

box(windowGroup, [3.2, 2.2, 0.06], [0, 3.2, -5.85], glass);

box(windowGroup, [3.5, 0.12, 0.15], [0, 4.35, -5.75], wood);
box(windowGroup, [3.5, 0.12, 0.15], [0, 2.05, -5.75], wood);
box(windowGroup, [0.12, 2.4, 0.15], [-1.7, 3.2, -5.75], wood);
box(windowGroup, [0.12, 2.4, 0.15], [1.7, 3.2, -5.75], wood);
box(windowGroup, [0.08, 2.2, 0.16], [0, 3.2, -5.7], gold);

scene.add(windowGroup);

// BED
const bed = new THREE.Group();

box(bed, [4, 0.5, 5], [0, 0.5, 0], darkWood);
box(bed, [4.1, 0.15, 5.1], [0, 0.8, 0], gold);
box(bed, [3.85, 0.45, 4.8], [0, 1.05, 0], cream);
box(bed, [3.9, 0.15, 3.5], [0, 1.35, 0.5], fabric);

// Headboard
box(bed, [4.1, 2.2, 0.3], [0, 1.9, -2.55], wood);
box(bed, [3.5, 1.5, 0.08], [0, 1.9, -2.35], gold);
box(bed, [3.2, 1.25, 0.08], [0, 1.9, -2.29], cream);

for (const x of [-1, 0, 1]) {
    box(bed, [0.9, 0.25, 0.7], [x, 1.5, -1.5], cream);
}

for (const x of [-1.8, 1.8]) {
    for (const z of [-2.2, 2.2]) {
        cylinder(bed, 0.1, 0.15, 0.6, [x, 0.25, z], gold);
    }
}

scene.add(bed);
objects.bed = bed;

// WARDROBE
const wardrobe = new THREE.Group();

box(wardrobe, [2.5, 3.6, 1], [-3.5, 1.8, -4.5], wood);

for (const x of [-4.1, -2.9]) {
    box(wardrobe, [1.1, 3.2, 0.1], [x, 1.8, -3.95], darkWood);
    box(wardrobe, [0.85, 2.8, 0.04], [x, 1.8, -3.88], gold);
}

scene.add(wardrobe);
objects.wardrobe = wardrobe;

// BEDSIDE TABLES
const tables = new THREE.Group();

for (const x of [-2.7, 2.7]) {
    box(tables, [1.1, 1, 0.9], [x, 0.6, -0.8], wood);
    box(tables, [1.2, 0.12, 1], [x, 1.15, -0.8], gold);

    cylinder(tables, 0.22, 0.25, 0.1, [x, 1.3, -0.8], gold);
    cylinder(tables, 0.03, 0.03, 0.4, [x, 1.55, -0.8], gold);
    cylinder(tables, 0.18, 0.28, 0.35, [x, 1.9, -0.8], cream);

    const lamp = new THREE.PointLight("#ffd28a", 12, 4);
    lamp.position.set(x, 2, -0.8);
    tables.add(lamp);
}

scene.add(tables);
objects.table = tables;

// RUG
const rug = new THREE.Group();

box(rug, [5, 0.05, 3], [0, 0.02, 2], fabric);

scene.add(rug);

// DECORATIONS
const decor = new THREE.Group();

// Chandelier
cylinder(decor, 0.04, 0.04, 0.6, [0, 4.5, 0], gold);
cylinder(decor, 0.5, 0.5, 0.12, [0, 4.15, 0], gold);

for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5;

    const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 16, 16),
        cream
    );

    bulb.position.set(
        Math.cos(angle) * 0.55,
        4.1,
        Math.sin(angle) * 0.55
    );

    decor.add(bulb);
}

// Indoor plant
const potMaterial = new THREE.MeshStandardMaterial({
    color: "#9c674b"
});

cylinder(decor, 0.2, 0.3, 0.5, [-4, 0.25, 3.8], potMaterial);

const leafMaterial = new THREE.MeshStandardMaterial({
    color: "#496b3c"
});

for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;

    const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 12),
        leafMaterial
    );

    leaf.position.set(
        -4 + Math.cos(angle) * 0.35,
        1 + (i % 3) * 0.2,
        3.8 + Math.sin(angle) * 0.35
    );

    leaf.scale.set(0.7, 2, 0.6);
    decor.add(leaf);
}

scene.add(decor);
objects.decor = decor;

// WALL ART
const art = new THREE.Group();
box(art, [1.5, 1, 0.12], [0, 3.9, -5.75], gold);
box(art, [1.25, 0.75, 0.05], [0, 3.9, -5.67], fabric);
scene.add(art);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
    camera.aspect = room.clientWidth / room.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(room.clientWidth, room.clientHeight);
});

// WALL COLOUR
document.getElementById("wallColor").addEventListener("input", e => {
    wallMaterial.color.set(e.target.value);
});

// FLOOR COLOUR
document.getElementById("floorColor").addEventListener("input", e => {
    floorMaterial.color.set(e.target.value);
});

// FURNITURE VISIBILITY
for (const id of ["bed", "wardrobe", "table", "decor"]) {
    document.getElementById(id).addEventListener("change", e => {
        objects[id].visible = e.target.checked;
    });
}

// GET CURRENT DESIGN
function getDesign() {
    return {
        designName: document.getElementById("designName").value || "My Bedroom",
        wallColor: document.getElementById("wallColor").value,
        floorColor: document.getElementById("floorColor").value,
        furniture: ["bed", "wardrobe", "table", "decor"]
            .filter(id => document.getElementById(id).checked),
        camera: {
            position: camera.position.toArray(),
            target: controls.target.toArray()
        }
    };
}



// SAVE DESIGN TO MONGODB
window.saveDesign = async function () {
    try {
        const response = await fetch("/api/designs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(getDesign())
        });

        const text = await response.text();

        let result;

        try {
            result = JSON.parse(text);
        } catch {
            throw new Error(
                "Backend returned HTML instead of JSON. Check server.js API route. Response: " +
                text.substring(0, 120)
            );
        }

        if (!response.ok) {
            throw new Error(result.message || "Unable to save design");
        }

        alert("Design saved successfully!");

        window.loadDesigns();

    } catch (error) {
        console.error("Save error:", error);
        alert("Save failed: " + error.message);
    }
};


// LOAD SAVED DESIGNS
window.loadDesigns = async function() {
    const list = document.getElementById("designList");

    try {
        const response = await fetch("http://localhost:5000/api/designs");
        const designs = await response.json();

        if (!response.ok) throw new Error("Unable to load designs");

        list.innerHTML = "";

        designs.forEach(design => {
            const item = document.createElement("div");
            const title = document.createElement("p");
            title.textContent = design.designName;

            const open = document.createElement("button");
            open.textContent = "Open";
            open.onclick = () => applyDesign(design);

            const update = document.createElement("button");
            update.textContent = "Update";
            update.onclick = () => updateDesign(design._id);

            const remove = document.createElement("button");
            remove.textContent = "Delete";
            remove.onclick = () => deleteDesign(design._id);

            item.append(title, open, update, remove);
            list.appendChild(item);
        });

    } catch (error) {
        list.textContent = error.message;
    }
};

// OPEN SAVED DESIGN
function applyDesign(design) {
    document.getElementById("designName").value = design.designName;
    document.getElementById("wallColor").value = design.wallColor;
    document.getElementById("floorColor").value = design.floorColor;

    wallMaterial.color.set(design.wallColor);
    floorMaterial.color.set(design.floorColor);

    for (const id of ["bed", "wardrobe", "table", "decor"]) {
        const enabled = design.furniture.includes(id);
        document.getElementById(id).checked = enabled;
        objects[id].visible = enabled;
    }

    if (design.camera?.position?.length === 3) {
        camera.position.fromArray(design.camera.position);
        controls.target.fromArray(design.camera.target || [0, 1, 0]);
        controls.update();
    }
}

// UPDATE SAVED DESIGN
async function updateDesign(id) {
    try {
        const response = awaitfetch(`http://localhost:5000/api/designs/${id}`,  {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getDesign())
        });

        if (!response.ok) throw new Error("Update failed");

        alert("Design updated!");
        loadDesigns();
    } catch (error) {
        alert(error.message);
    }
}

// DELETE SAVED DESIGN
async function deleteDesign(id) {
    if (!confirm("Delete this design?")) return;

    try {
        const response = await fetch(`/api/designs/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Delete failed");

        loadDesigns();
    } catch (error) {
        alert(error.message);
    }
}
