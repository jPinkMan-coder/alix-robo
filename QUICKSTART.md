# Quick Start Guide

## Setup ElevenLabs Voice Assistant

### 1. Get Your ElevenLabs Agent ID

1. Go to [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai)
2. Create a new agent or use an existing one
3. Copy your Agent ID

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Agent ID
VITE_ELEVENLABS_AGENT_ID=your_actual_agent_id_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 5. Test Voice Features

1. Click the microphone button on the Control page
2. Allow microphone access when prompted
3. Start speaking to your AI assistant
4. The conversation will appear in real-time

## Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## How It Works

### Voice Conversation Flow

1. **Click Microphone** → Starts ElevenLabs conversation session
2. **Speak** → Your speech is transcribed and sent to the AI agent
3. **AI Responds** → Response is displayed and can be executed as a command
4. **Command Detection** → AI responses with keywords trigger command mode
5. **Execute** → Click "Execute Command" to run robot actions

### Command Keywords

The system detects these keywords in AI responses:
- `clean` → Triggers cleaning command
- `start` → Starts an action
- `stop` → Stops current action  
- `return` → Returns robot to base

### Quick Actions

Available without voice:
- **Full Clean** → Start complete cleaning cycle
- **Return Home** → Send robot back to charging station
- **Stop** → Emergency stop
- **Schedule** → Schedule cleaning tasks

## Troubleshooting

### Microphone Not Working

1. Check browser permissions (Settings → Privacy → Microphone)
2. Make sure you're using HTTPS or localhost
3. Try a different browser (Chrome recommended)

### Agent ID Error

Make sure you've:
1. Created an agent at elevenlabs.io
2. Copied the correct Agent ID
3. Updated .env file
4. Restarted the dev server

### Voice Not Recognized

1. Check microphone volume
2. Ensure quiet environment
3. Speak clearly and at normal pace
4. Check browser console for errors

## Features

✅ Real-time voice conversation with AI
✅ Speech-to-text transcription
✅ AI response display
✅ Command detection and execution
✅ Robot status monitoring
✅ Battery tracking
✅ Quick action buttons
✅ Map visualization
✅ History and scheduling

Enjoy! 🎙️🤖
