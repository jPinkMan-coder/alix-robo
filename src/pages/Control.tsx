import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Zap } from "lucide-react";
import { useConversation } from "@elevenlabs/react";

export default function Control() {
  const [conversationText, setConversationText] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isCommandMode, setIsCommandMode] = useState(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastAIResponseTimeRef = useRef<number>(0);

  const [robotStatus, setRobotStatus] = useState({
    currentLocation: "Main Bathroom",
    nextLocation: "Guest Bathroom",
    isActive: false,
    batteryLevel: 85,
    cleaningProgress: 65,
    currentAction: "",
    connectionStatus: "connected" as const,
  });

  const [batteryStatus] = useState({
    level: 85,
    status: "good",
    estimatedTime: "4h 20m",
    isCharging: false,
  });

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Connected to ElevenLabs");
      setConversationText("");
      setAssistantResponse("");
      setIsCommandMode(false);
    },
    onDisconnect: () => {
      console.log("❌ Disconnected from ElevenLabs");
      // Clear silence timer on disconnect
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    },
    onMessage: (message) => {
      console.log("📨 ElevenLabs Message:", message);

      // Clear any existing silence timer when we get a message
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      // Handle user transcript
      if (message.type === "user_transcript" && message.message) {
        console.log("👤 User said:", message.message);
        setConversationText(message.message);
      }

      // Handle agent response
      if (message.type === "agent_response" && message.message) {
        console.log("🤖 AI responded:", message.message);
        setAssistantResponse(message.message);
        lastAIResponseTimeRef.current = Date.now();

        // Check if the message contains a command
        const msg = message.message.toLowerCase();
        if (
          msg.includes("clean") ||
          msg.includes("start") ||
          msg.includes("stop") ||
          msg.includes("return") ||
          msg.includes("bathroom") ||
          msg.includes("schedule")
        ) {
          console.log("🎯 Command detected in AI response");
          setIsCommandMode(true);
        }

        // Start 5-second silence timer after AI response
        console.log("⏱️ Starting 5-second silence timer...");
        silenceTimerRef.current = setTimeout(() => {
          console.log("🔇 No user response for 5 seconds, ending session...");
          conversation.endSession();
        }, 5000);
      }

      // Handle interruption (user started speaking)
      if (message.type === "interruption") {
        console.log("🎤 User started speaking, timer cleared");
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      }
    },
    onError: (error) => {
      console.error("❌ ElevenLabs error:", error);
    },
  });

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCommandMode) {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

      silenceTimeoutRef.current = setTimeout(() => {
        console.log(
          "🕒 No user speech detected for 10s, ending conversation..."
        );
        endConversation();
      }, 10000);
    }
  }, [isCommandMode]);

  const isListening = conversation.status === "connected";

  const executeCommand = () => {
    console.log("⚡ Executing command:", assistantResponse);
    setRobotStatus((prev) => ({
      ...prev,
      isActive: true,
      cleaningProgress: 0,
      currentAction: "Executing voice command",
    }));

    // End the conversation after executing command
    conversation.endSession();

    // Clear messages after a short delay
    setTimeout(() => {
      setConversationText("");
      setAssistantResponse("");
      setIsCommandMode(false);
    }, 1000);
  };

  const executeQuickAction = (actionType: string) => {
    const actionNames: Record<string, string> = {
      fullClean: "Start Full Clean",
      returnToBase: "Return to Base",
      emergencyStop: "Stop",
      scheduleClean: "Schedule Clean",
    };

    setRobotStatus((prev) => ({
      ...prev,
      isActive: true,
      cleaningProgress: 0,
      currentAction: actionNames[actionType] || actionType,
    }));
  };

  const handleMicPress = async () => {
    if (!agentId || agentId === "your_agent_id_here") {
      alert(
        "Please set your ElevenLabs Agent ID in the .env file\n\n" +
        "1. Copy .env.example to .env\n" +
        "2. Add your agent ID: VITE_ELEVENLABS_AGENT_ID=your_id\n" +
        "3. Restart the dev server\n\n" +
        "Get your agent ID from:\nhttps://elevenlabs.io/app/conversational-ai"
      );
      return;
    }

    try {
      if (isListening) {
        console.log("🛑 Manually ending session");
        await conversation.endSession();
      } else {
        console.log("🎙️ Starting voice conversation...");
        await conversation.startSession({ agentId });
      }
    } catch (error) {
      console.error("Failed to toggle conversation:", error);
      alert(
        "Failed to start conversation.\n\n" +
        "Please check:\n" +
        "- Microphone permissions are granted\n" +
        "- Agent ID is correct\n" +
        "- Internet connection is active"
      );
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">ALIX Bot Control</h1>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Battery</span>
              <span className="stat-value">{batteryStatus.level}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Status</span>
              <span className={`connection-badge ${robotStatus.connectionStatus}`}>
                {robotStatus.connectionStatus}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Robot Status Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Robot Status</h2>
            <div className={`status-badge ${robotStatus.isActive ? 'active' : ''}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {robotStatus.isActive
                  ? robotStatus.currentAction.toUpperCase() || "CLEANING"
                  : "STANDBY"}
              </span>
            </div>
          </div>

          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Current Location</span>
              <span className="status-value">{robotStatus.currentLocation}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Next Location</span>
              <span className="status-value">{robotStatus.nextLocation}</span>
            </div>
          </div>

          {robotStatus.isActive && (
            <div className="progress-section">
              <span className="progress-label">
                {robotStatus.currentAction || "Cleaning"} Progress
              </span>
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${robotStatus.cleaningProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{robotStatus.cleaningProgress}%</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              {[
                { key: "fullClean", label: "Full Clean", color: "blue" },
                { key: "returnToBase", label: "Return Home", color: "cyan" },
                { key: "emergencyStop", label: "Stop", color: "red" },
                { key: "scheduleClean", label: "Schedule", color: "purple" },
              ].map((action) => (
                <button
                  key={action.key}
                  onClick={() => executeQuickAction(action.key)}
                  className={`action-button ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Commands Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Voice Assistant</h2>
            {conversation.status === "connected" && (
              <div className="status-badge active">
                <span className="status-dot"></span>
                <span className="status-text">LISTENING</span>
              </div>
            )}
          </div>

          {/* Voice Indicator */}
          <div className="voice-indicator">
            <button
              className={`mic-button ${isListening ? 'active' : ''}`}
              onClick={handleMicPress}
              disabled={conversation.status === "connecting"}
              style={{
                opacity: conversation.status === "connecting" ? 0.5 : 1,
                cursor: conversation.status === "connecting" ? "not-allowed" : "pointer",
              }}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
          </div>

          <p className="voice-status">
            {conversation.status === "connecting" && "Connecting to voice assistant..."}
            {conversation.status === "connected" && "🎤 Listening... Speak now!"}
            {conversation.status === "disconnected" && "Click microphone to start voice conversation"}
          </p>

          {/* Conversation Display */}
          <div className="conversation-section">
            <div className="conversation-container">
              <span className="conversation-label">
                {isCommandMode ? "Voice Command" : "Your Message"}
              </span>
              <p className="conversation-text" style={{ minHeight: '3rem' }}>
                {conversationText || "Your voice input will appear here..."}
              </p>
            </div>

            <div className="response-container">
              <span className="response-label">Assistant Response</span>
              <p className="response-text" style={{ minHeight: '3rem' }}>
                {assistantResponse || "AI assistant response will appear here..."}
              </p>

              {isCommandMode && assistantResponse && (
                <button onClick={executeCommand} className="execute-button">
                  <Zap size={16} />
                  <span>Execute Command</span>
                </button>
              )}
            </div>
          </div>

          {/* Debug Info (only in development) */}
          {import.meta.env.DEV && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}>
              <strong>Debug Info:</strong>
              <div>Status: {conversation.status}</div>
              <div>Agent ID: {agentId ? '✓ Configured' : '✗ Missing'}</div>
              <div>Auto-disconnect: 5s after AI response</div>
              <div>Command Mode: {isCommandMode ? '✓ Active' : '✗ Inactive'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
