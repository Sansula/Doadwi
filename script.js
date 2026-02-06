const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const message = document.getElementById('main-message');
const daysCount = document.getElementById('days-count');

// CONFIGURATION: Set your start date here
const startDate = new Date('2024-01-01'); 

// 1. Calculate Days of Love
const today = new Date();
const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
daysCount.textContent = diff;

// 2. Runaway Button Logic (Desktop + Mobile)
function moveButton() {
    // Get container dimensions to keep button inside
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate valid range (so it stays within the card)
    const maxLeft = containerRect.width - btnRect.width;
    const maxTop = containerRect.height - btnRect.height;

    const newLeft = Math.floor(Math.random() * maxLeft);
    const newTop = Math.floor(Math.random() * maxTop);

    noBtn.style.position = 'absolute';
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
}

// Events to trigger movement
noBtn.addEventListener('mouseover', moveButton); // Desktop hover
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent actual tap
    moveButton();
}); // Mobile touch

// 3. Celebration Logic
yesBtn.addEventListener('click', () => {
    message.innerHTML = "Yay! I knew you'd say YES! ❤️";
    noBtn.style.display = 'none';
    yesBtn.style.display = 'none';
    
    // Create floating hearts
    setInterval(createHeart, 100);
});

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floater');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}
