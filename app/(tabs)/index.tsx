import { LinearGradient } from "expo-linear-gradient";
import { Mic, MicOff, Zap } from "lucide-react-native";
import { use, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import SharedHeader from "../../components/SharedHeader";
import { ElevenLabsProvider, useConversation } from "@elevenlabs/react-native";
import type {
  ConversationStatus,
  ConversationEvent,
  Role,
} from "@elevenlabs/react-native";

import { AudioModule, setAudioModeAsync } from "expo-audio";
import StylishLoader from "../../components/StylishLoader";
const { width, height } = Dimensions.get("window");

// Responsive breakpoints
const getResponsiveSize = () => {
  if (width >= 1200) return "desktop";
  if (width >= 768) return "tablet";
  if (width >= 480) return "mobile-large";
  return "mobile";
};

const responsiveSize = getResponsiveSize();
const isDesktop = responsiveSize === "desktop";
const isTablet = responsiveSize === "tablet";
const isMobileLarge = responsiveSize === "mobile-large";

// Dynamic sizing functions
const scale = (size: number) => {
  "worklet";
  if (isDesktop) return size * 1.3;
  if (isTablet) return size * 1.15;
  if (isMobileLarge) return size * 1.05;
  return size;
};

const spacing = (size: number) => {
  if (isDesktop) return size * 1.4;
  if (isTablet) return size * 1.2;
  return size;
};

function ControlScreen1() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationText, setConversationText] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [detectedCommand, setDetectedCommand] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Refs for cleanup
  const mountedRef = useRef(true);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const executeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const quickActionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetSilenceTimeout = (duration = 20000) => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      console.log("🕒 Silence timeout reached, ending conversation...");
      endConversation();
    }, duration);
  };

  // ElevenLabs conversation hook using web SDK
  const conversation = useConversation({
    onConnect: (conversationId: string) => {
      console.log("✅ Connected to conversation", conversationId);
      if (mountedRef.current) {
        setIsListening(true);
        setIsProcessing(false);
      }
    },

    onDisconnect: (details: string) => {
      setIsConnecting(false);
      console.log("❌ Disconnected from conversation", details);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

      if (mountedRef.current) {
        setIsListening(false);
        setIsProcessing(false);
        pulseScale.value = withTiming(1);
        waveScale.value = withTiming(1);
      }
    },

    onError: (message: string, context?: Record<string, unknown>) => {
      console.error("❌ Conversation error:", message, context);
      setIsConnecting(false);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

      if (mountedRef.current) {
        setIsListening(false);
        setIsProcessing(false);
        pulseScale.value = withTiming(1);
        waveScale.value = withTiming(1);
        // Alert.alert(
        //   "Voice Error",
        //   "There was an issue with the voice conversation. Please try again."
        // );
      }
    },

    onMessage: (event: any) => {
      setIsConnecting(false);
      console.log("📩 Raw event:", event);

      const type = event?.message?.type;
      const source = event?.source ?? event?.role;

      let message: string;

      if (type === "user_transcript") {
        // user’s spoken text
        message = event.message.user_transcription_event.user_transcript;
        console.log(`💬 Message from user:`, message);
        setConversationText(message);
        resetSilenceTimeout();
      } else if (type === "agent_response") {
        // AI’s reply
        message = event.message.agent_response_event.agent_response;
        console.log(`💬 Message from ai:`, message);
        setAssistantResponse(message);
        detectCommandMode(message);
        if (detectCommandMode(message)) {
          console.log("⚙️ Command detected — will end after 10 seconds");
          resetSilenceTimeout();
        }
        setIsProcessing(false);
      } else if (type === "agent_response_correction") {
        message =
          event.message.agent_response_correction_event
            .corrected_agent_response;
        console.log(`🪄 Corrected AI response:`, message);
        setAssistantResponse(message);
        detectCommandMode(message);
        setIsProcessing(false);
      } else {
        // fallback
        message = JSON.stringify(event);
        console.log(`💬 Unknown message type:`, message);
      }
    },

    onModeChange: (mode: "speaking" | "listening") => {
      setIsConnecting(false);
      console.log(`🔊 Mode: ${mode}`);
      if (mountedRef.current) {
        if (mode === "listening") {
          setIsProcessing(false);
          pulseScale.value = withRepeat(
            withTiming(1.2, { duration: 800 }),
            -1,
            true
          );
        } else if (mode === "speaking") {
          setIsProcessing(true);
          waveScale.value = withRepeat(
            withTiming(1.1, { duration: 600 }),
            -1,
            true
          );
        }
      }
    },

    onStatusChange: (status: string) => {
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

  // Battery status
  const [batteryStatus, setBatteryStatus] = useState({
    level: 85,
    status: "good",
    estimatedTime: "4h 20m",
    isCharging: false,
  });

  // Robot status
  const [robotStatus, setRobotStatus] = useState({
    currentLocation: "Main Bathroom",
    nextLocation: "Guest Bathroom",
    isActive: false,
    batteryLevel: 85,
    cleaningProgress: 65,
    currentAction: "",
    connectionStatus: "connected",
  });

  // Animation values
  const pulseScale = useSharedValue(1);
  const waveScale = useSharedValue(1);
  const ballPosition = useSharedValue(0);

  useEffect(() => {
    ballPosition.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (listeningTimeoutRef.current)
        clearTimeout(listeningTimeoutRef.current);
      if (processingTimeoutRef.current)
        clearTimeout(processingTimeoutRef.current);
      if (executeIntervalRef.current) clearInterval(executeIntervalRef.current);
      if (quickActionIntervalRef.current)
        clearInterval(quickActionIntervalRef.current);
    };
  }, []);

  // Command keywords detection
  const commandKeywords = [
    // 'start',
    // 'stop',
    // 'clean',
    // 'return',
    // 'go',
    // 'move',
    // 'pause',
    // 'resume',
    // 'schedule',
    // 'cancel',
    // 'home',
    // 'base',
    // 'bathroom',
    // 'kitchen',
    // 'bedroom',
    // 'living room',
    // 'vacuum',
    // 'mop',
    // 'sweep',
    // 'charge',
    // 'dock',
    "execute command",
  ];

  const detectCommandMode = (text: string) => {
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
      setDetectedCommand(text);
    } else {
      setIsCommandMode(false);
      setDetectedCommand("");
    }

    return hasCommandKeyword;
  };

  const startConversation = async () => {
    if (isStarting || conversation.status === "connected") return;

    setIsConnecting(true);
    setIsStarting(true);
    try {
      // await requestMic();
      setConversationText("");
      setAssistantResponse("");
      setIsCommandMode(false);

      // Get signed URL from API route
      // Get signed URL from API route
      await conversation.startSession({
        agentId: "agent_0001k5k60af5fwrb9cgagaf3gkb1",
        dynamicVariables: {
          platform: Platform.OS,
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // Alert.alert(
      //   "Connection Error",
      //   "Could not connect to voice assistant. Please check your internet connection and try again."
      // );
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
    // Clear any existing timeouts
    if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
    if (processingTimeoutRef.current)
      clearTimeout(processingTimeoutRef.current);

    if (conversation.status === "connected") {
      endConversation();
    } else {
      startConversation();
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "connected":
        return "#10B981";
      case "connecting":
        return "#F59E0B";
      case "disconnected":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const executeCommand = () => {
    endConversation();
    // Clear any existing interval
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
    setDetectedCommand("");

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
    if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
    if (processingTimeoutRef.current)
      clearTimeout(processingTimeoutRef.current);
  };

  const executeQuickAction = (actionType: string) => {
    // Clear any existing interval
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

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale.value }],
    opacity: isProcessing ? 0.6 : 0,
  }));

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ballPosition.value * scale(80) }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <SharedHeader
        title="ALIX Bot Control"
        batteryLevel={batteryStatus.level}
        batteryTime={batteryStatus.estimatedTime}
        isRobotActive={robotStatus.isActive}
        connectionStatus={
          robotStatus.connectionStatus as "connected" | "disconnected"
        }
      />

      {/* Main Content - Horizontal Layout */}
      <View style={styles.mainContent}>
        {/* Robot Status Card */}
        <LinearGradient
          colors={["rgba(30, 41, 59, 0.95)", "rgba(51, 65, 85, 0.95)"]}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Robot Status</Text>
            <View
              style={[
                styles.statusBadge,
                robotStatus.isActive && styles.statusBadgeActive,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  robotStatus.isActive && styles.statusDotActive,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  robotStatus.isActive && styles.statusTextActive,
                ]}
              >
                {robotStatus.isActive
                  ? robotStatus.currentAction.toUpperCase() || "CLEANING"
                  : "STANDBY"}
              </Text>
            </View>
          </View>

          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Current Location</Text>
              <Text style={styles.statusValue}>
                {robotStatus.currentLocation}
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Next Location</Text>
              <Text style={styles.statusValue}>{robotStatus.nextLocation}</Text>
            </View>
          </View>

          {robotStatus.isActive && (
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>
                {robotStatus.currentAction || "Cleaning"} Progress
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={["#00d4aa", "#0891b2"]}
                    style={[
                      styles.progressFill,
                      { width: `${robotStatus.cleaningProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {robotStatus.cleaningProgress}%
                </Text>
              </View>
            </View>
          )}

          {/* Quick Actions Grid */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {[
                {
                  key: "fullClean",
                  label: "Full Clean",
                  colors: ["#3b82f6", "#1d4ed8"] as [string, string],
                },
                {
                  key: "returnToBase",
                  label: "Return Home",
                  colors: ["#00d4aa", "#0891b2"] as [string, string],
                },
                {
                  key: "emergencyStop",
                  label: "Stop",
                  colors: ["#f87171", "#dc2626"] as [string, string],
                },
                {
                  key: "scheduleClean",
                  label: "Schedule",
                  colors: ["#a855f7", "#7c3aed"] as [string, string],
                },
              ].map((action) => (
                <TouchableOpacity
                  key={action.key}
                  onPress={() => executeQuickAction(action.key)}
                  activeOpacity={0.8}
                  style={styles.actionButtonContainer}
                >
                  <LinearGradient
                    colors={action.colors}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>{action.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Voice Commands Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={["rgba(30, 41, 59, 0.95)", "rgba(51, 65, 85, 0.95)"]}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Voice Assistant</Text>
            </View>

            {isConnecting ? (
              <View
                style={[
                  styles.voiceIndicator,
                  { marginTop: spacing(41.5), marginBottom: spacing(43) },
                ]}
              >
                {" "}
                <LinearGradient
                  colors={["rgba(15,23,42,0.85)", "rgba(30,41,59,0.85)"]}
                  style={styles.loaderOverlay}
                >
                  <StylishLoader />
                </LinearGradient>
              </View>
            ) : (
              // Voice Indicator
              <View
                style={[styles.voiceIndicator, { marginTop: spacing(41.5) }]}
              >
                <Animated.View style={[styles.waveRing, waveStyle]} />
                <Animated.View style={[styles.pulseRing, pulseStyle]} />

                <TouchableOpacity
                  style={[
                    styles.micButton,
                    conversation.status === "connected" &&
                      styles.micButtonActive,
                    isProcessing && styles.micButtonProcessing,
                  ]}
                  onPress={handleMicPress}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      conversation.status === "connected"
                        ? ["#f87171", "#dc2626"]
                        : isProcessing
                        ? ["#a855f7", "#7c3aed"]
                        : ["#3b82f6", "#1d4ed8"]
                    }
                    style={styles.micButtonGradient}
                  >
                    {conversation.status === "connected" ? (
                      <MicOff size={scale(24)} color="#ffffff" />
                    ) : (
                      <Mic size={scale(24)} color="#ffffff" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Animated Ball Indicator */}
            {(isListening || isProcessing) && (
              <View style={styles.ballContainer}>
                <Animated.View style={[styles.animatedBall, ballStyle]} />
              </View>
            )}

            <Text style={styles.voiceStatus}>
              {conversation.status === "connected"
                ? "Listening for commands..."
                : isProcessing
                ? "Processing your request..."
                : "Tap microphone to start voice conversation"}
            </Text>
            <ScrollView
              style={styles.voiceScrollView}
              contentContainerStyle={styles.voiceScrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {/* Conversation Display */}
              <View style={styles.conversationSection}>
                <LinearGradient
                  colors={["rgba(59, 130, 246, 0.1)", "rgba(29, 78, 216, 0.1)"]}
                  style={styles.conversationContainer}
                >
                  <Text style={styles.conversationLabel}>
                    {isCommandMode ? "Voice Command" : "Conversation"}
                  </Text>
                  <Text style={styles.conversationText}>
                    {conversationText ||
                      "Start a conversation with your voice assistant..."}
                  </Text>
                </LinearGradient>

                <LinearGradient
                  colors={["rgba(0, 212, 170, 0.1)", "rgba(8, 145, 178, 0.1)"]}
                  style={styles.responseContainer}
                >
                  <Text style={styles.responseLabel}>Assistant Response</Text>
                  <Text style={styles.responseText}>
                    {assistantResponse || "I'm ready to help you..."}
                  </Text>

                  {isCommandMode && assistantResponse !== "" && (
                    <TouchableOpacity
                      onPress={executeCommand}
                      activeOpacity={0.8}
                      style={styles.executeButtonContainer}
                    >
                      <LinearGradient
                        colors={["#00d4aa", "#0891b2"]}
                        style={styles.executeButton}
                      >
                        <Zap size={scale(16)} color="#ffffff" />
                        <Text style={styles.executeButtonText}>
                          Execute Command
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

export default function ControlScreen() {
  return (
    <ElevenLabsProvider>
      <ControlScreen1 />
    </ElevenLabsProvider>
  );
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {},
  mainContent: {
    flex: 1,
    flexDirection: isDesktop || isTablet ? "row" : "column",
    padding: spacing(16),
    gap: spacing(16),
    alignItems: "stretch",
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: scale(16),
    padding: spacing(18),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing(16),
  },
  cardTitle: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#f1f5f9",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(100, 116, 139, 0.3)",
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(5),
    borderRadius: scale(16),
    gap: spacing(6),
  },
  statusBadgeActive: {
    backgroundColor: "rgba(0, 212, 170, 0.2)",
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: "#64748b",
  },
  statusDotActive: {
    backgroundColor: "#00d4aa",
  },
  statusText: {
    fontSize: scale(10),
    fontWeight: "600",
    color: "#94a3b8",
  },
  statusTextActive: {
    color: "#00d4aa",
  },
  statusGrid: {
    flexDirection: isTablet || isDesktop ? "row" : "column",
    gap: spacing(12),
    marginBottom: spacing(16),
  },
  statusItem: {
    flex: 1,
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    padding: spacing(12),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  statusLabel: {
    fontSize: scale(11),
    color: "#94a3b8",
    marginBottom: spacing(3),
    fontWeight: "500",
  },
  statusValue: {
    fontSize: scale(13),
    fontWeight: "600",
    color: "#f1f5f9",
  },
  progressSection: {
    marginBottom: spacing(12),
  },
  progressLabel: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(6),
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
  },
  progressBar: {
    flex: 1,
    height: scale(4),
    backgroundColor: "rgba(100, 116, 139, 0.3)",
    borderRadius: scale(2),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: scale(2),
  },
  progressText: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "#00d4aa",
    minWidth: scale(30),
  },
  quickActionsSection: {
    marginTop: spacing(4),
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(8),
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing(12),
  },
  actionButtonContainer: {
    flex: isDesktop ? 0 : 1,
    minWidth: isDesktop ? scale(180) : scale(180),
    maxWidth: isDesktop ? scale(180) : scale(180),
  },
  actionButton: {
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(8),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
    minHeight: scale(36),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: scale(14),
    fontWeight: "600",
    textAlign: "center",
  },
  voiceScrollView: {
    flex: 1,
    maxHeight: scale(400),
  },
  voiceScrollContent: {
    flexGrow: 1,
    paddingBottom: spacing(16),
  },
  voiceIndicator: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing(16),
    position: "relative",
  },
  waveRing: {
    position: "absolute",
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 2,
    borderColor: "#3b82f6",
    opacity: 0.3,
  },
  pulseRing: {
    position: "absolute",
    width: scale(85),
    height: scale(85),
    borderRadius: scale(42.5),
    borderWidth: 2,
    borderColor: "#1d4ed8",
    opacity: 0.5,
  },
  micButton: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: scale(30),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  micButtonActive: {
    backgroundColor: "#f87171",
  },
  micButtonProcessing: {
    backgroundColor: "#a855f7",
  },
  ballContainer: {
    width: scale(90),
    height: scale(16),
    marginVertical: spacing(12),
    position: "relative",
    alignSelf: "center",
  },
  animatedBall: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#3b82f6",
    position: "absolute",
    top: scale(4),
  },
  voiceStatus: {
    fontSize: scale(13),
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: spacing(16),
    fontWeight: "500",
  },
  conversationSection: {
    gap: spacing(12),
  },
  conversationContainer: {
    padding: spacing(12),
    borderRadius: scale(10),
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  conversationLabel: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "#60a5fa",
    marginBottom: spacing(6),
  },
  conversationText: {
    fontSize: scale(13),
    color: "#e2e8f0",
    fontStyle: "italic",
    lineHeight: scale(18),
  },
  responseContainer: {
    padding: spacing(12),
    borderRadius: scale(10),
    borderLeftWidth: 3,
    borderLeftColor: "#00d4aa",
  },
  responseLabel: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "#34d399",
    marginBottom: spacing(6),
  },
  responseText: {
    fontSize: scale(13),
    color: "#e2e8f0",
    lineHeight: scale(18),
    marginBottom: spacing(12),
  },
  executeButtonContainer: {
    alignSelf: "flex-start",
  },
  executeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(8),
    borderRadius: scale(8),
    gap: spacing(6),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  executeButtonText: {
    color: "#ffffff",
    fontSize: scale(11),
    fontWeight: "600",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  loaderText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
