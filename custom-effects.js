// ===== CUSTOM INTERACTIVE EFFECTS =====
class ParticleEffect {
    constructor() {
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particleCount = 30;
        
        // Setup canvas
        this.canvas.className = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '20';
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Mouse events
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.addParticles(1);
        });
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addParticles(count) {
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 5 + 1;
            const speedX = Math.random() * 2 - 1;
            const speedY = Math.random() * 2 - 1;
            const colorType = Math.random() < 0.5 ? 'primary' : 'accent';
            
            this.particles.push({
                x: this.mousePosition.x,
                y: this.mousePosition.y,
                size: size,
                speedX: speedX,
                speedY: speedY,
                color: colorType,
                alpha: 1,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 2 - 1
            });
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw and update particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= 0.05;
            p.rotation += p.rotationSpeed;
            
            // Draw
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            
            if (p.color === 'primary') {
                this.ctx.fillStyle = 'rgba(153, 0, 255, ' + p.alpha + ')';
                this.ctx.shadowColor = 'rgba(153, 0, 255, 0.7)';
            } else {
                this.ctx.fillStyle = 'rgba(0, 255, 204, ' + p.alpha + ')';
                this.ctx.shadowColor = 'rgba(0, 255, 204, 0.7)';
            }
            
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Remove if fully transparent
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }
}

class AdvancedCursor {
    constructor() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursorRing = document.createElement('div');
        
        this.cursor.className = 'cursor-dot';
        this.cursorRing.className = 'cursor-ring';
        
        // Apply base styles programmatically to ensure they're applied
        this.applyCursorStyles();
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorRing);
        
        // Variables
        this.cursorPos = { x: 0, y: 0 };
        this.ringPos = { x: 0, y: 0 };
        this.previousTimestamp = 0;
        this.velocity = { x: 0, y: 0 };
        this.isActive = false;
        this.isHovering = false;
        this.isTouching = false;
        
        // Hide default cursor
        document.documentElement.style.cursor = 'none';
        
        // Event listeners with passive option for better performance
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
        document.addEventListener('mousedown', () => this.onMouseDown(), { passive: true });
        document.addEventListener('mouseup', () => this.onMouseUp(), { passive: true });
        document.addEventListener('mouseleave', () => this.onMouseLeave(), { passive: true });
        document.addEventListener('mouseenter', () => this.onMouseEnter(), { passive: true });
        
        // Touch support for mobile
        document.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
        document.addEventListener('touchend', () => this.onTouchEnd(), { passive: true });
        
        // Add hover effects with event delegation for better performance
        document.body.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.matches('a, button, .project-card, .social-card, input, select, textarea, [role="button"], .interactive')) {
                this.onElementHover(true);
            }
        }, { passive: true });
        
        document.body.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (target.matches('a, button, .project-card, .social-card, input, select, textarea, [role="button"], .interactive')) {
                this.onElementHover(false);
            }
        }, { passive: true });
        
        // Start animation loop with requestAnimationFrame
        this.animate();
    }
    
    applyCursorStyles() {
        // Dot styles
        this.cursor.style.position = 'fixed';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.width = '8px';
        this.cursor.style.height = '8px';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.backgroundColor = 'rgba(0, 255, 204, 1)';
        this.cursor.style.zIndex = '99999';
        this.cursor.style.transform = 'translate(-50%, -50%)';
        this.cursor.style.transition = 'width 0.2s, height 0.2s, background-color 0.2s';
        this.cursor.style.mixBlendMode = 'screen';
        this.cursor.style.boxShadow = '0 0 10px rgba(0, 255, 204, 0.8)';
        
        // Ring styles
        this.cursorRing.style.position = 'fixed';
        this.cursorRing.style.pointerEvents = 'none';
        this.cursorRing.style.width = '30px';
        this.cursorRing.style.height = '30px';
        this.cursorRing.style.borderRadius = '50%';
        this.cursorRing.style.border = '1px solid rgba(153, 0, 255, 0.7)';
        this.cursorRing.style.borderWidth = '1px';
        this.cursorRing.style.zIndex = '99998';
        this.cursorRing.style.transform = 'translate(-50%, -50%)';
        this.cursorRing.style.transition = 'width 0.3s, height 0.3s, border-color 0.3s';
        this.cursorRing.style.mixBlendMode = 'screen';
        this.cursorRing.style.boxShadow = '0 0 15px rgba(153, 0, 255, 0.3)';
        
        // Add CSS classes for state changes
        const style = document.createElement('style');
        style.textContent = `
            .cursor-dot.cursor-active {
                width: 16px;
                height: 16px;
                background-color: rgba(255, 0, 128, 1);
            }
            
            .cursor-ring.cursor-active {
                width: 40px;
                height: 40px;
                border-color: rgba(255, 0, 128, 0.7);
            }
            
            .cursor-dot.cursor-hover {
                width: 12px;
                height: 12px;
                background-color: rgba(0, 255, 255, 1);
            }
            
            .cursor-ring.cursor-hover {
                width: 50px;
                height: 50px;
                border-color: rgba(0, 255, 255, 0.7);
                border-width: 2px;
            }
            
            .cursor-hidden {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    onMouseMove(e) {
        // Calculate velocity for smoother trailing effect
        const currentTimestamp = performance.now();
        const deltaTime = currentTimestamp - this.previousTimestamp;
        
        if (this.previousTimestamp !== 0 && deltaTime > 0) {
            this.velocity.x = (e.clientX - this.cursorPos.x) / deltaTime * 10;
            this.velocity.y = (e.clientY - this.cursorPos.y) / deltaTime * 10;
        }
        
        this.cursorPos = { x: e.clientX, y: e.clientY };
        this.previousTimestamp = currentTimestamp;
        
        // Position dot directly at cursor for perfect accuracy
        this.cursor.style.left = `${this.cursorPos.x}px`;
        this.cursor.style.top = `${this.cursorPos.y}px`;
    }
    
    onTouchStart(e) {
        if (e.touches && e.touches[0]) {
            this.isTouching = true;
            this.cursorPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            this.ringPos = { ...this.cursorPos };
            
            this.cursor.classList.remove('cursor-hidden');
            this.cursorRing.classList.remove('cursor-hidden');
            this.onMouseDown();
        }
    }
    
    onTouchMove(e) {
        if (e.touches && e.touches[0]) {
            this.cursorPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            
            this.cursor.style.left = `${this.cursorPos.x}px`;
            this.cursor.style.top = `${this.cursorPos.y}px`;
        }
    }
    
    onTouchEnd() {
        this.isTouching = false;
        this.cursor.classList.add('cursor-hidden');
        this.cursorRing.classList.add('cursor-hidden');
        this.onMouseUp();
    }
    
    onMouseDown() {
        this.cursor.classList.add('cursor-active');
        this.cursorRing.classList.add('cursor-active');
        
        // Add click ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.position = 'fixed';
        ripple.style.left = `${this.cursorPos.x}px`;
        ripple.style.top = `${this.cursorPos.y}px`;
        ripple.style.width = '5px';
        ripple.style.height = '5px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 0, 128, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.zIndex = '99997';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleEffect 0.8s ease-out forwards';
        
        document.body.appendChild(ripple);
        
        // Add ripple animation if it doesn't exist
        if (!document.querySelector('#ripple-animation')) {
            const rippleAnimation = document.createElement('style');
            rippleAnimation.id = 'ripple-animation';
            rippleAnimation.textContent = `
                @keyframes rippleEffect {
                    0% { width: 5px; height: 5px; opacity: 1; }
                    100% { width: 100px; height: 100px; opacity: 0; }
                }
            `;
            document.head.appendChild(rippleAnimation);
        }
        
        // Remove ripple after animation completes
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }
    
    onMouseUp() {
        this.cursor.classList.remove('cursor-active');
        this.cursorRing.classList.remove('cursor-active');
    }
    
    onMouseLeave() {
        this.cursor.classList.add('cursor-hidden');
        this.cursorRing.classList.add('cursor-hidden');
        this.isActive = false;
    }
    
    onMouseEnter() {
        this.cursor.classList.remove('cursor-hidden');
        this.cursorRing.classList.remove('cursor-hidden');
        this.isActive = true;
    }
    
    onElementHover(isHovering) {
        this.isHovering = isHovering;
        
        if (isHovering) {
            this.cursor.classList.add('cursor-hover');
            this.cursorRing.classList.add('cursor-hover');
        } else {
            this.cursor.classList.remove('cursor-hover');
            this.cursorRing.classList.remove('cursor-hover');
        }
    }
    
    animate() {
        // Using RAF for smoother animation
        requestAnimationFrame(() => this.animate());
        
        // Apply physics-based follow for the ring with momentum
        const easing = this.isHovering ? 0.1 : 0.15;
        
        // Add slight velocity influence for more natural movement
        const targetX = this.cursorPos.x + (this.velocity.x * 0.3);
        const targetY = this.cursorPos.y + (this.velocity.y * 0.3);
        
        // Smooth follow with easing
        this.ringPos.x += (targetX - this.ringPos.x) * easing;
        this.ringPos.y += (targetY - this.ringPos.y) * easing;
        
        // Dampen velocity
        this.velocity.x *= 0.95;
        this.velocity.y *= 0.95;
        
        // Apply position to ring (dot is positioned directly in mousemove)
        this.cursorRing.style.left = `${this.ringPos.x}px`;
        this.cursorRing.style.top = `${this.ringPos.y}px`;
    }
    
    // Allow enabling/disabling the custom cursor
    enable() {
        document.documentElement.style.cursor = 'none';
        this.cursor.style.display = 'block';
        this.cursorRing.style.display = 'block';
    }
    
    disable() {
        document.documentElement.style.cursor = '';
        this.cursor.style.display = 'none';
        this.cursorRing.style.display = 'none';
    }
}

// Usage:
// const cursor = new AdvancedCursor();
// To disable: cursor.disable();
// To re-enable: cursor.enable();

class ContentFilter {
    constructor() {
        this.initializeFilters();
    }
    
    initializeFilters() {
        // Create filter controls
        const projectSection = document.querySelector('#projects .content');
        
        if (!projectSection) return;
        
        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        // Create filter buttons
        const filters = ['ALL', 'STREAMING', 'VIDEOS', 'GAMING'];
        
        filters.forEach(filter => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = filter;
            if (filter === 'ALL') button.classList.add('active');
            
            button.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Filter projects
                this.filterProjects(filter.toLowerCase());
            });
            
            filterContainer.appendChild(button);
        });
        
        // Add filter container before project grid
        const projectGrid = projectSection.querySelector('.project-grid');
        projectSection.insertBefore(filterContainer, projectGrid);
        
        // Add categories to projects
        const projects = document.querySelectorAll('.project-card');
        const categories = ['streaming', 'videos', 'gaming'];
        
        projects.forEach((project, index) => {
            // Assign category based on index for demo purposes
            const category = categories[index % categories.length];
            project.setAttribute('data-category', category);
        });
    }
    
    filterProjects(category) {
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach(project => {
            if (category === 'all' || project.getAttribute('data-category') === category) {
                project.style.display = 'block';
                project.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                project.style.display = 'none';
            }
        });
    }
}

class ThemeToggle {
    constructor() {
        this.isDarkMode = true; // Default is dark mode
        this.initializeToggle();
    }
    
    initializeToggle() {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = `
            <span class="theme-icon dark">🌙</span>
            <span class="theme-icon light">☀️</span>
        `;
        
        // Add to header
        const header = document.querySelector('header');
        header.appendChild(toggleBtn);
        
        // Add click event
        toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        
        if (this.isDarkMode) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
        
        // Update toggle button
        const toggleBtn = document.querySelector('.theme-toggle');
        toggleBtn.classList.toggle('light-active', !this.isDarkMode);
    }
}

class ScrollAnimations {
    constructor() {
        this.initializeObserver();
    }
    
    initializeObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Add animation classes to elements
        const animatableClasses = [
            '.project-card',
            '.social-card',
            '.skill',
            'h1',
            'h2',
            '.about-content p'
        ];
        
        animatableClasses.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                // Add animation delay based on index
                element.style.animationDelay = `${index * 0.1}s`;
                element.classList.add('animate-on-scroll');
                observer.observe(element);
            });
        });
    }
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize effects
    const particleEffect = new ParticleEffect();
    const advancedCursor = new AdvancedCursor();
    const contentFilter = new ContentFilter();
    const themeToggle = new ThemeToggle();
    const scrollAnimations = new ScrollAnimations();
    
    console.log('Custom effects initialized');
});
