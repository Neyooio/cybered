/**
 * CyberBot - AI Chatbot Widget
 * Free Groq-powered assistant for CyberEd students
 */

import { API_BASE_URL } from './config.js';

class CyberBot {
    constructor() {
        this.API_URL = `${API_BASE_URL}/api/chatbot`;
        this.conversationHistory = [];
        this.isOpen = false;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.injectHTML();
        this.attachEventListeners();
        this.setupDrawerListener();
        this.checkHealth();
    }

    injectHTML() {
        // Check if user is faculty or admin
        const userRole = localStorage.getItem('authRole');
        const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
        
        // Check current page
        const currentPath = window.location.pathname.toLowerCase();
        const isHomepage = currentPath.includes('cybered.html') || currentPath.endsWith('/');
        const isLessonPage = currentPath.includes('/lessons/');
        const isFacultySpacePage = currentPath.includes('faculty-space.html');
        const isModulesPage = currentPath.includes('modules.html');
        
        // Check if mobile (window width <= 768px)
        const isMobile = window.innerWidth <= 768;
        
        // Show plus button for all users on modules page (faculty creates, students join)
        // But hide on mobile since there's already a + button in the topbar
        const showPlusButton = isModulesPage && !isMobile;
        
        // Hide chatbot on faculty space page
        const showChatbot = !isFacultySpacePage;
        
        const html = `
            ${showPlusButton ? `
            <!-- Space Action Button (Create for Faculty, Join for Students) -->
            <button class="faculty-add-toggle" id="faculty-add-toggle" aria-label="Space Options">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            ` : ''}
            
            ${showChatbot ? `
            <!-- Chatbot Toggle Button -->
            <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open CyberBot">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            <!-- Chatbot Container -->
            <div class="chatbot-container" id="chatbot-container">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">
                            <img src="../../assets/images/Cipher.png" alt="Cipher" />
                        </div>
                        <div class="chatbot-header-text">
                            <h3>Cipher</h3>
                            <p>Your Cybersecurity Assistant</p>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbot-close" aria-label="Close chatbot">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Messages -->
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="welcome-message">
                        <h4>👋 Hello, I'm Cipher!</h4>
                        <p>I can help you understand concepts from Cryptography, Malware Defense, Network Defense, and Web Security. Ask me anything!</p>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbot-input" 
                        placeholder="Ask me about cybersecurity..." 
                        maxlength="500"
                    />
                    <button class="chatbot-send" id="chatbot-send" aria-label="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
            ` : ''}
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const facultyToggle = document.getElementById('faculty-add-toggle');

        if (toggle) toggle.addEventListener('click', () => this.toggleChat());
        if (close) close.addEventListener('click', () => this.toggleChat());
        if (send) send.addEventListener('click', () => this.sendMessage());
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isTyping) {
                    this.sendMessage();
                }
            });
        }
        
        // Faculty button handler
        if (facultyToggle) {
            facultyToggle.addEventListener('click', () => this.showSpaceOptions());
        }
        
        // Hide chatbot when hamburger menu opens
        this.setupDrawerListener();
    }
    
    setupDrawerListener() {
        // Wait for drawer to be available in DOM
        const waitForDrawer = () => {
            const drawer = document.getElementById('mobileDrawer');
            const chatbotToggle = document.getElementById('chatbot-toggle');
            const chatbotContainer = document.getElementById('chatbot-container');
            const facultyToggle = document.getElementById('faculty-add-toggle');
            
            if (!drawer) {
                // Retry after a short delay if drawer not found
                setTimeout(waitForDrawer, 100);
                return;
            }
            
            // Use MutationObserver to watch for aria-hidden attribute changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                        const isDrawerOpen = drawer.getAttribute('aria-hidden') === 'false';
                        
                        console.log('Drawer state changed:', isDrawerOpen ? 'OPEN' : 'CLOSED');
                        
                        // Hide/show chatbot elements when drawer opens/closes
                        if (chatbotToggle) {
                            chatbotToggle.style.display = isDrawerOpen ? 'none' : 'flex';
                        }
                        if (chatbotContainer && this.isOpen) {
                            chatbotContainer.style.display = isDrawerOpen ? 'none' : 'flex';
                        }
                        if (facultyToggle) {
                            facultyToggle.style.display = isDrawerOpen ? 'none' : 'flex';
                        }
                    }
                });
            });
            
            observer.observe(drawer, { attributes: true });
            console.log('Drawer listener set up successfully');
        };
        
        waitForDrawer();
    }
    
    showSpaceOptions() {
        const userRole = localStorage.getItem('authRole');
        const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
        
        if (isFacultyOrAdmin) {
            // Faculty/Admin: Open create space modal
            if (window.facultyModuleCreator) {
                window.facultyModuleCreator.openModal();
            } else {
                alert('Faculty Options:\n\n• Add Quiz Questions\n• Manage Content\n• View Analytics\n\n(Coming soon!)');
            }
        } else {
            // Students: Open join space modal
            if (window.studentSpaceJoiner) {
                window.studentSpaceJoiner.openModal();
            } else {
                alert('Join Space feature loading...');
            }
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbot-container');
        
        if (this.isOpen) {
            container.classList.add('active');
            document.getElementById('chatbot-input').focus();
        } else {
            container.classList.remove('active');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage('user', message);
        input.value = '';

        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Show typing indicator
        this.showTyping();

        try {
            const response = await fetch(`${this.API_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory
                })
            });

            const data = await response.json();

            this.hideTyping();

            if (data.success) {
                this.addMessage('bot', data.response);
                
                // Add bot response to history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: data.response
                });
            } else {
                this.addMessage('bot', `Sorry, I encountered an error: ${data.error}`);
            }

        } catch (error) {
            this.hideTyping();
            console.error('Chatbot error:', error);
            this.addMessage('bot', 'Sorry, I\'m having trouble connecting. Please make sure the server is running and try again.');
        }
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarContent = sender === 'bot' 
            ? '<img src="../../assets/images/Cipher.png" alt="Cipher" />'
            : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatarContent}
            </div>
            <div class="message-content">
                <p>${this.escapeHtml(text)}</p>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbot-messages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="../../assets/images/Cipher.png" alt="Cipher" />
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.API_URL}/health`);
            const data = await response.json();
            
            if (!data.available) {
                console.warn('CyberBot service not fully configured:', data.message);
            }
        } catch (error) {
            console.warn('CyberBot health check failed. Make sure backend is running.');
        }
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cyberBot = new CyberBot();
    });
} else {
    window.cyberBot = new CyberBot();
}
