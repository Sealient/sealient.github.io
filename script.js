// ===== GLOBAL VARIABLES =====
let scene, camera, renderer;
let particles, geometry, materials = [];
let raycaster, mouse, intersects;
let clock = new THREE.Clock();
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// ===== NEON COLORS =====
const colors = {
    primary: 0x9900ff,
    accent: 0x00ffcc,
    dark: 0x0a0a12,
};

// ===== INITIALIZATION =====
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(colors.dark, 0.001);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webgl-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create grid
    createGrid();

    // Create particles
    createParticles();

    // Create floating objects
    createFloatingObjects();

    // Create mouse interaction
    createMouseInteraction();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // Start animation loop
    animate();

    // Hide loading screen after delay
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = 0;
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 1000);
    }, 2000);
}

// ===== CREATE GRID =====
function createGrid() {
    const gridHelper = new THREE.GridHelper(400, 40, colors.accent, colors.primary);
    gridHelper.position.y = -30;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Create horizontal lines
    const lineCount = 20;
    const lineSpacing = 400 / lineCount;
    
    for (let i = 0; i <= lineCount; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(6);
        
        linePositions[0] = -200;
        linePositions[1] = -30;
        linePositions[2] = i * lineSpacing - 200;
        
        linePositions[3] = 200;
        linePositions[4] = -30;
        linePositions[5] = i * lineSpacing - 200;
        
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: i % 4 === 0 ? colors.primary : colors.accent,
            transparent: true,
            opacity: 0.2
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    }
}

// ===== CREATE PARTICLES =====
function createParticles() {
    // Create particle system
    geometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 500;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 500;
        
        // Color
        const colorValue = Math.random();
        if (colorValue < 0.5) {
            color.setHSL(0.75, 1, 0.5 + Math.random() * 0.5); // Purple
        } else {
            color.setHSL(0.5, 1, 0.5 + Math.random() * 0.5); // Teal
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Size
        sizes[i] = Math.random() * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Create particle system
    particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
}

// ===== CREATE FLOATING OBJECTS =====
function createFloatingObjects() {
    // Create floating glowing orbs
    for (let i = 0; i < 15; i++) {
        const radius = Math.random() * 3 + 1;
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        
        // Create the core material
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? colors.primary : colors.accent,
            transparent: true,
            opacity: 0.7
        });
        
        // Create the glow material
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? colors.primary : colors.accent,
            transparent: true,
            opacity: 0.2
        });
        
        // Create core and glow meshes
        const core = new THREE.Mesh(geometry, coreMaterial);
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.5, 32, 32),
            glowMaterial
        );
        
        // Position the orb
        const orb = new THREE.Group();
        orb.add(core);
        orb.add(glow);
        orb.position.set(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 400
        );
        
        // Add to scene
        scene.add(orb);
        
        // Store material for animation
        materials.push({
            core: coreMaterial,
            glow: glowMaterial,
            mesh: orb,
            speed: Math.random() * 0.5 + 0.2,
            radius: radius,
            offset: Math.random() * Math.PI * 2
        });
    }
}

// ===== CREATE MOUSE INTERACTION =====
function createMouseInteraction() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

// ===== WINDOW RESIZE =====
function onWindowResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// ===== MOUSE MOVE =====
function onMouseMove(event) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    
    // Subtle camera movement
    gsap.to(camera.position, {
        x: mouse.x * 5,
        y: mouse.y * 5,
        duration: 2,
        ease: "power2.out"
    });
}

// ===== ANIMATION =====
function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Animate particles
    particles.rotation.y = elapsedTime * 0.05;
    
    // Animate floating orbs
    materials.forEach((material, i) => {
        const orbit = elapsedTime * material.speed + material.offset;
        material.mesh.position.y += Math.sin(orbit) * 0.05;
        
        // Pulse the glow
        const pulse = Math.sin(elapsedTime * 2 + i) * 0.5 + 0.5;
    });
    
    renderer.render(scene, camera);
}

// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize three.js scene
    init();
    
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSectionId = link.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSectionId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Project button
    const projectsBtn = document.querySelector('.primary-btn');
    projectsBtn.addEventListener('click', () => {
        navLinks.forEach(link => link.classList.remove('active'));
        const projectsLink = document.querySelector('[data-section="projects"]');
        projectsLink.classList.add('active');
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === 'projects') {
                section.classList.add('active');
            }
        });
    });
    
    // Connect button
    const connectBtn = document.querySelector('.secondary-btn');
    connectBtn.addEventListener('click', () => {
        navLinks.forEach(link => link.classList.remove('active'));
        const contactLink = document.querySelector('[data-section="contact"]');
        contactLink.classList.add('active');
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === 'contact') {
                section.classList.add('active');
            }
        });
    });
    
    // Create background video lines
    createBackgroundLines();
    
    // Add form submission handler
    //const contactForm = document.querySelector('.contact-form');
    //contactForm.addEventListener('submit', (e) => {
      //  e.preventDefault();
        
        // Add success animation
        //const formElements = contactForm.querySelectorAll('input, textarea, button');
 //       formElements.forEach(el => {
   //         el.style.transition = 'all 0.3s ease';
     //       el.style.borderColor = colors.accent;
       //     setTimeout(() => {
         //       el.style.borderColor = '';
           // }, 1000);
      //  });
        
        // Reset form
//        contactForm.reset();
  //  });
});

// ===== CREATE BACKGROUND LINES =====
function createBackgroundLines() {
    const lineCount = 5;
    const lines = [];
    
    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.classList.add('bg-line');
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDuration = `${Math.random() * 5 + 10}s`;
        line.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        document.body.appendChild(line);
        lines.push(line);
    }
}

// ===== CURSOR EFFECTS =====
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);
    
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// ===== PRELOAD ASSETS =====
function preloadAssets() {
    return new Promise((resolve) => {
        // Simulate loading
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                clearInterval(interval);
                resolve();
            }
        }, 200);
    });
}

// ===== INITIALIZE GSAP =====
// GSAP fallback for the mouse move effect
if (typeof gsap === 'undefined') {
    window.gsap = {
        to: (obj, props) => {
            const { x, y, duration } = props;
            const startX = obj.x || 0;
            const startY = obj.y || 0;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsedTime = (Date.now() - startTime) / 1000;
                const progress = Math.min(elapsedTime / duration, 1);
                
                if (x !== undefined) obj.x = startX + (x - startX) * progress;
                if (y !== undefined) obj.y = startY + (y - startY) * progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
    };
}

// Add this to make sure the script runs, even if GSAP is not loaded
window.addEventListener('DOMContentLoaded', () => {
    // Initialize cursor effects
    initCursorEffects();
    
    // Preload assets
    preloadAssets().then(() => {
        // Start the experience
        init();
    });
});
