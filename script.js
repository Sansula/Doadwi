// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particles.js background
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

    // DOM Elements
    const elements = {
        // Buttons
        yesBtn: document.getElementById('yes-btn'),
        noBtn: document.getElementById('no-btn'),
        musicToggle: document.getElementById('music-toggle'),
        themeToggle: document.getElementById('theme-toggle'),
        heartGlow: document.getElementById('heart-glow'),
        heartSpin: document.getElementById('heart-spin'),
        heartPulse: document.getElementById('heart-pulse'),
        sendMessage: document.getElementById('send-message'),
        shareBtn: document.getElementById('share-btn'),
        resetBtn: document.getElementById('reset-btn'),
        
        // Interactive Elements
        heart3d: document.getElementById('heart-3d'),
        loveMessage: document.getElementById('love-message'),
        messagesContainer: document.getElementById('messages-container'),
        celebrationModal: document.getElementById('celebration-modal'),
        
        // Metrics
        loveMeter: document.getElementById('love-meter'),
        loveCounter: document.getElementById('love-counter'),
        loveTimer: document.getElementById('love-timer'),
        escapeCount: document.getElementById('escape-count'),
        reactionSpeed: document.getElementById('reaction-speed'),
        noText: document.getElementById('no-text'),
        
        // Audio
        backgroundMusic: document.getElementById('background-music')
    };

    // State Variables
    const state = {
        loveLevel: 0,
        escapeAttempts: 0,
        reactionTimes: [],
        isCelebrating: false,
        startTime: Date.now(),
        messages: [],
        isMusicPlaying: false,
        isDarkMode: false,
        isHeartSpinning: false,
        isHeartGlowing: false,
        isHeartPulsing: false
    };

    // Initialize Chart.js
    const loveGraph = new Chart(document.getElementById('love-graph'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Love Level',
                data: [],
                borderColor: '#ff4081',
                backgroundColor: 'rgba(255, 64, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { display: false }
            }
        }
    });

    // Initialize Audio
    elements.backgroundMusic.volume = 0.3;

    // Event Listeners
    initializeEventListeners();

    // Start Timers
    startLoveTimer();
    startLoveCounter();
    updateLoveMeter();

    // Functions
    function initializeEventListeners() {
        // YES Button - Celebration
        elements.yesBtn.addEventListener('click', startCelebration);
        elements.yesBtn.addEventListener('touchend', startCelebration);

        // NO Button - Escape Logic
        elements.noBtn.addEventListener('mouseenter', moveNoButton);
        elements.noBtn.addEventListener('touchstart', handleNoButtonTouch);
        elements.noBtn.addEventListener('touchend', preventDefaultTouch);

        // Music Toggle
        elements.musicToggle.addEventListener('click', toggleMusic);

        // Theme Toggle
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Heart Controls
        elements.heartGlow.addEventListener('click', toggleHeartGlow);
        elements.heartSpin.addEventListener('click', toggleHeartSpin);
        elements.heartPulse.addEventListener('click', toggleHeartPulse);

        // 3D Heart Interactions
        elements.heart3d.addEventListener('click', heartClickEffect);
        elements.heart3d.addEventListener('touchend', heartClickEffect);

        // Message System
        elements.sendMessage.addEventListener('click', sendLoveMessage);
        elements.loveMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendLoveMessage();
        });

        // Share Button
        elements.shareBtn.addEventListener('click', shareCelebration);

        // Reset Button
        elements.resetBtn.addEventListener('click', resetExperience);
    }

    function moveNoButton() {
        if (state.isCelebrating) return;

        const startTime = performance.now();
        const button = elements.noBtn;
        const wrapper = button.closest('.button-wrapper');
        const zones = wrapper.querySelectorAll('.zone');
        
        // Calculate new position
        const maxX = 300;
        const maxY = 300;
        const randomX = Math.floor(Math.random() * maxX - maxX/2);
        const randomY = Math.floor(Math.random() * maxY - maxY/2);
        
        // Animate movement
        button.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        button.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 20 - 10}deg)`;
        
        // Update metrics
        state.escapeAttempts++;
        elements.escapeCount.textContent = state.escapeAttempts;
        
        const reactionTime = performance.now() - startTime;
        state.reactionTimes.push(reactionTime);
        elements.reactionSpeed.textContent = `${Math.min(reactionTime, 999)}ms`;
        
        // Change button text
        const texts = [
            "Nice try! 😏", 
            "Too slow! 🏃‍♂️", 
            "Catch me if you can!", 
            "Not today! 😄",
            "I'm too fast! ⚡",
            "You'll need luck! 🍀",
            "Try harder! 💪",
            "Almost got me! 😅"
        ];
        elements.noText.textContent = texts[Math.floor(Math.random() * texts.length)];
        
        // Trigger zone animations
        zones.forEach(zone => {
            zone.style.animation = 'none';
            setTimeout(() => {
                zone.style.animation = 'pulse-zone 2s infinite';
            }, 10);
        });

        // Update love meter
        state.loveLevel = Math.min(state.loveLevel + 2, 100);
        updateLoveMeter();
        updateLoveGraph();
    }

    function handleNoButtonTouch(e) {
        e.preventDefault();
        moveNoButton();
        
        // Add vibration if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    function preventDefaultTouch(e) {
        e.preventDefault();
    }

    function startCelebration() {
        if (state.isCelebrating) return;
        
        state.isCelebrating = true;
        state.loveLevel = 100;
        updateLoveMeter();
        
        // Show celebration modal
        elements.celebrationModal.style.display = 'flex';
        
        // Create confetti
        createConfetti();
        
        // Play celebration sound
        playCelebrationSound();
        
        // Trigger fireworks
        createFireworks();
        
        // Update metrics
        elements.loveCounter.textContent = "∞";
        
        // Disable NO button
        elements.noBtn.disabled = true;
        elements.noBtn.style.opacity = '0.5';
        
        // Add celebration message
        addMessage("🎉 Celebration Mode Activated! Infinite love unlocked!", true);
    }

    function createConfetti() {
        const confettiContainer = document.querySelector('.confetti-container');
        const colors = ['#ff4081', '#e91e63', '#f50057', '#ff6b9d', '#ffffff'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-20px';
            
            confettiContainer.appendChild(confetti);
            
            // Animate confetti
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)',
                delay: Math.random() * 1000
            });
            
            // Remove after animation
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    function createFireworks() {
        const container = document.querySelector('.container');
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.style.position = 'fixed';
                firework.style.left = `${Math.random() * 100}%`;
                firework.style.top = `${Math.random() * 100}%`;
                firework.style.width = '5px';
                firework.style.height = '5px';
                firework.style.background = '#ff4081';
                firework.style.borderRadius = '50%';
                firework.style.zIndex = '9999';
                firework.style.pointerEvents = 'none';
                
                document.body.appendChild(firework);
                
                // Animate firework explosion
                firework.animate([
                    { transform: 'scale(1)', opacity: 1 },
                    { transform: 'scale(20)', opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                });
                
                setTimeout(() => firework.remove(), 1000);
            }, i * 300);
        }
    }

    function toggleMusic() {
        const icon = elements.musicToggle.querySelector('i');
        const text = elements.musicToggle.querySelector('span');
        
        if (state.isMusicPlaying) {
            elements.backgroundMusic.pause();
            icon.className = 'fas fa-music';
            text.textContent = 'Play Music';
        } else {
            elements.backgroundMusic.play().catch(e => console.log("Audio playback failed:", e));
            icon.className = 'fas fa-volume-up';
            text.textContent = 'Music Playing';
        }
        
        state.isMusicPlaying = !state.isMusicPlaying;
    }

    function toggleTheme() {
        state.isDarkMode = !state.isDarkMode;
        document.body.classList.toggle('dark-mode', state.isDarkMode);
        
        // Update particle colors
        if (state.isDarkMode) {
            particlesJS('particles-js', {
                particles: {
                    color: { value: "#1a1a2e" },
                    line_linked: { color: "#0f0c29" }
                }
            });
        } else {
            particlesJS('particles-js', {
                particles: {
                    color: { value: "#ff4081" },
                    line_linked: { color: "#e91e63" }
                }
            });
        }
    }

    function toggleHeartGlow() {
        state.isHeartGlowing = !state.isHeartGlowing;
        const heartCenter = elements.heart3d.querySelector('.heart-center');
        
        if (state.isHeartGlowing) {
            heartCenter.style.animation = 'glow 1s infinite';
            elements.heartGlow.innerHTML = '<i class="fas fa-magic"></i> Glowing!';
        } else {
            heartCenter.style.animation = '';
            elements.heartGlow.innerHTML = '<i class="fas fa-magic"></i> Glow';
        }
    }

    function toggleHeartSpin() {
        state.isHeartSpinning = !state.isHeartSpinning;
        
        if (state.isHeartSpinning) {
            elements.heart3d.style.animation = 'spin 3s linear infinite';
            elements.heartSpin.innerHTML = '<i class="fas fa-sync fa-spin"></i> Spinning!';
        } else {
            elements.heart3d.style.animation = '';
            elements.heartSpin.innerHTML = '<i class="fas fa-sync"></i> Spin';
        }
    }

    function toggleHeartPulse() {
        state.isHeartPulsing = !state.isHeartPulsing;
        const heartLayers = elements.heart3d.querySelectorAll('.heart-layer');
        
        if (state.isHeartPulsing) {
            heartLayers.forEach(layer => {
                layer.style.animation = 'float 1.5s ease-in-out infinite';
            });
            elements.heartPulse.innerHTML = '<i class="fas fa-heartbeat"></i> Pulsing!';
        } else {
            heartLayers.forEach(layer => {
                layer.style.animation = 'float 3s ease-in-out infinite';
            });
            elements.heartPulse.innerHTML = '<i class="fas fa-heartbeat"></i> Pulse';
        }
    }

    function heartClickEffect() {
        if (state.isCelebrating) return;
        
        // Add love points
        state.loveLevel = Math.min(state.loveLevel + 5, 100);
        updateLoveMeter();
        
        // Create mini hearts
        for (let i = 0; i < 5; i++) {
            createMiniHeart();
        }
        
        // Update counter
        const currentCount = parseInt(elements.loveCounter.textContent);
        elements.loveCounter.textContent = currentCount + 1;
        
        // Add message
        addMessage("❤️ Heart clicked! Love level increased!", false);
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
        heart.style.opacity = '0.8';
        
        document.body.appendChild(heart);
        
        // Animate heart floating
        heart.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0.8 },
            { transform: 'translateY(-100px) scale(0.5)', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        });
        
        setTimeout(() => heart.remove(), 2000);
    }

    function sendLoveMessage() {
        const message = elements.loveMessage.value.trim();
        if (message) {
            addMessage(message, true);
            elements.loveMessage.value = '';
            
            // Add auto-response
            setTimeout(() => {
                const responses = [
                    "That's so sweet! ❤️",
                    "You make my heart flutter! 🦋",
                    "I feel the same way! 💕",
                    "You're amazing! ✨",
                    "My heart is smiling! 😊"
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                addMessage(response, false);
                
                // Increase love level
                state.loveLevel = Math.min(state.loveLevel + 3, 100);
                updateLoveMeter();
            }, 1000);
        }
    }

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${isUser ? 'user' : ''}`;
        messageDiv.textContent = text;
        
        elements.messagesContainer.appendChild(messageDiv);
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        
        state.messages.push({ text, isUser, timestamp: Date.now() });
    }

    function startLoveTimer() {
        setInterval(() => {
            const elapsed = Date.now() - state.startTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            elements.loveTimer.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function startLoveCounter() {
        setInterval(() => {
            if (!state.isCelebrating) {
                const currentCount = parseInt(elements.loveCounter.textContent);
                elements.loveCounter.textContent = currentCount + 1;
                updateLoveGraph();
            }
        }, 5000);
    }

    function updateLoveMeter() {
        elements.loveMeter.style.width = `${state.loveLevel}%`;
        elements.loveMeter.textContent = `${state.loveLevel}%`;
        
        // Update flame intensity
        const flames = document.querySelectorAll('.flame');
        flames.forEach((flame, index) => {
            if (state.loveLevel > (index + 1) * 33) {
                flame.style.opacity = '1';
                flame.style.height = '60px';
            } else {
                flame.style.opacity = '0.5';
                flame.style.height = '40px';
            }
        });
    }

    function updateLoveGraph() {
        const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        loveGraph.data.labels.push(now);
        loveGraph.data.datasets[0].data.push(state.loveLevel);
        
        // Keep only last 10 points
        if (loveGraph.data.labels.length > 10) {
            loveGraph.data.labels.shift();
            loveGraph.data.datasets[0].data.shift();
        }
        
        loveGraph.update();
    }

    function playCelebrationSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create celebration melody
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }, index * 200);
        });
    }

    function shareCelebration() {
        if (navigator.share) {
            navigator.share({
                title: 'I Said YES to Love! ❤️',
                text: 'Check out this amazing interactive Valentine website I just experienced!',
                url: window.location.href
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`${window.location.href}\n\nI said YES to love! ❤️ Check out this amazing Valentine website!`);
            alert('Link copied to clipboard! Share it with your loved ones! 💕');
        }
    }

    function resetExperience() {
        if (confirm("Are you sure you want to restart the experience? All progress will be lost.")) {
            // Reset state
            state.loveLevel = 0;
            state.escapeAttempts = 0;
            state.reactionTimes = [];
            state.isCelebrating = false;
            state.startTime = Date.now();
            state.messages = [];
            
            // Reset UI
            elements.celebrationModal.style.display = 'none';
            elements.loveCounter.textContent = '0';
            elements.escapeCount.textContent = '0';
            elements.reactionSpeed.textContent = '0ms';
            elements.noText.textContent = 'Maybe... 😅';
            elements.messagesContainer.innerHTML = '';
            elements.noBtn.disabled = false;
            elements.noBtn.style.opacity = '1';
            elements.noBtn.style.transform = 'translate(0, 0) rotate(0deg)';
            
            // Reset love meter
            updateLoveMeter();
            
            // Reset graph
            loveGraph.data.labels = [];
            loveGraph.data.datasets[0].data = [];
            loveGraph.update();
            
            // Add reset message
            addMessage("🔄 Experience has been reset! Let's create new memories!", false);
        }
    }

    // Add CSS for spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotateY(0); }
            to { transform: rotateY(360deg); }
        }
        
        .heart-3d {
            transform-style: preserve-3d;
            perspective: 1000px;
        }
    `;
    document.head.appendChild(style);

    // Initialize with welcome message
    setTimeout(() => {
        addMessage("Welcome to your personalized Valentine experience! ❤️", false);
        addMessage("Click the heart, try to catch the NO button, and enjoy the magic!", false);
    }, 1000);
});
