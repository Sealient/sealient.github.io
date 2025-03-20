// ===== ENHANCED CYBERPUNK CONTEXT MENU =====
document.addEventListener('DOMContentLoaded', function() {
    // Create context menu element
    const contextMenu = document.createElement('div');
    contextMenu.className = 'custom-context-menu';
    document.body.appendChild(contextMenu);
    
    // Context menu structure with categories and submenus
    const menuItems = [
        {
            header: 'NAVIGATION'
        },
        {
            icon: '⟳',
            text: 'Refresh Page',
            shortcut: 'F5',
            action: () => location.reload(),
            glitchEffect: true
        },
        {
            icon: '⇢',
            text: 'Forward',
            shortcut: 'Alt+→',
            action: () => window.history.forward()
        },
        {
            icon: '⇠',
            text: 'Back',
            shortcut: 'Alt+←',
            action: () => window.history.back()
        },
        { separator: true },
        {
            header: 'PAGE OPTIONS'
        },
        {
            icon: '✎',
            text: 'View Content',
            submenu: [
                {
                    icon: '📄',
                    text: 'Projects',
                    action: () => navigateToSection('projects')
                },
                {
                    icon: '📊',
                    text: 'Statistics',
                    action: () => navigateToSection('statistics')
                },
                {
                    icon: '📱',
                    text: 'Portfolio',
                    action: () => navigateToSection('portfolio')
                }
            ]
        },
        {
            icon: '✉',
            text: 'Contact',
            action: () => navigateToSection('contact')
        },
        { separator: true },
        {
            header: 'SETTINGS'
        },
        {
            icon: '⚙',
            text: 'Toggle Effects',
            action: toggleEffects
        },
        {
            icon: '🌙',
            text: 'Toggle Theme',
            action: toggleTheme
        },
        {
            icon: '🖥️',
            text: 'View Mode',
            submenu: [
                {
                    icon: '👁️',
                    text: 'Normal Mode',
                    action: () => setViewMode('normal')
                },
                {
                    icon: '🔍',
                    text: 'Focus Mode',
                    action: () => setViewMode('focus')
                },
                {
                    icon: '🎮',
                    text: 'Immersive Mode',
                    action: () => setViewMode('immersive')
                }
            ]
        },
        { separator: true },
        {
            icon: '❌',
            text: 'Close Menu',
            shortcut: 'Esc',
            action: hideContextMenu,
            className: 'danger'
        }
    ];
    
    // Build the menu HTML
    buildContextMenu();
    
    // Context menu event listeners
    document.addEventListener('contextmenu', showContextMenu);
    document.addEventListener('click', hideContextMenu);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') hideContextMenu();
        
        // Handle keyboard shortcuts
        if (e.key === 'F5') {
            e.preventDefault();
            location.reload();
        }
        if (e.altKey && e.key === 'ArrowRight') {
            e.preventDefault();
            window.history.forward();
        }
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            window.history.back();
        }
    });
    
    window.addEventListener('resize', hideContextMenu);
    
    // Setup variables to store settings
    let effectsEnabled = true;
    let darkTheme = true;
    let currentViewMode = 'normal';
    
    // Function to build the context menu
    function buildContextMenu() {
        contextMenu.innerHTML = '';
        
        menuItems.forEach(item => {
            // If it's a header
            if (item.header) {
                const header = document.createElement('div');
                header.className = 'context-menu-header';
                header.textContent = item.header;
                contextMenu.appendChild(header);
                return;
            }
            
            // If it's a separator
            if (item.separator) {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                contextMenu.appendChild(separator);
                return;
            }
            
            // Regular menu item
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            if (item.className) {
                menuItem.classList.add(item.className);
            }
            
            // If has submenu, add class
            if (item.submenu) {
                menuItem.classList.add('context-menu-submenu');
            }
            
            // Create icon
            const iconElement = document.createElement('span');
            iconElement.className = 'context-menu-icon';
            iconElement.textContent = item.icon;
            menuItem.appendChild(iconElement);
            
            // Create text
            const textElement = document.createElement('span');
            textElement.className = 'context-menu-text';
            textElement.textContent = item.text;
            textElement.setAttribute('data-text', item.text); // For glitch effect
            menuItem.appendChild(textElement);
            
            // Create shortcut if available
            if (item.shortcut) {
                const shortcutElement = document.createElement('span');
                shortcutElement.className = 'context-menu-shortcut';
                shortcutElement.textContent = item.shortcut;
                menuItem.appendChild(shortcutElement);
            }
            
            // Create submenu if available
            if (item.submenu) {
                const submenu = document.createElement('div');
                submenu.className = 'context-submenu';
                
                item.submenu.forEach(subItem => {
                    const subMenuItem = document.createElement('div');
                    subMenuItem.className = 'context-menu-item';
                    
                    // Create icon
                    const subIconElement = document.createElement('span');
                    subIconElement.className = 'context-menu-icon';
                    subIconElement.textContent = subItem.icon;
                    subMenuItem.appendChild(subIconElement);
                    
                    // Create text
                    const subTextElement = document.createElement('span');
                    subTextElement.className = 'context-menu-text';
                    subTextElement.textContent = subItem.text;
                    subTextElement.setAttribute('data-text', subItem.text); // For glitch effect
                    subMenuItem.appendChild(subTextElement);
                    
                    // Add click handler for submenu item
                    subMenuItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        subItem.action();
                        hideContextMenu();
                    });
                    
                    submenu.appendChild(subMenuItem);
                });
                
                menuItem.appendChild(submenu);
            }
            
            // Add click handler for main item (if no submenu)
            if (!item.submenu) {
                menuItem.addEventListener('click', () => {
                    item.action();
                    hideContextMenu();
                });
            }
            
            contextMenu.appendChild(menuItem);
        });
    }
    
    // Function to show context menu
    function showContextMenu(e) {
        e.preventDefault();
        
        // Position the menu
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Check if menu goes outside viewport
        const menuWidth = 220; // Estimate initial width
        const menuHeight = 400; // Estimate initial height
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Adjust position if needed
        const adjustedX = posX + menuWidth > windowWidth 
            ? windowWidth - menuWidth - 10 
            : posX;
        const adjustedY = posY + menuHeight > windowHeight 
            ? windowHeight - menuHeight - 10 
            : posY;
        
        // Set position
        contextMenu.style.top = `${adjustedY}px`;
        contextMenu.style.left = `${adjustedX}px`;
        
        // Show the menu with animation
        requestAnimationFrame(() => {
            contextMenu.classList.add('active');
        });
        
        // Add initial glitch effect
        addGlitchEffect(contextMenu);
    }
    
    // Function to hide context menu
    function hideContextMenu() {
        contextMenu.classList.remove('active');
    }
    
    // Function to navigate to a section
    function navigateToSection(sectionId) {
        // Find the section and nav link
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (section) {
            // Add dramatic page transition effect
            const transition = document.createElement('div');
            transition.style.position = 'fixed';
            transition.style.top = '0';
            transition.style.left = '0';
            transition.style.width = '100%';
            transition.style.height = '100%';
            transition.style.background = 'rgba(153, 0, 255, 0.2)';
            transition.style.zIndex = '9000';
            transition.style.opacity = '0';
            transition.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(transition);
            
            // Animate transition
            requestAnimationFrame(() => {
                transition.style.opacity = '1';
                
                setTimeout(() => {
                    // Update active classes
                    if (navLink) {
                        document.querySelectorAll('nav a').forEach(link => {
                            link.classList.remove('active');
                        });
                        navLink.classList.add('active');
                    }
                    
                    document.querySelectorAll('.section').forEach(s => {
                        s.classList.remove('active');
                    });
                    section.classList.add('active');
                    
                    // Fade out transition
                    transition.style.opacity = '0';
                    
                    // Remove transition element
                    setTimeout(() => {
                        document.body.removeChild(transition);
                    }, 300);
                    
                    // Show notification
                    showNotification('Navigation', `Navigated to ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`);
                }, 300);
            });
        }
    }
    
    // Function to toggle effects
    function toggleEffects() {
        effectsEnabled = !effectsEnabled;
        
        // Apply effect changes
        document.body.classList.toggle('effects-disabled', !effectsEnabled);
        
        // Find Three.js canvas and adjust
        const canvas = document.getElementById('webgl-canvas');
        if (canvas) {
            canvas.style.opacity = effectsEnabled ? '1' : '0.3';
            canvas.style.transition = 'opacity 0.5s ease';
        }
        
        // Update menu option text
        const effectsItem = menuItems.find(item => item.text === 'Toggle Effects');
        if (effectsItem) {
            effectsItem.text = effectsEnabled ? 'Toggle Effects' : 'Enable Effects';
            buildContextMenu();
        }
        
        // Apply glitch effect to body
        if (effectsEnabled) {
            addBodyGlitch();
        }
        
        // Show notification
        showNotification('Settings', effectsEnabled ? 'Visual Effects Enabled' : 'Visual Effects Disabled');
    }
    
    // Function to toggle theme
    function toggleTheme() {
        darkTheme = !darkTheme;
        
        // Apply theme changes
        document.body.classList.toggle('light-theme', !darkTheme);
        document.body.classList.toggle('dark-theme', darkTheme);
        
        // Add theme transition effect
        const themeTransition = document.createElement('div');
        themeTransition.style.position = 'fixed';
        themeTransition.style.top = '0';
        themeTransition.style.left = '0';
        themeTransition.style.width = '100%';
        themeTransition.style.height = '100%';
        themeTransition.style.background = darkTheme ? 'rgba(10, 10, 18, 0.3)' : 'rgba(240, 240, 255, 0.3)';
        themeTransition.style.zIndex = '8000';
        themeTransition.style.opacity = '0';
        themeTransition.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(themeTransition);
        
        // Animate theme transition
        requestAnimationFrame(() => {
            themeTransition.style.opacity = '1';
            
            setTimeout(() => {
                themeTransition.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.removeChild(themeTransition);
                }, 500);
            }, 300);
        });
        
        // Show notification
        showNotification('Settings', darkTheme ? 'Dark Theme Activated' : 'Light Theme Activated');
    }
    
    // Function to set view mode
    function setViewMode(mode) {
        currentViewMode = mode;
        
        // Remove all previous modes
        document.body.classList.remove('mode-normal', 'mode-focus', 'mode-immersive');
        document.body.classList.add(`mode-${mode}`);
        
        // Apply specific styles based on mode
        switch(mode) {
            case 'focus':
                // Hide non-essential elements
                document.querySelectorAll('.non-essential').forEach(el => {
                    el.style.opacity = '0.3';
                });
                document.querySelectorAll('main').forEach(el => {
                    el.style.maxWidth = '800px';
                    el.style.margin = '0 auto';
                });
                break;
            case 'immersive':
                // Enhance visual elements
                document.querySelectorAll('.visual-element').forEach(el => {
                    el.style.transform = 'scale(1.05)';
                });
                // If a canvas exists, make it more prominent
                const canvas = document.getElementById('webgl-canvas');
                if (canvas) {
                    canvas.style.opacity = '1';
                    canvas.style.filter = 'saturate(1.2)';
                }
                break;
            default: // normal mode
                // Reset all customizations
                document.querySelectorAll('.non-essential').forEach(el => {
                    el.style.opacity = '1';
                });
                document.querySelectorAll('main').forEach(el => {
                    el.style.maxWidth = '';
                    el.style.margin = '';
                });
                document.querySelectorAll('.visual-element').forEach(el => {
                    el.style.transform = '';
                });
                const defaultCanvas = document.getElementById('webgl-canvas');
                if (defaultCanvas) {
                    defaultCanvas.style.filter = '';
                }
                break;
        }
        
        // Show notification
        showNotification('View Mode', `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode Activated`);
    }
    
    // Function to add a glitch effect to an element
    function addGlitchEffect(element) {
        // Skip effect if disabled
        if (!effectsEnabled) return;
        
        // Create overlay layers for RGB shift effect
        const colors = ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'];
        const layers = [];
        
        colors.forEach((color, index) => {
            const layer = document.createElement('div');
            layer.style.position = 'absolute';
            layer.style.top = '0';
            layer.style.left = '0';
            layer.style.right = '0';
            layer.style.bottom = '0';
            layer.style.zIndex = '-1';
            layer.style.backgroundColor = color;
            layer.style.mixBlendMode = 'lighten';
            layer.style.pointerEvents = 'none';
            layer.style.opacity = '0.5';
            layer.style.transform = `translate(${(index-1)*3}px, ${(index-1)*-2}px)`;
            layers.push(layer);
            element.appendChild(layer);
        });
        
        // Animate RGB shift
        let frame = 0;
        const glitchInterval = setInterval(() => {
            frame++;
            
            if (frame < 12) {
                layers.forEach((layer, index) => {
                    const offsetX = Math.sin(frame * 0.8) * (index - 1) * 2;
                    const offsetY = Math.cos(frame * 0.8) * (index - 1) * 1.5;
                    layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                    layer.style.opacity = Math.max(0, 0.5 - frame * 0.04);
                });
            } else {
                clearInterval(glitchInterval);
                layers.forEach(layer => element.removeChild(layer));
            }
        }, 50);
    }
    
    // Function to add full-screen glitch effect
    function addBodyGlitch() {
        // Create overlay for full-screen glitch
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.position = 'fixed';
        glitchOverlay.style.top = '0';
        glitchOverlay.style.left = '0';
        glitchOverlay.style.width = '100%';
        glitchOverlay.style.height = '100%';
        glitchOverlay.style.zIndex = '9500';
        glitchOverlay.style.pointerEvents = 'none';
        glitchOverlay.style.overflow = 'hidden';
        document.body.appendChild(glitchOverlay);
        
        // Create glitch lines
        for (let i = 0; i < 10; i++) {
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.height = `${Math.random() * 5 + 1}px`;
            line.style.width = '100%';
            line.style.background = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.3 + 0.1})`;
            line.style.top = `${Math.random() * 100}%`;
            line.style.left = '0';
            line.style.transform = `translateX(${Math.random() > 0.5 ? '-' : ''}100%)`;
            line.style.boxShadow = '0 0 8px rgba(0, 255, 204, 0.5)';
            glitchOverlay.appendChild(line);
            
            // Animate the line
            gsapAnimation(line);
        }
        
        // Remove overlay after animation
        setTimeout(() => {
            document.body.removeChild(glitchOverlay);
        }, 1000);
    }
    
    // Simulated GSAP animation (since we can't actually use GSAP)
    function gsapAnimation(element) {
        const startPosition = -100;
        const endPosition = 100;
        const duration = 400 + Math.random() * 600;
        const startTime = Date.now();
        
        function animate() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease in-out cubic function
            let easedProgress;
            if (progress < 0.5) {
                easedProgress = 4 * progress * progress * progress;
            } else {
                easedProgress = 1 - Math.pow(-2 * progress + 2, 3) / 2;
            }
            
            const currentPosition = startPosition + (endPosition - startPosition) * easedProgress;
            element.style.transform = `translateX(${currentPosition}%)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
    
    // Function to show styled notification
    function showNotification(title, message) {
        // Remove existing notification
        let notification = document.querySelector('.custom-notification');
        if (notification) {
            document.body.removeChild(notification);
        }
        
        // Create new notification
        notification = document.createElement('div');
        notification.className = 'custom-notification';
        
        // Add title and message
        const titleElement = document.createElement('div');
        titleElement.className = 'notification-title';
        titleElement.textContent = title;
        notification.appendChild(titleElement);
        
        const messageElement = document.createElement('div');
        messageElement.className = 'notification-message';
        messageElement.textContent = message;
        notification.appendChild(messageElement);
        
        // Add to document
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('active');
            
            // Trigger glitch effect
            if (effectsEnabled) {
                addGlitchEffect(notification);
            }
            
            // Hide after delay
            setTimeout(() => {
                notification.classList.remove('active');
                
                // Remove after animation completes
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 400);
            }, 3000);
        }, 10);
    }
    
    // Function to add keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+E to toggle effects
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                toggleEffects();
            }
            
            // Ctrl+Shift+T to toggle theme
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                toggleTheme();
            }
            
            // Ctrl+Shift+[1-3] to change view modes
            if (e.ctrlKey && e.shiftKey && e.key === '1') {
                e.preventDefault();
                setViewMode('normal');
            }
            if (e.ctrlKey && e.shiftKey && e.key === '2') {
                e.preventDefault();
                setViewMode('focus');
            }
            if (e.ctrlKey && e.shiftKey && e.key === '3') {
                e.preventDefault();
                setViewMode('immersive');
            }
        });
    }
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initial notification
    setTimeout(() => {
        showNotification('System', 'Right-click to access the cyberpunk context menu');
    }, 1000);
});
