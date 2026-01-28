import * as THREE from 'three';

// Crear la escena
const scene = new THREE.Scene();

// Crear la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1.5;

// Obtener canvas existente y crear el renderizador usando ese canvas
const canvas = document.querySelector('#glCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// Ajustar tamaño inicial al tamaño del canvas en la página
const initialWidth = canvas.clientWidth || canvas.width;
const initialHeight = canvas.clientHeight || canvas.height;
renderer.setSize(initialWidth, initialHeight, false);

// Actualizar cámara con la relación de aspecto del canvas
camera.aspect = initialWidth / initialHeight;
camera.updateProjectionMatrix();

// Manejar redimensionado de la ventana para mantener el canvas y la cámara en sincronía
function onWindowResize() {
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize, false);

// Crear la geometría del triángulo
const geometry = new THREE.BufferGeometry();
// Vértices con valores similares a webgl2: (0, 0.85), (-0.85, -0.5), (0.85, -0.5)
const vertices = new Float32Array([
    0.0,  0.85,  0.0,   // vértice superior
   -0.85, -0.5,   0.0,   // vértice inferior izquierdo
    0.85, -0.5,   0.0    // vértice inferior derecho
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// Colores por vértice: rojo, azul, blanco
const colors = new Float32Array([
    1.0, 0.0, 0.0, // vértice 0: rojo
    0.0, 1.0, 0.0, // vértice 1  verde
    0.0, 0.0, 1.0, // vértice 2: azul
]);
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Crear el material del triángulo
const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });

// Crear el mesh y añadirlo a la escena
const triangle = new THREE.Mesh(geometry, material);
scene.add(triangle);

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Iniciar la animación
animate();