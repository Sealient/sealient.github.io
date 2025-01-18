// Optional dynamic effect for 3D hover
document.body.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelector('.holographic-container').style.transform =
    `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
});

// Update the current time and date every second
function updateTime() {
  const timeElement = document.getElementById('current-time');
  const now = new Date();
  timeElement.textContent = `${now.toLocaleTimeString()} | ${now.toLocaleDateString()}`;
}

updateTime();
setInterval(updateTime, 1000);

// Check for updates from a GitHub file
const updateFileUrl = 'https://raw.githubusercontent.com/Sealient/Updates/refs/heads/main/updates.txt';
let lastUpdate = '';

// Show notification for new updates
function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification', 'show');
  notification.innerHTML = `<p><span>New Update:</span> ${message}</p>`;
  document.getElementById('notifications').appendChild(notification);

  setTimeout(() => {
    notification.classList.remove('show');
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Check for updates and show notification if any
function checkForUpdates() {
  fetch(updateFileUrl)
    .then(response => response.ok ? response.text() : Promise.reject('Failed to fetch updates'))
    .then(data => {
      const updates = data.split('\n').map(update => update.trim()).filter(Boolean);
      if (updates.length > 0 && updates[0] !== lastUpdate) {
        showNotification(updates[0]);
        lastUpdate = updates[0];
      }
    })
    .catch(error => console.error('Error fetching updates:', error));
}

setInterval(checkForUpdates, 30000);
checkForUpdates();

// Handle category toggling
document.querySelectorAll('.category').forEach(category => {
  const title = category.querySelector('.category-title');
  const content = category.querySelector('.category-content');
  
  title.addEventListener('click', (e) => {
    e.preventDefault();
    content.classList.toggle('active');
    document.querySelectorAll('.category-content').forEach(c => {
      if (c !== content) c.classList.remove('active');
    });
  });
});

// Tooltip logic
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.setAttribute('title', link.getAttribute('data-tooltip'));
  });
  link.addEventListener('mouseleave', () => {
    link.removeAttribute('title');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const enterScreen = document.getElementById('enter-screen');
  const holographicContainer = document.querySelector('.holographic-container');
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background-video');

  // Wait for user click to start
  enterScreen.addEventListener('click', () => {
    // Hide the "Click to Enter" screen
    enterScreen.style.display = 'none';

    // Start the background music and video
    backgroundMusic.play().catch(error => console.error('Error starting the music:', error));
    backgroundVideo.play().catch(error => console.error('Error starting the video:', error));

  });
});
