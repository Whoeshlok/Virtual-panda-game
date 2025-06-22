class VirtualPet {
    constructor() {
        this.hunger = 100;
        this.happiness = 100;
        this.energy = 100;
        this.name = "Your Pet";
        this.isSleeping = false;
        this.zzzInterval = null; // Add interval reference
        this.initializeElements();
        this.setupEventListeners();
        this.startHungerTimer();
        this.updateStats(); // Initial update
    }

    initializeElements() {
        this.petImage = document.querySelector('.panda');
        this.petHearts = document.querySelector('.pet-hearts');
        this.petZzz = document.querySelector('.pet-zzz');
        this.petBall = document.querySelector('.pet-ball');
        this.petNameInput = document.getElementById('petNameInput');
        this.setNameBtn = document.getElementById('setNameBtn');
        this.petNameDisplay = document.getElementById('petNameDisplay');
        this.hungerBar = document.getElementById('hungerBar');
        this.happinessBar = document.getElementById('happinessBar');
        this.energyBar = document.getElementById('energyBar');
        this.feedBtn = document.getElementById('feedBtn');
        this.playBtn = document.getElementById('playBtn');
        this.sleepBtn = document.getElementById('sleepBtn');
        this.moodIndicator = document.getElementById('moodIndicator');
        this.lastMood = '';
    }

    setupEventListeners() {
        this.setNameBtn.addEventListener('click', () => this.setName());
        this.petNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.setName();
        });
        this.feedBtn.addEventListener('click', () => this.feed());
        this.playBtn.addEventListener('click', () => this.play());
        this.sleepBtn.addEventListener('click', () => this.sleep());
    }

    setName() {
        const newName = this.petNameInput.value.trim();
        if (newName) {
            this.name = newName;
            this.petNameDisplay.textContent = this.name;
            this.petNameInput.value = '';
        }
    }

    updateStats() {
        this.setBar(this.hungerBar, this.hunger);
        this.setBar(this.happinessBar, this.happiness);
        this.setBar(this.energyBar, this.energy);
        this.updateMood();
    }

    setBar(bar, value) {
        bar.style.width = `${value}%`;
        bar.classList.remove('low', 'medium');
        if (value < 30) {
            bar.classList.add('low');
        } else if (value < 70) {
            bar.classList.add('medium');
        }
    }

    updateMood() {
        if (this.petImage) {
            this.petImage.classList.remove('happy', 'sad', 'sleeping', 'normal');
        }
        let mood = '';
        let color = '';
        if (this.isSleeping) {
            if (this.petImage) this.petImage.classList.add('sleeping');
            mood = 'Sleeping';
            color = '#888';
        } else if (this.hunger < 30 || this.happiness < 30) {
            if (this.petImage) this.petImage.classList.add('sad');
            mood = 'Sad';
            color = 'var(--danger)';
        } else if (this.hunger > 70 && this.happiness > 70) {
            if (this.petImage) this.petImage.classList.add('happy');
            mood = 'Happy';
            color = 'var(--success)';
        } else {
            if (this.petImage) this.petImage.classList.add('normal');
            mood = 'Normal';
            color = 'var(--primary-dark)';
        }
        // Floating hearts when happy
        if (mood === 'Happy' && this.lastMood !== 'Happy') {
            this.showHearts();
        }
        // Zzz when sleeping
        if (this.petZzz) {
            if (mood === 'Sleeping' && !this.petZzz.querySelector('.floating-zzz')) {
                this.petZzz.textContent = 'Zzz';
            } else if (mood !== 'Sleeping') {
                this.petZzz.textContent = '';
            }
        }
        this.lastMood = mood;
        if (this.moodIndicator) {
            this.moodIndicator.textContent = `Mood: ${mood}`;
            this.moodIndicator.style.color = color;
        }
    }

    showHearts() {
        if (!this.petHearts) return;
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
            heart.style.animationDelay = `${i * 0.18 + Math.random() * 0.1}s`;
            this.petHearts.appendChild(heart);
            setTimeout(() => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            }, 1400);
        }
    }

    feed() {
        if (this.isSleeping) return;

        // Panda bounce (optional, can be removed if not needed)
        this.petImage.classList.add('eating');
        setTimeout(() => {
            this.petImage.classList.remove('eating');
        }, 600);

        // Mouth chewing animation
        const mouth = this.petImage.querySelector('.mouth');
        if (mouth) {
            mouth.classList.add('chewing');
            setTimeout(() => {
                mouth.classList.remove('chewing');
            }, 600);
        }
        
        this.hunger = Math.min(100, this.hunger + 30);
        this.energy = Math.max(0, this.energy - 10);
        this.updateStats();
    }

    play() {
        if (this.isSleeping) return;
        this.happiness = Math.min(100, this.happiness + 30);
        this.energy = Math.max(0, this.energy - 20);
        this.hunger = Math.max(0, this.hunger - 10);
        this.showBall();
        this.updateStats();
    }

    showBall() {
        if (!this.petBall) return;
        const ball = document.createElement('div');
        ball.className = 'floating-ball';
        this.petBall.appendChild(ball);
        setTimeout(() => {
            if (ball.parentNode) ball.parentNode.removeChild(ball);
        }, 1200);
    }

    showZzz() {
        if (!this.petZzz) return;
        // Add a floating Z (do not clear previous Z's)
        const zzz = document.createElement('div');
        zzz.className = 'floating-zzz';
        zzz.textContent = 'Z';
        zzz.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
        zzz.style.animationDelay = `0s`;
        this.petZzz.appendChild(zzz);
        setTimeout(() => {
            if (zzz.parentNode) zzz.parentNode.removeChild(zzz);
        }, 1600);
    }

    sleep() {
        this.isSleeping = !this.isSleeping;
        this.sleepBtn.textContent = this.isSleeping ? '⏰ Wake Up' : '💤 Sleep';
        if (this.isSleeping) {
            this.petImage.classList.add('sleeping');
            this.energy = 100;
            this.happiness = Math.max(0, this.happiness - 10);
            // Start spawning Z's repeatedly
            if (this.zzzInterval) clearInterval(this.zzzInterval);
            this.zzzInterval = setInterval(() => this.showZzz(), 500);
        } else {
            this.petImage.classList.remove('sleeping');
            if (this.petZzz) this.petZzz.innerHTML = '';
            // Stop spawning Z's
            if (this.zzzInterval) clearInterval(this.zzzInterval);
            this.zzzInterval = null;
        }
        this.updateStats();
    }

    startHungerTimer() {
        setInterval(() => {
            if (!this.isSleeping) {
                this.hunger = Math.max(0, this.hunger - 1);
                this.happiness = Math.max(0, this.happiness - 0.5);
                this.energy = Math.max(0, this.energy - 0.5);
                this.updateStats();
            }
        }, 5000);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new VirtualPet();
}); 