# ElevenLabs Voice Setup Instructions

## ✅ ElevenLabs Integration Complete!

Your ALIX Bot Control app now has **full voice conversation capabilities** powered by ElevenLabs AI.

## 🎙️ What's Working

- ✅ **ElevenLabs React SDK** installed and configured
- ✅ **Voice-to-text** transcription in real-time
- ✅ **AI responses** displayed instantly
- ✅ **Command detection** for robot actions
- ✅ **Microphone controls** with visual feedback
- ✅ **Connection status** indicators
- ✅ **Error handling** with user-friendly messages

## 🚀 To Start Using Voice Features

### Step 1: Get Your ElevenLabs Agent ID

1. Visit: https://elevenlabs.io/app/conversational-ai
2. Sign in or create an account
3. Click **"Create Agent"** or select an existing agent
4. Copy your **Agent ID** (it looks like: `abc123xyz...`)

### Step 2: Add Agent ID to Your Project

Open the `.env` file and replace `your_agent_id_here`:

```bash
VITE_ELEVENLABS_AGENT_ID=paste_your_actual_agent_id_here
```

### Step 3: Start the App

```bash
npm run dev
```

### Step 4: Test Voice

1. Open `http://localhost:3000` in Chrome (recommended)
2. Go to the **Control** page
3. Click the **microphone button**
4. Allow microphone access when prompted
5. Start talking! 🎤

## 💡 How It Works

### Voice Flow

```
You speak → Microphone captures audio → ElevenLabs AI processes
→ Transcription appears → AI responds → Command detected
→ Execute button appears → Click to run command → Robot acts
```

### Features You Can Try

**Say things like:**
- "Start cleaning the bathroom"
- "What's the battery level?"
- "Return to the charging station"
- "Stop cleaning"
- "Show me the cleaning schedule"

The AI will:
1. **Understand** your natural language
2. **Respond** with relevant information
3. **Detect** if it's a robot command
4. **Enable** the Execute button for commands

## 🎯 Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| Blue microphone | Ready to start |
| Red pulsing microphone | Actively listening |
| "LISTENING" badge | Voice session active |
| "Connecting..." | Establishing connection |
| Execute button visible | Command detected |

## 🔧 Customization

### Adjust AI Behavior

Edit your agent at: https://elevenlabs.io/app/conversational-ai

You can configure:
- AI personality and tone
- Knowledge base
- Response style
- Language and accent
- Voice characteristics

### Modify Command Detection

In `src/pages/Control.tsx`, edit the command keywords:

```typescript
const msg = message.message.toLowerCase();
if (msg.includes("clean") ||
    msg.includes("start") ||
    msg.includes("stop") ||
    msg.includes("return")) {
  setIsCommandMode(true);
}
```

Add more keywords to detect different commands!

## 🐛 Troubleshooting

### "Please set your ElevenLabs Agent ID" Alert

**Solution:**
1. Make sure `.env` file exists
2. Check that `VITE_ELEVENLABS_AGENT_ID` is set
3. Restart the dev server (`npm run dev`)

### Microphone Not Working

**Solutions:**
- Use **Chrome** browser (best WebRTC support)
- Check browser permissions: Settings → Privacy → Microphone
- Make sure you're on `localhost` or `https://` (required for mic access)
- Try incognito mode to rule out extension conflicts

### "Failed to start conversation" Error

**Causes:**
- Invalid or missing Agent ID
- No microphone connected
- Microphone permission denied
- Network connection issues

**Solutions:**
1. Verify Agent ID in `.env`
2. Check microphone is plugged in
3. Grant permission when browser asks
4. Check internet connection

### Voice Not Recognized

**Improve recognition:**
- Speak clearly at normal pace
- Reduce background noise
- Check microphone volume in system settings
- Try different browser (Chrome recommended)
- Position microphone closer

## 🌐 Production Deployment

### Environment Variables

In your hosting platform (Netlify/Vercel/etc), add:

```
VITE_ELEVENLABS_AGENT_ID=your_agent_id
```

**Note:** This variable is **client-side** and will be visible in the browser bundle. This is normal and expected for ElevenLabs agent IDs.

### HTTPS Required

Voice features need HTTPS in production (microphone access requirement):
- ✅ Netlify: Automatic HTTPS
- ✅ Vercel: Automatic HTTPS
- ✅ GitHub Pages: Supports HTTPS
- ⚠️ Custom hosting: Configure SSL certificate

## 📊 Bundle Size Impact

With ElevenLabs SDK:
- JavaScript: **669KB** (184KB gzipped)
- CSS: 7KB (2KB gzipped)
- **Total: ~186KB** transferred (gzipped)

This is normal for real-time voice AI capabilities.

## 🎓 Learning Resources

- **ElevenLabs Docs**: https://elevenlabs.io/docs/conversational-ai
- **Agent Dashboard**: https://elevenlabs.io/app/conversational-ai
- **API Reference**: https://elevenlabs.io/docs/api-reference
- **React SDK**: https://www.npmjs.com/package/@11labs/react

## 💬 Example Conversation

**You:** "Hey, start cleaning the main bathroom"

**AI:** "I'll start a full clean of the main bathroom right away. The robot is powering up and heading to the bathroom area."

*[Execute Command button appears]*

**You click Execute** → Robot status updates to "CLEANING - Main Bathroom"

---

## ✨ You're All Set!

Your voice-controlled robot interface is ready to use. Start a conversation and control your ALIX bot naturally with your voice!

Questions? Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)
