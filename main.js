import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

// ----- camera and render setup -----


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
const  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas"), alpha: true});

/*
window.addEventListener( 'resize', function(){
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize( width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
})
*/


// right - up - zoom
camera.position.set(0, 0 , 2);

//----- light -----

const light = new THREE.DirectionalLight(0xfff0ff, 5);
light.position.set(5, 10, 7.5);
light.target.position.set(0, 0, 0);

scene.add(light);
scene.add(light.target);


const light2 = new THREE.DirectionalLight(0x4A3C80, 10);
light2.position.set(-6, 5, -4.5);
light2.target.position.set(0, 0, 0);

scene.add(light2);
scene.add(light2.target);

//----- shadow ----- 

renderer.shadowMap.enabled = true;
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
light.shadow.bias = -0.00008;

const d = 1;
light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;

// ----- loading model -----

const loader = new GLTFLoader();

let pcModel;

loader.load('pcV4.gltf', function(pcGltf) {
  scene.add(pcGltf.scene);
  pcModel = pcGltf.scene;
  pcModel.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
    pcModel.position.set(1.5, 0, 0)
  });
  animate();
});



// ----- Camera movement -----
var cameraXPosition = 0;
var movementSpeed = 0.001;


const cameraPosition = new THREE.Vector3();
camera.getWorldPosition(cameraPosition);
console.log(cameraPosition)

// ----- Area51 -----



// ----- render -----

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width ||canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  
    }
  }


  function animate() {

    pcModel.rotation.y += 0.0025;
    pcModel.rotation.x += 0.0025;


    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
  
    // Berechnen Sie den Abstand zwischen der Kamera und dem 3D-Modell
    const distance = cameraPosition.distanceTo(pcModel.position);
  
    // Setzen Sie den Schwellenwert
    const thresholdDistance = 3.5;
  
    if (distance > thresholdDistance) {
      // Das Modell ist weiter als der Schwellenwert von der Kamera entfernt
      // Setzen Sie das Modell unsichtbar
      scene.remove(pcModel);
    } else {
      // Das Modell ist näher an der Kamera
      // Setzen Sie das Modell sichtbar
      pcModel.visible = true;
    }


    cameraXPosition += movementSpeed;
    camera.position.x = cameraXPosition;
  
    resizeCanvasToDisplaySize();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
