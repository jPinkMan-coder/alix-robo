import { RTCPeerConnection } from "@livekit/react-native-webrtc";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Lock, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import logo from "../assets/images/logo2.png";

const { width } = Dimensions.get("window");

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

// Dynamic scaling functions
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

export default function HomeScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  console.log("RTCPeerConnection type:", typeof RTCPeerConnection);

  // Animations
  const shinePosition = useSharedValue(-1);
  const glowIntensity = useSharedValue(0.3);
  const logoScale = useSharedValue(1);

  useEffect(() => {
    // Shine sweep
    shinePosition.value = withRepeat(
      withSequence(
        withDelay(
          2000,
          withTiming(1.5, { duration: 1800, easing: Easing.out(Easing.ease) })
        ),
        withDelay(3000, withTiming(-1, { duration: 0 }))
      ),
      -1,
      false
    );

    // LED pulsing glow
    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const handleEnterPress = () => {
    logoScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setShowPasswordModal(true);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    if (text.length === 6) {
      if (text === "123456") {
        setShowPasswordModal(false);
        setPassword("");
        router.push("/(tabs)");
      } else {
        setPassword("");
        Alert.alert("Error", "Incorrect password. Please try again.");
      }
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setPassword("");
  };

  // Animated styles
  const shineAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shinePosition.value,
      [-1, 1.5],
      [-scale(250), scale(250)]
    );
    const opacity = interpolate(
      shinePosition.value,
      [-1, -0.5, 0.5, 1.5],
      [0, 0.7, 0.7, 0]
    );
    return {
      transform: [{ translateX }, { rotate: "25deg" }],
      opacity,
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowIntensity.value,
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const logoGlowAnimatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowIntensity.value * 0.8,
    shadowRadius: glowIntensity.value * 20,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    elevation: glowIntensity.value * 15,
  }));

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155", "#1e40af", "#3b82f6"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Center logo */}
      <View style={styles.centerContent}>
        <TouchableOpacity onPress={handleEnterPress}>
          <Animated.View
            style={[
              styles.logoWrapper,
              logoAnimatedStyle,
              logoGlowAnimatedStyle,
            ]}
          >
            {/* Main Logo Container */}
            <LinearGradient
              colors={["#0f172a", "#1e3a8a", "#3b82f6"]}
              style={styles.logoContainer}
            >
              <Image
                source={logo}
                style={styles.logoImage}
                resizeMode="contain"
              />

              {/* Shine sweep across logo */}
              <View style={styles.shineContainer}>
                <Animated.View
                  style={[styles.shineOverlay, shineAnimatedStyle]}
                />
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["rgba(30, 41, 59, 0.98)", "rgba(51, 65, 85, 0.98)"]}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleModalClose}
                activeOpacity={0.7}
              >
                <X size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordSection}>
              <LinearGradient
                colors={["#374151", "#4b5563"]}
                style={styles.lockIconContainer}
              >
                <Lock size={32} color="#3b82f6" />
              </LinearGradient>
              <Text style={styles.passwordLabel}>
                Enter 6-digit password to access CleanBot Control
              </Text>

              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="••••••"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry={true}
                autoFocus={true}
              />
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing(32),
  },
  logoWrapper: {
    position: "relative",
    marginBottom: spacing(15),
  },
  logoContainer: {
    width: scale(120 * 1.2),
    height: scale(117 * 1.2),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  logoImage: {
    width: scale(120 * 0.9),
    height: scale(150 * 1.2),
    borderRadius: scale(20),
    zIndex: 2,
  },
  shineContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: scale(20),
  },
  shineOverlay: {
    position: "absolute",
    width: scale(50),
    height: "200%",
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    top: "-50%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing(16),
  },
  modalContainer: {
    borderRadius: scale(16),
    padding: spacing(20),
    width: "100%",
    maxWidth: scale(350),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: spacing(20),
  },
  closeButton: {
    padding: spacing(6),
    borderRadius: scale(6),
    backgroundColor: "rgba(100,116,139,0.3)",
  },
  passwordSection: { alignItems: "center", gap: spacing(12) },
  lockIconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing(8),
  },
  passwordLabel: {
    fontSize: scale(12),
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "500",
  },
  passwordInput: {
    backgroundColor: "rgba(51,65,85,0.5)",
    borderRadius: scale(10),
    padding: spacing(12),
    fontSize: scale(16),
    color: "#f1f5f9",
    textAlign: "center",
    letterSpacing: spacing(6),
    fontWeight: "600",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
  },
});
