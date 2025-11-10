import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// System context about CyberEd modules
const SYSTEM_CONTEXT = `You are CyberBot, an intelligent cybersecurity learning assistant for CyberEd - an educational platform teaching cybersecurity concepts.

You help students understand four main modules:

1. CRYPTOGRAPHY
- Covers: fundamentals (plaintext, ciphertext, encryption, keys), symmetric vs asymmetric encryption
- Classical ciphers: Caesar cipher, Vigenère cipher
- Modern algorithms: AES, RSA, ECC
- Hashing and digital signatures
- Real-world applications: HTTPS/TLS, blockchain, password storage

2. MALWARE DEFENSE
- What malware is and types: viruses, worms, trojans, ransomware, spyware
- Malware analysis: static and dynamic analysis
- Safe analysis environments: virtual machines, sandboxes
- Prevention: EDR, patch management, endpoint protection
- Incident response: detection, containment, eradication, recovery

3. NETWORK DEFENSE
- OSI Model (7 layers) and how data travels
- Common threats: DDoS, ARP spoofing, packet sniffing, Man-in-the-Middle attacks
- Defense tools: firewalls, IDS (Intrusion Detection Systems), IPS (Intrusion Prevention Systems)
- Monitoring tools: Wireshark, Nmap, Snort
- Incident response procedures

4. WEB SECURITY
- Core principles: confidentiality, integrity, availability, accountability
- OWASP Top 10 risks including:
  - Injection (SQL injection)
  - Broken Authentication
  - Cross-Site Scripting (XSS)
  - Insecure Direct Object References
  - Security Misconfiguration
  - Sensitive Data Exposure
  - Missing Function-Level Access Control
  - CSRF (Cross-Site Request Forgery)
  - Using Components with Known Vulnerabilities
  - Unvalidated Redirects and Forwards

Your role:
- Answer questions clearly and concisely
- Help students understand difficult concepts
- Provide examples when helpful
- If a question is outside these topics, politely redirect to cybersecurity learning
- Keep responses educational and encouraging
- Use simple language suitable for students learning cybersecurity`;

// POST /api/chatbot/ask
router.post('/ask', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Message is required and must be a string'
            });
        }

        // Check if API key is configured
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                success: false,
                error: 'Chatbot service is not configured. Please contact administrator.'
            });
        }

        // Build conversation messages
        const messages = [
            { role: 'system', content: SYSTEM_CONTEXT }
        ];

        // Add conversation history (limit to last 10 messages)
        const recentHistory = conversationHistory.slice(-10);
        messages.push(...recentHistory);

        // Add current user message
        messages.push({ role: 'user', content: message });

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.1-70b-versatile', // Fast and capable model
            temperature: 0.7,
            max_tokens: 500, // Keep responses concise
            top_p: 1,
            stream: false
        });

        const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

        res.json({
            success: true,
            response: aiResponse,
            messageCount: messages.length
        });

    } catch (error) {
        console.error('Chatbot error:', error);

        // Handle specific Groq errors
        if (error.status === 401) {
            return res.status(500).json({
                success: false,
                error: 'Authentication failed. Please check API configuration.'
            });
        }

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                error: 'Rate limit exceeded. Please try again in a moment.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to get response from chatbot. Please try again later.'
        });
    }
});

// GET /api/chatbot/health - Check if chatbot service is available
router.get('/health', async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return res.json({
                available: false,
                message: 'API key not configured'
            });
        }

        res.json({
            available: true,
            message: 'Chatbot service is ready',
            model: 'llama-3.1-70b-versatile'
        });
    } catch (error) {
        res.status(500).json({
            available: false,
            message: 'Service check failed'
        });
    }
});

export default router;
