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
            "Nice try, Doadwi! 😏", 
            "Too slow! 🏃‍♂️", 
            "Catch me if you can, Doadwi!", 
            "Not today! 😄",
            "I'm too fast! ⚡",
            "You'll need luck! 🍀",
            "Try harder, Doadwi! 💪",
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

    // ====================
    // ULTIMATE CELEBRATION SYSTEM
    // ====================

    class UltimateCelebration {
        constructor() {
            this.currentStage = 1;
            this.totalStages = 4;
            this.isActive = false;
            this.effects = {
                confetti: true,
                music: true,
                lasers: false
            };
            this.init();
        }
        
        init() {
            // Setup canvas
            this.canvas = document.getElementById('celebration-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            // Setup particles
            this.particles = [];
            this.confettiParticles = [];
            this.laserParticles = [];
            
            // Setup audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.music = {
                melody: null,
                bass: null,
                drums: null
            };
            
            // Bind event listeners
            this.bindEvents();
            
            // Start animation loop
            this.animate();
        }
        
        bindEvents() {
            // Stage navigation
            document.getElementById('next-stage').addEventListener('click', () => this.nextStage());
            document.getElementById('prev-stage').addEventListener('click', () => this.prevStage());
            
            // Stage indicators
            document.querySelectorAll('.stage-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const stage = parseInt(e.target.dataset.stage);
                    this.goToStage(stage);
                });
            });
            
            // Effect toggles
            document.getElementById('toggle-confetti').addEventListener('click', () => this.toggleEffect('confetti'));
            document.getElementById('toggle-music').addEventListener('click', () => this.toggleEffect('music'));
            document.getElementById('toggle-lasers').addEventListener('click', () => this.toggleEffect('lasers'));
            
            // Firework controls
            document.querySelectorAll('.fw-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const type = e.target.dataset.type;
                    this.createFireworkShow(type);
                });
            });
            
            // Share and close
            document.getElementById('celebration-share').addEventListener('click', () => this.shareCelebration());
            document.getElementById('close-celebration').addEventListener('click', () => this.close());
        }
        
        start() {
            this.isActive = true;
            this.currentStage = 1;
            document.getElementById('celebration-system').style.display = 'block';
            this.goToStage(1);
            
            // Initial effects
            this.createInitialBurst();
            this.startPartyMusic();
            this.createConfettiStorm();
            
            // Start auto-advance
            this.autoAdvance = setTimeout(() => this.nextStage(), 5000);
        }
        
        goToStage(stage) {
            if (stage < 1 || stage > this.totalStages) return;
            
            // Clear auto-advance
            if (this.autoAdvance) {
                clearTimeout(this.autoAdvance);
                this.autoAdvance = null;
            }
            
            // Hide all stages
            for (let i = 1; i <= this.totalStages; i++) {
                const stageEl = document.getElementById(`stage-${i}`);
                const dot = document.querySelector(`.stage-dot[data-stage="${i}"]`);
                
                if (stageEl) stageEl.style.display = 'none';
                if (dot) dot.classList.remove('active');
            }
            
            // Show current stage
            const currentStageEl = document.getElementById(`stage-${stage}`);
            const currentDot = document.querySelector(`.stage-dot[data-stage="${stage}"]`);
            
            if (currentStageEl) {
                currentStageEl.style.display = 'block';
                currentStageEl.classList.add('active');
            }
            
            if (currentDot) {
                currentDot.classList.add('active');
            }
            
            this.currentStage = stage;
            
            // Stage-specific effects
            switch(stage) {
                case 1:
                    this.createInitialBurst();
                    break;
                case 2:
                    this.createFireworkShow('heart');
                    break;
                case 3:
                    this.startTunnelEffect();
                    break;
                case 4:
                    this.showFinalStats();
                    break;
            }
            
            // Set auto-advance for next stage
            if (stage < this.totalStages) {
                this.autoAdvance = setTimeout(() => this.nextStage(), 8000);
            }
        }
        
        nextStage() {
            if (this.currentStage < this.totalStages) {
                this.goToStage(this.currentStage + 1);
            }
        }
        
        prevStage() {
            if (this.currentStage > 1) {
                this.goToStage(this.currentStage - 1);
            }
        }
        
        createInitialBurst() {
            // Create shockwave particles
            for (let i = 0; i < 200; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 4;
                const particle = {
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 2 + Math.random() * 4,
                    color: this.getRandomColor(),
                    life: 100
                };
                this.particles.push(particle);
            }
            
            // Play burst sound
            this.playSound(523.25, 'sine', 0.5, 0.2);
            setTimeout(() => this.playSound(659.25, 'sine', 0.5, 0.2), 100);
            setTimeout(() => this.playSound(783.99, 'sine', 0.5, 0.2), 200);
            setTimeout(() => this.playSound(1046.50, 'sine', 0.5, 0.2), 300);
        }
        
        createFireworkShow(type = 'heart') {
            // Clear existing fireworks
            this.particles = this.particles.filter(p => p.type !== 'firework');
            
            // Create multiple fireworks
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    this.launchFirework(type);
                }, i * 300);
            }
        }
        
        launchFirework(type) {
            const x = 100 + Math.random() * (this.canvas.width - 200);
            const y = this.canvas.height;
            const targetY = 100 + Math.random() * (this.canvas.height / 2);
            
            // Create launch particle
            const launchParticle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: -8 - Math.random() * 4,
                size: 3,
                color: this.getRandomColor(),
                life: 60,
                type: 'firework',
                phase: 'launch',
                targetY: targetY,
                explosionType: type
            };
            
            this.particles.push(launchParticle);
            
            // Play launch sound
            this.playSound(880, 'square', 0.1, 0.1);
        }
        
        explodeFirework(x, y, type) {
            const particleCount = type === 'spiral' ? 300 : 150;
            
            for (let i = 0; i < particleCount; i++) {
                let angle, speed, shape;
                
                switch(type) {
                    case 'heart':
                        angle = Math.random() * Math.PI * 2;
                        speed = 1 + Math.random() * 3;
                        shape = 'heart';
                        break;
                    case 'star':
                        angle = (i / particleCount) * Math.PI * 2;
                        speed = 2 + Math.random() * 2;
                        shape = 'star';
                        break;
                    case 'spiral':
                        angle = (i / particleCount) * Math.PI * 2;
                        speed = 0.5 + (i % 10) * 0.2;
                        shape = 'circle';
                        break;
                    default:
                        angle = Math.random() * Math.PI * 2;
                        speed = 1 + Math.random() * 3;
                        shape = 'circle';
                }
                
                const particle = {
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: type === 'star' ? 3 : 2 + Math.random() * 3,
                    color: this.getRandomColor(),
                    life: 100,
                    type: 'firework',
                    phase: 'explosion',
                    shape: shape,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1
                };
                
                this.particles.push(particle);
            }
            
            // Play explosion sound
            this.playSound(440, 'sawtooth', 0.2, 0.1);
            this.playSound(554.37, 'sawtooth', 0.2, 0.1);
            this.playSound(659.25, 'sawtooth', 0.2, 0.1);
        }
        
        startTunnelEffect() {
            // Create tunnel particles
            for (let i = 0; i < 1000; i++) {
                const z = Math.random() * 1000;
                const angle = Math.random() * Math.PI * 2;
                const radius = 50 + Math.random() * 100;
                
                const particle = {
                    x: this.canvas.width / 2 + Math.cos(angle) * radius,
                    y: this.canvas.height / 2 + Math.sin(angle) * radius,
                    z: z,
                    size: 1 + Math.random() * 3,
                    color: this.getRandomColor(),
                    speed: 5 + Math.random() * 10,
                    type: 'tunnel'
                };
                
                this.particles.push(particle);
            }
        }
        
        createConfettiStorm() {
            if (!this.effects.confetti) return;
            
            // Create confetti particles
            for (let i = 0; i < 500; i++) {
                const confetti = {
                    x: Math.random() * this.canvas.width,
                    y: -20,
                    vx: (Math.random() - 0.5) * 4,
                    vy: 2 + Math.random() * 4,
                    size: 5 + Math.random() * 10,
                    color: this.getRandomColor(),
                    life: 200 + Math.random() * 100,
                    type: 'confetti',
                    shape: Math.random() > 0.5 ? 'rect' : 'circle',
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1,
                    wobble: Math.random() * 2
                };
                
                this.confettiParticles.push(confetti);
            }
        }
        
        showFinalStats() {
            // Animate stats
            this.animateCounter('final-love', 0, 100, 2000);
            this.animateCounter('final-time', 0, 999, 1500);
            
            // Create trophy particles
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    this.createTrophyParticle();
                }, i * 40);
            }
        }
        
        createTrophyParticle() {
            const x = this.canvas.width / 2;
            const y = this.canvas.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 4,
                color: '#FFD700',
                life: 100,
                type: 'trophy',
                shape: 'star'
            };
            
            this.particles.push(particle);
        }
        
        animateCounter(elementId, start, end, duration) {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            const startTime = Date.now();
            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(start + (end - start) * easeOut);
                
                element.textContent = end === 100 ? `${value}%` : 
                                    end === 999 ? `${value}+` : 
                                    value.toString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        }
        
        startPartyMusic() {
            if (!this.effects.music) return;
            
            // Create melody
            const melodyNotes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50];
            let noteIndex = 0;
            
            this.music.melody = setInterval(() => {
                this.playSound(melodyNotes[noteIndex], 'sine', 0.1, 0.3);
                noteIndex = (noteIndex + 1) % melodyNotes.length;
            }, 200);
            
            // Create bass line
            const bassNotes = [130.81, 146.83, 164.81, 196.00];
            let bassIndex = 0;
            
            this.music.bass = setInterval(() => {
                this.playSound(bassNotes[bassIndex], 'sine', 0.05, 0.5);
                bassIndex = (bassIndex + 1) % bassNotes.length;
            }, 400);
            
            // Create drums
            this.music.drums = setInterval(() => {
                this.playSound(100, 'square', 0.05, 0.1);
            }, 500);
        }
        
        playSound(frequency, type = 'sine', duration = 0.5, volume = 0.1) {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                const now = this.audioContext.currentTime;
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                
                oscillator.start(now);
                oscillator.stop(now + duration);
            } catch (e) {
                console.log("Audio context not available");
            }
        }
        
        toggleEffect(effect) {
            this.effects[effect] = !this.effects[effect];
            
            const button = document.getElementById(`toggle-${effect}`);
            if (button) {
                button.classList.toggle('active', this.effects[effect]);
            }
            
            switch(effect) {
                case 'music':
                    if (this.effects.music) {
                        this.startPartyMusic();
                    } else {
                        this.stopMusic();
                    }
                    break;
                case 'confetti':
                    if (this.effects.confetti) {
                        this.createConfettiStorm();
                    }
                    break;
                case 'lasers':
                    if (this.effects.lasers) {
                        this.startLaserShow();
                    }
                    break;
            }
        }
        
        stopMusic() {
            if (this.music.melody) clearInterval(this.music.melody);
            if (this.music.bass) clearInterval(this.music.bass);
            if (this.music.drums) clearInterval(this.music.drums);
        }
        
        startLaserShow() {
            // Create laser beams
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.createLaserBeam();
                }, i * 200);
            }
        }
        
        createLaserBeam() {
            const startX = Math.random() * this.canvas.width;
            const startY = 0;
            const endX = Math.random() * this.canvas.width;
            const endY = this.canvas.height;
            
            const laser = {
                x1: startX,
                y1: startY,
                x2: endX,
                y2: endY,
                width: 3,
                color: this.getRandomColor(),
                life: 30,
                type: 'laser'
            };
            
            this.laserParticles.push(laser);
            
            // Create particles along laser
            for (let i = 0; i < 20; i++) {
                const t = i / 20;
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t;
                
                const particle = {
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: 2 + Math.random() * 3,
                    color: laser.color,
                    life: 50,
                    type: 'laser-particle'
                };
                
                this.particles.push(particle);
            }
        }
        
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        animate() {
            requestAnimationFrame(() => this.animate());
            
            if (!this.isActive) return;
            
            // Clear canvas with fade effect
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and draw particles
            this.updateParticles();
            this.drawParticles();
            
            // Update and draw confetti
            this.updateConfetti();
            this.drawConfetti();
            
            // Update and draw lasers
            this.updateLasers();
            this.drawLasers();
        }
        
        updateParticles() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                
                // Update based on type
                switch(p.type) {
                    case 'firework':
                        if (p.phase === 'launch') {
                            p.x += p.vx;
                            p.y += p.vy;
                            p.life--;
                            
                            if (p.y <= p.targetY) {
                                this.explodeFirework(p.x, p.y, p.explosionType);
                                this.particles.splice(i, 1);
                            }
                        } else {
                            p.x += p.vx;
                            p.y += p.vy;
                            p.vy += 0.05; // gravity
                            p.life--;
                            p.rotation += p.rotationSpeed || 0;
                        }
                        break;
                        
                    case 'tunnel':
                        p.z -= p.speed;
                        if (p.z < 0) {
                            p.z = 1000;
                            p.x = this.canvas.width / 2 + (Math.random() - 0.5) * 100;
                            p.y = this.canvas.height / 2 + (Math.random() - 0.5) * 100;
                        }
                        break;
                        
                    default:
                        p.x += p.vx;
                        p.y += p.vy;
                        p.life--;
                        if (p.rotationSpeed) p.rotation += p.rotationSpeed;
                }
                
                // Remove dead particles
                if (p.life <= 0 || 
                    p.x < -100 || p.x > this.canvas.width + 100 ||
                    p.y < -100 || p.y > this.canvas.height + 100) {
                    this.particles.splice(i, 1);
                }
            }
        }
        
        drawParticles() {
            this.particles.forEach(p => {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                
                if (p.rotation) {
                    this.ctx.rotate(p.rotation);
                }
                
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = Math.min(p.life / 100, 1);
                
                switch(p.shape) {
                    case 'heart':
                        this.drawHeart(0, 0, p.size);
                        break;
                    case 'star':
                        this.drawStar(0, 0, p.size);
                        break;
                    case 'rect':
                        this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                        break;
                    default:
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                        this.ctx.fill();
                }
                
                this.ctx.restore();
            });
        }
        
        drawHeart(x, y, size) {
            this.ctx.beginPath();
            const topCurveHeight = size * 0.3;
            this.ctx.moveTo(x, y + topCurveHeight);
            // top left curve
            this.ctx.bezierCurveTo(
                x, y, 
                x - size/2, y, 
                x - size/2, y + size/3
            );
            // bottom left curve
            this.ctx.bezierCurveTo(
                x - size/2, y + size * 0.7,
                x, y + size,
                x, y + size * 0.9
            );
            // bottom right curve
            this.ctx.bezierCurveTo(
                x, y + size,
                x + size/2, y + size * 0.7,
                x + size/2, y + size/3
            );
            // top right curve
            this.ctx.bezierCurveTo(
                x + size/2, y,
                x, y,
                x, y + topCurveHeight
            );
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        drawStar(x, y, size) {
            this.ctx.beginPath();
            const spikes = 5;
            const outerRadius = size/2;
            const innerRadius = size/4;
            
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = Math.PI / spikes * i;
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        updateConfetti() {
            for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
                const c = this.confettiParticles[i];
                
                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.05; // gravity
                c.life--;
                c.rotation += c.rotationSpeed;
                c.x += Math.sin(c.life * 0.1) * c.wobble;
                
                if (c.life <= 0 || c.y > this.canvas.height + 50) {
                    this.confettiParticles.splice(i, 1);
                }
            }
        }
        
        drawConfetti() {
            this.confettiParticles.forEach(c => {
                this.ctx.save();
                this.ctx.translate(c.x, c.y);
                this.ctx.rotate(c.rotation);
                this.ctx.fillStyle = c.color;
                this.ctx.globalAlpha = Math.min(c.life / 100, 1);
                
                if (c.shape === 'rect') {
                    this.ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, c.size/2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                this.ctx.restore();
            });
        }
        
        updateLasers() {
            for (let i = this.laserParticles.length - 1; i >= 0; i--) {
                const l = this.laserParticles[i];
                l.life--;
                
                if (l.life <= 0) {
                    this.laserParticles.splice(i, 1);
                }
            }
        }
        
        drawLasers() {
            this.laserParticles.forEach(l => {
                this.ctx.save();
                this.ctx.strokeStyle = l.color;
                this.ctx.lineWidth = l.width;
                this.ctx.globalAlpha = l.life / 30;
                this.ctx.beginPath();
                this.ctx.moveTo(l.x1, l.y1);
                this.ctx.lineTo(l.x2, l.y2);
                this.ctx.stroke();
                
                // Add glow effect
                this.ctx.shadowColor = l.color;
                this.ctx.shadowBlur = 20;
                this.ctx.stroke();
                this.ctx.restore();
            });
        }
        
        getRandomColor() {
            const colors = [
                '#FF4081', '#E91E63', '#F50057', '#FF0066',
                '#4CAF50', '#2E7D32', '#00C853', '#64DD17',
                '#2196F3', '#1565C0', '#2979FF', '#2962FF',
                '#FF9800', '#F57C00', '#FF9100', '#FF6D00',
                '#9C27B0', '#7B1FA2', '#AA00FF', '#6200EA'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        shareCelebration() {
            if (navigator.share) {
                navigator.share({
                    title: '🎉 Doadwi Said YES! Ultimate Celebration!',
                    text: 'Doadwi just said YES to the most amazing Valentine celebration! Check it out!',
                    url: window.location.href
                });
            } else {
                alert('Celebration shared!\n\nDoadwi\'s Love Level: 100%\nAchievements: All Unlocked!\n\nShare the love! ❤️');
            }
        }
        
        close() {
            this.isActive = false;
            this.stopMusic();
            document.getElementById('celebration-system').style.display = 'none';
            
            // Clear all particles
            this.particles = [];
            this.confettiParticles = [];
            this.laserParticles = [];
            
            // Clear intervals
            if (this.autoAdvance) {
                clearTimeout(this.autoAdvance);
            }
        }
    }

    // Initialize celebration system
    let ultimateCelebration;

    function startCelebration() {
        if (!ultimateCelebration) {
            ultimateCelebration = new UltimateCelebration();
        }
        
        // Update metrics
        state.loveLevel = 100;
        updateLoveMeter();
        elements.loveCounter.textContent = "∞";
        
        // Disable NO button
        elements.noBtn.disabled = true;
        elements.noBtn.style.opacity = '0.5';
        
        // Start the ultimate celebration
        ultimateCelebration.start();
        
        // Add celebration message
        addMessage("🎉 ULTIMATE CELEBRATION ACTIVATED! DOADWI SAID YES!", true);
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
        addMessage("❤️ Heart clicked! Love for Doadwi increased!", false);
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
            addMessage(`You: ${message}`, true);
            elements.loveMessage.value = '';
            
            // Add auto-response
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

    function shareCelebration() {
        if (navigator.share) {
            navigator.share({
                title: 'For Doadwi: I Said YES to Love! ❤️',
                text: 'Check out this amazing interactive Valentine website made for Doadwi!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(`${window.location.href}\n\nMade for Doadwi: I said YES to love! ❤️ Check out this amazing Valentine website!`);
            alert('Link copied to clipboard! Share it with Doadwi! 💕');
        }
    }

    function resetExperience() {
        if (confirm("Are you sure you want to restart the experience for Doadwi?")) {
            if (ultimateCelebration) {
                ultimateCelebration.close();
            }
            
            // Reset state
            state.loveLevel = 0;
            state.escapeAttempts = 0;
            state.reactionTimes = [];
            state.isCelebrating = false;
            state.startTime = Date.now();
            state.messages = [];
            
            // Reset UI
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
            addMessage("🔄 Experience has been reset! Let's create new memories with Doadwi!", false);
        }
    }

    // Add window resize and keyboard event listeners for celebration
    window.addEventListener('resize', () => {
        if (ultimateCelebration) {
            ultimateCelebration.resizeCanvas();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!ultimateCelebration || !ultimateCelebration.isActive) return;
        
        switch(e.key) {
            case 'ArrowRight':
                ultimateCelebration.nextStage();
                break;
            case 'ArrowLeft':
                ultimateCelebration.prevStage();
                break;
            case 'Escape':
                ultimateCelebration.close();
                break;
            case ' ':
                // Space bar triggers extra effects
                if (ultimateCelebration.effects.confetti) {
                    ultimateCelebration.createConfettiStorm();
                }
                break;
        }
    });

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
        addMessage("Welcome to your personalized Valentine experience for Doadwi! ❤️", false);
        addMessage("Click the heart, try to catch the NO button, and enjoy the magic made for Doadwi!", false);
    }, 1000);
});
