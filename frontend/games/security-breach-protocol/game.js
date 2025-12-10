// Game State
let gameState = {
    score: 100,
    currentScenario: 0,
    scenarioHistory: [],
    isGameOver: false
};

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Branching Scenarios
const scenarios = [
    {
        id: 0,
        title: "Suspicious Email Detected",
        description: "You receive an urgent email from what appears to be your company's IT department requesting you to verify your credentials immediately. The email contains a link and mentions 'unusual activity' on your account.",
        icon: "fa-solid fa-envelope-open-text",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        choices: [
            {
                text: "Click the link and enter your credentials to verify",
                correct: false,
                impact: -30,
                feedback: "❌ Critical Error! This was a phishing attempt. Never click suspicious links or provide credentials via email. Always verify through official channels.",
                nextScenario: 1
            },
            {
                text: "Contact IT department directly to verify the email",
                correct: true,
                impact: 10,
                feedback: "✅ Excellent decision! You've identified a potential phishing attempt and followed proper protocol. The IT department confirms this was a scam.",
                nextScenario: 2
            },
            {
                text: "Delete the email and ignore it",
                correct: false,
                impact: -10,
                feedback: "⚠️ Partially correct. While you avoided the trap, you should report suspicious emails to help protect your organization and colleagues.",
                nextScenario: 3
            }
        ]
    },
    {
        id: 1,
        title: "System Compromised",
        description: "Your credentials have been stolen! The attacker is now accessing sensitive company data. Security alerts are flooding your system. You need to act quickly to minimize damage.",
        icon: "fa-solid fa-triangle-exclamation",
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        choices: [
            {
                text: "Immediately disconnect from the network and alert security team",
                correct: true,
                impact: 15,
                feedback: "✅ Smart quick thinking! Disconnecting limits the breach. The security team can now contain the damage and investigate.",
                nextScenario: 4
            },
            {
                text: "Try to change your password first",
                correct: false,
                impact: -20,
                feedback: "❌ Too slow! The attacker already changed your password. They've accessed confidential files. Immediate isolation should be the priority.",
                nextScenario: 5
            },
            {
                text: "Continue working and monitor what happens",
                correct: false,
                impact: -25,
                feedback: "❌ Critical mistake! The breach spreads to other systems. Always respond immediately to security incidents.",
                nextScenario: 5
            }
        ]
    },
    {
        id: 2,
        title: "USB Drive Found",
        description: "You find a USB drive in the parking lot labeled 'Confidential Salaries 2025'. Your curiosity is piqued, and you have access to a computer nearby.",
        icon: "fa-brands fa-usb",
        background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
        choices: [
            {
                text: "Plug it into your work computer to see what's on it",
                correct: false,
                impact: -25,
                feedback: "❌ Dangerous move! USB drives found in public are often infected with malware. This one contained ransomware that's now encrypting company files.",
                nextScenario: 6
            },
            {
                text: "Turn it in to security/IT department immediately",
                correct: true,
                impact: 10,
                feedback: "✅ Perfect protocol! Unknown USB drives are common attack vectors. IT confirms it contained malware. You prevented a major breach!",
                nextScenario: 7
            },
            {
                text: "Throw it away and continue with your day",
                correct: false,
                impact: -5,
                feedback: "⚠️ Better than plugging it in, but you should report found devices. Someone else might plug it in, or it could be evidence.",
                nextScenario: 3
            }
        ]
    },
    {
        id: 3,
        title: "Weak Password Alert",
        description: "A security audit reveals that many employees use weak passwords. As a team member, you notice your password 'Password123!' has been flagged. The system requires an update.",
        icon: "fa-solid fa-key",
        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        choices: [
            {
                text: "Create a strong password using a passphrase and enable 2FA",
                correct: true,
                impact: 15,
                feedback: "✅ Excellent security practice! Strong passwords with 2FA significantly reduce the risk of account compromise. You're setting a great example!",
                nextScenario: 7
            },
            {
                text: "Change it to 'Password124!' and move on",
                correct: false,
                impact: -15,
                feedback: "❌ Poor choice! This is still a weak password. It can be cracked in seconds. Use complex passwords with mixed characters.",
                nextScenario: 8
            },
            {
                text: "Use a password manager to generate and store a strong password",
                correct: true,
                impact: 15,
                feedback: "✅ Outstanding! Password managers are highly recommended. You've created a unique, strong password and enabled secure storage.",
                nextScenario: 7
            }
        ]
    },
    {
        id: 4,
        title: "Incident Response Success",
        description: "Thanks to your quick action, the security team contained the breach. They're now implementing additional security measures and want your input on preventing future incidents.",
        icon: "fa-solid fa-shield-halved",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        choices: [
            {
                text: "Recommend mandatory security awareness training for all staff",
                correct: true,
                impact: 10,
                feedback: "✅ Proactive thinking! Human error is the weakest link. Regular training significantly reduces security risks.",
                nextScenario: 9
            },
            {
                text: "Suggest implementing multi-factor authentication company-wide",
                correct: true,
                impact: 10,
                feedback: "✅ Excellent recommendation! MFA adds a crucial security layer that would have prevented the credential theft.",
                nextScenario: 9
            },
            {
                text: "Recommend nothing - the breach is contained",
                correct: false,
                impact: -5,
                feedback: "⚠️ Missed opportunity! Security is an ongoing process. Organizations must continuously improve defenses.",
                nextScenario: 9
            }
        ]
    },
    {
        id: 5,
        title: "Data Breach Escalation",
        description: "The breach has spread. Customer data has been compromised, and the company faces potential legal consequences. A crisis management meeting is called.",
        icon: "fa-solid fa-burst",
        background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
        choices: [
            {
                text: "Support transparent communication with affected customers",
                correct: true,
                impact: 10,
                feedback: "✅ Responsible approach! Transparency builds trust and is legally required. You're helping the company handle this ethically.",
                nextScenario: 9
            },
            {
                text: "Suggest hiding the breach to avoid negative publicity",
                correct: false,
                impact: -20,
                feedback: "❌ Illegal and unethical! Hiding breaches violates data protection laws and destroys customer trust permanently.",
                nextScenario: 9
            }
        ]
    },
    {
        id: 6,
        title: "Ransomware Attack",
        description: "The USB drive infected the network with ransomware! Files are being encrypted, and a ransom demand appears: 50 Bitcoin to decrypt your data. The clock is ticking.",
        icon: "fa-solid fa-skull-crossbones",
        background: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)",
        choices: [
            {
                text: "Pay the ransom to get files back quickly",
                correct: false,
                impact: -20,
                feedback: "❌ Bad decision! Paying ransoms funds criminals and doesn't guarantee data recovery. Often leads to repeat attacks.",
                nextScenario: 9
            },
            {
                text: "Activate incident response plan, isolate systems, and restore from backups",
                correct: true,
                impact: 15,
                feedback: "✅ Professional response! This is why organizations maintain backups. You're following industry best practices for ransomware recovery.",
                nextScenario: 9
            }
        ]
    },
    {
        id: 7,
        title: "Social Engineering Attempt",
        description: "You receive a phone call from someone claiming to be from technical support. They say your computer has a virus and they need remote access to fix it.",
        icon: "fa-solid fa-phone-volume",
        background: "linear-gradient(135deg, #334155 0%, #475569 100%)",
        choices: [
            {
                text: "Give them remote access to fix the 'virus'",
                correct: false,
                impact: -25,
                feedback: "❌ Classic scam! Legitimate tech support never cold-calls requesting remote access. Your system is now compromised.",
                nextScenario: 5
            },
            {
                text: "Hang up and report the call to IT security",
                correct: true,
                impact: 10,
                feedback: "✅ Perfect response! You recognized social engineering. IT confirms this is a known scam targeting employees.",
                nextScenario: 8
            },
            {
                text: "Ask for verification and their company details",
                correct: true,
                impact: 10,
                feedback: "✅ Good critical thinking! When asked for verification, they hang up. You've avoided a social engineering attack.",
                nextScenario: 8
            }
        ]
    },
    {
        id: 8,
        title: "Public Wi-Fi Dilemma",
        description: "You're working from a coffee shop and need to access company files. The free Wi-Fi network 'CoffeeShop_Guest' is available, but it's unsecured.",
        icon: "fa-solid fa-wifi",
        background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
        choices: [
            {
                text: "Connect directly and access company systems",
                correct: false,
                impact: -15,
                feedback: "❌ Risky behavior! Unsecured public Wi-Fi allows attackers to intercept data. Your login credentials may have been captured.",
                nextScenario: 9
            },
            {
                text: "Use company VPN before accessing any work resources",
                correct: true,
                impact: 10,
                feedback: "✅ Secure practice! VPNs encrypt your connection, protecting data even on untrusted networks. Well done!",
                nextScenario: 9
            },
            {
                text: "Use your phone's hotspot instead",
                correct: true,
                impact: 10,
                feedback: "✅ Smart alternative! Mobile hotspots are more secure than public Wi-Fi. You're prioritizing security over convenience.",
                nextScenario: 9
            }
        ]
    },
    {
        id: 9,
        title: "Final Security Assessment",
        description: "You've navigated various security challenges. The final test: A colleague asks for your password to access a shared project while you're on vacation.",
        icon: "fa-solid fa-bullseye",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        choices: [
            {
                text: "Share your password - they need it for work",
                correct: false,
                impact: -20,
                feedback: "❌ Major policy violation! Never share passwords. This creates accountability issues and security risks.",
                nextScenario: null
            },
            {
                text: "Refuse and set up proper access permissions instead",
                correct: true,
                impact: 15,
                feedback: "✅ Perfect! You understand the importance of access controls and accountability. This is professional security practice!",
                nextScenario: null
            },
            {
                text: "Give temporary access through proper delegation features",
                correct: true,
                impact: 15,
                feedback: "✅ Excellent solution! Delegation features maintain security while enabling collaboration. You're a security champion!",
                nextScenario: null
            }
        ]
    }
];

// Canvas animation variables
let particles = [];
let animationFrame;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(249, 115, 22, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

// Draw network connections
function drawConnections() {
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Draw scenario info on canvas
function drawScenarioOnCanvas() {
    const scenario = scenarios[gameState.currentScenario];
    
    // Clear canvas
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animate particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawConnections();

    // Draw scenario number
    ctx.font = 'bold 16px "Press Start 2P", monospace';
    ctx.fillStyle = '#f97316';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    ctx.fillText(`Scenario ${gameState.currentScenario + 1} of ${scenarios.length}`, canvas.width / 2, canvas.height - 40);
    
    // Draw title text in center
    ctx.font = 'bold 20px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f97316';
    
    // Word wrap the title
    const words = scenario.title.split(' ');
    let line = '';
    let y = canvas.height / 2 - 20;
    
    words.forEach((word, i) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 100 && i > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = word + ' ';
            y += 30;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, canvas.width / 2, y);
    ctx.shadowBlur = 0;
}

// Animate canvas
function animate() {
    drawScenarioOnCanvas();
    animationFrame = requestAnimationFrame(animate);
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('scenario-count').textContent = gameState.currentScenario + 1;
}

// Display scenario
function displayScenario(scenarioId) {
    const scenario = scenarios[scenarioId];
    
    // Update scenario image with Font Awesome icon
    const scenarioImage = document.getElementById('scenarioImage');
    scenarioImage.style.background = scenario.background;
    scenarioImage.innerHTML = `<i class="${scenario.icon}"></i>`;

    document.getElementById('scenarioTitle').textContent = scenario.title;
    document.getElementById('scenarioDescription').textContent = scenario.description;

    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    scenario.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => makeChoice(choice, button);
        choicesContainer.appendChild(button);
    });

    // Hide feedback
    const feedbackPanel = document.getElementById('feedbackPanel');
    feedbackPanel.classList.remove('show', 'success', 'error', 'warning');

    drawScenarioOnCanvas();
}

// Handle choice selection
function makeChoice(choice, button) {
    // Disable all choice buttons
    const allButtons = document.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => btn.classList.add('disabled'));

    // Update button appearance
    if (choice.correct) {
        button.classList.add('correct');
    } else {
        button.classList.add('incorrect');
    }

    // Update score
    gameState.score = Math.max(0, Math.min(100, gameState.score + choice.impact));
    updateUI();

    // Show feedback
    const feedbackPanel = document.getElementById('feedbackPanel');
    feedbackPanel.innerHTML = `
        <h3>${choice.correct ? 'Correct!' : 'Incorrect!'}</h3>
        <p>${choice.feedback}</p>
        <button class="btn-next" onclick="nextScenario(${choice.nextScenario})">Continue →</button>
    `;
    
    if (choice.correct) {
        feedbackPanel.classList.add('success');
    } else if (choice.impact < -15) {
        feedbackPanel.classList.add('error');
    } else {
        feedbackPanel.classList.add('warning');
    }
    
    feedbackPanel.classList.add('show');

    // Record choice in history
    gameState.scenarioHistory.push({
        scenarioId: gameState.currentScenario,
        choice: choice.text,
        correct: choice.correct,
        impact: choice.impact
    });
}

// Move to next scenario
function nextScenario(nextScenarioId) {
    if (nextScenarioId === null || gameState.score <= 0) {
        endGame();
        return;
    }

    gameState.currentScenario = nextScenarioId;
    displayScenario(nextScenarioId);
}

// End game
function endGame() {
    gameState.isGameOver = true;
    
    const gameOverDiv = document.getElementById('gameOver');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const finalScore = document.getElementById('finalScore');

    finalScore.textContent = gameState.score;

    if (gameState.score >= 90) {
        gameOverTitle.textContent = '🏆 Security Expert!';
        gameOverMessage.textContent = 'Outstanding performance! You demonstrated exceptional cybersecurity awareness and made consistently excellent decisions. You\'re a true security champion!';
    } else if (gameState.score >= 70) {
        gameOverTitle.textContent = '🎖️ Security Professional';
        gameOverMessage.textContent = 'Great job! You showed strong security knowledge and handled most situations well. Keep up the good practices!';
    } else if (gameState.score >= 50) {
        gameOverTitle.textContent = '📚 Security Learner';
        gameOverMessage.textContent = 'Good effort! You made some good decisions but there\'s room for improvement. Review the feedback to strengthen your security awareness.';
    } else if (gameState.score > 0) {
        gameOverTitle.textContent = '⚠️ Security Risk';
        gameOverMessage.textContent = 'Several critical mistakes were made. Cybersecurity awareness training is recommended. Review each scenario carefully!';
    } else {
        gameOverTitle.textContent = '🚨 Security Breach!';
        gameOverMessage.textContent = 'Critical security failures occurred! Your organization has been seriously compromised. Immediate training required!';
    }

    gameOverDiv.style.display = 'flex';
}

// Restart game
function restartGame() {
    gameState = {
        score: 100,
        currentScenario: 0,
        scenarioHistory: [],
        isGameOver: false
    };

    document.getElementById('gameOver').style.display = 'none';
    updateUI();
    displayScenario(0);
}

// Initialize game
function initGame() {
    initParticles();
    updateUI();
    displayScenario(0);
    animate();
}

// Start game when page loads
window.addEventListener('load', initGame);

// Handle window resize
window.addEventListener('resize', () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    initParticles();
});
