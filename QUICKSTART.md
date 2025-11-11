# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```

The optimized build will be in the `dist/` folder (192KB).

## What's Included

### Pages
- **Control** (`/control`) - Robot control panel with quick actions
- **Map** (`/map`) - Map visualization with history and scheduling

### Navigation
- Bottom navigation bar with Home and Map tabs
- Responsive design that works on all devices

### Features Working
✅ Robot status monitoring
✅ Battery level display
✅ Quick action buttons
✅ Progress tracking
✅ Tab navigation (Live Status, History, Schedule)
✅ Responsive design
✅ Dark theme with animations

### Note About Voice Features
The voice assistant UI is present but displays a message that voice features are available on mobile platforms. This is intentional as the original React Native app used native voice SDKs.

## Deploy
Simply upload the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

Enjoy! 🚀
