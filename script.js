document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Elegant 3D Particle System
    // ======================
    function init3DParticles() {
        let container = document.querySelector('.particle-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'particle-container';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                overflow: hidden;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        // Subtle settings for elegant particles
        const settings = {
            particleCount: Math.min(100, Math.floor(window.innerWidth / 15)),
            maxDistance: 120,
            particleSize: 1.5,
            baseColor: [188, 19, 254],
            mouseForce: 15,
            connectionOpacity: 0.08,
            moveSpeed: 0.3
        };

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.z = 60;
        
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Particles with subtle glow
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesMaterial = new THREE.PointsMaterial({
            size: settings.particleSize,
            color: new THREE.Color(`rgb(${settings.baseColor.join(',')})`),
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        // Initialize particles in a sphere
        const positions = new Float32Array(settings.particleCount * 3);
        for (let i = 0; i < settings.particleCount; i++) {
            const i3 = i * 3;
            const radius = 40 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Delicate connections
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(`rgb(${settings.baseColor.join(',')})`),
            transparent: true,
            opacity: settings.connectionOpacity,
            blending: THREE.AdditiveBlending
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // Gentle mouse interaction
        const mouse = new THREE.Vector2();
        window.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation loop with smooth movements
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Gentle rotation
            particles.rotation.y += 0.0003;
            lines.rotation.y += 0.0003;
            
            // Update connections
            updateConnections(particles, lines, settings.maxDistance);
            
            // Subtle mouse interaction
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < settings.particleCount; i++) {
                const i3 = i * 3;
                const dx = positions[i3] - mouse.x * settings.mouseForce;
                const dy = positions[i3 + 1] - mouse.y * settings.mouseForce;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < settings.mouseForce * 1.5) {
                    const force = (settings.mouseForce * 1.5 - distance) / distance * 0.15;
                    positions[i3] += dx * force * settings.moveSpeed;
                    positions[i3 + 1] += dy * force * settings.moveSpeed;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    function updateConnections(particles, lines, maxDistance) {
        const positions = particles.geometry.attributes.position.array;
        const linePositions = [];
        const particleCount = positions.length / 3;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const x1 = positions[i3];
            const y1 = positions[i3 + 1];
            const z1 = positions[i3 + 2];
            
            const neighbors = [];
            for (let j = 0; j < particleCount; j++) {
                if (i === j) continue;
                const j3 = j * 3;
                const dx = positions[j3] - x1;
                const dy = positions[j3 + 1] - y1;
                const dz = positions[j3 + 2] - z1;
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if (distance < maxDistance) {
                    neighbors.push({j, distance});
                }
            }
            
            neighbors.sort((a,b) => a.distance - b.distance);
            const closest = neighbors.slice(0, 3);
            
            closest.forEach(neighbor => {
                const j3 = neighbor.j * 3;
                linePositions.push(x1, y1, z1);
                linePositions.push(positions[j3], positions[j3+1], positions[j3+2]);
            });
        }
        
        lines.geometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(linePositions, 3));
        lines.geometry.attributes.position.needsUpdate = true;
    }

    // Load Three.js and initialize particles
    function loadThreeJS() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = init3DParticles;
        document.head.appendChild(script);
    }
    loadThreeJS();

    // ======================
    // Navigation System
    // ======================
    const navButtons = document.querySelectorAll('.neon-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Show first section by default
    if (contentSections.length > 0) {
        contentSections[0].classList.remove('hidden');
    }
    
    // Handle nav button clicks
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Hide all sections
            contentSections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show target section
            document.getElementById(targetSection).classList.remove('hidden');
            
            // Update active button styling
            navButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Scroll to section smoothly
            document.getElementById(targetSection).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // ======================
    // Premium Discord Status
    // ======================
    const fetchPremiumDiscordStatus = async () => {
        try {
            const DISCORD_USER_ID = "763488231072596018";
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            
            if (!response.ok) throw new Error("API request failed");
            
            const { data } = await response.json();
            updatePremiumWidget(data);
            
            // If playing a game, highlight the corresponding tile
            const activeGame = data.activities.find(a => a.type === 0);
            if (activeGame) {
                highlightGameTile(activeGame.name);
            }
        } catch (error) {
            console.error("Discord API error:", error);
            showDiscordError();
        }
    };

    const updatePremiumWidget = (data) => {
        const statusColors = {
            online: 'status-online',
            idle: 'status-idle',
            dnd: 'status-dnd',
            offline: 'status-offline'
        };

        const currentStatus = statusColors[data.discord_status] || 'status-offline';
        const activeGame = data.activities.find(a => a.type === 0);
        const spotify = data.spotify;
        const customStatus = data.activities.find(a => a.type === 4);
        const streaming = data.activities.find(a => a.type === 1);

        // Update profile section
        document.querySelector('.discord-profile').innerHTML = `
            <img src="https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.webp?size=256" 
                 class="discord-avatar ${currentStatus}"
                 onerror="this.src='https://cdn.discordapp.com/embed/avatars/${Number(data.discord_user.discriminator) % 5}.png'"
                 alt="Discord Avatar">
            <div class="discord-info">
                <h3>${data.discord_user.username}</h3>
                <div class="status-indicator">
                    <span class="status-dot"></span>
                    <span>${getStatusText(data.discord_status)}</span>
                </div>
            </div>
        `;

        // Update activity section
        const activitySection = document.querySelector('.discord-activity');
        
        if (streaming) {
            activitySection.innerHTML = `
                <div class="activity-glow"></div>
                <div class="activity-content">
                    <div>
                        <span class="game-icon">🔴</span>
                        <strong>Streaming ${streaming.name}</strong>
                    </div>
                    <p>${streaming.details || ''}</p>
                    <p>${streaming.state || ''}</p>
                    ${streaming.assets?.large_image ? `
                        <img src="https://cdn.discordapp.com/app-assets/${streaming.application_id}/${streaming.assets.large_image}.webp" 
                             class="game-art" 
                             onerror="this.style.display='none'"
                             alt="${streaming.name} Artwork">
                    ` : ''}
                    <a href="${streaming.url}" class="stream-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Watch Stream
                    </a>
                </div>
            `;
        } else if (activeGame) {
            activitySection.innerHTML = `
                <div class="activity-glow"></div>
                <div class="activity-content">
                    <div>
                        <span class="game-icon">🎮</span>
                        <strong>Playing ${activeGame.name}</strong>
                    </div>
                    ${activeGame.details ? `<p>${activeGame.details}</p>` : ''}
                    ${activeGame.state ? `<p>${activeGame.state}</p>` : ''}
                    ${activeGame.assets?.large_image ? `
                        <img src="https://cdn.discordapp.com/app-assets/${activeGame.application_id}/${activeGame.assets.large_image}.webp" 
                             class="game-art" 
                             onerror="this.style.display='none'"
                             alt="${activeGame.name} Artwork">
                    ` : ''}
                </div>
            `;
        } else if (spotify) {
            activitySection.innerHTML = `
                <div class="activity-glow"></div>
                <div class="activity-content">
                    <div>
                        <span class="game-icon">🎵</span>
                        <strong>Listening to ${spotify.song}</strong>
                    </div>
                    <p>by ${spotify.artist}</p>
                    <img src="${spotify.album_art_url}" 
                         class="spotify-art" 
                         alt="${spotify.album} Cover">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${getProgressPercentage(spotify.timestamps)}%"></div>
                    </div>
                    <p class="time">${formatTime(spotify.timestamps.start)} - ${formatTime(spotify.timestamps.end)}</p>
                </div>
            `;
        } else if (customStatus) {
            activitySection.innerHTML = `
                <div class="activity-glow"></div>
                <div class="activity-content">
                    <div class="custom-status">
                        ${customStatus.emoji?.id ? `
                            <img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.webp" 
                                 class="status-emoji"
                                 alt="${customStatus.emoji.name}">
                        ` : ''}
                        <strong>${customStatus.state || getDefaultStatusMessage(data.discord_status)}</strong>
                    </div>
                    ${getStatusSubtext(data.discord_status)}
                </div>
            `;
        } else {
            activitySection.innerHTML = `
                <div class="activity-glow"></div>
                <div class="activity-content">
                    <p>${getDefaultStatusMessage(data.discord_status)}</p>
                    ${getStatusSubtext(data.discord_status)}
                </div>
            `;
        }
    };

    // Helper functions for status messages
    const getStatusText = (status) => {
        const statusMap = {
            online: 'ONLINE',
            idle: 'IDLE',
            dnd: 'DO NOT DISTURB',
            offline: 'OFFLINE'
        };
        return statusMap[status] || 'OFFLINE';
    };

    const getDefaultStatusMessage = (status) => {
        const messages = {
            online: "Available in the Cove",
            idle: "Away but around",
            dnd: "Focusing - please don't @ me",
            offline: "Currently offline"
        };
        return messages[status] || "In the Cove";
    };

    const getStatusSubtext = (status) => {
        const subtexts = {
            online: "<p>Come hang out!</p>",
            idle: "<p class='idle-text'>I'll be back soon</p>",
            dnd: "<p class='dnd-text'>Notifications muted</p>",
            offline: "<p>Last online: Just now</p>"
        };
        return subtexts[status] || "";
    };

    const getProgressPercentage = (timestamps) => {
        if (!timestamps) return 0;
        const now = Date.now();
        const duration = timestamps.end - timestamps.start;
        const progress = now - timestamps.start;
        return Math.min(100, (progress / duration) * 100);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const highlightGameTile = (gameName) => {
        document.querySelectorAll('.game-tile').forEach(tile => {
            tile.classList.remove('live-game');
        });

        const games = {
            'Apex Legends': 'apex',
            'Overwatch': 'overwatch',
            'VALORANT': 'valorant',
            'Rocket League': 'rocketleague',
            'Counter-Strike 2': 'cs2',
            'League of Legends': 'lol',
            'Fortnite': 'fortnite',
            'Minecraft': 'minecraft'
        };

        const gameKey = games[gameName];
        if (gameKey) {
            const gameTile = document.querySelector(`.game-tile[data-game="${gameKey}"]`);
            if (gameTile) {
                gameTile.classList.add('live-game');
                
                const pulse = document.createElement('div');
                pulse.className = 'live-pulse';
                gameTile.appendChild(pulse);
                
                setTimeout(() => {
                    pulse.remove();
                }, 2000);
            }
        }
    };

    const showDiscordError = () => {
        document.querySelector('.discord-profile').innerHTML = `
            <p class="api-error">Status feed offline</p>
            <p class="api-subtext">Join Discord to check my status</p>
        `;
        document.querySelector('.discord-activity').innerHTML = `
            <div class="activity-glow"></div>
            <div class="activity-content">
                <p>Connection issues detected</p>
                <p class="retry" onclick="window.location.reload()">Click to refresh</p>
            </div>
        `;
    };

    // Initialize Discord status
    fetchPremiumDiscordStatus();
    setInterval(fetchPremiumDiscordStatus, 30000);

    // ======================
    // FAQ Accordion
    // ======================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.contains('show');
            
            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('show');
            });
            
            // Remove active class from all questions
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
            });
            
            // Toggle current answer if it wasn't open
            if (!isOpen) {
                answer.classList.add('show');
                this.classList.add('active');
            }
        });
    });

    // ======================
    // Join Discord Button
    // ======================
    document.querySelector('.discord-join')?.addEventListener('click', () => {
        window.open('https://discord.gg/S6c5we5D4J', '_blank');
    });

    // ======================
    // Support Buttons
    // ======================
    const supportBtns = document.querySelectorAll('.support-btn');
    supportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.parentElement.querySelector('h3').textContent;
            const links = {
                'Ko-fi': 'https://ko-fi.com/Sealient',
                'PayPal': 'https://paypal.me/sealienty'
            };
            
            if (links[platform]) {
                window.open(links[platform], '_blank');
            }
        });
    });

    // ======================
    // Seal Avatar Animation
    // ======================
    const seal = document.querySelector('.seal');
    if (seal) {
        setInterval(() => {
            seal.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 10}px)`;
        }, 50);
    }

    // ======================
    // Game Tiles Hover Effect
    // ======================
    const gameTiles = document.querySelectorAll('.game-tile');
    gameTiles.forEach(tile => {
        tile.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', x);
            this.style.setProperty('--mouse-y', y);
        });
    });
});