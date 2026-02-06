// ============================================
// WORLD'S BEST VALENTINE WEBSITE FOR DOADWI
// ============================================

// Global state
const AppState = {
    loveLevel: 0,
    escapeAttempts: 0,
    reactionTimes: [],
    isCelebrating: false,
    startTime: Date.now(),
    messages: [],
    isMusicPlaying: false,
    isDarkMode: false,
    isHeartGlowing: false,
    isHeartSpinning: false,
    isHeartPulsing: false,
    currentCelebrationStage: 1
};

// DOM Elements cache
const DOM = {
    // Main elements
    yesBtn: document.getElementById('yes-btn'),
    noBtn: document.getElementById('no-btn'),
    heart3d: document.getElementById('heart-3d'),
    loveMeter: document.getElementById('love-meter'),
    loveCounter: document.getElementById('love-counter'),
    loveTimer: document.getElementById('love-timer'),
    escapeCount: document.getElementById('escape-count'),
    reactionSpeed: document.getElementById('reaction-speed'),
    noText: document.getElementById('no-text'),
    loveMessage: document.getElementById('love-message'),
    messagesContainer: document.getElementById('messages-container'),
    sendMessage: document.getElementById('send-message'),
    
    // Celebration elements
    celebrationOverlay: document.getElementById('celebration-overlay'),
    stage1: document.getElementById('stage-1'),
    stage2: document.getElementById('stage-2'),
    stage3: document.getElementById('stage-3'),
    stage4: document.getElementById('stage-4'),
    prevStageBtn: document.getElementById('prev-stage'),
    nextStageBtn: document.getElementById('next-stage'),
    stageDots: document.querySelectorAll('.stage-dot'),
    closeCelebrationBtn: document.getElementById('close-celebration'),
    shareCelebrationBtn: document.getElementById('share-celebration'),
    
    // Audio
    backgroundMusic: document.getElementById('background-music'),
    musicToggle: document.getElementById('music-toggle'),
    
    // Control buttons
    heartGlow: document.getElementById('heart-glow'),
    heartSpin: document.getElementById('heart-spin'),
    heartPulse: document.getElementById('heart-pulse'),
    resetBtn: document.getElementById('reset-btn')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Valentine Website for Doadwi Loaded!');
    
    // Initialize particles
    initParticles();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize celebration system
    initCelebrationSystem();
    
    // Start timers
    startLoveTimer();
    startLoveCounter();
    
    // Add welcome message
    setTimeout(() => {
        addMessage("💖 Welcome to your personalized Valentine experience for Doadwi!", false);
        addMessage("Click the heart, try to catch the NO button, and enjoy the magic!", false);
    }, 1000);
});

// ============================================
// PARTICLES BACKGROUND
// ============================================

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ff4081" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#e91e63",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    // YES Button - Celebration
    DOM.yesBtn.addEventListener('click', startCelebration);
    DOM.yesBtn.addEventListener('touchend', startCelebration);
    
    // NO Button - Escape Logic
    DOM.noBtn.addEventListener('mouseenter', moveNoButton);
    DOM.noBtn.addEventListener('touchstart', handleNoButtonTouch);
    DOM.noBtn.addEventListener('touchend', preventDefaultTouch);
    
    // Heart Interactions
    DOM.heart3d.addEventListener('click', heartClickEffect);
    DOM.heart3d.addEventListener('touchend', heartClickEffect);
    
    // Heart Controls
    DOM.heartGlow.addEventListener('click', toggleHeartGlow);
    DOM.heartSpin.addEventListener('click', toggleHeartSpin);
    DOM.heartPulse.addEventListener('click', toggleHeartPulse);
    
    // Music Toggle
    DOM.musicToggle.addEventListener('click', toggleMusic);
    DOM.backgroundMusic.volume = 0.3;
    
    // Message System
    DOM.sendMessage.addEventListener('click', sendLoveMessage);
    DOM.loveMessage.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendLoveMessage();
    });
    
    // Reset Button
    DOM.resetBtn.addEventListener('click', resetExperience);
}

// ============================================
// NO BUTTON ESCAPE LOGIC
// ============================================

function moveNoButton() {
    if (AppState.isCelebrating) return;
    
    const startTime = performance.now();
    const maxX = 300;
    const maxY = 300;
    const randomX = Math.floor(Math.random() * maxX - maxX/2);
    const randomY = Math.floor(Math.random() * maxY - maxY/2);
    
    DOM.noBtn.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    DOM.noBtn.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 20 - 10}deg)`;
    
    AppState.escapeAttempts++;
    DOM.escapeCount.textContent = AppState.escapeAttempts;
    
    const reactionTime = performance.now() - startTime;
    AppState.reactionTimes.push(reactionTime);
    DOM.reactionSpeed.textContent = `${Math.min(reactionTime, 999)}ms`;
    
    const texts = [
        "Nice try! 😏", 
        "Too slow! 🏃‍♂️", 
        "Catch me if you can!", 
        "Not today! 😄",
        "I'm too fast! ⚡",
        "Try again! 💪",
        "Almost got me! 😅",
        "For Doadwi only! 💖"
    ];
    DOM.noText.textContent = texts[Math.floor(Math.random() * texts.length)];
    
    AppState.loveLevel = Math.min(AppState.loveLevel + 2, 100);
    updateLoveMeter();
}

function handleNoButtonTouch(e) {
    e.preventDefault();
    moveNoButton();
    if (navigator.vibrate) navigator.vibrate(50);
}

function preventDefaultTouch(e) {
    e.preventDefault();
}

// ============================================
// HEART CONTROLS
// ============================================

function heartClickEffect() {
    AppState.loveLevel = Math.min(AppState.loveLevel + 5, 100);
    updateLoveMeter();
    
    for (let i = 0; i < 3; i++) {
        createMiniHeart();
    }
    
    const currentCount = parseInt(DOM.loveCounter.textContent);
    DOM.loveCounter.textContent = currentCount + 1;
    
    addMessage("❤️ Heart clicked! Love for Doadwi increased!", false);
}

function toggleHeartGlow() {
    AppState.isHeartGlowing = !AppState.isHeartGlowing;
    const heartCenter = DOM.heart3d.querySelector('.heart-center');
    
    if (AppState.isHeartGlowing) {
        heartCenter.style.animation = 'glow 1s infinite';
        DOM.heartGlow.innerHTML = '<i class="fas fa-magic"></i> Glowing!';
    } else {
        heartCenter.style.animation = '';
        DOM.heartGlow.innerHTML = '<i class="fas fa-magic"></i> Glow';
    }
}

function toggleHeartSpin() {
    AppState.isHeartSpinning = !AppState.isHeartSpinning;
    
    if (AppState.isHeartSpinning) {
        DOM.heart3d.style.animation = 'spin 3s linear infinite';
        DOM.heartSpin.innerHTML = '<i class="fas fa-sync fa-spin"></i> Spinning!';
    } else {
        DOM.heart3d.style.animation = '';
        DOM.heartSpin.innerHTML = '<i class="fas fa-sync"></i> Spin';
    }
}

function toggleHeartPulse() {
    AppState.isHeartPulsing = !AppState.isHeartPulsing;
    const heartLayers = DOM.heart3d.querySelectorAll('.heart-layer');
    
    if (AppState.isHeartPulsing) {
        heartLayers.forEach(layer => {
            layer.style.animation = 'float 1.5s ease-in-out infinite';
        });
        DOM.heartPulse.innerHTML = '<i class="fas fa-heartbeat"></i> Pulsing!';
    } else {
        heartLayers.forEach(layer => {
            layer.style.animation = 'float 3s ease-in-out infinite';
        });
        DOM.heartPulse.innerHTML = '<i class="fas fa-heartbeat"></i> Pulse';
    }
}

function createMiniHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.fontSize = '20px';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    
    document.body.appendChild(heart);
    
    heart.animate([
        { transform: 'translateY(0) scale(1)', opacity: 0.8 },
        { transform: 'translateY(-100px) scale(0.5)', opacity: 0 }
    ], {
        duration: 2000,
        easing: 'ease-out'
    });
    
    setTimeout(() => heart.remove(), 2000);
}

// ============================================
// MESSAGE SYSTEM
// ============================================

function sendLoveMessage() {
    const message = DOM.loveMessage.value.trim();
    if (message) {
        addMessage(`You: ${message}`, true);
        DOM.loveMessage.value = '';
        
        setTimeout(() => {
            const responses = [
                "Doadwi: That's so sweet! ❤️",
                "Doadwi: You make my heart flutter! 🦋",
                "Doadwi: I feel the same way! 💕",
                "Doadwi: You're amazing! ✨",
                "Doadwi: My heart is smiling! 😊",
                "Doadwi: This is so romantic! 🌹",
                "Doadwi: I'm blushing! 😳",
                "Doadwi: You're the best! 🥰"
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            addMessage(response, false);
            
            AppState.loveLevel = Math.min(AppState.loveLevel + 3, 100);
            updateLoveMeter();
        }, 1000);
    }
}

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble ${isUser ? 'user' : ''}`;
    messageDiv.textContent = text;
    
    DOM.messagesContainer.appendChild(messageDiv);
    DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
    
    AppState.messages.push({ text, isUser, timestamp: Date.now() });
}

// ============================================
// TIMERS & METRICS
// ============================================

function startLoveTimer() {
    setInterval(() => {
        const elapsed = Date.now() - AppState.startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        DOM.loveTimer.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function startLoveCounter() {
    setInterval(() => {
        if (!AppState.isCelebrating) {
            const currentCount = parseInt(DOM.loveCounter.textContent);
            DOM.loveCounter.textContent = currentCount + 1;
        }
    }, 5000);
}

function updateLoveMeter() {
    DOM.loveMeter.style.width = `${AppState.loveLevel}%`;
    DOM.loveMeter.textContent = `${AppState.loveLevel}%`;
    
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        if (AppState.loveLevel > (index + 1) * 33) {
            flame.style.opacity = '1';
            flame.style.height = '60px';
        } else {
            flame.style.opacity = '0.5';
            flame.style.height = '40px';
        }
    });
}

// ============================================
// ULTIMATE CELEBRATION SYSTEM
// ============================================

function initCelebrationSystem() {
    // Stage navigation
    DOM.prevStageBtn.addEventListener('click', () => changeCelebrationStage(-1));
    DOM.nextStageBtn.addEventListener('click', () => changeCelebrationStage(1));
    
    // Stage dots
    DOM.stageDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const stage = parseInt(e.target.dataset.stage);
            goToCelebrationStage(stage);
        });
    });
    
    // Close celebration
    DOM.closeCelebrationBtn.addEventListener('click', closeCelebration);
    
    // Share celebration
    DOM.shareCelebrationBtn.addEventListener('click', shareCelebration);
    
    // Firework controls
    document.querySelectorAll('.firework-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            createFireworks(type);
        });
    });
    
    // Confetti controls
    document.querySelectorAll('.confetti-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.dataset.color;
            createConfetti(color);
        });
    });
    
    // Effect toggles
    document.getElementById('toggle-confetti').addEventListener('click', toggleEffect);
    document.getElementById('toggle-music').addEventListener('click', toggleEffect);
    document.getElementById('toggle-sparkles').addEventListener('click', toggleEffect);
}

// ============================================
// CELEBRATION CONTROLS
// ============================================

function startCelebration() {
    console.log('🎉 Starting celebration...');
    
    AppState.isCelebrating = true;
    AppState.loveLevel = 100;
    AppState.currentCelebrationStage = 1;
    
    // Update UI
    updateLoveMeter();
    DOM.loveCounter.textContent = "∞";
    DOM.noBtn.disabled = true;
    DOM.noBtn.style.opacity = '0.5';
    
    // Show celebration
    DOM.celebrationOverlay.classList.add('active');
    document.body.classList.add('celebration-active');
    
    // Go to first stage
    goToCelebrationStage(1);
    
    // Start celebration effects
    startCelebrationEffects();
    
    // Add celebration message
    addMessage("🎉 ULTIMATE CELEBRATION ACTIVATED! DOADWI SAID YES!", true);
    
    // Auto-advance stages
    startStageAutoAdvance();
}

function goToCelebrationStage(stage) {
    if (stage < 1 || stage > 4) return;
    
    AppState.currentCelebrationStage = stage;
    
    // Hide all stages
    [DOM.stage1, DOM.stage2, DOM.stage3, DOM.stage4].forEach((stageEl, index) => {
        stageEl.classList.remove('active');
        DOM.stageDots[index].classList.remove('active');
    });
    
    // Show current stage
    const currentStage = document.getElementById(`stage-${stage}`);
    const currentDot = DOM.stageDots[stage - 1];
    
    if (currentStage) {
        currentStage.classList.add('active');
        currentDot.classList.add('active');
    }
    
    // Stage-specific effects
    switch(stage) {
        case 1:
            createBurstEffect();
            break;
        case 2:
            createFireworks('heart');
            break;
        case 3:
            createConfetti('rainbow');
            break;
        case 4:
            showFinalStats();
            break;
    }
}

function changeCelebrationStage(direction) {
    const newStage = AppState.currentCelebrationStage + direction;
    if (newStage >= 1 && newStage <= 4) {
        goToCelebrationStage(newStage);
    }
}

function startStageAutoAdvance() {
    if (AppState.autoAdvanceTimer) clearInterval(AppState.autoAdvanceTimer);
    
    AppState.autoAdvanceTimer = setInterval(() => {
        if (AppState.currentCelebrationStage < 4) {
            goToCelebrationStage(AppState.currentCelebrationStage + 1);
        } else {
            clearInterval(AppState.autoAdvanceTimer);
        }
    }, 8000); // Change stage every 8 seconds
}

function startCelebrationEffects() {
    // Play celebration music
    if (!AppState.isMusicPlaying) {
        toggleMusic();
    }
    
    // Create initial burst
    createBurstEffect();
    
    // Create confetti
    createConfetti('rainbow');
}

function createBurstEffect() {
    const burst = document.querySelector('.burst-effect');
    if (burst) {
        burst.style.animation = 'none';
        setTimeout(() => {
            burst.style.animation = 'burstPulse 2s ease-in-out infinite';
        }, 10);
    }
    
    // Create shockwave particles
    for (let i = 0; i < 50; i++) {
        createBurstParticle();
    }
}

function createBurstParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = getRandomColor();
    particle.style.borderRadius = '50%';
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.zIndex = '10000';
    particle.style.pointerEvents = 'none';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 200;
    const duration = 1000 + Math.random() * 1000;
    
    particle.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { 
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, 
            opacity: 0 
        }
    ], {
        duration: duration,
        easing: 'ease-out'
    });
    
    setTimeout(() => particle.remove(), duration);
}

function createFireworks(type = 'heart') {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create multiple fireworks
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            launchFirework(ctx, canvas, type);
        }, i * 500);
    }
}

function launchFirework(ctx, canvas, type) {
    const x = canvas.width / 2 + (Math.random() - 0.5) * 200;
    const y = canvas.height;
    const targetY = 50 + Math.random() * 150;
    
    // Draw launch trail
    let currentY = y;
    const launchInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = getRandomColor();
        ctx.beginPath();
        ctx.arc(x, currentY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        currentY -= 5;
        
        if (currentY <= targetY) {
            clearInterval(launchInterval);
            explodeFirework(ctx, x, currentY, type);
        }
    }, 16);
}

function explodeFirework(ctx, x, y, type) {
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const size = 2 + Math.random() * 4;
        
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size,
            color: getRandomColor(),
            life: 100
        });
    }
    
    const explosionInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // Gravity
            p.life--;
            
            if (p.life > 0) {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 100;
                ctx.beginPath();
                
                if (type === 'heart') {
                    drawHeart(ctx, p.x, p.y, p.size);
                } else if (type === 'star') {
                    drawStar(ctx, p.x, p.y, p.size);
                } else {
                    ctx.arc(p.x, p.y, p.size/2, 0, Math.PI * 2);
                }
                
                ctx.fill();
            }
        });
        
        // Remove dead particles
        const aliveParticles = particles.filter(p => p.life > 0);
        if (aliveParticles.length === 0) {
            clearInterval(explosionInterval);
        }
    }, 16);
}

function createConfetti(colorScheme = 'rainbow') {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const confetti = [];
    const confettiCount = 300;
    
    for (let i = 0; i < confettiCount; i++) {
        let color;
        switch(colorScheme) {
            case 'rainbow':
                color = getRandomColor();
                break;
            case 'love':
                color = ['#ff4081', '#e91e63', '#f50057'][Math.floor(Math.random() * 3)];
                break;
            case 'gold':
                color = ['#ffd700', '#ffed4e', '#fff8a8'][Math.floor(Math.random() * 3)];
                break;
            default:
                color = getRandomColor();
        }
        
        confetti.push({
            x: Math.random() * canvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 4,
            vy: 2 + Math.random() * 4,
            size: 5 + Math.random() * 10,
            color: color,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            wobble: Math.random() * 2
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach(c => {
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.05; // Gravity
            c.rotation += c.rotationSpeed;
            c.x += Math.sin(c.y * 0.01) * c.wobble;
            
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.fillStyle = c.color;
            
            if (c.shape === 'rect') {
                ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, c.size/2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
            
            // Reset confetti if it falls off screen
            if (c.y > canvas.height + 50) {
                c.y = -20;
                c.x = Math.random() * canvas.width;
            }
        });
        
        requestAnimationFrame(animateConfetti);
    }
    
    animateConfetti();
}

function drawHeart(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size/20, size/20);
    
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-5, 0, -10, -5, 0, -10);
    ctx.bezierCurveTo(10, -5, 5, 0, 0, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawStar(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    
    const spikes = 5;
    const outerRadius = size/2;
    const innerRadius = size/4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = Math.PI / spikes * i;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function showFinalStats() {
    // Animate love percentage
    animateCounter('celeb-love', 0, 100, 2000);
    
    // Animate time counter
    animateCounter('celeb-time', 0, 999, 1500);
    
    // Create trophy particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createTrophyParticle(), i * 100);
    }
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let startTime = null;
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = elementId === 'celeb-love' ? `${value}%` : `${value}+`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function createTrophyParticle() {
    const particle = document.createElement('div');
    particle.innerHTML = '⭐';
    particle.style.position = 'fixed';
    particle.style.fontSize = '20px';
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.zIndex = '10000';
    particle.style.pointerEvents = 'none';
    particle.style.color = '#FFD700';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    
    particle.animate([
        { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
        { 
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0) rotate(360deg)`, 
            opacity: 0 
        }
    ], {
        duration: 2000,
        easing: 'ease-out'
    });
    
    setTimeout(() => particle.remove(), 2000);
}

function toggleEffect(e) {
    const btn = e.target.closest('.effect-btn');
    if (btn) {
        btn.classList.toggle('active');
    }
}

function closeCelebration() {
    DOM.celebrationOverlay.classList.remove('active');
    document.body.classList.remove('celebration-active');
    
    if (AppState.autoAdvanceTimer) {
        clearInterval(AppState.autoAdvanceTimer);
    }
    
    addMessage("🎉 Celebration complete! Let's continue loving Doadwi! 💖", false);
}

function shareCelebration() {
    const shareData = {
        title: '🎉 Doadwi Said YES!',
        text: 'Doadwi just experienced the most amazing Valentine celebration! Check it out!',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(`${window.location.href}\n\n🎉 Doadwi's Valentine Celebration!`);
        alert('🎉 Celebration link copied to clipboard! Share it with Doadwi!');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function toggleMusic() {
    const icon = DOM.musicToggle.querySelector('i');
    const text = DOM.musicToggle.querySelector('span');
    
    if (AppState.isMusicPlaying) {
        DOM.backgroundMusic.pause();
        icon.className = 'fas fa-music';
        text.textContent = 'Play Music';
    } else {
        DOM.backgroundMusic.play().catch(e => console.log("Music play failed:", e));
        icon.className = 'fas fa-volume-up';
        text.textContent = 'Music Playing';
    }
    
    AppState.isMusicPlaying = !AppState.isMusicPlaying;
}

function getRandomColor() {
    const colors = [
        '#FF4081', '#E91E63', '#F50057', '#FF0066',
        '#4CAF50', '#2E7D32', '#00C853', '#64DD17',
        '#2196F3', '#1565C0', '#2979FF', '#2962FF',
        '#FF9800', '#F57C00', '#FF9100', '#FF6D00',
        '#9C27B0', '#7B1FA2', '#AA00FF', '#6200EA'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function resetExperience() {
    if (confirm("Are you sure you want to restart the experience for Doadwi?")) {
        // Reset state
        AppState.loveLevel = 0;
        AppState.escapeAttempts = 0;
        AppState.reactionTimes = [];
        AppState.isCelebrating = false;
        AppState.startTime = Date.now();
        AppState.messages = [];
        
        // Reset UI
        DOM.loveCounter.textContent = '0';
        DOM.escapeCount.textContent = '0';
        DOM.reactionSpeed.textContent = '0ms';
        DOM.noText.textContent = 'Maybe... 😅';
        DOM.messagesContainer.innerHTML = '';
        DOM.noBtn.disabled = false;
        DOM.noBtn.style.opacity = '1';
        DOM.noBtn.style.transform = 'translate(0, 0) rotate(0deg)';
        
        // Close celebration if open
        DOM.celebrationOverlay.classList.remove('active');
        document.body.classList.remove('celebration-active');
        
        // Reset love meter
        updateLoveMeter();
        
        // Add reset message
        addMessage("🔄 Experience has been reset! Let's create new memories with Doadwi!", false);
    }
}

// ============================================
// AUTO-START TEST (REMOVE IN PRODUCTION)
// ============================================

// Uncomment this line to auto-start celebration for testing:
// setTimeout(() => startCelebration(), 2000);

console.log('🚀 Valentine Website Ready! Click YES to see the celebration!');
