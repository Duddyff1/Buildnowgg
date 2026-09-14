const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Ground
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x3b7a57 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Controls & Movement State
const keys = { w: false, a: false, s: false, d: false };
window.addEventListener('keydown', (e) => { if (keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { if (keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = false; });

document.body.addEventListener('click', () => { document.body.requestPointerLock(); });

let yaw = 0, pitch = 0;
document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        yaw -= e.movementX * 0.002;
        pitch -= e.movementY * 0.002;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
    }
});

// Building System
const objects = [];
window.addEventListener('mousedown', (e) => {
    if (e.button === 0 && document.pointerLockElement === document.body) {
        const wallGeo = new THREE.BoxGeometry(4, 3, 0.2);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
        const wall = new THREE.Mesh(wallGeo, wallMat);
        
        // Spawn wall directly in front of camera
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        wall.position.copy(camera.position).add(dir.multiplyScalar(5));
        wall.position.y = 1.5;
        wall.rotation.y = yaw;
        
        scene.add(wall);
        objects.push(wall);
    }
});

// Game Loop
function animate() {
    requestAnimationFrame(animate);
    
    const speed = 0.1;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    
    const sideDir = new THREE.Vector3(-dir.z, 0, dir.x);
    
    if (keys.w) camera.position.addScaledVector(dir, speed);
    if (keys.s) camera.position.addScaledVector(dir, -speed);
    if (keys.a) camera.position.addScaledVector(sideDir, speed);
    if (keys.d) camera.position.addScaledVector(sideDir, -speed);
    
    renderer.render(scene, camera);
}
animate();
