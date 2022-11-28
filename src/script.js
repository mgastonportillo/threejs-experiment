import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import './style.css';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
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

// Helper
// const helper = new THREE.GridHelper(160, 10);
// helper.rotation.x = Math.PI / 2;
// scene.add(helper);

// Objects
// Text
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry(
		'@mgastonportillo\nweb developer\nartist & data analyst',
		{
			font: font,
			size: 0.3,
			height: 0.2,
			curveSegments: 5,
			bevelEnabled: true,
			bevelThickness: 0.02,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 8,
		}
	);
	textGeometry.computeBoundingBox();
	textGeometry.center();

	const material = new THREE.MeshPhongMaterial();
	const text = new THREE.Mesh(textGeometry, material);
	scene.add(text);
});

// Svg
const loader = new SVGLoader();

for (let i = 0; i < 123; i++) {
	loader.load(
		'gale_logo.svg',

		function (data) {
			const paths = data.paths;
			const group = new THREE.Group();
			// group.scale.multiplyScalar(0.0002);
			// group.translate(
			// 	-(textGeometry.boundingBox.max.x / 2),
			// 	-(textGeometry.boundingBox.max.y / 2),
			// 	-(textGeometry.boundingBox.max.z / 2)
			// );

			for (let i = 0; i < paths.length; i++) {
				const path = paths[i];

				const material = new THREE.MeshPhongMaterial({
					color: path.color,
					side: THREE.DoubleSide,
					depthWrite: false,
				});

				const shapes = SVGLoader.createShapes(path);

				for (let j = 0; j < shapes.length; j++) {
					const shape = shapes[j];
					const geometry = new THREE.ShapeGeometry(shape);
					// geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1));
					const mesh = new THREE.Mesh(geometry, material);
					group.add(mesh);
				}
			}

			group.position.x = (Math.random() - 0.5) * 20;
			group.position.y = (Math.random() - 0.5) * 20;
			group.position.z = (Math.random() - 0.5) * 20;
			group.rotation.x = Math.random() * Math.PI;
			group.rotation.y = Math.random() * Math.PI;
			const scale = Math.random() * 0.0005;
			group.scale.set(scale, scale, scale);
			scene.add(group);
		},

		function (xhr) {
			console.log(
				Infinity ? 'SVG Loaded' : `${(xhr.loaded / xhr.total) * 100}% loaded`
			);
		},

		function (error) {
			console.log('An error happened');
		}
	);
}

// Camera
// Base camera
const camera = new THREE.PerspectiveCamera(
	60,
	sizes.width / sizes.height,
	0.1,
	50
);
camera.position.x = -1.2;
camera.position.y = 0.5;
camera.position.z = 3.5;
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 1;
pointLight.position.z = 20;
scene.add(pointLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: canvas,
	// alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
