// Counter for days
let dayCount = 0;
const dayCounter = document.getElementById('day-counter');

// Update counter every second (change to 86400000 for real days)
setInterval(() => {
    dayCount++;
    dayCounter.textContent = dayCount;
}, 1000);

// DOM Elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const message = document.getElementById('message');
const heart = document.getElementById('animated-heart');
const container = document.querySelector('.container');

// Valentine acceptance function
yesBtn.addEventListener('click', acceptValentine);

// Also allow touch for mobile
yesBtn.addEventListener('touchend', function(e) {
    e.preventDefault(); // Prevent mouse event from firing
    acceptValentine();
});

function acceptValentine() {
    message.textContent = "You've made me the happiest person! 💖🎉";
    message.style.opacity = "1";
    
    // Create floating hearts
    for(let i = 0; i < 20; i++) {
        createFloatingHeart();
    }
    
    // Change heart color and animation
    heart.style.color = "#ff4081";
    heart.style.animation = "heartbeat 0.5s infinite";
    
    // Disable buttons
    yesBtn.disabled = true;
    noBtn.disabled = true;
    yesBtn.style.opacity = "0.8";
    noBtn.style.opacity = "0.5";
    
    // Add celebration effect
    container.style.background = "linear-gradient(135deg, #ffd6e0, #ffe0cc)";
}

// Move "No" button on hover (desktop) and touch (mobile)
let isMoving = false;

// Desktop hover
noBtn.addEventListener('mouseenter', moveButton);

// Mobile touch
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent click from firing
    moveButton();
    
    // Add shaking effect on mobile
    noBtn.classList.add('shaking');
    setTimeout(() => noBtn.classList.remove('shaking'), 500);
});

noBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
});

// Also prevent click if touch moved the button
noBtn.addEventListener('click', function(e) {
    if (isMoving) {
        e.preventDefault();
        e.stopPropagation();
        isMoving = false;
    }
});

function moveButton() {
    if (noBtn.disabled) return;
    
    isMoving = true;
    
    const containerRect = container.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();
    
    // Calculate safe boundaries (keep button fully visible)
    const padding = 20;
    const maxX = containerRect.width - noBtnRect.width - padding;
    const maxY = containerRect.height - 120; // Leave space for other elements
    
    // Random position within safe boundaries
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * (maxY - 100) + 50); // Keep away from top
    
    // Apply new position
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    
    // Change button text randomly
    const texts = [
        "Are you sure?",
        "Think again!",
        "Please say yes!",
        "Just click YES!",
        "Don't do this!",
        "Try the other button!",
        "I'm shy!",
        "Not this one!"
    ];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    noBtn.textContent = randomText;
    
    // Reset moving flag after animation
    setTimeout(() => {
        isMoving = false;
    }, 300);
}

// Create floating hearts animation
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 20 + 15 + 'px';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.opacity = '0.8';
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    heart.style.userSelect = 'none';
    
    document.body.appendChild(heart);
    
    // Animate heart floating up
    const animation = heart.animate([
        { 
            transform: 'translateY(0) rotate(0deg) scale(1)', 
            opacity: 0.8 
        },
        { 
            transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg) scale(0.5)`, 
            opacity: 0 
        }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    // Remove heart after animation
    animation.onfinish = () => {
        if (heart.parentNode) {
            heart.remove();
        }
    };
}

// Click/tap heart for surprise
heart.addEventListener('click', heartClick);
heart.addEventListener('touchend', function(e) {
    e.preventDefault();
    heartClick();
});

function heartClick() {
    heart.style.transform = 'scale(1.3)';
    heart.style.color = '#ff0000';
    
    setTimeout(() => {
        heart.style.transform = 'scale(1)';
        heart.style.color = '#e91e63';
    }, 300);
    
    // Create multiple hearts on tap
    for(let i = 0; i < 3; i++) {
        createFloatingHeart();
    }
}

// Initial floating hearts
window.addEventListener('load', () => {
    for(let i = 0; i < 5; i++) {
        setTimeout(() => createFloatingHeart(), i * 300);
    }
    
    // Initialize no button position
    noBtn.style.left = '50%';
    noBtn.style.top = '50%';
    noBtn.style.transform = 'translate(-50%, -50%)';
});

// Handle window resize
window.addEventListener('resize', () => {
    // Keep no button within bounds if it's positioned absolutely
    const noBtnRect = noBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    if (noBtnRect.right > containerRect.right - 10) {
        noBtn.style.left = `${containerRect.width - noBtnRect.width - 20}px`;
    }
    if (noBtnRect.bottom > containerRect.bottom - 10) {
        noBtn.style.top = `${containerRect.height - noBtnRect.height - 80}px`;
    }
});

// Prevent context menu on buttons (mobile long press)
noBtn.addEventListener('contextmenu', (e) => e.preventDefault());
yesBtn.addEventListener('contextmenu', (e) => e.preventDefault());
heart.addEventListener('contextmenu', (e) => e.preventDefault());
