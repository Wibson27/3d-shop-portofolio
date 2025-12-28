import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { texture } from 'three/tsl';

const canvas = document.querySelector('#experience-canvas')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Model Loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const environmentMap = new THREE.CubeTextureLoader()
  .setPath('textures/skybox/')
  .load([
    'px.webp',
    'nx.webp',
    'py.webp',
    'ny.webp',
    'pz.webp',
    'nz.webp'
  ]);
// environmentMap.encoding = THREE.sRGBEncoding;

const textureMap = {
  Counter: "textures/Counter.webp",
  Github: "textures/Upstairs.webp",
  LinkedIn: "textures/Upstairs.webp",
  Email: "textures/Balcony.webp",
  Education: "textures/Upstairs.webp",
  SignTopWallHolder: "textures/Upstairs.webp",
  SignBottomWallHolder: "textures/Balcony.webp",
  AboutMe: "textures/Balcony.webp",
  RoofFan: "textures/Upstairs.webp",
  Trash: "textures/Floor.webp",
  TrashLid: "textures/Floor.webp",
  Bulbasaur: "textures/bulbasaur.png",
  Oshawott: "textures/Oshawott.png",
  Jigglypuff: "textures/Jigglypuff.png",
  JigglypuffBoard: "textures/JigglyFloor.png",
  Cubone: "textures/Cubone.png",
  Sudowoodo: "textures/Sudowoodo.png",
  Swablu: "textures/Swablu.png",
  Floor: "textures/Floor.webp",
  Inside: "textures/Inside.webp",
  Balcony: "textures/Balcony.webp",
  Upstairs: "textures/Upstairs.webp",
  TopShelf: "textures/TopShelf.webp",
  AlmaOne: "textures/AlmaOne.webp",
  AlmaTwo: "textures/AlmaTwo.webp",
  Psyduck: "textures/Psyduck.webp",
  PortoOne: "textures/PortoOne.webp",
  PortoTwo: "textures/PortoTwo.webp",
  PortoThree: "textures/PortoThree.webp",
  PortoFour: "textures/PortoFour.webp",
  PortoFive: "textures/PortoFive.webp",
  PortoSix: "textures/PortoSix.webp",
  PortoSeven: "textures/PortoSeven.webp",
  PortoEight: "textures/PortoEight.webp",
  SertifOne: "textures/SertifOne.webp",
  SertifTwo: "textures/SertifTwo.webp",
  SertifThree: "textures/SertifThree.webp",
  SertifFour: "textures/SertifFour.webp",
  SertifFive: "textures/SertifFive.webp",
  Sertifsix: "textures/SertifSix.webp",
  SertifSeven: "textures/SertifSeven.webp",
  SertifEight: "textures/SertifEight.webp",
};

const loaderTextures = {
  Counter: {},
  Floor: {},
  Inside: {},
  Balcony: {},
  Upstairs: {},
  TopShelf: {},
  AlmaOne: {},
  AlmaTwo: {},
  Psyduck: {},
  Oshawott: {},
  Jigglypuff: {},
  JigglypuffBoard: {},
  Cubone: {},
  Sudowoodo: {},
  Swablu: {},
  PortoOne: {},
  PortoTwo: {},
  PortoThree: {},
  PortoFour: {},
  PortoFive: {},
  PortoSix: {},
  PortoSeven: {},
  PortoEight: {},
  SertifOne: {},
  SertifTwo: {},
  SertifThree: {},
  SertifFour: {},
  SertifFive: {},
  SertifSix: {},
  SertifSeven: {},
  SertifEight: {},
  Email: {},
  SignTopWallHolder: {},
  Education: {},
  SignBottomWallHolder: {},
  AboutMe: {},
  RoofFan: {},
  Trash: {},
  TrashLid: {},
  Bulbasaur: {},
};

Object.entries(textureMap).forEach(([key, value]) => {
  const texture = textureLoader.load(value);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  loaderTextures[key] = texture;  
});

loaderTextures['Bulbasaur'].wrapS = THREE.RepeatWrapping;
loaderTextures['Bulbasaur'].wrapT = THREE.RepeatWrapping;
loaderTextures['Jigglypuff'].wrapS = THREE.RepeatWrapping;
loaderTextures['Jigglypuff'].wrapT = THREE.RepeatWrapping;


const scene = new THREE.Scene();

gltfLoader.load("models/RifqiShop.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {

      // Make Trash dark grey
      if (child.name === 'Trash') {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x1a1a1a, // Very dark grey
        });
        return;
      }

      if (child.name.includes("Glass")) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            opacity: 1,
            metalness: 0.4,
            roughness: 0,
            transmission: 1,
            transparent: false,  
            ior: 1.5,
            thickness: 1,
            envMap: environmentMap,
            specularIntensity: 1,
            envMapIntensity: 1,
          });
        }

      else{
        Object.keys(textureMap).forEach((key) => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loaderTextures[key],
          });

          child.material = material;

          if (child.material.map){
            child.material.map.minFilter = THREE.LinearFilter;
          }
        }
      });
      }
    
    }
  });
  scene.add(glb.scene);
});
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.set(-60, 18, 50);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.02;
controls.target.set(0, 18, 0);
controls.update();

// Event Listener
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

function animate() {


}

const render = () => {
  controls.update();

  // console.log(camera.position);
  // console.log("000000000000")
  // console.log(controls.target);

  renderer.render( scene, camera );

  window.requestAnimationFrame( render );
  
}

render();
