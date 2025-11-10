# 🤖 CyberBot - AI Chatbot Integration Guide

## Overview
CyberBot is an AI-powered chatbot assistant integrated into CyberEd to help students understand cybersecurity concepts. It uses **Groq's free API** with the LLaMA 3.1 70B model.

## Features
- ✅ **100% Free** - Uses Groq's generous free tier
- 🎓 Expert in all 4 CyberEd modules (Cryptography, Malware Defense, Network Defense, Web Security)
- 💬 Conversational memory (remembers last 10 messages)
- 🎨 Beautiful, modern UI with smooth animations
- 📱 Fully responsive (mobile-friendly)
- ⚡ Fast responses (Groq is one of the fastest AI inference platforms)

---

## Setup Instructions

### Step 1: Get Your Free Groq API Key

1. Visit **https://console.groq.com**
2. Sign up for a free account (no credit card required)
3. Go to **API Keys** section
4. Click **"Create API Key"**
5. Copy your API key (keep it safe!)

### Step 2: Configure Backend

1. Navigate to the `backend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

### Step 3: Install Dependencies (Already Done)
The `groq-sdk` package is already installed. If you need to reinstall:
```bash
cd backend
npm install
```

### Step 4: Add Chatbot to Your Pages

Add these two lines to any HTML page where you want the chatbot:

```html
<!-- Add in <head> section -->
<link rel="stylesheet" href="/css/chatbot.css">

<!-- Add before closing </body> tag -->
<script src="/js/chatbot.js"></script>
```

**Example pages to add it to:**
- All 16 lesson pages
- Module pages (cryptography, malware-defense, network-defense, web-security)
- Main dashboard (cybered.html)
- Profile page
- Challenges page

---

## Testing the Chatbot

### 1. Start the Backend Server
```bash
cd backend
npm start
```

Server should run on: `http://localhost:4000`

### 2. Open Any Page with Chatbot
Open any HTML file with the chatbot scripts included.

### 3. Test Questions

Try asking CyberBot:
- "What is the difference between symmetric and asymmetric encryption?"
- "Explain what SQL injection is"
- "How does a firewall work?"
- "What are the OWASP Top 10?"
- "Tell me about malware analysis"
- "What is ARP spoofing?"

---

## How It Works

### Backend (`backend/src/routes/chatbot.js`)
- **POST `/api/chatbot/ask`** - Send a question, get AI response
- **GET `/api/chatbot/health`** - Check if service is available
- Uses Groq SDK to communicate with LLaMA 3.1 70B model
- Maintains conversation context (last 10 messages)
- Has detailed knowledge about all 4 CyberEd modules

### Frontend 
- **`chatbot.js`** - Widget logic and API communication
- **`chatbot.css`** - Beautiful purple gradient UI
- Floating button in bottom-right corner
- Click to open chat window
- Type questions and get instant answers

---

## Groq Free Tier Limits

- **Rate Limit:** ~30 requests per minute
- **Daily Limit:** Very generous (thousands of requests)
- **Cost:** $0.00 forever (completely free!)
- **Speed:** Extremely fast (Groq specializes in fast AI inference)

Perfect for educational use! 🎓

---

## Customization

### Change Bot Personality
Edit the `SYSTEM_CONTEXT` in `backend/src/routes/chatbot.js` to modify how the bot responds.

### Change Colors
Edit `frontend/src/css/chatbot.css`:
- Purple gradient: `#667eea` and `#764ba2`
- Change to your preferred colors

### Change Model
In `backend/src/routes/chatbot.js`, line 77:
```javascript
model: 'llama-3.1-70b-versatile', // Change to other Groq models
```

Available Groq models:
- `llama-3.1-70b-versatile` (Best for general questions)
- `llama-3.1-8b-instant` (Faster, less capable)
- `mixtral-8x7b-32768` (Good alternative)

---

## Troubleshooting

### "Chatbot service not configured"
✅ Make sure you added `GROQ_API_KEY` to `.env` file

### "Failed to connect"
✅ Check if backend server is running on port 4000
✅ Check browser console for errors

### "Rate limit exceeded"
✅ You've hit Groq's free tier limit (wait 1 minute)
✅ Still very generous for a free service!

### Chatbot not appearing
✅ Check that `chatbot.css` and `chatbot.js` are included in HTML
✅ Check browser console for JavaScript errors

---

## Security Notes

🔒 **Never commit your `.env` file to GitHub!**
- The `.env` file is already in `.gitignore`
- API keys should remain private
- Groq's free tier is generous but not unlimited

---

## Next Steps

1. ✅ Get Groq API key
2. ✅ Add to `.env` file
3. ✅ Add chatbot to all pages
4. ✅ Test with real questions
5. ✅ Enjoy your free AI assistant!

---

## Resources

- **Groq Console:** https://console.groq.com
- **Groq Documentation:** https://console.groq.com/docs
- **Groq Pricing:** https://groq.com/pricing (Free tier is very generous!)

---

**Made with ❤️ for CyberEd students**
