// Counter for days
let dayCount = 0;
const dayCounter = document.getElementById('day-counter');

// Update counter every second to simulate days
setInterval(() => {
    dayCount++;
    dayCounter.textContent = dayCount;
}, 1000); // Change to 86400000 for real days (24 hours)

// Valentine acceptance function
function acceptValentine() {
    const message = document.getElementById('message');
    const heart = document.getElementById('animated-heart');
    
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
    document.getElementById('yes-btn').disabled = true;
    document.getElementById('no-btn').disabled = true;
}

// Move "No" button when hovered
function moveButton() {
    const noBtn = document.getElementById('no-btn');
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    
    // Random position within container
    const maxX = containerRect.width - noBtn.offsetWidth - 20;
    const maxY = containerRect.height - noBtn.offsetHeight - 20;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    
    // Change button text randomly
    const texts = ["Are you sure?", "Think again!", "Please?", "Just click YES!", "Don't do this!"];
    noBtn.textContent = texts[Math.floor(Math.random() * texts.length)];
}

// Create floating hearts animation
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.opacity = '0.7';
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    
    document.body.appendChild(heart);
    
    // Animate heart floating up
    const animation = heart.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 0.7 },
        { transform: `translateY(-${window.innerHeight}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    // Remove heart after animation
    animation.onfinish = () => {
        heart.remove();
    };
}

// Click heart for surprise
document.getElementById('animated-heart').addEventListener('click', function() {
    this.style.transform = 'scale(1.5)';
    this.style.color = '#ff0000';
    
    setTimeout(() => {
        this.style.transform = 'scale(1)';
        this.style.color = '#e91e63';
    }, 300);
    
    createFloatingHeart();
});

// Initial floating hearts
for(let i = 0; i < 5; i++) {
    setTimeout(() => createFloatingHeart(), i * 300);
}