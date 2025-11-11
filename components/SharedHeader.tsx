import { LinearGradient } from "expo-linear-gradient";
import { Activity, Battery, Wifi } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

// Dynamic sizing functions
const scale = (size: number) => {
  "worklet";
  if (isDesktop) return size * 1.3;
  if (isTablet) return size * 1.15;
  return size;
};

const spacing = (size: number) => {
  if (isDesktop) return size * 1.4;
  if (isTablet) return size * 1.2;
  return size;
};

interface SharedHeaderProps {
  title: string;
  subtitle?: string;
  batteryLevel: number;
  batteryTime: string;
  isRobotActive: boolean;
  connectionStatus: "connected" | "disconnected";
}

export default function SharedHeader({
  title,
  subtitle,
  batteryLevel,
  batteryTime,
  isRobotActive,
  connectionStatus,
}: SharedHeaderProps) {
  const getBatteryColor = (level: number) => {
    if (level > 50) return "#00d4aa";
    if (level > 20) return "#fbbf24";
    return "#f87171";
  };

  const getConnectionColor = (status: string) => {
    return status === "connected" ? "#00d4aa" : "#f87171";
  };

  return (
    <LinearGradient
      colors={["#1e40af", "#3b82f6", "#60a5fa"]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={["#ffffff", "#f1f5f9"]}
            style={styles.logoPlaceholder}
          >
            <Image
              source={logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSubtitleContainer}>
            <Wifi
              size={scale(14)}
              color={getConnectionColor(connectionStatus)}
            />
            <Text style={styles.headerSubtitle}>
              {subtitle ||
                (connectionStatus === "connected"
                  ? "Connected"
                  : "Disconnected")}
            </Text>
          </View>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Battery size={scale(20)} color={getBatteryColor(batteryLevel)} />
            <View style={styles.statInfo}>
              <Text
                style={[
                  styles.statValue,
                  { color: getBatteryColor(batteryLevel) },
                ]}
              >
                {batteryLevel}%
              </Text>
              <Text style={styles.statLabel}>{batteryTime}</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Activity
              size={scale(20)}
              color={isRobotActive ? "#00d4aa" : "#64748b"}
            />
            <View style={styles.statInfo}>
              <Text
                style={[
                  styles.statValue,
                  { color: isRobotActive ? "#00d4aa" : "#64748b" },
                ]}
              >
                {isRobotActive ? "ACTIVE" : "IDLE"}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing(16),
    paddingTop: spacing(32),
    paddingBottom: spacing(12),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    height: spacing(80), // Fixed height to prevent layout shifts
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: isDesktop ? "row" : "row",
    alignItems: isDesktop ? "center" : "center",
    gap: spacing(12),
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoPlaceholder: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoText: {
    fontSize: scale(16),
    fontWeight: "700",
    color: "#1e40af",
    letterSpacing: 0.5,
  },
  headerText: {
    flex: isDesktop ? 1 : undefined,
    alignItems: isDesktop ? "flex-start" : "flex-start",
    marginTop: isDesktop ? 0 : spacing(6),
    minHeight: scale(40), // Prevent text reflow
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: spacing(3),
    textAlign: isDesktop ? "left" : "center",
    lineHeight: scale(24), // Fixed line height
  },
  headerSubtitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing(6),
    minHeight: scale(16), // Prevent layout shift
  },
  headerSubtitle: {
    fontSize: scale(12),
    color: "#dbeafe",
    fontWeight: "500",
    lineHeight: scale(16), // Fixed line height
  },
  headerStats: {
    flexDirection: "row",
    gap: spacing(16),
    marginBottom: isDesktop ? spacing(12) : spacing(12),
    marginLeft: spacing(370),

    justifyContent: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(8),
    borderRadius: scale(10),
    gap: spacing(8),
    minWidth: scale(80), // Prevent width changes
    minHeight: scale(36), // Fixed height
  },
  statInfo: {
    alignItems: "flex-start",
    minWidth: scale(40), // Prevent text reflow
  },
  statValue: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: scale(16), // Fixed line height
  },
  statLabel: {
    fontSize: scale(10),
    color: "#dbeafe",
    fontWeight: "500",
    lineHeight: scale(12), // Fixed line height
  },
  logoImage: {
    width: scale(42),
    height: scale(42),
  },
});
