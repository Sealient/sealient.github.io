document.addEventListener("DOMContentLoaded", () => {
    const toggleAboutBtn = document.getElementById("toggleAbout");
    const toggleSocialsBtn = document.getElementById("toggleSocials");
    const toggleStatsBtn = document.getElementById("toggleStats");

    const aboutLayer = document.getElementById("about");
    const socialsLayer = document.getElementById("socials");
    const statsLayer = document.getElementById("stats");

    const card = document.querySelector(".card");

    // Ensure elements exist before adding event listeners
    if (toggleAboutBtn && aboutLayer) {
        toggleAboutBtn.addEventListener("click", () => {
            aboutLayer.classList.toggle("hidden");
        });
    }

    if (toggleSocialsBtn && socialsLayer) {
        toggleSocialsBtn.addEventListener("click", () => {
            socialsLayer.classList.toggle("hidden");
        });
    }

    if (toggleStatsBtn && statsLayer) {
        toggleStatsBtn.addEventListener("click", () => {
            statsLayer.classList.toggle("hidden");

            if (!statsLayer.classList.contains("hidden")) {
                loadStats();
            }
        });
    }

    // Mousemove 3D Effect
    document.addEventListener("mousemove", (e) => {
        if (!card) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 30;

        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    document.addEventListener("mouseleave", () => {
        if (card) {
            card.style.transform = "rotateY(0deg) rotateX(0deg)";
        }
    });

    // Fetch and Display Stats
    async function loadStats() {
        const statsContainer = document.getElementById("stats-content");
        if (!statsContainer) return;

        statsContainer.innerHTML = "Loading stats...";

        try {
            const response = await fetch("https://raw.githubusercontent.com/Sealient/Stats/refs/heads/main/data.json");
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            statsContainer.innerHTML = ""; // Clear previous content

            Object.keys(data).forEach((category) => {
                const header = document.createElement("h4");
                header.classList.add("stat-header");
                header.innerText = category;
                statsContainer.appendChild(header);

                Object.entries(data[category]).forEach(([key, value]) => {
                    const statItem = document.createElement("div");
                    statItem.classList.add("stat-item");
                    statItem.innerHTML = `<span class="stat-label">${key}:</span> <span>${value}</span>`;
                    statsContainer.appendChild(statItem);
                });
            });
        } catch (error) {
            statsContainer.innerHTML = "⚠️ Failed to load stats.";
            console.error("Error loading stats:", error);
        }
    }
});

document.getElementById("overlay").addEventListener("click", function() {
    const video = document.getElementById("bg-video");
    const audio = document.getElementById("bg-audio");

    // Play both video and audio
    video.play();
    audio.play();

    // Hide overlay
    this.classList.add("hidden");
});

// Timer Element
const timerElement = document.createElement("div");
timerElement.classList.add("timer");
document.body.appendChild(timerElement);

// Function to update the time
function updateTimer() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    timerElement.innerText = `${hours}:${minutes}:${seconds} ${amPm}`;
}

// Update every second
setInterval(updateTimer, 1000);
updateTimer(); // Initialize immediately

// Simulate loading progress with more advanced steps
const loadingProgress = document.querySelector('.loading-progress');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.querySelector('.loading-text');

let progress = 0;

function updateLoadingBar() {
    if (progress < 100) {
        progress += Math.random() * 4 + 2; // Increase progress by random increment (faster)

        // Ensuring the progress doesn't exceed 100
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = `${progress.toFixed(1)}%`;

        // Update feedback text dynamically based on progress
        if (progress < 30) {
            loadingText.innerText = "Loading assets...";
        } else if (progress < 60) {
            loadingText.innerText = "Setting up... Almost there!";
        } else if (progress < 90) {
            loadingText.innerText = "Almost done... Just a few seconds!";
        } else {
            loadingText.innerText = "Finishing up...";
        }
    } else {
        // Hide the loading overlay once done
        setTimeout(() => {
            loadingOverlay.style.opacity = '0'; // Fade out the overlay
            setTimeout(() => {
                loadingOverlay.style.display = 'none'; // Hide it completely after fade
            }, 1000);
        }, 300);
    }
}

// Call the function every 50ms to simulate advanced loading with more dynamic progress
setInterval(updateLoadingBar, 50);

let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const carouselTrack = document.querySelector('.carousel-track');

// Auto change item every 5 seconds
setInterval(() => {
    if (currentIndex === items.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    updateCarouselPosition();
}, 5000);

function updateCarouselPosition() {
    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
}




