// ===== ENHANCED CUSTOM CONTEXT MENU =====
document.addEventListener('DOMContentLoaded', function() {
    // Create context menu elements
    const contextMenu = document.createElement('div');
    contextMenu.className = 'custom-context-menu';
    
    const subMenuContainer = document.createElement('div');
    subMenuContainer.className = 'submenu-container';
    
    document.body.appendChild(contextMenu);
    document.body.appendChild(subMenuContainer);
    
    // Context menu configuration with nested submenus and enhanced options
    const menuItems = [
        {
            icon: '⟳',
            text: 'Refresh',
            shortcut: 'F5',
            action: () => location.reload()
        },
        {
            icon: '🧭',
            text: 'Navigation',
            submenu: [
                {
                    icon: '⇢',
                    text: 'Go Forward',
                    shortcut: 'Alt+→',
                    action: () => window.history.forward()
                },
                {
                    icon: '⇠',
                    text: 'Go Back',
                    shortcut: 'Alt+←',
                    action: () => window.history.back()
                },
                {
                    icon: '⌂',
                    text: 'Go Home',
                    shortcut: 'Alt+H',
                    action: () => window.location.href = '/'
                },
                {
                    icon: '↑',
                    text: 'Scroll to Top',
                    action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
                }
            ]
        },
        { separator: true },
        {
            icon: '📄',
            text: 'Content',
            submenu: [
                {
                    icon: '✎',
                    text: 'View Projects',
                    action: () => navigateToSection('projects')
                },
                {
                    icon: '📊',
                    text: 'View Portfolio',
                    action: () => navigateToSection('portfolio')
                },
                {
                    icon: '📝',
                    text: 'View Blog',
                    action: () => navigateToSection('blog')
                },
                {
                    icon: '👤',
                    text: 'About',
                    action: () => navigateToSection('about')
                },
                {
                    icon: '✉',
                    text: 'Contact',
                    action: () => navigateToSection('contact')
                }
            ]
        },
        {
            icon: '⚙',
            text: 'Settings',
            submenu: [
                {
                    icon: '🎨',
                    text: 'Toggle Dark Mode',
                    action: toggleDarkMode
                },
                {
                    icon: '✨',
                    text: 'Toggle Effects',
                    action: toggleEffects
                },
                {
                    icon: '🔍',
                    text: 'Toggle Zoom',
                    action: toggleZoom
                },
                {
                    icon: '🔊',
                    text: 'Toggle Sound',
                    action: toggleSound
                }
            ]
        },
        { separator: true },
        {
            icon: '📋',
            text: 'Copy',
            shortcut: 'Ctrl+C',
            action: () => document.execCommand('copy')
        },
        {
            icon: '📝',
            text: 'Paste',
            shortcut: 'Ctrl+V',
            action: () => document.execCommand('paste')
        },
        {
            icon: '✂️',
            text: 'Cut',
            shortcut: 'Ctrl+X',
            action: () => document.execCommand('cut')
        },
        { separator: true },
        {
            icon: '🔗',
            text: 'Copy Page URL',
            action: () => {
                navigator.clipboard.writeText(window.location.href);
                showNotification('URL copied to clipboard!');
            }
        },
        {
            icon: '❓',
            text: 'Help',
            action: () => showHelp()
        }
    ];
    
    // Settings state
    const settings = {
        darkMode: false,
        effectsEnabled: true,
        zoomEnabled: false,
        soundEnabled: false
    };
    
    // Track active submenu
    let activeSubmenu = null;
    let activeSubmenuTrigger = null;
    
    // Build the menu HTML
    buildContextMenu();
    
    // Context menu event listeners
    document.addEventListener('contextmenu', showContextMenu);
    document.addEventListener('click', hideAllMenus);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') hideAllMenus();
    });
    window.addEventListener('resize', hideAllMenus);
    
    // Function to build the context menu
    function buildContextMenu() {
        contextMenu.innerHTML = '';
        
        menuItems.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                contextMenu.appendChild(separator);
                return;
            }
            
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            
            // Create icon
            const iconElement = document.createElement('span');
            iconElement.className = 'context-menu-icon';
            iconElement.textContent = item.icon;
            menuItem.appendChild(iconElement);
            
            // Create text
            const textElement = document.createElement('span');
            textElement.className = 'context-menu-text';
            textElement.textContent = item.text;
            menuItem.appendChild(textElement);
            
            // Create submenu indicator or shortcut
            if (item.submenu) {
                const submenuIndicator = document.createElement('span');
                submenuIndicator.className = 'submenu-indicator';
                submenuIndicator.textContent = '▶';
                menuItem.appendChild(submenuIndicator);
                
                // Handle submenu hover
                menuItem.addEventListener('mouseenter', (e) => {
                    showSubmenu(e, item.submenu, menuItem);
                    
                    // Add active class to this item
                    if (activeSubmenuTrigger) {
                        activeSubmenuTrigger.classList.remove('submenu-active');
                    }
                    menuItem.classList.add('submenu-active');
                    activeSubmenuTrigger = menuItem;
                });
            } else if (item.shortcut) {
                const shortcutElement = document.createElement('span');
                shortcutElement.className = 'context-menu-shortcut';
                shortcutElement.textContent = item.shortcut;
                menuItem.appendChild(shortcutElement);
                
                // For regular items, hide any active submenu on hover
                menuItem.addEventListener('mouseenter', () => {
                    hideSubmenu();
                    if (activeSubmenuTrigger) {
                        activeSubmenuTrigger.classList.remove('submenu-active');
                        activeSubmenuTrigger = null;
                    }
                });
            } else {
                // For regular items without shortcuts, hide any active submenu on hover
                menuItem.addEventListener('mouseenter', () => {
                    hideSubmenu();
                    if (activeSubmenuTrigger) {
                        activeSubmenuTrigger.classList.remove('submenu-active');
                        activeSubmenuTrigger = null;
                    }
                });
            }
            
            // Add click handler
            menuItem.addEventListener('click', () => {
                if (!item.submenu && item.action) {
                    item.action();
                    hideAllMenus();
                }
            });
            
            contextMenu.appendChild(menuItem);
        });
    }
    
    // Function to show submenu
    function showSubmenu(event, submenuItems, parentItem) {
        // Clear any existing submenu
        hideSubmenu();
        
        // Create submenu
        const submenu = document.createElement('div');
        submenu.className = 'custom-submenu';
        
        // Build submenu items
        submenuItems.forEach(subItem => {
            if (subItem.separator) {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                submenu.appendChild(separator);
                return;
            }
            
            const submenuItem = document.createElement('div');
            submenuItem.className = 'context-menu-item';
            
            // Create icon
            const iconElement = document.createElement('span');
            iconElement.className = 'context-menu-icon';
            iconElement.textContent = subItem.icon;
            submenuItem.appendChild(iconElement);
            
            // Create text
            const textElement = document.createElement('span');
            textElement.className = 'context-menu-text';
            textElement.textContent = subItem.text;
            submenuItem.appendChild(textElement);
            
            // Create shortcut if available
            if (subItem.shortcut) {
                const shortcutElement = document.createElement('span');
                shortcutElement.className = 'context-menu-shortcut';
                shortcutElement.textContent = subItem.shortcut;
                submenuItem.appendChild(shortcutElement);
            }
            
            // Add click handler
            submenuItem.addEventListener('click', () => {
                if (subItem.action) {
                    subItem.action();
                    hideAllMenus();
                }
            });
            
            submenu.appendChild(submenuItem);
        });
        
        // Position submenu next to parent item
        const parentRect = parentItem.getBoundingClientRect();
        const mainMenuRect = contextMenu.getBoundingClientRect();
        
        // Determine if there's enough space to the right
        const rightSpace = window.innerWidth - (mainMenuRect.left + mainMenuRect.width);
        const fitsOnRight = rightSpace >= 200; // Assume submenu width around 200px
        
        if (fitsOnRight) {
            submenu.style.left = `${mainMenuRect.width}px`;
            submenu.style.top = `${parentRect.top - mainMenuRect.top}px`;
        } else {
            // Position to the left if not enough space on right
            submenu.style.right = `${mainMenuRect.width}px`;
            submenu.style.left = 'auto';
            submenu.style.top = `${parentRect.top - mainMenuRect.top}px`;
        }
        
        // Add to container
        subMenuContainer.innerHTML = '';
        subMenuContainer.appendChild(submenu);
        subMenuContainer.style.left = fitsOnRight ? 
            `${mainMenuRect.left}px` : 
            `${mainMenuRect.left - 200}px`; // Adjust based on submenu width
        subMenuContainer.style.top = `${mainMenuRect.top}px`;
        
        // Show with animation
        requestAnimationFrame(() => {
            submenu.classList.add('active');
        });
        
        activeSubmenu = submenu;
        
        // Add glitch effect if effects are enabled
        if (settings.effectsEnabled) {
            addGlitchEffect(submenu);
        }
    }
    
    // Function to hide submenu
    function hideSubmenu() {
        if (activeSubmenu) {
            activeSubmenu.classList.remove('active');
            activeSubmenu = null;
        }
    }
    
    // Function to show context menu
    function showContextMenu(e) {
        e.preventDefault();
        hideAllMenus();
        
        // Position the menu
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Check if menu goes outside viewport
        const menuWidth = 200; // Approximate width before rendering
        const menuHeight = 400; // Approximate max height before rendering
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
        
        // Add glitch effect on menu appearance
        if (settings.effectsEnabled) {
            addGlitchEffect(contextMenu);
        }
    }
    
    // Function to hide all menus
    function hideAllMenus() {
        hideSubmenu();
        contextMenu.classList.remove('active');
        if (activeSubmenuTrigger) {
            activeSubmenuTrigger.classList.remove('submenu-active');
            activeSubmenuTrigger = null;
        }
    }
    
    // Function to navigate to a section
    function navigateToSection(sectionId) {
        // Find the section and nav link
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (section) {
            // If section exists, make it active
            document.querySelectorAll('.section').forEach(s => {
                s.classList.remove('active');
            });
            section.classList.add('active');
            
            // Scroll to section
            section.scrollIntoView({ behavior: 'smooth' });
            
            // Update nav link if it exists
            if (navLink) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
            
            showNotification(`Navigated to ${sectionId}`);
        } else {
            showNotification(`Section "${sectionId}" not found`, 'error');
        }
    }
    
    // Toggle functions
    function toggleDarkMode() {
        settings.darkMode = !settings.darkMode;
        document.body.classList.toggle('dark-mode', settings.darkMode);
        showNotification(settings.darkMode ? 'Dark Mode Enabled' : 'Light Mode Enabled');
    }
    
    function toggleEffects() {
        settings.effectsEnabled = !settings.effectsEnabled;
        
        // Find Three.js canvas and adjust
        const canvas = document.getElementById('webgl-canvas');
        if (canvas) {
            canvas.style.opacity = settings.effectsEnabled ? '1' : '0.3';
        }
        
        // Remove or add effects class to body
        document.body.classList.toggle('effects-disabled', !settings.effectsEnabled);
        
        showNotification(settings.effectsEnabled ? 'Effects Enabled' : 'Effects Disabled');
    }
    
    function toggleZoom() {
        settings.zoomEnabled = !settings.zoomEnabled;
        
        // Set zoom level
        document.body.style.zoom = settings.zoomEnabled ? '110%' : '100%';
        
        showNotification(settings.zoomEnabled ? 'Zoom Enabled' : 'Zoom Disabled');
    }
    
    function toggleSound() {
        settings.soundEnabled = !settings.soundEnabled;
        
        // Logic to enable/disable sound would go here
        
        showNotification(settings.soundEnabled ? 'Sound Enabled' : 'Sound Disabled');
    }
    
    function showHelp() {
        // Create a help modal or redirect to help page
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="help-content">
                <h2>Help</h2>
                <p>Right-click anywhere to access the custom context menu.</p>
                <h3>Keyboard Shortcuts</h3>
                <ul>
                    <li><strong>F5</strong> - Refresh page</li>
                    <li><strong>Alt+←</strong> - Go back</li>
                    <li><strong>Alt+→</strong> - Go forward</li>
                    <li><strong>Alt+H</strong> - Go home</li>
                    <li><strong>Esc</strong> - Close menus</li>
                </ul>
                <button class="close-help">Close</button>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        
        // Show with animation
        setTimeout(() => {
            helpModal.classList.add('active');
        }, 10);
        
        // Add close button handler
        helpModal.querySelector('.close-help').addEventListener('click', () => {
            helpModal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(helpModal);
            }, 300); // Wait for transition to complete
        });
    }
    
    // Function to add a glitch effect
    function addGlitchEffect(element) {
        if (!settings.effectsEnabled) return;
        
        // Create a temporary glitch overlay
        const glitchEl = document.createElement('div');
        glitchEl.className = 'glitch-overlay';
        element.appendChild(glitchEl);
        
        // Add random glitch offsets
        setTimeout(() => {
            element.classList.add('glitch-effect');
            
            // Remove the glitch effect after a short time
            setTimeout(() => {
                element.classList.remove('glitch-effect');
                if (glitchEl.parentNode === element) {
                    element.removeChild(glitchEl);
                }
            }, 300);
        }, 50);
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Check if notification element exists, create if not
        let notification = document.querySelector('.custom-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'custom-notification';
            document.body.appendChild(notification);
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = `custom-notification notification-${type}`;
        
        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('active');
        });
        
        // Add glitch effect if enabled
        if (settings.effectsEnabled) {
            addGlitchEffect(notification);
        }
        
        // Play sound if enabled
        if (settings.soundEnabled) {
            const sound = new Audio();
            sound.src = type === 'error' ? 'error.mp3' : 'notification.mp3';
            sound.volume = 0.5;
            sound.play().catch(() => {}); // Catch and ignore any autoplay restrictions
        }
        
        // Hide after delay
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }
    
    // Add CSS styles for enhanced context menu
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* Context Menu Styles */
        .custom-context-menu,
        .custom-submenu {
            position: absolute;
            background: rgba(20, 20, 25, 0.95);
            border: 1px solid var(--accent, #9900ff);
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(153, 0, 255, 0.4);
            min-width: 180px;
            max-width: 250px;
            backdrop-filter: blur(10px);
            z-index: 1000;
            opacity: 0;
            transform: scale(0.98) translateY(-5px);
            transform-origin: top left;
            transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
            overflow: hidden;
            padding: 6px 0;
        }
        
        .custom-context-menu.active,
        .custom-submenu.active {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        
        .context-menu-item {
            padding: 8px 14px;
            color: #eee;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            position: relative;
            font-family: var(--font-main, sans-serif);
            transition: background 0.2s;
        }
        
        .context-menu-item:hover {
            background: rgba(153, 0, 255, 0.2);
        }
        
        .context-menu-icon {
            margin-right: 10px;
            width: 16px;
            text-align: center;
            color: var(--accent, #9900ff);
        }
        
        .context-menu-text {
            flex-grow: 1;
        }
        
        .context-menu-shortcut {
            margin-left: 14px;
            opacity: 0.5;
            font-size: 12px;
        }
        
        .context-menu-separator {
            height: 1px;
            background: rgba(153, 0, 255, 0.3);
            margin: 5px 0;
        }
        
        .submenu-indicator {
            font-size: 10px;
            margin-left: 8px;
            opacity: 0.7;
        }
        
        .submenu-container {
            position: absolute;
            z-index: 1001;
            pointer-events: none;
        }
        
        .custom-submenu {
            pointer-events: all;
        }
        
        .submenu-active {
            background: rgba(153, 0, 255, 0.2);
        }
        
        /* Notification Styles */
        .custom-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(20, 20, 25, 0.9);
            color: var(--accent, #9900ff);
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 2000;
            font-family: var(--font-main, sans-serif);
            font-size: 14px;
            border: 1px solid var(--accent, #9900ff);
            box-shadow: 0 0 15px rgba(153, 0, 255, 0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
            max-width: 300px;
            backdrop-filter: blur(8px);
        }
        
        .custom-notification.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-error {
            border-color: #ff3366;
            color: #ff3366;
            box-shadow: 0 0 15px rgba(255, 51, 102, 0.3);
        }
        
        /* Help Modal */
        .help-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .help-modal.active {
            opacity: 1;
        }
        
        .help-content {
            background: rgba(20, 20, 25, 0.95);
            border: 1px solid var(--accent, #9900ff);
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            width: 80%;
            color: #eee;
            font-family: var(--font-main, sans-serif);
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(153, 0, 255, 0.4);
        }
        
        .help-content h2 {
            color: var(--accent, #9900ff);
            margin-top: 0;
        }
        
        .help-content button {
            background: var(--accent, #9900ff);
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 15px;
            font-family: inherit;
            transition: all 0.2s;
        }
        
        .help-content button:hover {
            opacity: 0.9;
            box-shadow: 0 0 10px rgba(153, 0, 255, 0.6);
        }
        
        /* Glitch effect */
        .glitch-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(153, 0, 255, 0.2);
            pointer-events: none;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .glitch-effect {
            position: relative;
            overflow: hidden;
        }
        
        .glitch-effect:before {
            content: '';
            position: absolute;
            top: 0;
            left: -5px;
            width: 3px;
            height: 100%;
            background: var(--accent, #9900ff);
            opacity: 0.7;
            animation: glitch-line 0.3s linear;
        }
        
        .glitch-effect:after {
            content: '';
            position: absolute;
            top: 0;
            right: -5px;
            width: 3px;
            height: 100%;
            background: #00ffcc;
            opacity: 0.7;
            animation: glitch-line 0.3s linear reverse;
        }
        
        @keyframes glitch-line {
            0% { transform: translateY(-100%); }
            50% { transform: translateY(100%); }
            100% { transform: translateY(-100%); }
        }
        
        /* Dark mode */
        body.dark-mode {
            background: #111;
            color: #eee;
        }
    `;
    document.head.appendChild(styleEl);
});
