import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
// ----- general setings -----

function setPadding() {
  const div = document.getElementById("content");
  const screenWidth = window.innerWidth;
  const defaultPadding = 16;
  const minPadding = 4;
  const screenMaxWidth = 1920; // Hier setzen Sie die maximale Bildschirmbreite

  // Berechnung des angepassten Paddings
  let paddingValue = minPadding + (defaultPadding - minPadding) * (screenWidth / screenMaxWidth)

  // Stellen Sie sicher, dass das Padding nicht unter den Mindestwert fällt und nicht über den Standardwert steigt
  paddingValue = Math.max(paddingValue, minPadding);
  paddingValue = Math.min(paddingValue, defaultPadding);

  // Padding auf die linken und rechten Seiten des DIVs anwenden
  div.style.paddingLeft = `${paddingValue}%`;
  div.style.paddingRight = `${paddingValue}%`;
}

// Initial das Padding setzen
setPadding();

// Das Padding aktualisieren, wenn sich die Bildschirmgröße ändert
window.addEventListener("resize", setPadding);




// ----- camera and render setup -----

"use strict";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
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
camera.position.set(0, .5 , 1);

//----- light -----

const light = new THREE.DirectionalLight(0xfff0ff, 5);
light.position.set(-10, 10, 10);
light.target.position.set(0, 0, 0);



//----- shadow smoother ----- (must be near a object)
const d = 1;
light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;

const helper = new THREE.DirectionalLightHelper(light, 1);
scene.add(helper);

scene.add(light);
scene.add(light.target);

renderer.shadowMap.enabled = true;
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
light.shadow.bias = -0.0009;


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
  });
  animate();
});


// ----- 
const controls = new OrbitControls(camera, renderer.domElement);

// ----- Area51 -----

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
document.body.appendChild(labelRenderer.domElement);

const p = document.createElement('P')
p.textContent = 'hello'
const cPointLabel = new CSS2DObject(p)
scene.add(cPointLabel)
cPointLabel.position.set(0, 0, 0)
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

    pcModel.rotation.y += 0.01;
    resizeCanvasToDisplaySize();
    renderer.render(scene, camera);


    requestAnimationFrame(animate);
    controls.update();
  }
  
  requestAnimationFrame(animate);
