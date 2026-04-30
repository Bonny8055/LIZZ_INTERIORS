// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('nav');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.2)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.15)';
    }
});

// Video Player Functionality
let currentVideoId = 'ag8J3VoAMss';

function initVideoOptions() {
    const optionButtons = document.querySelectorAll('.video-option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.dataset.video) {
                document.querySelector('.video-option-btn.active').classList.remove('active');
                this.classList.add('active');
                currentVideoId = this.dataset.video;
                const placeholder = document.querySelector('.video-placeholder');
                const iframe = document.getElementById('yt-video');
                placeholder.style.display = 'flex';
                iframe.style.display = 'none';
                iframe.src = '';
            }
        });
    });
}

function loadVideo() {
    const placeholder = document.querySelector('.video-placeholder');
    const iframe = document.getElementById('yt-video');
    placeholder.style.display = 'none';
    iframe.style.display = 'block';
    iframe.src = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0`;
}

// 3D Model Viewer Implementation
let scene, camera, renderer, controls;
let currentModel = null;
const models = {};
const modelFiles = {
    project1: 'door_wooden_door_metal.glb',
    project2: 'path/to/your/modern-office.glb',
    project3: 'path/to/your/premium-residence.glb'
};

function init3DViewer() {
    const container = document.getElementById('model-viewer');
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    scene.add(new THREE.SpotLight(0xD4AF37, 0.3));
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    
    loadAllModels();
    window.addEventListener('resize', onWindowResize);
    animate();
}

function loadAllModels() {
    const loader = new THREE.GLTFLoader();
    Object.keys(modelFiles).forEach(modelName => {
        loader.load(modelFiles[modelName], (gltf) => {
            models[modelName] = gltf.scene;
            models[modelName].visible = false;
            scene.add(models[modelName]);
            if (modelName === 'project1') showModel('project1');
            document.querySelector('.loading').style.display = 'none';
        }, undefined, () => createPremiumFallbackModel(modelName));
    });
}

function createPremiumFallbackModel(modelName) {
    const group = new THREE.Group();
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf8f8f8 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshStandardMaterial({ color: 0xD4AF37 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2;
    group.add(floor);
    
    const table = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 4), new THREE.MeshStandardMaterial({ color: 0xB8860B }));
    table.position.set(0, -1, 0); group.add(table);

    models[modelName] = group;
    models[modelName].visible = false;
    scene.add(models[modelName]);
    if (modelName === 'project1') showModel('project1');
    document.querySelector('.loading').style.display = 'none';
}

function showModel(modelName) {
    if (currentModel) currentModel.visible = false;
    currentModel = models[modelName];
    if (currentModel) {
        currentModel.visible = true;
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        controls.reset();
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('model-viewer');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', function() {
    initVideoOptions();
    init3DViewer();

    // Navigation handling
    document.querySelectorAll('.model-nav button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelector('.model-nav button.active').classList.remove('active');
            this.classList.add('active');
            showModel(this.dataset.model);
        });
    });

    // Hover effects
    document.querySelectorAll('.service-card, .benefit-card').forEach(card => {
        card.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-15px) scale(1.02)'; });
        card.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0) scale(1)'; });
    });

    // Smooth scrolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            if (nav) nav.classList.remove('active');
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                } else {
                    input.style.borderColor = '#D4AF37';
                }
            });
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }
});

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
});

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});