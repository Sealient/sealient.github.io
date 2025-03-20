// ===== CUSTOM CONTEXT MENU =====
document.addEventListener('DOMContentLoaded', function() {
    // Create context menu element
    const contextMenu = document.createElement('div');
    contextMenu.className = 'custom-context-menu';
    document.body.appendChild(contextMenu);
    
    // Context menu structure - customize as needed
    const menuItems = [
        {
            icon: '⟳',
            text: 'Refresh',
            shortcut: 'F5',
            action: () => location.reload()
        },
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
        { separator: true },
        {
            icon: '✎',
            text: 'View Content',
            action: () => navigateToSection('projects')
        },
        {
            icon: '✉',
            text: 'Contact',
            action: () => navigateToSection('contact')
        },
        { separator: true },
        {
            icon: '⚙',
            text: 'Toggle Effects',
            action: toggleEffects
        }
    ];
    
    // Build the menu HTML
    buildContextMenu();
    
    // Context menu event listeners
    document.addEventListener('contextmenu', showContextMenu);
    document.addEventListener('click', hideContextMenu);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') hideContextMenu();
    });
    window.addEventListener('resize', hideContextMenu);
    
    // Setup a variable to store if effects are enabled
    let effectsEnabled = true;
    
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
            textElement.textContent = item.text;
            menuItem.appendChild(textElement);
            
            // Create shortcut if available
            if (item.shortcut) {
                const shortcutElement = document.createElement('span');
                shortcutElement.className = 'context-menu-shortcut';
                shortcutElement.textContent = item.shortcut;
                menuItem.appendChild(shortcutElement);
            }
            
            // Add click handler
            menuItem.addEventListener('click', () => {
                item.action();
                hideContextMenu();
            });
            
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
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
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
        
        if (section && navLink) {
            // Update active classes
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
            
            document.querySelectorAll('.section').forEach(s => {
                s.classList.remove('active');
            });
            section.classList.add('active');
        }
    }
    
    // Function to toggle effects
    function toggleEffects() {
        effectsEnabled = !effectsEnabled;
        
        // Find Three.js canvas and adjust
        const canvas = document.getElementById('webgl-canvas');
        if (canvas) {
            canvas.style.opacity = effectsEnabled ? '1' : '0.3';
        }
        
        // Update menu option text
        const effectsItem = menuItems.find(item => item.text === 'Toggle Effects' || item.text === 'Enable Effects');
        if (effectsItem) {
            effectsItem.text = effectsEnabled ? 'Toggle Effects' : 'Enable Effects';
            buildContextMenu();
        }
        
        // Show notification
        showNotification(effectsEnabled ? 'Effects Enabled' : 'Effects Disabled');
    }
    
    // Function to add a glitch effect
    function addGlitchEffect(element) {
        // Create a temporary glitch overlay
        const glitchEl = document.createElement('div');
        glitchEl.style.position = 'absolute';
        glitchEl.style.top = '0';
        glitchEl.style.left = '0';
        glitchEl.style.width = '100%';
        glitchEl.style.height = '100%';
        glitchEl.style.background = 'rgba(153, 0, 255, 0.3)';
        glitchEl.style.zIndex = '-1';
        glitchEl.style.pointerEvents = 'none';
        element.style.position = 'relative';
        element.appendChild(glitchEl);
        
        // Animate it
        let opacity = 0.3;
        const glitchInterval = setInterval(() => {
            opacity -= 0.05;
            glitchEl.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(glitchInterval);
                element.removeChild(glitchEl);
            }
        }, 50);
    }
    
    // Function to show notification
    function showNotification(message) {
        // Check if notification element exists, create if not
        let notification = document.querySelector('.custom-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'custom-notification';
            document.body.appendChild(notification);
            
            // Style the notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.background = 'rgba(10, 10, 18, 0.9)';
            notification.style.color = 'var(--accent)';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '4px';
            notification.style.zIndex = '2000';
            notification.style.boxShadow = 'var(--glow-accent)';
            notification.style.fontFamily = 'var(--font-main)';
            notification.style.fontSize = '14px';
            notification.style.border = '1px solid var(--accent)';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'all 0.3s ease';
        }
        
        // Set message
        notification.textContent = message;
        
        // Show notification
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        });
        
        // Hide after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 3000);
    }
});