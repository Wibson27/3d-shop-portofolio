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

const yAxisFans = [];

const raycasterObjects = [];
let currentIntersects = [];
let hoveredObject = null;  

// Social links (open in new tab)
const socialLinks = {
  Github: "https://github.com/Wibson27",
  LinkedIn: "https://www.linkedin.com/in/rifqi-wibisono-09703720a/",
  Email: "mailto:rifqiwibisono271002@gmail.com"
};

// Modal content data
const portfolioData = {
  PortoOne: {
    number: "#01",
    title: "3D Portfolio Website",
    description: "An immersive 3D web portfolio built with Three.js and Blender. Features optimized textures, baked lighting, and interactive elements that bring the portfolio to life in a unique shop-themed environment.",
    tech: ["Three.js", "Blender", "JavaScript", "GSAP", "Vite"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  },
  PortoTwo: {
    number: "#02",
    title: "DevOps Pipeline System",
    description: "Enterprise-grade CI/CD pipeline implementation featuring Jenkins automation, Docker containerization, and comprehensive monitoring with Prometheus and Grafana.",
    tech: ["Jenkins", "Docker", "Prometheus", "Grafana", "NGINX"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  },
  PortoThree: {
    number: "#03",
    title: "Machine Learning Platform",
    description: "Data science project implementing various ML algorithms including Naive Bayes classification and A/B testing frameworks for statistical analysis.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "Jupyter"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  },
  PortoFour: {
    number: "#04",
    title: "Arduino IoT Projects",
    description: "Collection of embedded systems projects including keypad password door locks, gesture-controlled synthesizers, and ESP32-based IoT applications.",
    tech: ["Arduino", "ESP32", "C++", "Sensors", "Tinkercad"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  },
  PortoFive: {
    number: "#05",
    title: "Database Management System",
    description: "Comprehensive database design project featuring ER diagrams, SQL optimization, and relational algebra implementations for efficient data management.",
    tech: ["PostgreSQL", "MySQL", "SQL", "Database Design"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  },
  PortoSix: {
    number: "#06",
    title: "Blockchain DApp",
    description: "Decentralized application exploring blockchain technology, smart contracts, and Web3 integration for transparent and secure transactions.",
    tech: ["Solidity", "Web3.js", "Ethereum", "React"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  },
  PortoSeven: {
    number: "#07",
    title: "Minecraft Mod Manager",
    description: "Custom modpack configuration and management system for Minecraft, featuring Cobblemon integration and compatibility troubleshooting tools.",
    tech: ["Java", "Forge", "Fabric", "JSON"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  },
  PortoEight: {
    number: "#08",
    title: "Web Development Suite",
    description: "Collection of web applications demonstrating proficiency in modern frontend frameworks, responsive design, and full-stack development practices.",
    tech: ["React", "Node.js", "HTML/CSS", "JavaScript"],
    liveUrl: "#",
    githubUrl: "https://github.com/Wibson27"
  }
};

const certificateData = {
  SertifOne: {
    title: "DevOps Engineering Bootcamp",
    issuer: "Tech Academy",
    date: "December 2024",
    description: "Comprehensive DevOps certification covering CI/CD pipelines, containerization, infrastructure as code, and monitoring systems.",
    skills: ["Jenkins", "Docker", "Kubernetes", "Terraform"],
    verifyUrl: "#"
  },
  SertifTwo: {
    title: "Full Stack Web Development",
    issuer: "Online Learning Platform",
    date: "November 2024",
    description: "Advanced certification in modern web development technologies and best practices for building scalable applications.",
    skills: ["React", "Node.js", "MongoDB", "REST APIs"],
    verifyUrl: "#"
  },
  SertifThree: {
    title: "Python for Data Science",
    issuer: "Data Science Institute",
    date: "October 2024",
    description: "Certification demonstrating proficiency in Python programming for data analysis, visualization, and machine learning.",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib"],
    verifyUrl: "#"
  },
  SertifFour: {
    title: "Database Administration",
    issuer: "Database Academy",
    date: "September 2024",
    description: "Professional certification in database design, optimization, and administration for enterprise applications.",
    skills: ["SQL", "PostgreSQL", "Database Design", "Query Optimization"],
    verifyUrl: "#"
  },
  SertifFive: {
    title: "Cloud Computing Fundamentals",
    issuer: "Cloud Provider",
    date: "August 2024",
    description: "Foundation certification covering cloud architecture, services, and deployment strategies.",
    skills: ["AWS", "Cloud Architecture", "Serverless", "IaC"],
    verifyUrl: "#"
  },
  SertifSix: {
    title: "Blockchain Development",
    issuer: "Blockchain Institute",
    date: "July 2024",
    description: "Certification in blockchain technology, smart contract development, and decentralized application architecture.",
    skills: ["Solidity", "Ethereum", "Smart Contracts", "DApps"],
    verifyUrl: "#"
  },
  SertifSeven: {
    title: "Machine Learning Specialization",
    issuer: "AI Academy",
    date: "June 2024",
    description: "Advanced certification covering machine learning algorithms, neural networks, and AI model deployment.",
    skills: ["TensorFlow", "Scikit-learn", "Neural Networks", "Model Training"],
    verifyUrl: "#"
  },
  SertifEight: {
    title: "3D Graphics & Visualization",
    issuer: "Digital Arts Institute",
    date: "May 2024",
    description: "Certification in 3D modeling, texturing, and real-time graphics programming for web and applications.",
    skills: ["Blender", "Three.js", "UV Mapping", "Texture Baking"],
    verifyUrl: "#"
  }
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Model Loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const environmentMap = new THREE.CubeTextureLoader()
  .setPath('skybox/')
  .load([
    'px.webp',
    'nx.webp',
    'py.webp',
    'ny.webp',
    'pz.webp',
    'nz.webp'
  ]);

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
scene.background = environmentMap;

window.addEventListener('mousemove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

const modalOverlay = document.getElementById('modal-overlay');
const modals = {
  aboutme: document.getElementById('modal-aboutme'),
  education: document.getElementById('modal-education'),
  portfolio: document.getElementById('modal-portfolio'),
  certificate: document.getElementById('modal-certificate')
};

let currentModal = null;

// Determine which modal to open based on object name
function getModalType(objectName) {
  if (objectName.includes('AboutMe')) return 'aboutme';
  if (objectName.includes('Education')) return 'education';
  if (objectName.includes('Porto')) return 'portfolio';
  if (objectName.includes('Sertif')) return 'certificate';
  return null;
}

// Get the specific key for data lookup
function getDataKey(objectName) {
  // Extract the exact key from textureMap keys
  const keys = Object.keys(textureMap);
  for (const key of keys) {
    if (objectName.includes(key)) return key;
  }
  return objectName;
}

// Populate portfolio modal with data
function populatePortfolioModal(dataKey) {
  const data = portfolioData[dataKey];
  if (!data) return;

  document.getElementById('portfolio-title').textContent = data.title;
  document.getElementById('portfolio-description').textContent = data.description;
  document.querySelector('.portfolio-number').textContent = data.number;
  
  const tagsContainer = document.getElementById('portfolio-tags');
  tagsContainer.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  
  document.getElementById('portfolio-link').href = data.liveUrl;
  document.getElementById('portfolio-github').href = data.githubUrl;
}

// Populate certificate modal with data
function populateCertificateModal(dataKey) {
  const data = certificateData[dataKey];
  if (!data) return;

  document.getElementById('certificate-title').textContent = data.title;
  document.getElementById('certificate-issuer').textContent = `Issued by ${data.issuer}`;
  document.getElementById('certificate-date').textContent = data.date;
  document.getElementById('certificate-description').textContent = data.description;
  
  const tagsContainer = document.getElementById('certificate-tags');
  tagsContainer.innerHTML = data.skills.map(s => `<span class="tech-tag">${s}</span>`).join('');
  
  document.getElementById('certificate-link').href = data.verifyUrl;
}

// Open modal with GSAP animation
function openModal(modalType, dataKey = null) {
  if (currentModal) return;
  
  const modal = modals[modalType];
  if (!modal) return;

  // Populate data for portfolio/certificate modals
  if (modalType === 'portfolio' && dataKey) {
    populatePortfolioModal(dataKey);
  } else if (modalType === 'certificate' && dataKey) {
    populateCertificateModal(dataKey);
  }

  currentModal = modal;

  // Show overlay
  modalOverlay.classList.add('active');
  modal.classList.add('active');

  // GSAP animation
  gsap.fromTo(modalOverlay, 
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: "power2.out" }
  );

  gsap.fromTo(modal,
    { 
      opacity: 0, 
      scale: 0.85, 
      y: 40,
    },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      duration: 0.5, 
      ease: "back.out(1.7)",
      delay: 0.1
    }
  );

  // Animate modal content elements
  const contentElements = modal.querySelectorAll('.modal-header, .about-intro, .about-section, .timeline-item, .portfolio-image, .portfolio-details > *, .certificate-badge, .certificate-details > *');
  
  gsap.fromTo(contentElements,
    { 
      opacity: 0, 
      y: 20 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.4, 
      stagger: 0.05,
      ease: "power2.out",
      delay: 0.3
    }
  );
}

// Close modal with GSAP animation
function closeModal() {
  if (!currentModal) return;

  const modal = currentModal;

  gsap.to(modal, {
    opacity: 0,
    scale: 0.9,
    y: 20,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      modal.classList.remove('active');
    }
  });

  gsap.to(modalOverlay, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      modalOverlay.classList.remove('active');
      currentModal = null;
    }
  });
}

// Close button event listeners
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', closeModal);
});

// Click outside to close
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Escape key to close
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentModal) {
    closeModal();
  }
});

// Handle 3D object click
window.addEventListener('click', () => {
  if (currentIntersects.length > 0) {
    const clickedObject = currentIntersects[0].object;
    const objectName = clickedObject.name;

    // Check if it's a social link
    if (socialLinks[objectName]) {
      window.open(socialLinks[objectName], '_blank');
      return;
    }

    // Check if it should open a modal
    const modalType = getModalType(objectName);
    if (modalType) {
      const dataKey = getDataKey(objectName);
      openModal(modalType, dataKey);
    }
  }
});

gltfLoader.load("models/RifqiShop.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {

      const clickableNames = ['Porto', 'Sertif', 'Github', 'LinkedIn', 'Email', 'Education', 'AboutMe'];
      if (clickableNames.some(name => child.name.includes(name))) {
        raycasterObjects.push(child);
      }

      // Make Trash dark grey
      if (child.name === 'Trash') {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x1a1a1a,
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

          if (child.name.includes("RoofFan")){
            yAxisFans.push(child);
          }

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
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const render = () => {
  controls.update();

  // Animate Fans
  yAxisFans.forEach((fan) => {
    fan.rotation.y += 0.05;
  });

  // Raycaster
  raycaster.setFromCamera(pointer, camera);
  currentIntersects = raycaster.intersectObjects(raycasterObjects);

  // Reset previous hovered object
  if (hoveredObject && !currentIntersects.find(intersect => intersect.object === hoveredObject)) {
    hoveredObject.material.color.set(0xffffff);
    hoveredObject = null;
  }

  // Set new hovered object
  if (currentIntersects.length > 0) {
    hoveredObject = currentIntersects[0].object;
    hoveredObject.material.color.set(0xff0000);
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}

render();
