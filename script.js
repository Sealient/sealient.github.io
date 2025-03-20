// ===== GLOBAL VARIABLES =====
let scene, camera, renderer;
let particles, geometry, materials = [];
let raycaster, mouse, intersects;
let clock = new THREE.Clock();
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
let audioAnalyser, audioContext, dataArray;
let isAudioInitialized = false;

// ===== NEON COLORS =====
const colors = {
    primary: 0x9900ff,
    accent: 0x00ffcc,
    dark: 0x0a0a12,
    highlight: 0xff0066, // New highlight color
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

    // Create renderer with improved settings
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webgl-canvas'),
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create grid
    createGrid();

    // Create particles
    createParticles();

    // Create floating objects
    createFloatingObjects();

    // Create audio-reactive elements
    createAudioReactiveElements();

    // Create mouse interaction
    createMouseInteraction();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);

    // Start animation loop
    animate();

    // Improved loading screen with progress
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingBar = document.querySelector('.loading-bar-progress');
    const loadingPercentage = document.querySelector('.loading-percentage');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            loadingBar.style.width = '100%';
            loadingPercentage.textContent = '100%';
            
            setTimeout(() => {
                loadingScreen.style.opacity = 0;
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Trigger entrance animations
                    triggerEntranceAnimations();
                }, 1000);
            }, 500);
        } else {
            loadingBar.style.width = `${progress}%`;
            loadingPercentage.textContent = `${Math.floor(progress)}%`;
        }
    }, 100);
}

// ===== CREATE GRID =====
function createGrid() {
    const gridHelper = new THREE.GridHelper(400, 40, colors.accent, colors.primary);
    gridHelper.position.y = -30;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Create horizontal lines with improved aesthetics
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
        
        // More dynamic line styling
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: i % 4 === 0 ? colors.primary : i % 2 === 0 ? colors.accent : colors.highlight,
            transparent: true,
            opacity: 0.2 + (Math.random() * 0.2)
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    }
    
    // Add vertical lines for a more complete grid
    for (let i = 0; i <= lineCount; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(6);
        
        linePositions[0] = i * lineSpacing - 200;
        linePositions[1] = -30;
        linePositions[2] = -200;
        
        linePositions[3] = i * lineSpacing - 200;
        linePositions[4] = -30;
        linePositions[5] = 200;
        
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: i % 4 === 0 ? colors.primary : i % 2 === 0 ? colors.accent : colors.highlight,
            transparent: true,
            opacity: 0.1 + (Math.random() * 0.1)
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    }
}

// ===== CREATE PARTICLES =====
function createParticles() {
    // Create enhanced particle system
    geometry = new THREE.BufferGeometry();
    const particleCount = 3000; // Increased count
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
        // Position with better distribution
        const radius = Math.random() * 400 + 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 50;
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // More varied colors
        const colorValue = Math.random();
        if (colorValue < 0.4) {
            color.setHSL(0.75, 1, 0.5 + Math.random() * 0.5); // Purple
        } else if (colorValue < 0.8) {
            color.setHSL(0.5, 1, 0.5 + Math.random() * 0.5); // Teal
        } else {
            color.setHSL(0.9, 1, 0.5 + Math.random() * 0.5); // Pinkish
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Varied sizes
        sizes[i] = Math.random() * 3;
        
        // Different speeds for more organic motion
        speeds[i] = Math.random() * 0.2 + 0.05;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Store speeds for animation
    geometry.userData = { speeds };
    
    // Create particle material with custom shader
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        },
        vertexShader: `
            attribute float size;
            uniform float time;
            uniform float pixelRatio;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Create a circular point
                float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                if (r > 0.5) discard;
                
                // Add glow effect
                float glow = 0.5 - r;
                vec3 color = vColor * glow * 2.0;
                gl_FragColor = vec4(color, glow * 1.5);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });
    
    // Create particle system
    particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
}

// ===== CREATE FLOATING OBJECTS =====
function createFloatingObjects() {
    // Create enhanced floating glowing orbs
    for (let i = 0; i < 20; i++) {
        const radius = Math.random() * 3 + 1;
        const detail = 32;
        const geometry = new THREE.SphereGeometry(radius, detail, detail);
        
        // Create the core material
        const coreColor = i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.accent : colors.highlight;
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: coreColor,
            transparent: true,
            opacity: 0.7
        });
        
        // Create the glow material
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: coreColor,
            transparent: true,
            opacity: 0.2
        });
        
        // Create core and glow meshes
        const core = new THREE.Mesh(geometry, coreMaterial);
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 2, detail, detail),
            glowMaterial
        );
        
        // Position the orb
        const orb = new THREE.Group();
        orb.add(core);
        orb.add(glow);
        
        // More interesting positioning
        const distance = Math.random() * 200 + 100;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 200;
        
        orb.position.set(
            Math.cos(angle) * distance,
            height,
            Math.sin(angle) * distance
        );
        
        // Add to scene
        scene.add(orb);
        
        // Store material for animation with more parameters
        materials.push({
            core: coreMaterial,
            glow: glowMaterial,
            mesh: orb,
            speed: Math.random() * 0.5 + 0.2,
            radius: radius,
            offset: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.02 - 0.01,
            orbitRadius: Math.random() * 10 + 5,
            orbitSpeed: Math.random() * 0.1 + 0.05
        });
    }
    
    // Add some geometric shapes for variety
    const geometryTypes = [
        new THREE.TetrahedronGeometry(5, 0),
        new THREE.OctahedronGeometry(5, 0),
        new THREE.IcosahedronGeometry(5, 0)
    ];
    
    for (let i = 0; i < 5; i++) {
        const geometry = geometryTypes[i % geometryTypes.length];
        const wireframe = new THREE.WireframeGeometry(geometry);
        const color = i % 2 === 0 ? colors.primary : colors.accent;
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        
        const shape = new THREE.LineSegments(wireframe, lineMaterial);
        
        // Position the shape
        shape.position.set(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 300
        );
        
        // Random scale
        const scale = Math.random() * 2 + 1;
        shape.scale.set(scale, scale, scale);
        
        // Add to scene
        scene.add(shape);
        
        // Store for animation
        materials.push({
            mesh: shape,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            isShape: true
        });
    }
}

// ===== CREATE AUDIO REACTIVE ELEMENTS =====
function createAudioReactiveElements() {
    // Create circular audio visualizer
    const visualizerGeometry = new THREE.BufferGeometry();
    const segments = 128;
    const radius = 30;
    
    const positions = new Float32Array((segments + 1) * 3);
    
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = 0;
    }
    
    visualizerGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const visualizerMaterial = new THREE.LineBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.6
    });
    
    const visualizer = new THREE.Line(visualizerGeometry, visualizerMaterial);
    visualizer.position.z = -100;
    visualizer.visible = false; // Hidden until audio is initialized
    scene.add(visualizer);
    
    // Store for updates
    scene.userData = {
        ...scene.userData,
        audioVisualizer: visualizer,
        visualizerGeometry: visualizerGeometry,
        visualizerRadius: radius
    };
}

// ===== INITIALIZE AUDIO =====
function initAudio() {
    if (isAudioInitialized) return;
    
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create audio element for background music
    const audioElement = document.createElement('audio');
    audioElement.src = 'path/to/your/background-music.mp3'; // Add your music file
    audioElement.loop = true;
    audioElement.volume = 0.3;
    document.body.appendChild(audioElement);
    
    // Create media element source
    const source = audioContext.createMediaElementSource(audioElement);
    
    // Create analyser
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 256;
    
    // Connect nodes
    source.connect(audioAnalyser);
    audioAnalyser.connect(audioContext.destination);
    
    // Create data array
    dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    
    // Play audio
    audioElement.play().catch(e => console.log('Audio autoplay blocked:', e));
    
    // Show visualizer
    scene.userData.audioVisualizer.visible = true;
    
    isAudioInitialized = true;
}

// ===== CREATE MOUSE INTERACTION =====
function createMouseInteraction() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Add cursor ripple effect
    const rippleGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
    const rippleMaterial = new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.y = -29.5; // Just above the grid
    ripple.visible = false;
    scene.add(ripple);
    
    // Store for animation
    scene.userData = {
        ...scene.userData,
        ripple: ripple,
        rippleSize: 0.2,
        rippleExpanding: false
    };
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
    
    // Update ripple position
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([scene.children[0]]); // Intersect with grid
    
    if (intersects.length > 0) {
        const ripple = scene.userData.ripple;
        ripple.position.set(intersects[0].point.x, -29.5, intersects[0].point.z);
        ripple.visible = true;
    }
    
    // Enhanced camera movement with inertia
    gsap.to(camera.position, {
        x: mouse.x * 10,
        y: mouse.y * 10,
        duration: 2,
        ease: "power2.out"
    });
    
    // Subtle rotation to follow mouse
    gsap.to(camera.rotation, {
        x: -mouse.y * 0.1,
        y: -mouse.x * 0.1,
        duration: 2,
        ease: "power2.out"
    });
}

// ===== MOUSE CLICK =====
function onMouseClick(event) {
    // Initialize audio on first click (to handle autoplay restrictions)
    if (!isAudioInitialized) {
        initAudio();
    }
    
    // Create ripple effect
    const ripple = scene.userData.ripple;
    if (ripple.visible) {
        scene.userData.rippleSize = 0.2;
        scene.userData.rippleExpanding = true;
        
        // Create particle burst at click point
        createParticleBurst(ripple.position.x, ripple.position.y, ripple.position.z);
    }
}

// ===== CREATE PARTICLE BURST =====
function createParticleBurst(x, y, z) {
    const burstGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = [];
    
    const color = new THREE.Color(colors.accent);
    
    for (let i = 0; i < particleCount; i++) {
        // Start at burst position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Color
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Size
        sizes[i] = Math.random() * 1 + 0.5;
        
        // Random velocity
        velocities.push({
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * 2,
            z: (Math.random() - 0.5) * 2
        });
    }
    
    burstGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    burstGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    burstGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const burstMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });
    
    const burst = new THREE.Points(burstGeometry, burstMaterial);
    burst.userData = {
        velocities,
        lifetime: 0,
        maxLifetime: 60
    };
    scene.add(burst);
    
    // Store for animation
    if (!scene.userData.particleBursts) {
        scene.userData.particleBursts = [];
    }
    scene.userData.particleBursts.push(burst);
}

// ===== ANIMATION =====
function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();
    
    // Update particle materials with time uniform
    if (particles && particles.material.uniforms) {
        particles.material.uniforms.time.value = elapsedTime;
    }
    
    // Rotate particles
    if (particles) {
        particles.rotation.y = elapsedTime * 0.05;
        
        // Add some wave motion
        const positions = particles.geometry.attributes.position.array;
        const speeds = particles.geometry.userData.speeds;
        
        for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;
            const speed = speeds[i];
            
            // Apply sine wave motion
            positions[i3 + 1] += Math.sin(elapsedTime * speed + i * 0.1) * 0.03;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate floating orbs
    materials.forEach((material, i) => {
        if (material.isShape) {
            // Rotate geometric shapes
            material.mesh.rotation.x += material.rotationSpeed.x;
            material.mesh.rotation.y += material.rotationSpeed.y;
            material.mesh.rotation.z += material.rotationSpeed.z;
        } else {
            // Animate orbs
            const orbit = elapsedTime * material.speed + material.offset;
            
            // More complex motion - orbital and floating
            material.mesh.position.y += Math.sin(orbit) * 0.05;
            
            // Add orbital motion
            const originalX = material.mesh.position.x;
            const originalZ = material.mesh.position.z;
            
            // Calculate center of orbit
            const centerX = originalX - Math.cos(material.offset) * material.orbitRadius;
            const centerZ = originalZ - Math.sin(material.offset) * material.orbitRadius;
            
            // Update position
            material.mesh.position.x = centerX + Math.cos(elapsedTime * material.orbitSpeed + material.offset) * material.orbitRadius;
            material.mesh.position.z = centerZ + Math.sin(elapsedTime * material.orbitSpeed + material.offset) * material.orbitRadius;
            
            // Pulse the glow
            const pulse = Math.sin(elapsedTime * 2 + i) * 0.5 + 0.5;
            material.glow.material.opacity = 0.1 + pulse * 0.2;
            material.core.material.opacity = 0.5 + pulse * 0.3;
            
            // Subtle color shifting
            const hue = (elapsedTime * 0.05 + i * 0.1) % 1;
            if (i % 3 === 0) {
                const color = new THREE.Color().setHSL(0.75 + Math.sin(hue) * 0.05, 1, 0.5);
                material.core.material.color.set(color);
                material.glow.material.color.set(color);
            }
        }
    });
    
    // Update ripple effect
    const ripple = scene.userData.ripple;
    if (scene.userData.rippleExpanding) {
        scene.userData.rippleSize += 0.4;
        ripple.scale.set(scene.userData.rippleSize, scene.userData.rippleSize, 1);
        ripple.material.opacity = Math.max(0, 1 - scene.userData.rippleSize / 20);
        
        if (scene.userData.rippleSize > 20) {
            scene.userData.rippleExpanding = false;
            ripple.visible = false;
        }
    }
    
    // Update particle bursts
    if (scene.userData.particleBursts) {
        scene.userData.particleBursts.forEach((burst, index) => {
            // Update lifetime
            burst.userData.lifetime++;
            
            // Update positions based on velocities
            const positions = burst.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length / 3; i++) {
                const i3 = i * 3;
                const velocity = burst.userData.velocities[i];
                
                positions[i3] += velocity.x * 0.2;
                positions[i3 + 1] += velocity.y * 0.2;
                positions[i3 + 2] += velocity.z * 0.2;
                
                // Add gravity
                velocity.y -= 0.01;
            }
            
            burst.geometry.attributes.position.needsUpdate = true;
            
            // Fade out
            burst.material.opacity = Math.max(0, 1 - burst.userData.lifetime / burst.userData.maxLifetime);
            
            // Remove if expired
            if (burst.userData.lifetime >= burst.userData.maxLifetime) {
                scene.remove(burst);
                scene.userData.particleBursts.splice(index, 1);
            }
        });
    }
    
    // Update audio visualizer if active
    if (isAudioInitialized && audioAnalyser) {
        audioAnalyser.getByteFrequencyData(dataArray);
        
        const visualizer = scene.userData.audioVisualizer;
        const visualizerGeo = visualizer.geometry;
        const positions = visualizerGeo.attributes.position.array;
        const baseRadius = scene.userData.visualizerRadius;
        
        // Update visualizer based on audio data
        for (let i = 0; i < 128; i++) {
            const angle = (i / 128) * Math.PI * 2;
            const value = dataArray[i] / 255; // Normalize between 0 and 1
            const radius = baseRadius * (1 + value * 0.3);
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;
        }
        
        // Copy the last point to close the loop
        positions[128 * 3] = positions[0];
        positions[128 * 3 + 1] = positions[1];
        positions[128 * 3 + 2] = positions[2];
        
        visualizerGeo.attributes.position.needsUpdate = true;
        
        // Rotate visualizer
        visualizer.rotation.z += deltaTime * 0.1;
    }
    
    renderer.render(scene, camera);
}

// ===== NAVIGATION ENHANCEMENT =====
function enhanceNavigation() {
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSectionId = link.getAttribute('data-section');
            
            // Update active link with glow effect
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
                navLink.classList.remove('nav-glow');
            });
            
            link.classList.add('active');
            link.classList.add('nav-glow');
            
            // Animate current section out
            const currentSection = document.querySelector('.section.active');
            if (currentSection) {
                gsap.to(currentSection, {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        currentSection.classList.remove('active');
                        
                        // Show target section
                        sections.forEach(section => {
                            if (section.id === targetSectionId) {
                                section.classList.add('active');
                                section.style.opacity = 0;
                                section.style.transform = 'translateY(20px)';
                                
                                gsap.to(section, {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    ease: "power2.out"
                                });
                                
                                // Animate section content
                                animateSectionContent(section);
                            }
                        });
                    }
                });
            } else {
                // If no active section, just show the target
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetSectionId) {
                        section.classList.add('active');
                        // Animate section content
                        animateSectionContent(section);
                    }
                });
            }
        });
    });
    
    // Project button enhancement
    const projectsBtn = document.querySelector('.primary-btn');
    if (projectsBtn) {
        projectsBtn.addEventListener('click', () => {
            // Trigger click on projects link
            const projectsLink = document.querySelector('[data-section="projects"]');
            if (projectsLink) {
                projectsLink.click();
                
                // Add button press animation
                gsap.to(projectsBtn, {
                    scale: 0.95,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(projectsBtn, {
                            scale: 1,
                            duration: 0.2,
                            ease: "back.out(1.5)"
                        });
                    }
                });
            }
        });
    }
    
    // Connect button enhancement
    const connectBtn = document.querySelector('.secondary-btn');
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            // Trigger click on contact link
            const contactLink = document.querySelector('[data-section="contact"]');
            if (contactLink) {
                contactLink.click();
                
                // Add button press animation
                gsap.to(connectBtn, {
                    scale: 0.95,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(connectBtn, {
                            scale: 1,
                            duration: 0.2,
                            ease: "back.out(1.5)"
                        });
                    }
                });
            }
        });
    }
}

// ===== ANIMATE SECTION CONTENT =====
function animateSectionContent(section) {
    // Animate headings
    const headings = section.querySelectorAll('h1, h2, h3');
    gsap.fromTo(headings, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );
    
    // Animate paragraphs
    const paragraphs = section.querySelectorAll('p');
    gsap.fromTo(paragraphs, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.3, ease: "power2.out" }
    );
    
    // Animate buttons
    const buttons = section.querySelectorAll('button, .btn');
    gsap.fromTo(buttons, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.5, ease: "power2.out" }
    );
    
    // Animate project cards
    const cards = section.querySelectorAll('.project-card');
    gsap.fromTo(cards, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.2, ease: "power2.out" }
    );
    
    // Animate skills
    const skills = section.querySelectorAll('.skill-item');
    gsap.fromTo(skills, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power2.out" }
    );
    
    // Animate form elements
    const formElements = section.querySelectorAll('input, textarea, .form-group');
    gsap.fromTo(formElements, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power2.out" }
    );
    
    // Add special effects for active section
    if (section.id === 'home') {
        animateHomeSection(section);
    } else if (section.id === 'projects') {
        animateProjectsSection(section);
    } else if (section.id === 'about') {
        animateAboutSection(section);
    } else if (section.id === 'contact') {
        animateContactSection(section);
    }
}

// ===== SECTION-SPECIFIC ANIMATIONS =====
function animateHomeSection(section) {
    // Animate the main heading with a typing effect
    const mainHeading = section.querySelector('h1');
    if (mainHeading) {
        const text = mainHeading.textContent;
        mainHeading.innerHTML = '';
        mainHeading.style.opacity = 1;
        
        let i = 0;
        const typeEffect = setInterval(() => {
            if (i < text.length) {
                mainHeading.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typeEffect);
                // Add cursor blink effect
                const cursor = document.createElement('span');
                cursor.classList.add('cursor-blink');
                cursor.textContent = '|';
                mainHeading.appendChild(cursor);
                
                // Remove cursor after a delay
                setTimeout(() => {
                    if (cursor && cursor.parentNode) {
                        cursor.parentNode.removeChild(cursor);
                    }
                }, 3000);
            }
        }, 50);
    }
    
    // Add parallax effect to hero image
    const heroImage = section.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            gsap.to(heroImage, {
                x: x,
                y: y,
                duration: 1,
                ease: "power2.out"
            });
        });
    }
}

function animateProjectsSection(section) {
    // Add hover effects to project cards
    const projectCards = section.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Make other cards slightly transparent
            projectCards.forEach(otherCard => {
                if (otherCard !== card) {
                    gsap.to(otherCard, {
                        opacity: 0.7,
                        duration: 0.3
                    });
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: "power2.in"
            });
            
            // Restore opacity of other cards
            projectCards.forEach(otherCard => {
                gsap.to(otherCard, {
                    opacity: 1,
                    duration: 0.3
                });
            });
        });
    });
    
    // Add filter animation
    const filterButtons = section.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: "power2.out",
                        clearProps: "visibility"
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.4,
                        ease: "power2.out",
                        onComplete: () => {
                            card.style.visibility = "hidden";
                        }
                    });
                }
            });
        });
    });
}

function animateAboutSection(section) {
    // Animate skill bars
    const skillBars = section.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        gsap.fromTo(bar, 
            { width: '0%' },
            { 
                width: percentage, 
                duration: 1.5, 
                ease: "power2.out",
                delay: 0.5
            }
        );
    });
    
    // Animate counters
    const counters = section.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const duration = 2000; // 2 seconds
        const interval = duration / target;
        
        const updateCounter = setInterval(() => {
            count++;
            counter.textContent = count;
            
            if (count >= target) {
                clearInterval(updateCounter);
            }
        }, interval);
    });
}

function animateContactSection(section) {
    // Add floating label effect to form inputs
    const formGroups = section.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            input.addEventListener('focus', () => {
                label.classList.add('active');
                gsap.to(input, {
                    borderColor: colors.accent,
                    duration: 0.3
                });
            });
            
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    label.classList.remove('active');
                }
                gsap.to(input, {
                    borderColor: '',
                    duration: 0.3
                });
            });
            
            // Check if input already has a value
            if (input.value !== '') {
                label.classList.add('active');
            }
        }
    });
    
    // Add form submission animation
    const contactForm = section.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            const inputs = contactForm.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && input.value.trim() === '') {
                    isValid = false;
                    gsap.to(input, {
                        borderColor: 'red',
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                }
            });
            
            if (isValid) {
                // Show success animation
                const submitButton = contactForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    const originalText = submitButton.textContent;
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
                    
                    // Simulate form submission
                    setTimeout(() => {
                        submitButton.innerHTML = '<span class="success-icon">✓</span> Message Sent!';
                        submitButton.classList.add('success');
                        
                        // Add success animation to form
                        gsap.to(contactForm, {
                            scale: 1.02,
                            duration: 0.3,
                            ease: "power2.out",
                            onComplete: () => {
                                gsap.to(contactForm, {
                                    scale: 1,
                                    duration: 0.3,
                                    ease: "power2.in"
                                });
                            }
                        });
                        
                        // Reset form after delay
                        setTimeout(() => {
                            contactForm.reset();
                            submitButton.disabled = false;
                            submitButton.textContent = originalText;
                            submitButton.classList.remove('success');
                            
                            // Reset labels
                            const labels = contactForm.querySelectorAll('label');
                            labels.forEach(label => label.classList.remove('active'));
                        }, 3000);
                    }, 1500);
                }
            }
        });
    }
}

// ===== CREATE BACKGROUND EFFECTS =====
function createBackgroundLines() {
    const lineCount = 10; // Increased from 5
    const lines = [];
    
    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.classList.add('bg-line');
        
        // More varied positioning and animation
        line.style.left = `${Math.random() * 100}%`;
        line.style.width = `${Math.random() * 1 + 0.5}px`;
        line.style.animationDuration = `${Math.random() * 10 + 15}s`; // Slower animation
        line.style.opacity = `${Math.random() * 0.4 + 0.1}`;
        
        // Random color based on theme
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            line.style.backgroundColor = '#9900ff';
        } else if (colorChoice < 0.66) {
            line.style.backgroundColor = '#00ffcc';
        } else {
            line.style.backgroundColor = '#ff0066';
        }
        
        // Add glow effect
        line.style.boxShadow = `0 0 8px ${line.style.backgroundColor}`;
        
        document.body.appendChild(line);
        lines.push(line);
    }
    
    // Add floating particles
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('bg-particle');
        
        // Random styling
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 6 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        
        // Random animation
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        // Random color
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            particle.style.backgroundColor = '#9900ff';
        } else if (colorChoice < 0.66) {
            particle.style.backgroundColor = '#00ffcc';
        } else {
            particle.style.backgroundColor = '#ff0066';
        }
        
        document.body.appendChild(particle);
    }
}

// ===== CURSOR EFFECTS =====
function initCursorEffects() {
    // Create main cursor
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);
    
    // Create cursor trail
    const cursorTrail = document.createElement('div');
    cursorTrail.classList.add('cursor-trail');
    document.body.appendChild(cursorTrail);
    
    // Create cursor glow
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);
    
    // Track mouse position with smoothing
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    let glowX = 0;
    let glowY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Update cursor position with subtle lag
    function updateCursor() {
        // Main cursor follows mouse exactly
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Trail follows with delay
        trailX += (mouseX - trailX) * 0.2;
        trailY += (mouseY - trailY) * 0.2;
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        // Glow follows with more delay
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Enhanced hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, input, textarea');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Expand cursor
            cursor.classList.add('cursor-hover');
            cursorTrail.classList.add('cursor-hover');
            
            // Add element-specific effects
            if (element.tagName === 'A') {
                cursor.classList.add('cursor-link');
            } else if (element.tagName === 'BUTTON') {
                cursor.classList.add('cursor-button');
            } else if (element.classList.contains('project-card')) {
                cursor.classList.add('cursor-card');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            // Reset cursor
            cursor.classList.remove('cursor-hover', 'cursor-link', 'cursor-button', 'cursor-card');
            cursorTrail.classList.remove('cursor-hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
        setTimeout(() => {
            cursor.classList.remove('cursor-click');
        }, 300);
    });
}

// ===== PRELOAD ASSETS =====
function preloadAssets() {
    return new Promise((resolve) => {
        const loadingScreen = document.querySelector('.loading-screen');
        const loadingBar = document.querySelector('.loading-bar-progress');
        const loadingText = document.querySelector('.loading-text');
        const loadingPercentage = document.querySelector('.loading-percentage');
        
        let progress = 0;
        let loadingItems = 0;
        
        // Add loading text animation
        const loadingPhrases = [
            "Initializing 3D environment...",
            "Preparing particles...",
            "Generating objects...",
            "Configuring audio...",
            "Optimizing rendering...",
            "Almost ready..."
        ];
        
        let phraseIndex = 0;
        const textInterval = setInterval(() => {
            loadingText.textContent = loadingPhrases[phraseIndex];
            phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
        }, 1200);
        
        // Simulate asset loading
        const loadingInterval = setInterval(() => {
            // Simulate loading speed with variable increments
            const increment = Math.random() * 5 + (progress > 80 ? 1 : 3);
            progress += increment;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                clearInterval(textInterval);
                
                loadingBar.style.width = '100%';
                loadingPercentage.textContent = '100%';
                loadingText.textContent = "Ready!";
                
                // Finish loading with animation
                setTimeout(() => {
                    gsap.to(loadingScreen, {
                        opacity: 0,
                        duration: 1,
                        ease: "power2.out",
                        onComplete: () => {
                            loadingScreen.style.display = 'none';
                            resolve();
                            
                            // Start entrance animations
                            triggerEntranceAnimations();
                        }
                    });
                }, 500);
            } else {
                loadingBar.style.width = `${progress}%`;
                loadingPercentage.textContent = `${Math.floor(progress)}%`;
            }
        }, 100);
    });
}

// ===== TRIGGER ENTRANCE ANIMATIONS =====
function triggerEntranceAnimations() {
    // Animate navigation
    const navbar = document.querySelector('nav');
    if (navbar) {
        gsap.fromTo(navbar, 
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
        );
    }
    
    // Animate active section
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        gsap.fromTo(activeSection, 
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" }
        );
        
        // Animate section content
        animateSectionContent(activeSection);
    }
    
    // Animate background lines
    const bgLines = document.querySelectorAll('.bg-line');
    gsap.fromTo(bgLines, 
        { opacity: 0 },
        { opacity: 1, duration: 2, stagger: 0.1, ease: "power2.out" }
    );
    
    // Initialize canvas with reveal effect
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
        gsap.fromTo(canvas, 
            { opacity: 0 },
            { opacity: 1, duration: 2, ease: "power2.out" }
        );
    }
}

// ===== INITIALIZE EXPERIENCE =====
document.addEventListener('DOMContentLoaded', () => {
    // Preload assets first
    preloadAssets().then(() => {
        // Initialize 3D scene
        init();
        
        // Initialize cursor effects
        initCursorEffects();
        
        // Create background effects
        createBackgroundLines();
        
        // Setup enhanced navigation
        enhanceNavigation();
    });
});
