// Intrusion Intercept - Canvas-Based Cybersecurity Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game State
let gameState = {
    score: 100,
    currentScenario: 0,
    isGameOver: false,
    gameStarted: false,
    showingChoice: false,
    showingFeedback: false,
    scenarioHistory: [],
    currentTopic: null,
    currentScenarios: [],
    timeRemaining: 20,
    timerInterval: null,
    lastChoice: null,
    glitchEnabled: false
};

// Audio files
let backgroundMusic = null;
let correctSound = null;
let wrongSound = null;
let gameOverSound = null;

// Initialize audio elements
function initAudio() {
    if (!backgroundMusic) {
        backgroundMusic = new Audio('sounds/roblox-minecraft-fortnite-video-game-music-358426.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
        
        correctSound = new Audio('sounds/game-bonus-144751.mp3');
        correctSound.volume = 0.5;
        
        wrongSound = new Audio('sounds/wrong-47985.mp3');
        wrongSound.volume = 0.5;
        
        gameOverSound = new Audio('sounds/game-over-39-199830.mp3');
        gameOverSound.volume = 0.6;
        
        console.log('Audio files initialized');
    }
}

// Play background music
function playBackgroundMusic() {
    initAudio();
    
    if (backgroundMusic && !backgroundMusic.paused) return;
    
    backgroundMusic.play().catch(err => {
        console.log('Background music autoplay blocked:', err);
    });
    
    console.log('Background music started');
}

// Stop background music
function stopBackgroundMusic() {
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        console.log('Background music stopped');
    }
}

// Play countdown beep sound
function playBeep() {
    if (wrongSound) {
        const beep = wrongSound.cloneNode();
        beep.volume = 0.3;
        beep.playbackRate = 1.5;
        beep.play().catch(() => {});
    }
}

// Click sound effect
function playClickSound() {
    if (correctSound) {
        const click = correctSound.cloneNode();
        click.volume = 0.15;
        click.playbackRate = 3.0;
        click.play().catch(() => {});
    }
}

// Correct answer sound effect
function playCorrectSound() {
    if (correctSound) {
        correctSound.currentTime = 0;
        correctSound.play().catch(err => console.log('Correct sound error:', err));
    }
}

// Incorrect answer sound effect
function playIncorrectSound() {
    if (wrongSound) {
        wrongSound.currentTime = 0;
        wrongSound.play().catch(err => console.log('Wrong sound error:', err));
    }
}

// Game over sound effect
function playGameOverSound() {
    if (gameOverSound) {
        gameOverSound.currentTime = 0;
        gameOverSound.play().catch(err => console.log('Game over sound error:', err));
    }
}

// Victory sound effect
function playVictorySound() {
    if (correctSound) {
        const victory = correctSound.cloneNode();
        victory.volume = 0.7;
        victory.playbackRate = 0.8;
        victory.play().catch(err => console.log('Victory sound error:', err));
    }
}

// Network particles for background animation
const networkParticles = [];
const particleCount = 80;
const connectionDistance = 150;
const particleSpeed = 0.3;

// Initialize network particles
function initNetworkParticles() {
    networkParticles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        networkParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * particleSpeed,
            vy: (Math.random() - 0.5) * particleSpeed,
            radius: Math.random() * 2 + 1
        });
    }
}

// Update and draw network background
function drawNetworkBackground() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    networkParticles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f97316';
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < networkParticles.length; j++) {
            const dx = networkParticles[j].x - particle.x;
            const dy = networkParticles[j].y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.5;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(networkParticles[j].x, networkParticles[j].y);
                ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    });
}

// Scenario overlay animation
let scenarioOverlay = {
    show: false,
    text: '',
    subtitle: '',
    alpha: 0,
    startTime: 0
};

function showScenarioOverlay(text, subtitle, enableGlitch = false) {
    scenarioOverlay.show = true;
    scenarioOverlay.text = text;
    scenarioOverlay.subtitle = subtitle;
    scenarioOverlay.alpha = 0;
    scenarioOverlay.startTime = Date.now();
    gameState.glitchEnabled = enableGlitch;
}

function drawScenarioOverlay() {
    if (!scenarioOverlay.show) return;
    
    const elapsed = Date.now() - scenarioOverlay.startTime;
    const duration = 2500;
    
    if (elapsed < 300) {
        scenarioOverlay.alpha = elapsed / 300;
    } else if (elapsed > duration - 300) {
        scenarioOverlay.alpha = (duration - elapsed) / 300;
    } else {
        scenarioOverlay.alpha = 1;
    }
    
    if (elapsed >= duration) {
        scenarioOverlay.show = false;
        return;
    }
    
    const pulse = 0.9 + Math.sin(elapsed / 200) * 0.1;
    
    ctx.save();
    ctx.globalAlpha = scenarioOverlay.alpha;
    
    // Glitch effect (only if enabled)
    const glitchIntensity = gameState.glitchEnabled ? Math.sin(elapsed / 100) * 2 : 0;
    
    ctx.font = 'bold 32px "Press Start 2P"';
    ctx.textAlign = 'center';
    
    const words = scenarioOverlay.text.split(' ');
    let line = '';
    let y = canvas.height / 2 - 40;
    const maxWidth = canvas.width - 100;
    const lines = [];
    
    words.forEach((word, i) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            lines.push({ text: line.trim(), y: y });
            line = word + ' ';
            y += 45;
        } else {
            line = testLine;
        }
    });
    if (line.trim()) {
        lines.push({ text: line.trim(), y: y });
    }
    
    // Draw glitch layers (only if enabled)
    lines.forEach(lineData => {
        if (gameState.glitchEnabled) {
            ctx.fillStyle = '#ff0000';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff0000';
            ctx.fillText(lineData.text, canvas.width / 2 - glitchIntensity - 2, lineData.y);
            
            ctx.fillStyle = '#00ff00';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff00';
            ctx.fillText(lineData.text, canvas.width / 2 + glitchIntensity + 2, lineData.y);
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20 * pulse;
        ctx.shadowColor = 'rgba(249, 115, 22, 0.8)';
        ctx.fillText(lineData.text, canvas.width / 2, lineData.y);
    });
    
    // Draw subtitle
    ctx.font = 'bold 16px "Press Start 2P"';
    ctx.fillStyle = '#f97316';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(249, 115, 22, 0.8)';
    const lastLine = lines[lines.length - 1];
    if (lastLine && scenarioOverlay.subtitle) {
        ctx.fillText(scenarioOverlay.subtitle, canvas.width / 2, lastLine.y + 35);
    }
    
    ctx.restore();
}

// Topics with scenarios - 6 topics, 10 scenarios each
const securityTopics = {
    "Phishing & Social Engineering": [
        { id: 0, title: "Suspicious Email", description: "You receive an urgent email from 'IT' requesting immediate credential verification through a provided link. The sender's address and urgent tone seem suspicious, but the login portal looks legitimate.", choices: [
            { text: "Click link and enter credentials", correct: false, impact: -30, feedback: "Critical Error! This was phishing. Never click suspicious links.", nextScenario: 1 },
            { text: "Contact IT department directly", correct: true, impact: 0, feedback: "Excellent! You identified phishing and verified properly.", nextScenario: 2 },
            { text: "Delete and ignore", correct: false, impact: -10, feedback: "Better, but report suspicious emails to protect others.", nextScenario: 3 }
        ]},
        { id: 1, title: "Account Breach", description: "Credentials stolen! An attacker is actively accessing your account and transferring company files. Security alerts show multiple suspicious activities happening right now.", choices: [
            { text: "Disconnect from network immediately", correct: true, impact: 0, feedback: "Smart! Isolation limits the breach.", nextScenario: 3 },
            { text: "Change password first", correct: false, impact: -20, feedback: "Too slow! Attacker changed it already.", nextScenario: 3 },
            { text: "Wait and monitor", correct: false, impact: -25, feedback: "Critical mistake! Breach spreads immediately.", nextScenario: 3 }
        ]},
        { id: 2, title: "Email Verification", description: "IT confirms the email was legitimate - they're conducting a security audit. Your proper verification procedure prevented a potential mistake.", choices: [
            { text: "Follow instructions safely", correct: true, impact: 0, feedback: "Good! Verification prevented a mistake.", nextScenario: 3 },
            { text: "Still ignore it", correct: false, impact: -5, feedback: "Unnecessary caution can slow work.", nextScenario: 3 },
            { text: "Forward to team", correct: false, impact: -10, feedback: "Could spread confusion. Confirm first.", nextScenario: 3 }
        ]},
        { id: 3, title: "USB Drive Found", description: "You find a USB drive in the parking lot labeled 'Confidential Salaries 2025'. It looks professional and you're curious about the contents.", choices: [
            { text: "Plug it in to check contents", correct: false, impact: -25, feedback: "Dangerous! USB contained ransomware.", nextScenario: 4 },
            { text: "Turn it to IT/security", correct: true, impact: 0, feedback: "Perfect! IT confirms it contained malware.", nextScenario: 5 },
            { text: "Throw it away", correct: false, impact: -5, feedback: "Better report it. Someone else might use it.", nextScenario: 4 }
        ]},
        { id: 4, title: "USB Malware Spread", description: "The USB drive contained malware now spreading rapidly across the network! Files are being encrypted and the infection is growing exponentially.", choices: [
            { text: "Isolate affected systems", correct: true, impact: 0, feedback: "Quick action prevents wider infection.", nextScenario: 6 },
            { text: "Try to remove it yourself", correct: false, impact: -15, feedback: "It spreads while you troubleshoot.", nextScenario: 6 },
            { text: "Restart computer", correct: false, impact: -20, feedback: "Malware persists and spreads further.", nextScenario: 6 }
        ]},
        { id: 5, title: "Threat Prevented", description: "IT confirms the USB contained sophisticated ransomware - you prevented a major breach! Now decide on proper follow-up actions.", choices: [
            { text: "Document the incident", correct: true, impact: 0, feedback: "Good practice for security tracking.", nextScenario: 6 },
            { text: "Just move on", correct: false, impact: 0, feedback: "Documentation helps prevent future incidents.", nextScenario: 6 },
            { text: "Email everyone", correct: false, impact: -5, feedback: "Report to security, not mass email.", nextScenario: 6 }
        ]},
        { id: 6, title: "Public WiFi", description: "Working from a coffee shop with an urgent deadline. The shop offers free unsecured WiFi, or you could use your phone's hotspot or company VPN.", choices: [
            { text: "Use open public WiFi", correct: false, impact: -20, feedback: "Bad choice! Credentials were intercepted.", nextScenario: 7 },
            { text: "Use company VPN", correct: true, impact: 0, feedback: "Excellent! Secure connection protects data.", nextScenario: 8 },
            { text: "Use phone hotspot", correct: false, impact: 5, feedback: "Safer than public WiFi but VPN is best.", nextScenario: 8 }
        ]},
        { id: 7, title: "WiFi Breach", description: "Your credentials were intercepted on the public WiFi! An attacker captured your login and is now accessing your account from multiple locations.", choices: [
            { text: "Change all passwords immediately", correct: true, impact: 0, feedback: "Quick response limits damage.", nextScenario: 9 },
            { text: "Log out and ignore", correct: false, impact: -15, feedback: "Attacker still has access!", nextScenario: 9 },
            { text: "Continue working", correct: false, impact: -25, feedback: "Severe mistake! Data breach continues.", nextScenario: 9 }
        ]},
        { id: 8, title: "Security Investigation", description: "Security is investigating the WiFi breach and needs your cooperation. Your detailed account of what happened is crucial for their analysis.", choices: [
            { text: "Provide detailed report", correct: true, impact: 0, feedback: "Great teamwork helps investigation.", nextScenario: 9 },
            { text: "Minimize involvement", correct: false, impact: -5, feedback: "Your input is valuable!", nextScenario: 9 },
            { text: "Hide your actions", correct: false, impact: -15, feedback: "Transparency is crucial in security.", nextScenario: 9 }
        ]},
        { id: 9, title: "Security Training", description: "Mandatory security awareness training is required after recent incidents. The program has required modules plus optional advanced sections.", choices: [
            { text: "Complete all modules", correct: true, impact: 0, feedback: "Excellent commitment to security!", nextScenario: null },
            { text: "Skip optional sections", correct: false, impact: -5, feedback: "Every section strengthens security awareness.", nextScenario: null },
            { text: "Rush through", correct: false, impact: -10, feedback: "Training requires attention to be effective.", nextScenario: null }
        ]}
    ],
    
    "Ransomware Defense": [
        { id: 0, title: "Files Encrypting", description: "Ransomware message on screen! Files are being encrypted with a 72-hour countdown demanding $5,000 in cryptocurrency.", choices: [
            { text: "Pay the ransom", correct: false, impact: -30, feedback: "Never pay! It funds criminals and doesn't guarantee recovery.", nextScenario: 1 },
            { text: "Restore from backup", correct: true, impact: 0, feedback: "Correct! Backups are the best defense.", nextScenario: 2 },
            { text: "Try to decrypt files", correct: false, impact: -10, feedback: "Without proper tools, this wastes time.", nextScenario: 1 }
        ]},
        { id: 1, title: "Ransom Failed", description: "Ransom paid but files still locked! The criminals disappeared without providing the decryption key.", choices: [
            { text: "Contact law enforcement", correct: true, impact: 0, feedback: "Good. Report cyber crimes.", nextScenario: 3 },
            { text: "Pay more money", correct: false, impact: -20, feedback: "They're exploiting you further!", nextScenario: 3 },
            { text: "Give up on files", correct: false, impact: -10, feedback: "Still need proper incident response.", nextScenario: 3 }
        ]},
        { id: 2, title: "Backup Recovery", description: "Files successfully restored from backup! Operations are resuming, but you need to find how the ransomware got in.", choices: [
            { text: "Analyze how ransomware entered", correct: true, impact: 0, feedback: "Critical to prevent future attacks.", nextScenario: 3 },
            { text: "Just continue working", correct: false, impact: -10, feedback: "Need to identify the vulnerability!", nextScenario: 3 },
            { text: "Blame IT department", correct: false, impact: -5, feedback: "Focus on solutions, not blame.", nextScenario: 3 }
        ]},
        { id: 3, title: "Suspicious Attachment", description: "Suspicious email from unknown sender about urgent invoice payment. The attachment is named 'Invoice_May2024.pdf.exe' with a double file extension.", choices: [
            { text: "Open to see what it is", correct: false, impact: -25, feedback: "Infected! Ransomware spreading.", nextScenario: 4 },
            { text: "Report to IT security", correct: true, impact: 0, feedback: "Perfect protocol! Threat neutralized.", nextScenario: 5 },
            { text: "Delete without reporting", correct: false, impact: -5, feedback: "Report threats to protect everyone.", nextScenario: 5 }
        ]},
        { id: 4, title: "System Lockdown", description: "System locked! Ransomware is actively encrypting files and spreading across the network to other systems.", choices: [
            { text: "Immediately disconnect network", correct: true, impact: 0, feedback: "Quick thinking! Contained the spread.", nextScenario: 6 },
            { text: "Try to remove it yourself", correct: false, impact: -15, feedback: "It spreads while you attempt removal.", nextScenario: 6 },
            { text: "Shut down computer", correct: false, impact: -10, feedback: "Disconnecting network is better first step.", nextScenario: 6 }
        ]},
        { id: 5, title: "Threat Response", description: "IT is investigating the threat and needs your cooperation. They're asking about recent emails, downloads, and USB devices you may have used.", choices: [
            { text: "Cooperate fully", correct: true, impact: 0, feedback: "Teamwork strengthens security.", nextScenario: 6 },
            { text: "Minimal cooperation", correct: false, impact: -5, feedback: "Your insights are valuable.", nextScenario: 6 },
            { text: "Continue working normally", correct: false, impact: -10, feedback: "Threat still needs resolution.", nextScenario: 6 }
        ]},
        { id: 6, title: "Backup Testing", description: "Backup verification testing is required after the incident. You need to test if backups can actually be restored successfully.", choices: [
            { text: "Test backup restoration", correct: true, impact: 0, feedback: "Smart! Verified backups work.", nextScenario: 7 },
            { text: "Assume backups work", correct: false, impact: -10, feedback: "Never assume! Test regularly.", nextScenario: 7 },
            { text: "Skip testing, too busy", correct: false, impact: -15, feedback: "Testing is critical for preparedness.", nextScenario: 7 }
        ]},
        { id: 7, title: "Backup Strategy", description: "New backup strategy proposed: 3-2-1 rule with three copies on two media types, one offsite. This ensures ransomware can't encrypt all backups simultaneously.", choices: [
            { text: "Implement 3-2-1 backup rule", correct: true, impact: 0, feedback: "Excellent! Industry best practice.", nextScenario: 8 },
            { text: "Keep current single backup", correct: false, impact: -10, feedback: "Single backup is risky!", nextScenario: 8 },
            { text: "No backups, cloud only", correct: false, impact: -15, feedback: "Cloud can be attacked too! Need multiple backups.", nextScenario: 8 }
        ]},
        { id: 8, title: "Ransomware Training", description: "Mandatory ransomware training after the recent attack. Multi-session program covering attack vectors and response procedures.", choices: [
            { text: "Attend all sessions", correct: true, impact: 0, feedback: "Knowledge is your best defense.", nextScenario: 9 },
            { text: "Skip optional parts", correct: false, impact: -5, feedback: "Complete training protects everyone.", nextScenario: 9 },
            { text: "Already know everything", correct: false, impact: -10, feedback: "Threats evolve. Keep learning.", nextScenario: 9 }
        ]},
        { id: 9, title: "Security Audit", description: "External security audit completed with multiple findings from critical to minor issues. The report contains specific recommendations for improvement.", choices: [
            { text: "Participate fully and implement findings", correct: true, impact: 0, feedback: "Outstanding commitment to security!", nextScenario: null },
            { text: "Implement only high priority", correct: false, impact: -5, feedback: "All findings matter for security.", nextScenario: null },
            { text: "Skip audit", correct: false, impact: -15, feedback: "Audits are crucial for identifying weaknesses.", nextScenario: null }
        ]}
    ],
    
    "Password Security": [
        { id: 0, title: "Password Policy", description: "New password policy: 12+ characters, mixed types, changed every 90 days. Many employees are frustrated by the complexity requirements.", choices: [
            { text: "Reuse old password variations", correct: false, impact: -20, feedback: "Bad practice! Predictable patterns are vulnerable.", nextScenario: 1 },
            { text: "Use password manager", correct: true, impact: 0, feedback: "Excellent! Best practice for password security.", nextScenario: 2 },
            { text: "Write passwords down", correct: false, impact: -15, feedback: "Physical security risk! Use password manager.", nextScenario: 1 }
        ]},
        { id: 1, title: "Account Compromised", description: "Account compromised! Your weak password was cracked and you've been using variations across multiple accounts.", choices: [
            { text: "Change all related passwords", correct: true, impact: 0, feedback: "Good response! Limit the damage.", nextScenario: 3 },
            { text: "Just change this one", correct: false, impact: -10, feedback: "If you reused passwords, all are at risk!", nextScenario: 3 },
            { text: "Keep monitoring", correct: false, impact: -15, feedback: "Act immediately! Don't wait.", nextScenario: 3 }
        ]},
        { id: 2, title: "Manager Setup", description: "Password manager successfully set up with strong encryption. It can generate and store unique passwords for all accounts.", choices: [
            { text: "Generate strong unique passwords", correct: true, impact: 0, feedback: "Perfect! Maximum security.", nextScenario: 3 },
            { text: "Still use memorable passwords", correct: false, impact: -10, feedback: "Defeats the purpose of a password manager!", nextScenario: 3 },
            { text: "Use same password for some accounts", correct: false, impact: -15, feedback: "Never reuse! Manager makes this easy.", nextScenario: 3 }
        ]},
        { id: 3, title: "Multi-Factor Auth", description: "Multi-factor authentication offered across all systems. MFA blocks 99.9% of credential attacks but adds 5-10 seconds to login.", choices: [
            { text: "Enable on all accounts", correct: true, impact: 0, feedback: "Excellent! Major security boost.", nextScenario: 4 },
            { text: "Too inconvenient, skip", correct: false, impact: -20, feedback: "Convenience isn't worth the risk!", nextScenario: 4 },
            { text: "Enable for important accounts only", correct: false, impact: -5, feedback: "All accounts deserve protection.", nextScenario: 4 }
        ]},
        { id: 4, title: "Unexpected Code", description: "Unexpected verification code received for your email account! Someone is attempting to access your account right now.", choices: [
            { text: "Ignore and change password immediately", correct: true, impact: 0, feedback: "Smart! Someone tried to access your account.", nextScenario: 5 },
            { text: "Click link in message", correct: false, impact: -25, feedback: "Phishing! Never click unexpected links.", nextScenario: 6 },
            { text: "Reply to confirm it wasn't you", correct: false, impact: -15, feedback: "Don't engage! Report and secure account.", nextScenario: 6 }
        ]},
        { id: 5, title: "Account Secured", description: "Account secured after suspicious activity! Password changed and MFA enabled, but you should review login history.", choices: [
            { text: "Review recent login history", correct: true, impact: 0, feedback: "Good practice! Monitor for anomalies.", nextScenario: 7 },
            { text: "Assume it's handled", correct: false, impact: -5, feedback: "Stay vigilant! Check regularly.", nextScenario: 7 },
            { text: "Nothing more to do", correct: false, impact: -10, feedback: "Enable additional security measures.", nextScenario: 7 }
        ]},
        { id: 6, title: "Phishing Clicked", description: "You clicked the phishing link and entered your credentials! Attackers now have your username and password.", choices: [
            { text: "Contact security team immediately", correct: true, impact: 0, feedback: "Quick action can limit damage.", nextScenario: 7 },
            { text: "Wait to see what happens", correct: false, impact: -20, feedback: "Every second counts! Act now.", nextScenario: 7 },
            { text: "Just change password later", correct: false, impact: -15, feedback: "Immediate action required!", nextScenario: 7 }
        ]},
        { id: 7, title: "Biometric Auth", description: "Biometric authentication available (fingerprint/face recognition). It verifies 'something you are' rather than 'something you know'.", choices: [
            { text: "Enable as additional factor", correct: true, impact: 0, feedback: "Great! Adds strong security layer.", nextScenario: 8 },
            { text: "Replace password with biometric only", correct: false, impact: -10, feedback: "Use both! Multi-factor is best.", nextScenario: 8 },
            { text: "Don't trust biometrics", correct: false, impact: -5, feedback: "When used properly, they're very secure.", nextScenario: 8 }
        ]},
        { id: 8, title: "Credential Sharing", description: "Colleague requests to borrow your credentials for urgent presentation. They promise to be careful and only use it briefly.", choices: [
            { text: "Refuse and explain policy", correct: true, impact: 0, feedback: "Correct! Never share credentials.", nextScenario: 9 },
            { text: "Share but change after", correct: false, impact: -15, feedback: "Still violates policy and creates risk!", nextScenario: 9 },
            { text: "Share, they're trusted", correct: false, impact: -20, feedback: "Trust doesn't override security policy!", nextScenario: 9 }
        ]},
        { id: 9, title: "Password Review", description: "Annual password security review time! The audit found weak passwords, missing MFA on some systems, and outdated recovery info.", choices: [
            { text: "Update all security measures", correct: true, impact: 0, feedback: "Excellent! Stay current with best practices.", nextScenario: null },
            { text: "Everything's fine, skip", correct: false, impact: -10, feedback: "Security requires constant attention.", nextScenario: null },
            { text: "Quick review only", correct: false, impact: -5, feedback: "Thorough review is necessary.", nextScenario: null }
        ]}
    ],
    
    "Network Security": [
        { id: 0, title: "Unknown Device", description: "Alert: Unknown device on network at 3:47 AM scanning internal resources. Could be a rogue attacker device or unauthorized personal device.", choices: [
            { text: "Investigate immediately", correct: true, impact: 0, feedback: "Correct! Could be an attacker.", nextScenario: 2 },
            { text: "Ignore the alert", correct: false, impact: -25, feedback: "Could be an attacker! Always investigate.", nextScenario: 1 },
            { text: "Check later when free", correct: false, impact: -15, feedback: "Immediate response is critical!", nextScenario: 1 }
        ]},
        { id: 1, title: "Attacker Confirmed", description: "Attacker confirmed! The device has been exfiltrating data for 40 minutes and mapping your network.", choices: [
            { text: "Shut down network", correct: true, impact: 0, feedback: "Isolation prevents further damage!", nextScenario: 3 },
            { text: "Monitor their activity", correct: false, impact: -20, feedback: "Active threats must be stopped immediately!", nextScenario: 3 },
            { text: "Change firewall rules only", correct: false, impact: -15, feedback: "Not enough! Full isolation needed.", nextScenario: 3 }
        ]},
        { id: 2, title: "BYOD Violation", description: "False alarm - employee's personal phone bypassed BYOD policy. Still a security risk that needs addressing.", choices: [
            { text: "Enforce BYOD policy", correct: true, impact: 0, feedback: "Policies prevent security gaps!", nextScenario: 3 },
            { text: "Allow any device", correct: false, impact: -15, feedback: "Unmanaged devices are security risks!", nextScenario: 3 },
            { text: "Trust employee judgment", correct: false, impact: -10, feedback: "Policies must be enforced consistently.", nextScenario: 3 }
        ]},
        { id: 3, title: "Firewall Update", description: "Critical firewall update available patching actively exploited vulnerabilities. Update requires brief network interruption.", choices: [
            { text: "Review and apply updates", correct: true, impact: 0, feedback: "Updated firewalls block new threats!", nextScenario: 4 },
            { text: "Keep current settings", correct: false, impact: -10, feedback: "Outdated rules leave vulnerabilities.", nextScenario: 4 },
            { text: "Update next month", correct: false, impact: -5, feedback: "Security updates should be applied promptly.", nextScenario: 4 }
        ]},
        { id: 4, title: "VPN Disconnected", description: "VPN disconnected during remote work! You're now on unsecured public WiFi without encryption.", choices: [
            { text: "Stop work until reconnected", correct: true, impact: 0, feedback: "VPN ensures secure communication!", nextScenario: 5 },
            { text: "Continue without VPN", correct: false, impact: -20, feedback: "Unencrypted traffic can be intercepted!", nextScenario: 5 },
            { text: "Only access public data", correct: false, impact: -5, feedback: "Your entire session should be protected.", nextScenario: 5 }
        ]},
        { id: 5, title: "Port Scan Detected", description: "Port scan detected targeting your network! Attacker is probing for vulnerabilities before launching an attack.", choices: [
            { text: "Block source and alert security", correct: true, impact: 0, feedback: "Port scans indicate reconnaissance!", nextScenario: 6 },
            { text: "Consider it normal traffic", correct: false, impact: -15, feedback: "Port scans precede attacks!", nextScenario: 6 },
            { text: "Monitor for more activity", correct: false, impact: -10, feedback: "Block immediately! Don't wait.", nextScenario: 6 }
        ]},
        { id: 6, title: "Guest WiFi Setup", description: "Guest WiFi needs configuration. Should it be isolated from the corporate network or share with restrictions?", choices: [
            { text: "Segregate from main network", correct: true, impact: 0, feedback: "Network segmentation is critical!", nextScenario: 7 },
            { text: "Share main network", correct: false, impact: -25, feedback: "Guests should never access internal network!", nextScenario: 7 },
            { text: "Limited access to main network", correct: false, impact: -15, feedback: "Even limited access is too risky!", nextScenario: 7 }
        ]},
        { id: 7, title: "IDS Alert", description: "IDS alerts on unusual traffic patterns! Unexpected protocols and off-hours activity detected.", choices: [
            { text: "Investigate immediately", correct: true, impact: 0, feedback: "IDS alerts require prompt attention!", nextScenario: 8 },
            { text: "Assume false positive", correct: false, impact: -15, feedback: "Don't ignore security alerts!", nextScenario: 8 },
            { text: "Check at end of day", correct: false, impact: -10, feedback: "Threats don't wait! Investigate now.", nextScenario: 8 }
        ]},
        { id: 8, title: "Network Slowdown", description: "Network performance severely degraded! Could be hardware failure or DDoS attack.", choices: [
            { text: "Check for DDoS attack", correct: true, impact: 0, feedback: "Performance issues can indicate attacks!", nextScenario: 9 },
            { text: "Assume hardware issue", correct: false, impact: -10, feedback: "Always consider security causes.", nextScenario: 9 },
            { text: "Restart equipment", correct: false, impact: -5, feedback: "Investigate cause first.", nextScenario: 9 }
        ]},
        { id: 9, title: "Network Audit", description: "Network security audit completed with findings across all severity levels. Recommendations include segmentation and firewall updates.", choices: [
            { text: "Participate and implement findings", correct: true, impact: 0, feedback: "Audits strengthen security posture!", nextScenario: null },
            { text: "Skip non-critical items", correct: false, impact: -10, feedback: "All findings matter for security.", nextScenario: null },
            { text: "High priority only", correct: false, impact: -5, feedback: "Comprehensive implementation is best.", nextScenario: null }
        ]}
    ],
    
    "Data Protection": [
        { id: 0, title: "Sensitive File Sharing", description: "Need to share confidential document with customer data urgently. Options: unencrypted email, cloud storage, or encrypted platform.", choices: [
            { text: "Email without encryption", correct: false, impact: -25, feedback: "Sensitive data must be encrypted!", nextScenario: 1 },
            { text: "Use encrypted file sharing", correct: true, impact: 0, feedback: "Encryption protects data in transit!", nextScenario: 2 },
            { text: "Cloud without password", correct: false, impact: -20, feedback: "Cloud files need encryption and access controls!", nextScenario: 1 }
        ]},
        { id: 1, title: "Data Breach", description: "Data breach! Unencrypted files exposed 15,000 customer records now appearing on dark web.", choices: [
            { text: "Notify affected parties immediately", correct: true, impact: 0, feedback: "Transparency and quick action are crucial!", nextScenario: 3 },
            { text: "Hide the breach", correct: false, impact: -30, feedback: "Concealing breaches is illegal and unethical!", nextScenario: null },
            { text: "Assess before notifying", correct: false, impact: -10, feedback: "Notify immediately, assess in parallel!", nextScenario: 3 }
        ]},
        { id: 2, title: "File Shared", description: "File shared securely with encryption! Now consider setting an expiration date to limit exposure.", choices: [
            { text: "Set expiration date", correct: true, impact: 0, feedback: "Good! Limits exposure window.", nextScenario: 3 },
            { text: "Permanent access", correct: false, impact: -10, feedback: "Time-limited access is more secure.", nextScenario: 3 },
            { text: "Share password separately", correct: false, impact: 0, feedback: "Already encrypted, but good practice.", nextScenario: 3 }
        ]},
        { id: 3, title: "Data Retention", description: "Thousands of old documents with sensitive data found on servers. Legal requires retention for 3-7 years, but indefinite storage creates risks.", choices: [
            { text: "Archive with retention policy", correct: true, impact: 0, feedback: "Proper data lifecycle management!", nextScenario: 4 },
            { text: "Keep everything forever", correct: false, impact: -10, feedback: "Old data increases breach risk.", nextScenario: 4 },
            { text: "Delete after 1 year", correct: false, impact: -5, feedback: "Need proper retention policy, not arbitrary.", nextScenario: 4 }
        ]},
        { id: 4, title: "GDPR Request", description: "Customer requests data deletion under GDPR 'right to be forgotten'. Must be honored within 30 days unless exemptions apply.", choices: [
            { text: "Delete as requested", correct: true, impact: 0, feedback: "Privacy rights must be honored!", nextScenario: 5 },
            { text: "Ignore request", correct: false, impact: -20, feedback: "GDPR/privacy violations have consequences!", nextScenario: 5 },
            { text: "Delay for review", correct: false, impact: -10, feedback: "Review quickly but honor request promptly.", nextScenario: 5 }
        ]},
        { id: 5, title: "Backup Location", description: "Database backup location decision needed. Options: same server, different server same location, or off-site encrypted storage.", choices: [
            { text: "Encrypted off-site storage", correct: true, impact: 0, feedback: "Off-site encrypted backups ensure recovery!", nextScenario: 6 },
            { text: "Same server as database", correct: false, impact: -15, feedback: "Single point of failure!", nextScenario: 6 },
            { text: "Different server, same location", correct: false, impact: -10, feedback: "Physical separation needed.", nextScenario: 6 }
        ]},
        { id: 6, title: "Laptop Lost", description: "Laptop with unencrypted customer data (8,000 records) lost! Device has remote wipe capability.", choices: [
            { text: "Report and remotely wipe", correct: true, impact: 0, feedback: "Quick action minimizes exposure!", nextScenario: 7 },
            { text: "Wait for return", correct: false, impact: -25, feedback: "Assume data is compromised!", nextScenario: 7 },
            { text: "Track location first", correct: false, impact: -15, feedback: "Wipe immediately! Location is secondary.", nextScenario: 7 }
        ]},
        { id: 7, title: "Data Classification", description: "Data classification system implementation needed. Categories: Public, Internal, Confidential, and Restricted with specific handling requirements.", choices: [
            { text: "Implement classification system", correct: true, impact: 0, feedback: "Classification guides protection!", nextScenario: 8 },
            { text: "Treat all data the same", correct: false, impact: -10, feedback: "Different data needs different protection.", nextScenario: 8 },
            { text: "Only classify sensitive data", correct: false, impact: -5, feedback: "All data should be classified.", nextScenario: 8 }
        ]},
        { id: 8, title: "Vendor Access", description: "Vendor requests direct database access for customer support. This would give broad visibility into customer data.", choices: [
            { text: "Review contract and limit access", correct: true, impact: 0, feedback: "Vendor access must be controlled!", nextScenario: 9 },
            { text: "Grant full access", correct: false, impact: -20, feedback: "Only provide minimum necessary!", nextScenario: 9 },
            { text: "Trust vendor security", correct: false, impact: -15, feedback: "Always verify and limit access!", nextScenario: 9 }
        ]},
        { id: 9, title: "Data Audit", description: "Data protection audit identifies critical gaps in consent, encryption, and access controls. Full implementation requires significant resources.", choices: [
            { text: "Complete audit and implement all findings", correct: true, impact: 0, feedback: "Outstanding data protection!", nextScenario: null },
            { text: "High priority only", correct: false, impact: -5, feedback: "All findings strengthen protection.", nextScenario: null },
            { text: "Skip audit", correct: false, impact: -15, feedback: "Audits identify critical gaps.", nextScenario: null }
        ]}
    ],
    
    "Mobile Security": [
        { id: 0, title: "App Permissions", description: "New puzzle game requests contacts, location, camera, microphone, and storage access. Seems excessive for a simple game.", choices: [
            { text: "Grant all permissions", correct: false, impact: -20, feedback: "Only grant necessary permissions!", nextScenario: 1 },
            { text: "Review and grant only necessary", correct: true, impact: 0, feedback: "Perfect! Minimize app access.", nextScenario: 2 },
            { text: "Deny all and don't install", correct: false, impact: -5, feedback: "Some permissions may be legitimate.", nextScenario: 2 }
        ]},
        { id: 1, title: "App Data Theft", description: "App caught harvesting your contact data! Uploading names, phone numbers, and emails to unknown servers.", choices: [
            { text: "Uninstall immediately and report", correct: true, impact: 0, feedback: "Quick action limits data exposure!", nextScenario: 3 },
            { text: "Keep using it", correct: false, impact: -20, feedback: "Your data is being stolen!", nextScenario: 3 },
            { text: "Disable permissions", correct: false, impact: -10, feedback: "Damage done! Uninstall and report.", nextScenario: 3 }
        ]},
        { id: 2, title: "App Installed", description: "App installed successfully with minimal permissions! Remember to monitor behavior regularly.", choices: [
            { text: "Monitor behavior regularly", correct: true, impact: 0, feedback: "Good practice! Stay vigilant.", nextScenario: 3 },
            { text: "Set and forget", correct: false, impact: -5, feedback: "Regular monitoring is important.", nextScenario: 3 },
            { text: "Trust completely", correct: false, impact: -10, feedback: "Always maintain healthy skepticism.", nextScenario: 3 }
        ]},
        { id: 3, title: "Device Update", description: "Device update available with critical security patches. Delayed updates leave you vulnerable to known exploits.", choices: [
            { text: "Install immediately", correct: true, impact: 0, feedback: "Updates patch security vulnerabilities!", nextScenario: 4 },
            { text: "Delay for convenience", correct: false, impact: -15, feedback: "Delays leave you vulnerable!", nextScenario: 4 },
            { text: "Skip this update", correct: false, impact: -20, feedback: "Every update is important for security!", nextScenario: 4 }
        ]},
        { id: 4, title: "Phone Lost", description: "Phone left in taxi! Contains corporate data, passwords, and banking apps with remote wipe capability.", choices: [
            { text: "Remote wipe immediately", correct: true, impact: 0, feedback: "Protect your data first!", nextScenario: 5 },
            { text: "Track and wait", correct: false, impact: -20, feedback: "Assume it's compromised! Wipe now.", nextScenario: 5 },
            { text: "Cancel cards first", correct: false, impact: -10, feedback: "Do both, but remote wipe is critical.", nextScenario: 5 }
        ]},
        { id: 5, title: "Phone Recovered", description: "Phone recovered from taxi! Device was out of your control for hours and could be compromised.", choices: [
            { text: "Factory reset before use", correct: true, impact: 0, feedback: "Smart! Could have been tampered with.", nextScenario: 6 },
            { text: "Just use it", correct: false, impact: -15, feedback: "Could be compromised! Reset it.", nextScenario: 6 },
            { text: "Only change passwords", correct: false, impact: -10, feedback: "Full reset is safest.", nextScenario: 6 }
        ]},
        { id: 6, title: "Public Charging", description: "Low battery at airport with public USB charging station available. 'Juice jacking' attacks can steal data through USB.", choices: [
            { text: "Use own power bank", correct: true, impact: 0, feedback: "Avoids juice jacking risk!", nextScenario: 7 },
            { text: "Use public USB port", correct: false, impact: -20, feedback: "Juice jacking can steal data!", nextScenario: 7 },
            { text: "Use with data blocker", correct: false, impact: 5, feedback: "Better than direct, but own power is safest.", nextScenario: 7 }
        ]},
        { id: 7, title: "MDM Enrollment", description: "MDM enrollment required for company devices. Gives IT control over security policies and remote wipe capability.", choices: [
            { text: "Enroll company device", correct: true, impact: 0, feedback: "MDM ensures security compliance!", nextScenario: 8 },
            { text: "Refuse enrollment", correct: false, impact: -15, feedback: "Required for corporate security!", nextScenario: 8 },
            { text: "Partial enrollment", correct: false, impact: -10, feedback: "Full enrollment provides full protection.", nextScenario: 8 }
        ]},
        { id: 8, title: "Screen Lock", description: "No screen lock set on your device! Anyone who finds it has immediate access to all data.", choices: [
            { text: "Enable strong biometric + PIN", correct: true, impact: 0, feedback: "Excellent! Multi-layer protection.", nextScenario: 9 },
            { text: "Simple 4-digit PIN", correct: false, impact: -10, feedback: "Too weak! Use strong lock.", nextScenario: 9 },
            { text: "No lock for convenience", correct: false, impact: -20, feedback: "Convenience isn't worth the risk!", nextScenario: 9 }
        ]},
        { id: 9, title: "Mobile Audit", description: "Mobile security audit found critical issues: no encryption, missing screen locks, and outdated systems. Comprehensive fixes needed.", choices: [
            { text: "Implement all recommendations", correct: true, impact: 0, feedback: "Excellent mobile security!", nextScenario: null },
            { text: "Only critical items", correct: false, impact: -5, feedback: "All items improve security.", nextScenario: null },
            { text: "Skip audit", correct: false, impact: -15, feedback: "Mobile devices need security too!", nextScenario: null }
        ]}
    ]
};

// Select random topic
function selectRandomTopic() {
    const topics = Object.keys(securityTopics);
    return topics[Math.floor(Math.random() * topics.length)];
}

// Animation loop
function animate() {
    drawNetworkBackground();
    drawScenarioOverlay();
    requestAnimationFrame(animate);
}

// Update HUD elements
function updateHUD() {
    document.getElementById('score').textContent = `Score: ${gameState.score}`;
    
    // Show main topic only in upper right (stays constant throughout)
    document.getElementById('scenario').textContent = gameState.currentTopic;
    
    updateTimer();
}

// Update timer display
function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = gameState.timeRemaining;
    
    if (gameState.timeRemaining <= 5 && gameState.timeRemaining > 0) {
        timerElement.classList.add('warning');
        playBeep();
    } else {
        timerElement.classList.remove('warning');
    }
}

// Start countdown timer
function startTimer() {
    stopTimer();
    gameState.timeRemaining = 20;
    updateTimer();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimer();
        
        if (gameState.timeRemaining <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

// Stop countdown timer
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    document.getElementById('timer').classList.remove('warning');
}

// Handle timeout
function handleTimeout() {
    if (!gameState.showingChoice || gameState.showingFeedback) return;
    
    const currentScenario = gameState.currentScenarios[gameState.currentScenario];
    const correctChoice = currentScenario.choices.find(choice => choice.correct);
    
    const choicePanel = document.getElementById('choicePanel');
    choicePanel.style.display = 'none';
    gameState.showingChoice = false;
    
    gameState.score -= 10;
    updateHUD();
    
    const feedbackPanel = document.getElementById('feedbackPanel');
    const feedbackText = document.getElementById('feedbackText');
    if (feedbackText) {
        feedbackText.textContent = "Time's Up! -10 points for timeout. Quick decisions are crucial in cybersecurity!";
    }
    if (feedbackPanel) {
        feedbackPanel.style.display = 'block';
    }
    gameState.showingFeedback = true;
    
    setTimeout(() => {
        feedbackPanel.style.display = 'none';
        gameState.showingFeedback = false;
        
        if (gameState.score <= 0) {
            endGame();
        } else {
            const nextScenarioId = correctChoice.nextScenario;
            
            if (nextScenarioId === null || nextScenarioId >= gameState.currentScenarios.length) {
                endGame();
            } else {
                loadNextScenario(nextScenarioId);
            }
        }
    }, 3000);
}

// Show choice panel
function displayScenarioChoices(scenario) {
    const choicePanel = document.getElementById('choicePanel');
    const scenarioTitle = document.getElementById('scenarioTitle');
    const scenarioDescription = document.getElementById('scenarioDescription');
    const choicesContainer = document.getElementById('choicesContainer');
    
    scenarioTitle.textContent = scenario.title || `Scenario ${gameState.currentScenario + 1}`;
    scenarioDescription.textContent = scenario.description;
    
    choicesContainer.innerHTML = '';
    scenario.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => makeChoice(choice, button);
        choicesContainer.appendChild(button);
    });
    
    choicePanel.style.display = 'block';
    gameState.showingChoice = true;
    startTimer();
}

// Make choice
function makeChoice(choice, button) {
    if (gameState.showingFeedback) return;
    
    stopTimer();
    playClickSound();
    
    gameState.score += choice.impact;
    if (gameState.score < 0) gameState.score = 0;
    if (gameState.score > 100) gameState.score = 100;
    
    updateHUD();
    
    button.style.background = choice.correct ? 
        'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    
    document.getElementById('choicePanel').style.display = 'none';
    gameState.showingChoice = false;
    
    if (choice.correct) {
        playCorrectSound();
    } else {
        playIncorrectSound();
    }
    
    showFeedback(choice);
}

// Show feedback
function showFeedback(choice) {
    const feedbackPanel = document.getElementById('feedbackPanel');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const continueBtn = document.getElementById('continueBtn');
    
    feedbackTitle.textContent = choice.correct ? 'Correct!' : 'Incorrect!';
    feedbackTitle.className = choice.correct ? 'success' : 'error';
    feedbackMessage.textContent = choice.feedback;
    
    continueBtn.onclick = () => {
        playClickSound();
        feedbackPanel.style.display = 'none';
        gameState.showingFeedback = false;
        gameState.lastChoice = choice.text;
        nextScenario(choice.nextScenario);
    };
    
    feedbackPanel.style.display = 'block';
    gameState.showingFeedback = true;
}

// Move to next scenario
function nextScenario(nextScenarioId) {
    if (nextScenarioId === null || gameState.score <= 0) {
        endGame();
        return;
    }
    
    gameState.currentScenario = nextScenarioId;
    updateHUD();
    
    const scenario = gameState.currentScenarios[nextScenarioId];
    
    // No overlay for subsequent scenarios, go directly to choices
    displayScenarioChoices(scenario);
}

function loadNextScenario(nextScenarioId) {
    nextScenario(nextScenarioId);
}

// End game
function endGame() {
    stopTimer();
    stopBackgroundMusic();
    gameState.isGameOver = true;
    const gameOverDiv = document.getElementById('gameOver');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const finalScore = document.getElementById('finalScore');
    
    finalScore.textContent = gameState.score;
    
    if (gameState.score >= 90) {
        gameOverTitle.textContent = 'Excellent! (A)';
        gameOverMessage.textContent = 'Outstanding performance! You demonstrated exceptional cybersecurity awareness and made consistently excellent decisions. You\'re a true security champion!';
        playVictorySound();
    } else if (gameState.score >= 80) {
        gameOverTitle.textContent = 'Very Good! (B)';
        gameOverMessage.textContent = 'Great job! You showed strong security knowledge and handled most situations well. Keep up the good practices!';
        playVictorySound();
    } else if (gameState.score >= 70) {
        gameOverTitle.textContent = 'Good! (C)';
        gameOverMessage.textContent = 'Solid performance! You made several good decisions. Review the feedback to strengthen weak areas.';
        playVictorySound();
    } else if (gameState.score >= 60) {
        gameOverTitle.textContent = 'Pass (D)';
        gameOverMessage.textContent = 'You passed, but there\'s significant room for improvement. Review the scenarios carefully to enhance your security awareness.';
        playIncorrectSound();
    } else {
        gameOverTitle.textContent = 'Failed (F)';
        gameOverMessage.textContent = 'Critical security failures occurred! Your decisions would lead to serious breaches. Immediate cybersecurity training is required!';
        playGameOverSound();
    }
    
    gameOverDiv.style.display = 'block';
}

// Start game
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('scenario').style.display = 'block';
    
    playClickSound();
    
    gameState.currentTopic = selectRandomTopic();
    gameState.currentScenarios = securityTopics[gameState.currentTopic];
    
    gameState.gameStarted = true;
    gameState.currentScenario = 0;
    gameState.score = 100;
    gameState.timeRemaining = 20;
    updateHUD();
    
    const firstScenario = gameState.currentScenarios[0];
    showScenarioOverlay(gameState.currentTopic, 'Begin Mission', true);
    
    setTimeout(() => {
        displayScenarioChoices(firstScenario);
    }, 2800);
}

// Restart game
function restartGame() {
    stopTimer();
    stopBackgroundMusic();
    playClickSound();
    
    gameState = {
        score: 100,
        currentScenario: 0,
        isGameOver: false,
        gameStarted: false,
        showingChoice: false,
        showingFeedback: false,
        scenarioHistory: [],
        currentTopic: null,
        currentScenarios: [],
        timeRemaining: 20,
        timerInterval: null,
        lastChoice: null,
        glitchEnabled: false
    };
    
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('scenario').style.display = 'block';
    
    startGame();
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    initNetworkParticles();
    animate();
    
    // Start background music immediately when game loads
    initAudio();
    playBackgroundMusic();
    
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
});
