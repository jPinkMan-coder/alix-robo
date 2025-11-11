# ALIX Bot Control - Web Application

A modern, responsive web application for controlling your ALIX cleaning robot with **ElevenLabs AI voice conversation** capabilities.

## ✨ Key Features

### 🎙️ Voice Assistant (NEW!)
- **Real-time AI Conversation** powered by ElevenLabs
- Voice-to-text transcription
- Natural language command processing
- Execute robot commands through voice
- Smart command detection

### 🤖 Robot Control
- Real-time status monitoring
- Battery level tracking
- Location tracking (current & next)
- Progress visualization
- Quick action buttons

### 🗺️ Map & Tracking
- Live robot position
- Cleaning history with stats
- Scheduled cleaning tasks
- Interactive legend

### 🎨 Modern UI
- Dark theme with gradients
- Smooth animations
- Responsive design (desktop/tablet/mobile)
- Glassmorphic effects

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure ElevenLabs
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your ElevenLabs Agent ID
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
```

Get your Agent ID from: https://elevenlabs.io/app/conversational-ai

### 3. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

Output: `dist/` folder (669KB with voice AI)

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **ElevenLabs React SDK** - Voice AI
- **React Router** - Navigation
- **Lucide React** - Icons

## 🎯 How to Use Voice Commands

1. Click the **microphone button** in the Control panel
2. Allow microphone access when prompted
3. **Speak naturally** to the AI assistant
4. View transcription and AI response in real-time
5. When AI detects a command, click **"Execute Command"**

### Example Voice Commands

- "Start cleaning the bathroom"
- "Return the robot to base"
- "Stop the current cleaning"
- "Schedule a cleaning for tomorrow"

The AI will understand natural language and detect actionable commands automatically.

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Navigation layout
│   ├── pages/
│   │   ├── Control.tsx         # Voice control panel
│   │   └── Map.tsx             # Map & scheduling
│   ├── styles/
│   │   └── global.css          # Theming & styles
│   └── main.tsx                # App entry
├── dist/                       # Build output
├── .env                        # Environment config
└── package.json                # Dependencies
```

## 🔧 Environment Variables

```bash
# Required for voice features
VITE_ELEVENLABS_AGENT_ID=your_agent_id

# Optional Supabase config
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🌐 Browser Requirements

- **Chrome** (recommended) - Best WebRTC support
- **Firefox** - Full support
- **Safari** - Requires HTTPS for microphone
- **Edge** - Full support

**Note:** Microphone access requires HTTPS in production (localhost works in dev).

## 📊 Performance

```
Bundle Size: 669KB JS (184KB gzipped) with AI
CSS: 7KB (2KB gzipped)
HTML: 0.6KB
Build Time: ~8 seconds
```

The larger bundle size includes the ElevenLabs conversational AI SDK for voice features.

## 🛠️ Available Scripts

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
npm run preview   # Preview production build
```

## 🌍 Deployment

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Vercel
- Import from GitHub
- Framework: Vite
- Build command: `npm run build`
- Output: `dist`

### Environment Variables (Production)
Add `VITE_ELEVENLABS_AGENT_ID` in your hosting platform's environment settings.

## 🔒 Security Notes

- **Never commit** your `.env` file with real API keys
- Use server-side authentication for production
- Consider signed URLs for sensitive operations
- ElevenLabs agent ID is public-facing (by design)

## 🐛 Troubleshooting

### Voice Not Working?

1. **Check microphone permissions** in browser settings
2. **Verify Agent ID** in `.env` file
3. **Restart dev server** after changing `.env`
4. **Use Chrome** for best compatibility
5. **Check console** for error messages

### Build Issues?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentation

- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)
- **ElevenLabs Docs**: https://elevenlabs.io/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

## 🎯 Features Roadmap

- ✅ Voice conversation with AI
- ✅ Real-time transcription
- ✅ Command detection
- ✅ Robot control interface
- ✅ Map visualization
- ⏳ WebSocket robot connection
- ⏳ Real-time telemetry
- ⏳ User authentication
- ⏳ Multi-robot support
- ⏳ Analytics dashboard

## 📝 License

Private

## 🤝 Support

For ElevenLabs API issues:
- Docs: https://elevenlabs.io/docs/conversational-ai
- Dashboard: https://elevenlabs.io/app

---

Built with ❤️ using React, TypeScript, and ElevenLabs AI
