# ALIX Bot Control - Web Application

A modern, responsive web application for controlling and monitoring your ALIX cleaning robot. Converted from React Native to pure web technologies.

## ✨ Features

- **Control Panel**: Real-time robot status monitoring, battery level, cleaning progress
- **Quick Actions**: One-click commands for Full Clean, Return Home, Emergency Stop, and Schedule
- **Voice Assistant UI**: Interface ready for future voice command integration
- **Map View**: Interactive visualization with Live Status, History, and Schedule tabs
- **Responsive Design**: Optimized for desktop, tablet, and mobile browsers
- **Modern UI**: Dark theme with gradient backgrounds, smooth animations, and glassmorphic effects

## 🚀 Tech Stack

- **React 18** - Latest stable React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, consistent icon library
- **CSS3** - Modern styling with animations and gradients

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build

Create an optimized production build:

```bash
npm run build
```

Build output: `dist/` directory (192KB total, 57KB gzipped)

## 👀 Preview

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with bottom navigation
│   ├── pages/
│   │   ├── Control.tsx         # Robot control panel
│   │   └── Map.tsx             # Map, history, and scheduling
│   ├── styles/
│   │   └── global.css          # Global styles and themes
│   └── main.tsx                # Application entry point
├── dist/                       # Production build output
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🌐 Deployment

The `dist/` folder contains a static website that can be deployed to any hosting platform:

### Netlify
```bash
# Drag and drop the dist folder to Netlify
```

### Vercel
```bash
# Import the project - Vite is auto-detected
```

### GitHub Pages
```bash
# Push dist folder to gh-pages branch
```

### Static Hosting
Upload the contents of the `dist/` folder to any web server.

## 🖥️ Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎨 Features Breakdown

### Control Panel
- Real-time robot status display
- Battery level monitoring
- Current and next location tracking
- Cleaning progress visualization
- Quick action buttons for common tasks
- Voice assistant interface (UI only, for mobile app integration)

### Map View
**Live Status Tab:**
- Interactive map visualization
- Robot position tracking
- Path completion indicators
- Real-time progress updates

**History Tab:**
- Cleaning session history
- Success/failure status
- Duration and area coverage stats

**Schedule Tab:**
- Scheduled cleaning times
- Cleaning types and locations
- Status indicators

## 🔒 Security

- No sensitive data exposed in frontend
- API calls should be proxied through backend (not implemented in demo)
- Environment variables for configuration (when needed)

## 📱 Responsive Design

- Desktop: Full feature set with multi-column layout
- Tablet: Optimized grid layout
- Mobile: Single-column layout with touch-friendly controls
- All devices: Fixed bottom navigation for easy access

## 🎯 Performance

- Small bundle size: 180KB JS (57KB gzipped)
- Minimal CSS: 6.8KB (1.9KB gzipped)
- Fast loading: Optimized with code splitting
- Smooth animations: CSS-based with GPU acceleration

## 🚧 Future Enhancements

- Real WebRTC voice integration for web browsers
- Real-time WebSocket connection to robot
- Map canvas with actual floor plan rendering
- Historical data charts and analytics
- User authentication and profiles
- Multi-robot management

## 📝 License

Private

## 🤝 Contributing

This is a demonstration project. For production use, additional features like authentication, backend API, and real robot integration would be needed.
