import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Zap, Battery, Wifi, WifiOff } from "lucide-react";
import SharedHeader from "../components/SharedHeader";
import { useConversation } from "@11labs/react";


// Stylish Loader Component
const StylishLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-text">Connecting...</p>
    </div>
  );
};

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  return data.signedUrl;
}

// Main Control Screen Component
const ControlScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationText, setConversationText] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const silenceTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const executeIntervalRef = useRef(null);
  const quickActionIntervalRef = useRef(null);

  const [batteryStatus] = useState({
    level: 85,
    status: "good",
    estimatedTime: "4h 20m",
    isCharging: false,
  });

  const [robotStatus, setRobotStatus] = useState({
    currentLocation: "Main Bathroom",
    nextLocation: "Guest Bathroom",
    isActive: false,
    batteryLevel: 85,
    cleaningProgress: 65,
    currentAction: "",
    connectionStatus: "connected",
  });

  async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

  const resetSilenceTimeout = (duration = 20000) => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      console.log("🕒 Silence timeout reached, ending conversation...");
      endConversation();
    }, duration);
  };

  const conversation = useConversation({
    onConnect: (conversationId) => {
      console.log("✅ Connected to conversation", conversationId);
      if (mountedRef.current) {
        setIsListening(true);
        setIsProcessing(false);
        setIsConnecting(false);
      }
    },
    onDisconnect: (details) => {
      setIsConnecting(false);
      console.log("❌ Disconnected from conversation", details);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (mountedRef.current) {
        setIsListening(false);
        setIsProcessing(false);
      }
    },
    onError: (message) => {
      console.error("❌ Conversation error:", message);
      setIsConnecting(false);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (mountedRef.current) {
        setIsListening(false);
        setIsProcessing(false);
      }
    },
    onMessage: (event) => {
      setIsConnecting(false);
      console.log("📩 Raw event:", event);

      const type = event?.message?.type;

      if (type === "user_transcript") {
        const message = event.message.user_transcription_event.user_transcript;
        console.log("💬 Message from user:", message);
        setConversationText(message);
        resetSilenceTimeout();
      } else if (type === "agent_response") {
        const message = event.message.agent_response_event.agent_response;
        console.log("💬 Message from ai:", message);
        setAssistantResponse(message);
        detectCommandMode(message);
        if (detectCommandMode(message)) {
          console.log("⚙️ Command detected — will end after 10 seconds");
          resetSilenceTimeout();
        }
        setIsProcessing(false);
      } else if (type === "agent_response_correction") {
        const message =
          event.message.agent_response_correction_event
            .corrected_agent_response;
        console.log("🪄 Corrected AI response:", message);
        setAssistantResponse(message);
        detectCommandMode(message);
        setIsProcessing(false);
      }
    },
    onModeChange: (mode) => {
      setIsConnecting(false);
      console.log(`🔊 Mode: ${mode}`);
      if (mountedRef.current) {
        if (mode === "listening") {
          setIsProcessing(false);
        } else if (mode === "speaking") {
          setIsProcessing(true);
        }
      }
    },
    onStatusChange: (status) => {
      console.log(`📡 Status: ${status}`);
    },
  });

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

  const commandKeywords = ["execute command"];

  const detectCommandMode = (text) => {
    if (typeof text !== "string") {
      console.warn("Invalid text:", text);
      return false;
    }
    const lowerText = text?.toLowerCase();
    const hasCommandKeyword = commandKeywords.some((keyword) =>
      lowerText?.includes(keyword)
    );

    if (hasCommandKeyword) {
      setIsCommandMode(true);
    } else {
      setIsCommandMode(false);
    }

    return hasCommandKeyword;
  };

  const startConversation = async () => {
    if (isStarting || conversation.status === "connected") return;
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert("No permission");
      return;
    }

    setIsConnecting(true);
    setIsStarting(true);

    try {
      setConversationText("");
      setAssistantResponse("");
      setIsCommandMode(false);

      const signedUrl = await getSignedUrl();
      const conversationId = await conversation.startSession({ signedUrl });
      // await conversation.startSession({
      //   agentId: "agent_0001k5k60af5fwrb9cgagaf3gkb1",
      // });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const endConversation = async () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    try {
      await conversation.endSession();
      if (!isCommandMode) {
        setAssistantResponse("");
        setConversationText("");
      }
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const handleMicPress = () => {
    if (conversation.status === "connected") {
      endConversation();
    } else {
      startConversation();
    }
  };

  const executeCommand = () => {
    endConversation();
    if (executeIntervalRef.current) clearInterval(executeIntervalRef.current);

    if (!mountedRef.current) return;
    setRobotStatus((prev) => ({
      ...prev,
      isActive: true,
      cleaningProgress: 0,
      currentAction: "Executing voice command",
    }));
    setConversationText("");
    setAssistantResponse("");
    setIsCommandMode(false);

    executeIntervalRef.current = setInterval(() => {
      setRobotStatus((prev) => {
        if (!mountedRef.current) return prev;
        const newProgress = prev.cleaningProgress + 5;
        if (newProgress >= 100) {
          if (executeIntervalRef.current)
            clearInterval(executeIntervalRef.current);
          return {
            ...prev,
            cleaningProgress: 100,
            isActive: false,
            currentAction: "",
          };
        }
        return { ...prev, cleaningProgress: newProgress };
      });
    }, 500);
  };

  const executeQuickAction = (actionType) => {
    if (quickActionIntervalRef.current)
      clearInterval(quickActionIntervalRef.current);

    if (!mountedRef.current) return;
    const actionNames = {
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

    quickActionIntervalRef.current = setInterval(() => {
      setRobotStatus((prev) => {
        if (!mountedRef.current) return prev;
        const newProgress = prev.cleaningProgress + 10;
        if (newProgress >= 100) {
          if (quickActionIntervalRef.current)
            clearInterval(quickActionIntervalRef.current);
          return {
            ...prev,
            cleaningProgress: 100,
            isActive: false,
            currentAction: "",
          };
        }
        return { ...prev, cleaningProgress: newProgress };
      });
    }, 300);
  };

  return (
    <div className="app-container">
      <div className="background-gradient"></div>

      <SharedHeader
        title="ALIX Bot Control"
        batteryLevel={batteryStatus.level}
        batteryTime={batteryStatus.estimatedTime}
        isRobotActive={robotStatus.isActive}
        connectionStatus={robotStatus.connectionStatus}
      />

      <div className="main-content">
        {/* Robot Status Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Robot Status</h2>
            <div
              className={`status-badge ${robotStatus.isActive ? "active" : ""}`}
            >
              <div
                className={`status-dot ${robotStatus.isActive ? "active" : ""}`}
              ></div>
              <span
                className={`status-text ${
                  robotStatus.isActive ? "active" : ""
                }`}
              >
                {robotStatus.isActive
                  ? robotStatus.currentAction.toUpperCase() || "CLEANING"
                  : "STANDBY"}
              </span>
            </div>
          </div>

          <div className="status-grid">
            <div className="status-item">
              <div className="status-label">Current Location</div>
              <div className="status-value">{robotStatus.currentLocation}</div>
            </div>
            <div className="status-item">
              <div className="status-label">Next Location</div>
              <div className="status-value">{robotStatus.nextLocation}</div>
            </div>
          </div>

          {robotStatus.isActive && (
            <div className="progress-section">
              <div className="progress-label">
                {robotStatus.currentAction || "Cleaning"} Progress
              </div>
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${robotStatus.cleaningProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {robotStatus.cleaningProgress}%
                </div>
              </div>
            </div>
          )}

          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              {[
                { key: "fullClean", label: "Full Clean", color: "#3b82f6" },
                { key: "returnToBase", label: "Return Home", color: "#00d4aa" },
                { key: "emergencyStop", label: "Stop", color: "#f87171" },
                { key: "scheduleClean", label: "Schedule", color: "#a855f7" },
              ].map((action) => (
                <button
                  key={action.key}
                  className="action-button"
                  style={{ background: action.color }}
                  onClick={() => executeQuickAction(action.key)}
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
          </div>

          {isConnecting ? (
            <div className="voice-indicator">
              <StylishLoader />
            </div>
          ) : (
            <div className="voice-indicator">
              <div
                className={`wave-ring ${isProcessing ? "active" : ""}`}
              ></div>
              <div
                className={`pulse-ring ${isListening ? "active" : ""}`}
              ></div>
              <button
                className={`mic-button ${
                  conversation.status === "connected" ? "active" : ""
                } ${isProcessing ? "processing" : ""}`}
                onClick={handleMicPress}
              >
                {conversation.status === "connected" ? (
                  <MicOff size={24} color="#ffffff" />
                ) : (
                  <Mic size={24} color="#ffffff" />
                )}
              </button>
            </div>
          )}

          {(isListening || isProcessing) && (
            <div className="ball-container">
              <div className="animated-ball"></div>
            </div>
          )}

          <div className="voice-status">
            {conversation.status === "connected"
              ? "Listening for commands..."
              : isProcessing
              ? "Processing your request..."
              : "Tap microphone to start voice conversation"}
          </div>

          <div className="conversation-section">
            <div className="conversation-container">
              <div className="conversation-label">
                {isCommandMode ? "Voice Command" : "Conversation"}
              </div>
              <div className="conversation-text">
                {conversationText ||
                  "Start a conversation with your voice assistant..."}
              </div>
            </div>

            <div className="response-container">
              <div className="response-label">Assistant Response</div>
              <div className="response-text">
                {assistantResponse || "I'm ready to help you..."}
              </div>

              {isCommandMode && assistantResponse !== "" && (
                <button className="execute-button" onClick={executeCommand}>
                  <Zap size={16} color="#ffffff" />
                  <span>Execute Command</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .background-gradient {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            #0f172a 0%,
            #1e293b 50%,
            #334155 100%
          );
          z-index: -1;
        }

        .header-container {
          padding: 20px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-title {
          font-size: 24px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .header-info {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .battery-info,
        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
        }

        .battery-time {
          color: #64748b;
          font-size: 12px;
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: linear-gradient(
            135deg,
            rgba(30, 41, 59, 0.95) 0%,
            rgba(51, 65, 85, 0.95) 100%
          );
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(100, 116, 139, 0.3);
          padding: 6px 12px;
          border-radius: 16px;
        }

        .status-badge.active {
          background: rgba(0, 212, 170, 0.2);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #64748b;
        }

        .status-dot.active {
          background: #00d4aa;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .status-text {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
        }

        .status-text.active {
          color: #00d4aa;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .status-item {
          background: rgba(51, 65, 85, 0.5);
          padding: 16px;
          border-radius: 10px;
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .status-label {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .status-value {
          font-size: 14px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .progress-section {
          margin-bottom: 20px;
        }

        .progress-label {
          font-size: 13px;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 8px;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(100, 116, 139, 0.3);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d4aa 0%, #0891b2 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          font-weight: 600;
          color: #00d4aa;
          min-width: 40px;
        }

        .quick-actions-section {
          margin-top: 16px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 12px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .action-button {
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .voice-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 40px 0 20px;
          position: relative;
          height: 120px;
        }

        .wave-ring,
        .pulse-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .wave-ring {
          width: 120px;
          height: 120px;
          border-color: #3b82f6;
        }

        .wave-ring.active {
          opacity: 0.3;
          animation: wave 1.5s ease-in-out infinite;
        }

        .pulse-ring {
          width: 100px;
          height: 100px;
          border-color: #1d4ed8;
        }

        .pulse-ring.active {
          opacity: 0.5;
          animation: pulse-ring 0.8s ease-in-out infinite alternate;
        }

        @keyframes wave {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }

        @keyframes pulse-ring {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.15);
          }
        }

        .mic-button {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          z-index: 1;
        }

        .mic-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
        }

        .mic-button.active {
          background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
          box-shadow: 0 4px 12px rgba(248, 113, 113, 0.4);
        }

        .mic-button.processing {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .ball-container {
          width: 100px;
          height: 20px;
          margin: 16px auto;
          position: relative;
        }

        .animated-ball {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3b82f6;
          position: absolute;
          top: 5px;
          animation: ball-slide 2s ease-in-out infinite;
        }

        @keyframes ball-slide {
          0%,
          100% {
            left: 0;
          }
          50% {
            left: 90px;
          }
        }

        .voice-status {
          text-align: center;
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .conversation-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .conversation-container,
        .response-container {
          padding: 16px;
          border-radius: 10px;
          border-left: 3px solid;
        }

        .conversation-container {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(29, 78, 216, 0.1) 100%
          );
          border-left-color: #3b82f6;
        }

        .response-container {
          background: linear-gradient(
            135deg,
            rgba(0, 212, 170, 0.1) 0%,
            rgba(8, 145, 178, 0.1) 100%
          );
          border-left-color: #00d4aa;
        }

        .conversation-label,
        .response-label {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .conversation-label {
          color: #60a5fa;
        }

        .response-label {
          color: #34d399;
        }

        .conversation-text,
        .response-text {
          font-size: 14px;
          color: #e2e8f0;
          line-height: 1.6;
        }

        .conversation-text {
          font-style: italic;
        }

        .execute-button {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #00d4aa 0%, #0891b2 100%);
          color: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 212, 170, 0.3);
        }

        .execute-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 212, 170, 0.4);
        }

        .execute-button:active {
          transform: translateY(0);
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .loader-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(59, 130, 246, 0.2);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loader-text {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .header-title {
            font-size: 20px;
          }

          .main-content {
            padding: 16px;
            gap: 16px;
          }

          .card {
            padding: 16px;
          }

          .card-title {
            font-size: 18px;
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .status-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-info {
            width: 100%;
            justify-content: space-between;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `} </style>
    </div>
  );
};

export default ControlScreen;
