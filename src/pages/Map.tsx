import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Dimensions,
  ImageBackground,
  Modal,
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
import logo from "../../assets/images/logob.png";
import SharedHeader from "../../components/SharedHeader";

import { LinearGradient } from "expo-linear-gradient";
import {
  Activity,
  Award,
  Calendar,
  CircleCheck as CheckCircle,
  Clock,
  MapPin,
  Navigation,
  X,
  Circle as XCircle,
} from "lucide-react-native";
import { BeatingCircle } from "../../components/BeatingCircle";

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
  if (isDesktop) return size * 1.4;
  if (isTablet) return size * 1.2;
  if (isMobileLarge) return size * 1.1;
  return size;
};

const spacing = (size: number) => {
  if (isDesktop) return size * 1.5;
  if (isTablet) return size * 1.3;
  return size;
};

export default function MapScreen() {
  const [selectedView, setSelectedView] = useState("current");
  const [activeTab, setActiveTab] = useState("Live Status");

  // Logo animation
  const logoScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withRepeat(
      withTiming(1.05, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const [robotStatus, setRobotStatus] = useState({
    batteryTime: "4h 20m",
    isActive: true,
    connectionStatus: "connected" as "connected" | "disconnected",
    currentLocation: "Main Bathroom - Toilet Area",
    nextLocation: "Main Bathroom - Sink Area",
    progress: 68,
    timeRemaining: "12:45",
    cleaningMode: "Deep Clean",
  });

  const [mapData] = useState({
    batteryLevel: 85,
    batteryTime: "4h 20m",
    isActive: true,
    connectionStatus: "connected" as "connected" | "disconnected",
  });

  const [locationMap] = useState([
    {
      id: 1,
      name: "Charging Dock",
      x: 20,
      y: 20,
      status: "completed",
      type: "dock",
    },
    {
      id: 2,
      name: "Main Bathroom - Floor",
      x: 60,
      y: 40,
      status: "completed",
      type: "floor",
    },
    {
      id: 3,
      name: "Main Bathroom - Toilet Area",
      x: 80,
      y: 60,
      status: "active",
      type: "toilet",
    },
    {
      id: 4,
      name: "Main Bathroom - Sink Area",
      x: 40,
      y: 80,
      status: "pending",
      type: "sink",
    },
    {
      id: 5,
      name: "Guest Bathroom",
      x: 20,
      y: 80,
      status: "pending",
      type: "bathroom",
    },
  ]);

  const [cleaningHistory] = useState<CleaningSession[]>([
    {
      id: 1,
      cleaning: "1",
      date: "Main Bathroom With Sink - L1 Floor",
      status: "completed",
      duration: "25m",
      rooms: 2,
      toilet: "toilet",
      positionLeft: "24%",
      positionTop: "79%",
    },

    {
      id: 3,
      cleaning: "1",
      date: "Toilet - L1 Floor",
      status: "completed",
      duration: "30m",
      rooms: 1,
      toilet: "Toilet",
      positionLeft: "97%",
      positionTop: "60%",
    },
    {
      id: 2,

      date: "Toilet - L1 Floor",
      status: "failed",
      duration: "30m",
      rooms: 1,
      toilet: "Toilet",
      positionLeft: "99%",
      positionTop: "85%",
    },
  ]);

  const [weeklyStats] = useState({
    totalCleans: 12,
    totalTime: "8h 24m",
    averageEfficiency: 94,
    issuesResolved: 3,
  });

  const [batteryStatus] = useState({
    level: 85,
    status: "good",
    estimatedTime: "4h 20m",
    isCharging: false,
  });

  const tabs = [
    { name: "Live Status", icon: MapPin, color: "#3b82f6" },
    { name: "History", icon: Clock, color: "#3b82f6" },
    { name: "Schedule", icon: Calendar, color: "#3b82f6" },
  ];
  type CleaningSession = {
    id: number;
    cleaning?: string;
    date: string;
    status: string;
    duration: string;
    rooms: number;
    toilet: string;
    positionLeft?: string;
    positionTop?: string;
  };

  const [selectedSession, setSelectedSession] =
    useState<CleaningSession | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openPopup = (session: CleaningSession) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  const closePopup = () => {
    setModalVisible(false);
    setSelectedSession(null);
  };

  // Animation values
  const pulseValue = useSharedValue(1);
  const progressValue = useSharedValue(0);

  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    scaleAnim.value = withRepeat(
      withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  useEffect(() => {
    if (robotStatus.isActive) {
      pulseValue.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );
    } else {
      pulseValue.value = withTiming(1);
    }

    progressValue.value = withTiming(robotStatus.progress / 100, {
      duration: 1000,
    });
  }, [robotStatus.isActive, robotStatus.progress]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Announce tab change for screen readers
    AccessibilityInfo.announceForAccessibility(`${tabName} tab selected`);
  };

  const getLocationColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "active":
        return "#3b82f6";
      case "pending":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={scale(16)} color="#10b981" />;
      case "interrupted":
        return <XCircle size={scale(16)} color="#ef4444" />;
      default:
        return <Clock size={scale(16)} color="#6b7280" />;
    }
  };

  const getBatteryColor = (level: number): string => {
    if (level > 50) return "#00d4aa";
    if (level > 20) return "#fbbf24";
    return "#f87171";
  };

  const getConnectionColor = (status: string) => {
    return status === "connected" ? "#00d4aa" : "#f87171";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Live Status":
        return (
          <LinearGradient
            colors={["rgba(15, 23, 42, 0.95)", "rgba(30, 41, 59, 0.95)"]}
            style={styles.card}
          >
            <ScrollView
              style={styles.liveStatusScrollView}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <View>
                <View style={styles.mapContainer}>
                  <View style={styles.mapWithLegendContainer}>
                    <ImageBackground
                      source={require("../../assets/images/review1.png")}
                      style={styles.gridMapWithLegend}
                      imageStyle={{ resizeMode: "contain", opacity: 0.9 }}
                    >
                      {/* Travelled Path Dots */}
                      <View
                        style={{
                          right: "28%",
                          bottom: "22%",
                        }}
                      >
                        <BeatingCircle
                          style={{
                            backgroundColor: "#3882f6",
                            width: scale(15),
                            height: scale(15),
                            borderRadius: scale(6),
                            position: "absolute",
                          }}
                        />
                      </View>
                      <Animated.Image
                        source={logo}
                        style={[
                          {
                            width: scale(40), // size of the small logo
                            height: scale(40),
                            position: "absolute",
                            top: "50%", // adjust position as needed
                            left: "33%",
                            borderRadius: scale(8),
                          },
                          animatedStyle,
                        ]}
                        resizeMode="contain"
                      />
                    </ImageBackground>

                    {/* Legend - Right side of map */}
                  </View>
                  <View style={styles.legendsBelow}>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: "#00a181" },
                        ]}
                      />
                      <Text style={styles.legendText}>Robot Position</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: "black" },
                        ]}
                      />
                      <Text style={styles.legendText}>Completed Path</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          {
                            backgroundColor: "#3B82F6",
                            borderRadius: 0,
                            borderWidth: 3,
                          },
                        ]}
                      />
                      <Text style={styles.legendText}>Next Target</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: "#239c65" },
                        ]}
                      />
                      <Text style={styles.legendText}>Cleaned</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: "#cd7d49" },
                        ]}
                      />
                      <Text style={styles.legendText}>Pending</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: "#d71b24" },
                        ]}
                      />
                      <Text style={styles.legendText}>Failed</Text>
                    </View>
                  </View>

                  <View style={styles.mapBottomSection}>
                    <View style={styles.locationDetails}>
                      <View style={styles.locationItem}>
                        <MapPin size={scale(16)} color="#10b981" />
                        <Text style={styles.locationText}>
                          Current: Grid 2,3 - {robotStatus.currentLocation}
                        </Text>
                      </View>
                      <View style={styles.locationItem}>
                        <Navigation size={scale(16)} color="#3b82f6" />
                        <Text style={styles.locationText}>
                          Target: Grid 4,2 - {robotStatus.nextLocation}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cleaningProgress}>
                      <View style={styles.progressHeader}>
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: robotStatus.isActive
                                ? "#10b981"
                                : "#6b7280",
                            },
                          ]}
                        />
                        <View style={styles.progressInfo}>
                          <Text style={styles.progressMode}>
                            {robotStatus.isActive ? "CLEANING" : "STANDBY"}
                          </Text>
                          <Text style={styles.progressType}>
                            {robotStatus.cleaningMode}
                          </Text>
                        </View>
                        <Text style={styles.progressPercent}>
                          {robotStatus.progress}%
                        </Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${robotStatus.progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressTime}>
                        {robotStatus.timeRemaining} remaining
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        );
      case "History":
        return (
          <LinearGradient
            colors={["rgba(15, 23, 42, 0.95)", "rgba(30, 41, 59, 0.95)"]}
            style={styles.card}
          >
            <View style={styles.mapContainer}>
              <View style={styles.mapWithLegendContainer}>
                <ImageBackground
                  source={require("../../assets/images/review2.png")}
                  style={styles.gridMapWithLegend}
                  imageStyle={{ resizeMode: "contain", opacity: 0.8 }}
                >
                  {/* Start Position Marker (assuming fixed) */}
                  <View
                    style={[styles.startMarker, { left: "10%", top: "16%" }]}
                  >
                    <View style={styles.startMarkerInner}>
                      <Text style={styles.markerText}>S</Text>
                    </View>
                  </View>

                  {/* Historical Markers rendered dynamically */}
                  {cleaningHistory.map((session, index) => {
                    // Choose style based on status
                    const isFailed = session.status === "failed";
                    const markerStyle = isFailed
                      ? styles.failedMarker
                      : styles.completedMarker;
                    const markerInnerStyle = isFailed
                      ? styles.failedMarkerInner
                      : styles.completedMarkerInner;
                    // Convert percentage string to number of pixels based on container size (assume 360x360 as in gridMapWithLegend)
                    const mapWidth = scale(360);
                    const mapHeight = scale(360);
                    const leftPercent = parseFloat(
                      session.positionLeft || "40"
                    );
                    const topPercent = parseFloat(session.positionTop || "40");
                    const left = (leftPercent / 100) * mapWidth;
                    const top = (topPercent / 100) * mapHeight;

                    // Marker label: number for completed, ! for failed
                    const label = isFailed ? "!" : session.cleaning ?? "1";

                    return (
                      <TouchableOpacity
                        key={session.id}
                        style={[markerStyle, { left, top }]}
                        onPress={() => openPopup(session)}
                        activeOpacity={0.7}
                      >
                        <View style={markerInnerStyle}>
                          <Text style={styles.markerText}>{label}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ImageBackground>
              </View>

              {/* Legends - unchanged */}
            </View>
            <View style={styles.legendsBelow}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#239c65" }]}
                />
                <Text style={styles.legendText}>Cleaned</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#cd7d49" }]}
                />
                <Text style={styles.legendText}>Pending</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#d71b24" }]}
                />
                <Text style={styles.legendText}>Failed</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#8b5cf6" }]}
                />
                <Text style={styles.legendText}>Start</Text>
              </View>
            </View>

            {/* Popup Modal */}
            <Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={closePopup}
            >
              <View style={styles.modalOverlay}>
                <TouchableOpacity
                  style={styles.modalBackdrop}
                  onPress={closePopup}
                  activeOpacity={1}
                />
                <View style={styles.modalContainer}>
                  <LinearGradient
                    colors={["#1e293b", "#334155", "#475569"]}
                    style={styles.modalGradient}
                  >
                    {selectedSession && (
                      <>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                          <View style={styles.modalTitleContainer}>
                            <LinearGradient
                              colors={["#3b82f6", "#1d4ed8"]}
                              style={styles.modalIconContainer}
                            >
                              <Clock size={scale(20)} color="#ffffff" />
                            </LinearGradient>
                            <Text style={styles.modalTitle}>
                              Session Details
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={closePopup}
                            activeOpacity={0.7}
                          >
                            <X size={scale(20)} color="#94a3b8" />
                          </TouchableOpacity>
                        </View>

                        {/* Session Status Badge */}
                        <View style={styles.modalStatusContainer}>
                          <View
                            style={[
                              styles.modalStatusBadge,
                              {
                                backgroundColor:
                                  selectedSession.status === "completed"
                                    ? "rgba(16, 185, 129, 0.2)"
                                    : "rgba(239, 68, 68, 0.2)",
                              },
                            ]}
                          >
                            {selectedSession.status === "completed" ? (
                              <CheckCircle size={scale(16)} color="#10b981" />
                            ) : (
                              <XCircle size={scale(16)} color="#ef4444" />
                            )}
                            <Text
                              style={[
                                styles.modalStatusText,
                                {
                                  color:
                                    selectedSession.status === "completed"
                                      ? "#10b981"
                                      : "#ef4444",
                                },
                              ]}
                            >
                              {selectedSession.status.toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        {/* Session Details */}
                        <View style={styles.modalDetailsContainer}>
                          <View style={styles.modalDetailRow}>
                            <View style={styles.modalDetailLabel}>
                              <MapPin size={scale(16)} color="#60a5fa" />
                              <Text style={styles.modalDetailLabelText}>
                                Location
                              </Text>
                            </View>
                            <Text style={styles.modalDetailValue}>
                              {selectedSession.date}
                            </Text>
                          </View>

                          <View style={styles.modalDetailRow}>
                            <View style={styles.modalDetailLabel}>
                              <Clock size={scale(16)} color="#60a5fa" />
                              <Text style={styles.modalDetailLabelText}>
                                Duration
                              </Text>
                            </View>
                            <Text style={styles.modalDetailValue}>
                              {selectedSession.duration}
                            </Text>
                          </View>

                          <View style={styles.modalDetailRow}>
                            <View style={styles.modalDetailLabel}>
                              <Activity size={scale(16)} color="#60a5fa" />
                              <Text style={styles.modalDetailLabelText}>
                                {selectedSession.status == "failed"
                                  ? "Failed"
                                  : "Area Cleaned"}
                              </Text>
                            </View>
                            <Text style={styles.modalDetailValue}>
                              {selectedSession.status === "failed"
                                ? "Toilet Broken"
                                : `${selectedSession.rooms} areas`}
                            </Text>
                          </View>

                          <View style={styles.modalDetailRow}>
                            <View style={styles.modalDetailLabel}>
                              <Award size={scale(16)} color="#60a5fa" />
                              <Text style={styles.modalDetailLabelText}>
                                Type
                              </Text>
                            </View>
                            <Text style={styles.modalDetailValue}>
                              {selectedSession.toilet}
                            </Text>
                          </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.modalActionsContainer}>
                          <TouchableOpacity
                            style={styles.modalSecondaryButton}
                            onPress={closePopup}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.modalSecondaryText}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </LinearGradient>
                </View>
              </View>
            </Modal>

            {/* History List - unchanged */}
          </LinearGradient>
        );

      case "Schedule":
        return (
          <LinearGradient
            colors={["rgba(15, 23, 42, 0.95)", "rgba(30, 41, 59, 0.95)"]}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Cleaning Schedule</Text>
            </View>

            <ScrollView
              style={styles.scheduleScrollView}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <View style={styles.scheduleList}>
                {[
                  {
                    time: "08:00 AM",
                    location: "Main Bathroom",
                    type: "Daily Deep Clean",
                    status: "Active",
                    color: "#3b82f6",
                  },
                  {
                    time: "02:00 PM",
                    location: "Guest Bathroom",
                    type: "Quick Clean",
                    status: "Scheduled",
                    color: "#10b981",
                  },
                  {
                    time: "06:30 PM",
                    location: "Main Bathroom",
                    type: "Evening Touch-up",
                    status: "Pending",
                    color: "#f59e0b",
                  },
                  {
                    time: "10:00 PM",
                    location: "Both Bathrooms",
                    type: "Night Maintenance",
                    status: "Scheduled",
                    color: "#8b5cf6",
                  },
                  {
                    time: "08:00 AM",
                    location: "Main Bathroom",
                    type: "Daily Deep Clean",
                    status: "Active",
                    color: "#3b82f6",
                  },
                  {
                    time: "02:00 PM",
                    location: "Guest Bathroom",
                    type: "Quick Clean",
                    status: "Scheduled",
                    color: "#10b981",
                  },
                  {
                    time: "06:30 PM",
                    location: "Main Bathroom",
                    type: "Evening Touch-up",
                    status: "Pending",
                    color: "#f59e0b",
                  },
                  {
                    time: "10:00 PM",
                    location: "Both Bathrooms",
                    type: "Night Maintenance",
                    status: "Scheduled",
                    color: "#8b5cf6",
                  },
                ].map((item, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <View style={styles.scheduleTime}>
                      <Clock size={scale(16)} color={item.color} />
                      <Text style={styles.scheduleTimeText}>{item.time}</Text>
                    </View>
                    <View style={styles.scheduleDetails}>
                      <Text style={styles.scheduleLocation}>
                        {item.location}
                      </Text>
                      <Text style={styles.scheduleType}>{item.type}</Text>
                    </View>
                    <View
                      style={[
                        styles.scheduleBadge,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <Text style={styles.scheduleBadgeText}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </LinearGradient>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.backgroundGradient}
      />

      <SharedHeader
        title="CleanBot Map"
        batteryLevel={mapData.batteryLevel}
        batteryTime={mapData.batteryTime}
        isRobotActive={mapData.isActive}
        connectionStatus={mapData.connectionStatus}
      />

      {/* Sticky Horizontal Tabs */}
      <View style={styles.stickyTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
          style={styles.tabsScrollView}
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.horizontalTabButton,
                  isActive && styles.horizontalTabButtonActive,
                ]}
                onPress={() => handleTabPress(tab.name)}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${tab.name} tab`}
                accessibilityHint={`Switch to ${tab.name} view`}
              >
                <LinearGradient
                  colors={
                    isActive
                      ? [tab.color, `${tab.color}CC`]
                      : ["rgba(51, 65, 85, 0.8)", "rgba(71, 85, 105, 0.8)"]
                  }
                  style={styles.horizontalTabGradient}
                >
                  <IconComponent
                    size={scale(18)}
                    color={isActive ? "#ffffff" : "#94a3b8"}
                  />
                  <Text
                    style={[
                      styles.horizontalTabText,
                      isActive && styles.horizontalTabTextActive,
                    ]}
                  >
                    {tab.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
          <View style={styles.locationTabs}>
            {["L1", "L2", "L3", "L4"].map((location, index) => (
              <TouchableOpacity
                key={location}
                style={[
                  styles.locationTab,
                  index === 0 && styles.locationTabActive,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.locationTabText,
                    index === 0 && styles.locationTabTextActive,
                  ]}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  stickyTabsContainer: {
    position: "absolute",
    top: spacing(isDesktop ? 80 : 80),
    left: 0,
    right: 0,
    zIndex: 10,

    borderBottomColor: "rgba(148, 163, 184, 0.2)",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? spacing(44) : spacing(24),
    paddingBottom: spacing(16),
    paddingHorizontal: spacing(16),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(12),
  },
  logoContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(30, 58, 138, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  logoPlaceholder: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: spacing(4),
  },
  headerSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
  },
  headerSubtitle: {
    fontSize: scale(12),
    color: "#dbeafe",
    fontWeight: "500",
  },
  headerStats: {
    alignItems: "flex-end",
    gap: spacing(4),
  },
  statValue: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: scale(10),
    color: "#dbeafe",
    fontWeight: "500",
  },
  splitContainer: {
    flex: 1,
    flexDirection: isDesktop || isTablet ? "row" : "column",
    gap: spacing(16),
    padding: spacing(16),
  },
  tabsScrollView: {
    flexGrow: 0,
  },
  sidebar: {
    width: isDesktop || isTablet ? scale(200) : "100%",
    height: isDesktop || isTablet ? undefined : "auto",
    padding: spacing(16),
    borderRadius: scale(16),
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
        elevation: 8,
      },
    }),
  },
  sidebarTitle: {
    fontSize: scale(12),
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: spacing(12),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sidebarTabs: {
    flexDirection: isDesktop || isTablet ? "column" : "row",
    gap: spacing(8),
  },
  tabsScrollContent: {
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(12),
    gap: spacing(8),
    alignItems: "center",
  },
  horizontalTabButton: {
    borderRadius: scale(10),
    overflow: "hidden",
    minWidth: scale(isDesktop ? 120 : 100),
  },
  horizontalTabButtonActive: {
    // Additional active styles if needed
  },
  sidebarTab: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing(12),
    borderRadius: scale(12),
    gap: spacing(8),
    backgroundColor: "rgba(51, 65, 85, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  horizontalTabGradient: {
    paddingVertical: spacing(12),
    paddingHorizontal: spacing(12),
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    justifyContent: "center",
  },
  sidebarTabActive: {
    backgroundColor: "rgba(59, 130, 246, 0.8)",
    borderColor: "rgba(59, 130, 246, 0.4)",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sidebarTabText: {
    fontSize: scale(10),
    fontWeight: "600",
    color: "#94a3b8",
    textAlign: "center",
  },
  sidebarTabTextActive: {
    color: "#ffffff",
  },
  contentArea: {
    flex: 1,
  },
  contentScrollContent: {
    paddingBottom: spacing(10),
  },
  card: {
    borderRadius: scale(20),
    padding: spacing(24),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    marginBottom: spacing(16),
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  backgroundLogoContainer: {
    position: "absolute",
    top: spacing(20),
    right: spacing(20),
    zIndex: 0,
  },
  logoWrapper: {
    opacity: 0.15,
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backgroundLogo: {
    width: scale(40),
    height: scale(40),
  },
  liveStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing(16),
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing(20),
  },
  cardTitle: {
    fontSize: scale(17.6),
    fontWeight: "700",
    color: "#f1f5f9",
  },
  locationTabs: {
    flexDirection: "row",
    gap: spacing(8),
    marginLeft: "45%",
  },
  locationTab: {
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(6),
    borderRadius: scale(8),
    minWidth: scale(32),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  locationTabActive: {
    backgroundColor: "rgba(59, 130, 246, 0.9)",
  },
  locationTabText: {
    fontSize: scale(9.6),
    fontWeight: "600",
    color: "#94a3b8",
  },
  locationTabTextActive: {
    color: "#ffffff",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(51, 65, 85, 0.6)",
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(6),
    borderRadius: scale(8),
    gap: spacing(6),
  },
  filterText: {
    fontSize: scale(9.6),
    fontWeight: "600",
    color: "#94a3b8",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(8),
    borderRadius: scale(8),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addButtonText: {
    fontSize: scale(11.2),
    fontWeight: "600",
    color: "#ffffff",
  },
  mapContainer: {
    flexDirection: "column",
    gap: spacing(16),
    borderRadius: scale(16),
    overflow: "hidden",
    marginBottom: spacing(20),
    width: "100%",
  },
  mapWithLegendContainer: {
    gap: spacing(16),
    flex: 1,
  },
  gridMap: {
    height: scale(400),
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    width: "100%",
  },
  gridMapWithLegend: {
    height: scale(360),
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  pathDot: {
    position: "absolute",
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    zIndex: 1,
    transform: [{ translateX: -scale(3) }, { translateY: -scale(3) }],
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeDot: {
    backgroundColor: "#10b981",
    opacity: 0.9,
  },
  cleanedDot: {
    backgroundColor: "#3b82f6",
    opacity: 0.7,
  },
  completedDot: {
    backgroundColor: "#10b981",
    opacity: 0.6,
  },
  failedDot: {
    backgroundColor: "#ef4444",
    opacity: 0.7,
  },
  startMarker: {
    position: "absolute",
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -scale(14) }, { translateY: -scale(14) }],
    zIndex: 3,
  },
  startMarkerInner: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cleanedMarker: {
    position: "absolute",
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -scale(12) }, { translateY: -scale(12) }],
    zIndex: 3,
  },
  cleanedMarkerInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  completedMarker: {
    position: "absolute",
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -scale(12) }, { translateY: -scale(12) }],
    zIndex: 3,
  },
  completedMarkerInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  failedMarker: {
    position: "absolute",
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -scale(12) }, { translateY: -scale(12) }],
    zIndex: 3,
  },
  failedMarkerInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  markerText: {
    fontSize: scale(8),
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  targetMarkerInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    position: "absolute",
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  robotPosition: {
    position: "absolute",
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -scale(16) }, { translateY: -scale(16) }],
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  targetPosition: {
    position: "absolute",
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -scale(12) }, { translateY: -scale(12) }],
  },
  targetRing: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    borderWidth: 2,
    borderColor: "#f59e0b",
    borderStyle: "dashed",
    opacity: 0.8,
  },
  mapBottomSection: {
    flexDirection: isTablet || isDesktop ? "row" : "column",
    gap: spacing(16),
  },
  locationDetails: {
    flex: 1,
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    padding: spacing(16),
    borderRadius: scale(12),
    gap: spacing(8),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
  },
  locationText: {
    fontSize: scale(11.2),
    color: "#e2e8f0",
    flex: 1,
    fontWeight: "500",
  },
  cleaningProgress: {
    flex: 1,
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    padding: spacing(16),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing(8),
    gap: spacing(8),
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  progressInfo: {
    flex: 1,
  },
  progressMode: {
    fontSize: scale(9.6),
    fontWeight: "700",
    color: "#f1f5f9",
  },
  progressType: {
    fontSize: scale(8),
    color: "#94a3b8",
  },
  progressPercent: {
    fontSize: scale(11.2),
    fontWeight: "700",
    color: "#10b981",
  },
  progressBarContainer: {
    height: scale(4),
    backgroundColor: "rgba(100, 116, 139, 0.3)",
    borderRadius: scale(2),
    overflow: "hidden",
    marginBottom: spacing(4),
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00d4aa",
    borderRadius: scale(2),
  },
  progressTime: {
    fontSize: scale(8),
    color: "#94a3b8",
    textAlign: "center",
  },
  legend: {
    flex: isDesktop || isTablet ? 0.7 : undefined,
    width: isDesktop || isTablet ? undefined : "100%",
    height: "60%",
    minWidth: isDesktop || isTablet ? scale(160) : undefined,
    maxWidth: isDesktop || isTablet ? scale(180) : undefined,
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: scale(12),
    padding: spacing(16),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  legendTitle: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(12),
  },
  legendGrid: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: spacing(10),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    minWidth: "10%",
  },
  legendColor: {
    width: scale(9),
    height: scale(9),
    borderRadius: scale(6),
  },
  legendText: {
    fontSize: scale(8),
    fontWeight: "600",
    color: "white",
  },
  horizontalTabText: {
    fontSize: scale(11),
    fontWeight: "500",
    color: "#94a3b8",
  },
  horizontalTabTextActive: {
    color: "#ffffff",
  },
  historyList: {
    gap: spacing(12),
  },
  mainScrollView: {
    flex: 1,
    marginTop: spacing(isDesktop ? 60 : 60),
  },
  scrollContent: {
    padding: spacing(16),
    paddingBottom: spacing(32),
  },
  sectionTitle: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(16),
  },
  additionalContent: {
    gap: spacing(16),
  },
  contentCard: {
    padding: spacing(20),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  contentTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(8),
  },
  contentDescription: {
    fontSize: scale(12),
    color: "#94a3b8",
    lineHeight: scale(18),
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    padding: spacing(16),
    borderRadius: scale(12),
    gap: spacing(12),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  historyIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: scale(11.2),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(2),
  },
  historyDetails: {
    fontSize: scale(9.6),
    color: "#94a3b8",
  },
  historyBadge: {
    backgroundColor: "rgba(51, 65, 85, 0.4)",
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(4),
    borderRadius: scale(6),
  },
  historyBadgeText: {
    fontSize: scale(10),
    fontWeight: "600",
    textTransform: "uppercase",
  },
  scheduleScrollView: {
    maxHeight: scale(400),
  },
  scheduleList: {
    gap: spacing(12),
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    padding: spacing(16),
    borderRadius: scale(12),
    gap: spacing(16),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  scheduleTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    minWidth: scale(100),
  },
  legendsBelow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(30),
    width: scale(50),
    marginLeft: 20,
  },
  scheduleTimeText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#e2e8f0",
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleLocation: {
    fontSize: scale(11.2),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(2),
  },
  scheduleType: {
    fontSize: scale(9.6),
    color: "#94a3b8",
  },
  scheduleBadge: {
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(4),
    borderRadius: scale(6),
  },
  scheduleBadgeText: {
    fontSize: scale(8),
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  liveStatusScrollView: {
    flex: 1,
    maxHeight: scale(500),
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00d4aa",
  },
  marker: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  nextCircle: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: "#3B82F6",
  },
  // New Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing(20),
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: "80%",
    height: "100%",
    maxWidth: scale(400),
    borderRadius: scale(20),

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalGradient: {
    padding: spacing(24),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing(2),
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(12),
    marginTop: spacing(0),
  },
  modalIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#f1f5f9",
  },
  modalCloseButton: {
    width: scale(36),
    height: scale(26),
    borderRadius: scale(18),
    backgroundColor: "rgba(100, 116, 139, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalStatusContainer: {
    alignItems: "center",
    marginBottom: spacing(24),
  },
  modalStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(8),
    borderRadius: scale(20),
    gap: spacing(8),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  modalStatusText: {
    fontSize: scale(14),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalDetailsContainer: {
    gap: spacing(16),
    marginBottom: spacing(24),
  },
  modalDetailRow: {
    flexDirection: "row",
    height: scale(40),
    paddingHorizontal: spacing(16),
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(51, 65, 85, 0.3)",
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  modalDetailLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    flex: 1,
  },
  modalDetailLabelText: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#94a3b8",
  },
  modalDetailValue: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#f1f5f9",
    textAlign: "right",
    flex: 1,
  },
  modalActionsContainer: {
    flexDirection: "row",
    gap: spacing(12),
  },
  modalActionButton: {
    flex: 1,
    borderRadius: scale(12),
    overflow: "hidden",
    height: scale(34),
  },
  modalActionGradient: {
    paddingVertical: spacing(14),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalActionText: {
    fontSize: scale(14),
    fontWeight: "700",
    color: "#ffffff",
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.3)",
    height: scale(34),
  },
  modalSecondaryText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#94a3b8",
  },
  // Fixed Header Styles
  fixedHeader: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    paddingHorizontal: spacing(24),
    paddingTop: spacing(20),
    paddingBottom: spacing(16),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  fixedHeaderTitle: {
    fontSize: scale(17.6),
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: spacing(16),
  },
  fixedLocationTabs: {
    flexDirection: "row",
    gap: spacing(8),
    justifyContent: "center",
  },
  scrollableContent: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    paddingHorizontal: spacing(24),
    paddingTop: spacing(16),
    paddingBottom: spacing(24),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "rgba(148, 163, 184, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  popupContainer: {
    width: "85%",
    backgroundColor: "#111827", // dark background matching second image
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 15,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e0e7ff", // light text color
    marginBottom: 16,
  },
  popupText: {
    color: "#cbd5e1", // lighter but subtle text color for details
    fontSize: 15,
    marginBottom: 8,
  },
  statusValue: {
    fontSize: scale(13),
    fontWeight: "600",
    color: "#f1f5f9",
    textAlign: "center",
  },
  liveStatusContainer: {
    alignItems: "center",
    gap: spacing(8),
  },
  logoStatusWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoHalo: {
    position: "absolute",
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: "#3b82f6",
    opacity: 0.3,
  },
  particleRing: {
    position: "absolute",
    width: scale(50),
    height: scale(50),
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
    width: scale(3),
    height: scale(3),
    borderRadius: scale(1.5),
    backgroundColor: "#60a5fa",
  },
  logoImage: {
    width: scale(32),
    height: scale(32),
    zIndex: 2,
  },
  shineContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: scale(8),
  },
  shineOverlay: {
    position: "absolute",
    width: scale(20),
    height: "200%",
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    top: "-50%",
  },
});
