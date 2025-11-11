import React, { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  Navigation,
  X,
  CheckCircle,
  XCircle,
  Activity,
  Award,
  Calendar,
} from "lucide-react";

import image1 from "../assets/images/review1.png";
import image2 from "../assets/images/review2.png";
import image from "../assets/images/logob.png";
import SharedHeader from "../components/SharedHeader";

// Responsive breakpoints
const getResponsiveSize = () => {
  const width = window.innerWidth;
  if (width >= 1200) return "desktop";
  if (width >= 768) return "tablet";
  if (width >= 480) return "mobile-large";
  return "mobile";
};

// Dynamic sizing functions
const scale = (size) => {
  const responsiveSize = getResponsiveSize();
  if (responsiveSize === "desktop") return size * 1.4;
  if (responsiveSize === "tablet") return size * 1.2;
  if (responsiveSize === "mobile-large") return size * 1.1;
  return size;
};

const spacing = (size) => {
  const responsiveSize = getResponsiveSize();
  if (responsiveSize === "desktop") return size * 1.5;
  if (responsiveSize === "tablet") return size * 1.3;
  return size;
};

// BeatingCircle Component
const BeatingCircle = ({ style }) => {
  return (
    <div
      className="beating-circle"
      style={{
        ...style,
        animation: "beat 1.5s ease-in-out infinite",
      }}
    />
  );
};

export default function Map() {
  const [selectedView, setSelectedView] = useState("current");
  const [activeTab, setActiveTab] = useState("Live Status");
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [robotStatus] = useState({
    batteryTime: "4h 20m",
    isActive: true,
    connectionStatus: "connected",
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
    connectionStatus: "connected",
  });

  const [cleaningHistory] = useState([
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

  const tabs = [
    { name: "Live Status", icon: MapPin, color: "#3b82f6" },
    { name: "History", icon: Clock, color: "#3b82f6" },
    { name: "Schedule", icon: Calendar, color: "#3b82f6" },
  ];

  const openPopup = (session) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  const closePopup = () => {
    setModalVisible(false);
    setSelectedSession(null);
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={scale(16)} color="#10b981" />;
      case "interrupted":
        return <XCircle size={scale(16)} color="#ef4444" />;
      default:
        return <Clock size={scale(16)} color="#6b7280" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Live Status":
        return (
          <div style={styles.card as React.CSSProperties}>
            <div style={styles.liveStatusScrollView as React.CSSProperties}>
              <div style={styles.mapContainer as React.CSSProperties}>
                <div
                  style={styles.mapWithLegendContainer as React.CSSProperties}
                >
                  <div style={styles.gridMapWithLegend as React.CSSProperties}>
                    <img
                      src={image1}
                      alt="Floor Map"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        opacity: 0.9,
                        position: "absolute",
                      }}
                    />

                    {/* Travelled Path Dot */}
                    <div
                      style={{
                        position: "absolute",
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
                    </div>

                    {/* Robot Logo */}
                    <div
                      className="pulsing-logo"
                      style={{
                        width: scale(40),
                        height: scale(40),
                        position: "absolute",
                        top: "50%",
                        left: "33%",
                        borderRadius: scale(8),
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: scale(20),
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    >
                      <img
                        src={image}
                        alt="Floor Map"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.legendsBelow as React.CSSProperties}>
                  <div style={styles.legendItem as React.CSSProperties}>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#00a181",
                      }}
                    />
                    <span style={styles.legendText}>Robot Position</span>
                  </div>
                  <div style={styles.legendItem as React.CSSProperties}>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "black",
                      }}
                    />
                    <span style={styles.legendText}>Completed Path</span>
                  </div>
                  <div style={styles.legendItem as React.CSSProperties}>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#3B82F6",
                        borderRadius: 0,
                        border: "3px solid #3B82F6",
                      }}
                    />
                    <span style={styles.legendText}>Next Target</span>
                  </div>
                  <div style={styles.legendItem as React.CSSProperties}>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#239c65",
                      }}
                    />
                    <span style={styles.legendText}>Cleaned</span>
                  </div>
                  <div style={styles.legendItem as React.CSSProperties}>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#cd7d49",
                      }}
                    />
                    <span style={styles.legendText}>Pending</span>
                  </div>
                  <div style={styles.legendItem as React.CSSProperties}>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#d71b24",
                      }}
                    />
                    <span style={styles.legendText}>Failed</span>
                  </div>
                </div>

                <div style={styles.mapBottomSection as React.CSSProperties}>
                  <div style={styles.locationDetails as React.CSSProperties}>
                    <div style={styles.locationItem as React.CSSProperties}>
                      <MapPin size={scale(16)} color="#10b981" />
                      <span style={styles.locationText}>
                        Current: Grid 2,3 - {robotStatus.currentLocation}
                      </span>
                    </div>
                    <div style={styles.locationItem as React.CSSProperties}>
                      <Navigation size={scale(16)} color="#3b82f6" />
                      <span style={styles.locationText}>
                        Target: Grid 4,2 - {robotStatus.nextLocation}
                      </span>
                    </div>
                  </div>

                  <div style={styles.cleaningProgress}>
                    <div style={styles.progressHeader as React.CSSProperties}>
                      <div
                        style={{
                          ...styles.statusDot,
                          backgroundColor: robotStatus.isActive
                            ? "#10b981"
                            : "#6b7280",
                        }}
                      />
                      <div style={styles.progressInfo}>
                        <span style={styles.progressMode}>
                          {robotStatus.isActive ? "CLEANING" : "STANDBY"}
                        </span>
                        <span style={styles.progressType}>
                          {robotStatus.cleaningMode}
                        </span>
                      </div>
                      <span style={styles.progressPercent}>
                        {robotStatus.progress}%
                      </span>
                    </div>
                    <div style={styles.progressBarContainer}>
                      <div
                        style={{
                          ...styles.progressBar,
                          width: `${robotStatus.progress}%`,
                        }}
                      />
                    </div>
                    <span style={styles.progressTime as React.CSSProperties}>
                      {robotStatus.timeRemaining} remaining
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "History":
        return (
          <div style={styles.card as React.CSSProperties}>
            <div style={styles.mapContainer as React.CSSProperties}>
              <div style={styles.mapWithLegendContainer as React.CSSProperties}>
                <div style={styles.gridMapWithLegend as React.CSSProperties}>
                  <img
                    src={image2}
                    alt="History Map"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      opacity: 0.8,
                      position: "absolute",
                    }}
                  />

                  {/* Start Position Marker */}
                  <div
                    style={{
                      ...(styles.startMarker as React.CSSProperties),
                      left: "10%",
                      top: "16%",
                    }}
                  >
                    <div style={styles.startMarkerInner as React.CSSProperties}>
                      <span style={styles.markerText as React.CSSProperties}>
                        S
                      </span>
                    </div>
                  </div>

                  {/* Historical Markers */}
                  {cleaningHistory.map((session) => {
                    const isFailed = session.status === "failed";
                    const markerStyle = isFailed
                      ? (styles.failedMarker as React.CSSProperties)
                      : (styles.completedMarker as React.CSSProperties);
                    const markerInnerStyle = isFailed
                      ? styles.failedMarkerInner
                      : styles.completedMarkerInner;
                    const label = isFailed ? "!" : session.cleaning ?? "1";

                    return (
                      <div
                        key={session.id}
                        style={{
                          ...markerStyle,
                          left: session.positionLeft,
                          top: session.positionTop,
                          cursor: "pointer",
                        }}
                        onClick={() => openPopup(session)}
                      >
                        <div style={markerInnerStyle}>
                          <span
                            style={styles.markerText as React.CSSProperties}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={styles.legendsBelow as React.CSSProperties}>
              <div style={styles.legendItem as React.CSSProperties}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#239c65" }}
                />
                <span style={styles.legendText}>Cleaned</span>
              </div>
              <div style={styles.legendItem as React.CSSProperties}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#cd7d49" }}
                />
                <span style={styles.legendText}>Pending</span>
              </div>
              <div style={styles.legendItem as React.CSSProperties}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#d71b24" }}
                />
                <span style={styles.legendText}>Failed</span>
              </div>
              <div style={styles.legendItem as React.CSSProperties}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#8b5cf6" }}
                />
                <span style={styles.legendText}>Start</span>
              </div>
            </div>

            {/* Modal */}
            {modalVisible && selectedSession && (
              <div
                style={styles.modalOverlay as React.CSSProperties}
                onClick={closePopup}
              >
                <div
                  style={styles.modalContainer as React.CSSProperties}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={styles.modalGradient}>
                    <div style={styles.modalHeader as React.CSSProperties}>
                      <div
                        style={
                          styles.modalTitleContainer as React.CSSProperties
                        }
                      >
                        <div style={styles.modalIconContainer}>
                          <Clock size={scale(20)} color="#ffffff" />
                        </div>
                        <h2 style={styles.modalTitle}>Session Details</h2>
                      </div>
                      <button
                        style={styles.modalCloseButton}
                        onClick={closePopup}
                      >
                        <X size={scale(20)} color="#94a3b8" />
                      </button>
                    </div>

                    <div style={styles.modalStatusContainer}>
                      <div
                        style={{
                          ...(styles.modalStatusBadge as React.CSSProperties),
                          backgroundColor:
                            selectedSession.status === "completed"
                              ? "rgba(16, 185, 129, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        {selectedSession.status === "completed" ? (
                          <CheckCircle size={scale(16)} color="#10b981" />
                        ) : (
                          <XCircle size={scale(16)} color="#ef4444" />
                        )}
                        <span
                          style={{
                            ...styles.modalStatusText,
                            color:
                              selectedSession.status === "completed"
                                ? "#10b981"
                                : "#ef4444",
                          }}
                        >
                          {selectedSession.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div
                      style={
                        styles.modalDetailsContainer as React.CSSProperties
                      }
                    >
                      <div style={styles.modalDetailRow as React.CSSProperties}>
                        <div
                          style={styles.modalDetailLabel as React.CSSProperties}
                        >
                          <MapPin size={scale(16)} color="#60a5fa" />
                          <span style={styles.modalDetailLabelText}>
                            Location
                          </span>
                        </div>
                        <span
                          style={styles.modalDetailValue as React.CSSProperties}
                        >
                          {selectedSession.date}
                        </span>
                      </div>

                      <div style={styles.modalDetailRow as React.CSSProperties}>
                        <div
                          style={styles.modalDetailLabel as React.CSSProperties}
                        >
                          <Clock size={scale(16)} color="#60a5fa" />
                          <span style={styles.modalDetailLabelText}>
                            Duration
                          </span>
                        </div>
                        <span
                          style={styles.modalDetailValue as React.CSSProperties}
                        >
                          {selectedSession.duration}
                        </span>
                      </div>

                      <div style={styles.modalDetailRow as React.CSSProperties}>
                        <div
                          style={styles.modalDetailLabel as React.CSSProperties}
                        >
                          <Activity size={scale(16)} color="#60a5fa" />
                          <span style={styles.modalDetailLabelText}>
                            {selectedSession.status === "failed"
                              ? "Failed"
                              : "Area Cleaned"}
                          </span>
                        </div>
                        <span
                          style={styles.modalDetailValue as React.CSSProperties}
                        >
                          {selectedSession.status === "failed"
                            ? "Toilet Broken"
                            : `${selectedSession.rooms} areas`}
                        </span>
                      </div>

                      <div style={styles.modalDetailRow as React.CSSProperties}>
                        <div
                          style={styles.modalDetailLabel as React.CSSProperties}
                        >
                          <Award size={scale(16)} color="#60a5fa" />
                          <span style={styles.modalDetailLabelText}>Type</span>
                        </div>
                        <span
                          style={styles.modalDetailValue as React.CSSProperties}
                        >
                          {selectedSession.toilet}
                        </span>
                      </div>
                    </div>

                    <div
                      style={
                        styles.modalActionsContainer as React.CSSProperties
                      }
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "Schedule":
        return (
          <div style={styles.card as React.CSSProperties}>
            <div style={styles.cardHeader as React.CSSProperties}>
              <h2 style={styles.cardTitle}>Cleaning Schedule</h2>
            </div>

            <div style={styles.scheduleScrollView as React.CSSProperties}>
              <div style={styles.scheduleList as React.CSSProperties}>
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
                ].map((item, index) => (
                  <div
                    key={index}
                    style={styles.scheduleItem as React.CSSProperties}
                  >
                    <div style={styles.scheduleTime as React.CSSProperties}>
                      <Clock size={scale(16)} color={item.color} />
                      <span style={styles.scheduleTimeText}>{item.time}</span>
                    </div>
                    <div style={styles.scheduleDetails as React.CSSProperties}>
                      <span style={styles.scheduleLocation}>
                        {item.location}
                      </span>
                      <span style={styles.scheduleType}>{item.type}</span>
                    </div>
                    <div
                      style={{
                        ...styles.scheduleBadge,
                        backgroundColor: item.color,
                      }}
                    >
                      <span
                        style={styles.scheduleBadgeText as React.CSSProperties}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <style>{`
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={styles.backgroundGradient as React.CSSProperties} />

      <SharedHeader
        title="CleanBot Map"
        batteryLevel={mapData.batteryLevel}
        batteryTime={mapData.batteryTime}
        isRobotActive={mapData.isActive}
        connectionStatus={mapData.connectionStatus}
      />

      {/* Sticky Tabs */}
      <div style={styles.stickyTabsContainer as React.CSSProperties}>
        <div style={styles.tabsScrollView as React.CSSProperties}>
          <div style={styles.tabsScrollContent as React.CSSProperties}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.name;

              return (
                <button
                  key={tab.name}
                  style={{
                    ...styles.horizontalTabButton,
                    background: isActive
                      ? `linear-gradient(135deg, ${tab.color}, ${tab.color}CC)`
                      : "linear-gradient(135deg, rgba(51, 65, 85, 0.8), rgba(71, 85, 105, 0.8))",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTabPress(tab.name)}
                >
                  <div
                    style={styles.horizontalTabGradient as React.CSSProperties}
                  >
                    <IconComponent
                      size={scale(18)}
                      color={isActive ? "#ffffff" : "#94a3b8"}
                    />
                    <span
                      style={{
                        ...styles.horizontalTabText,
                        color: isActive ? "#ffffff" : "#94a3b8",
                      }}
                    >
                      {tab.name}
                    </span>
                  </div>
                </button>
              );
            })}
            <div style={styles.locationTabs as React.CSSProperties}>
              {["L1", "L2", "L3", "L4"].map((location, index) => (
                <button
                  key={location}
                  style={{
                    ...(styles.locationTab as React.CSSProperties),
                    ...(index === 0 ? styles.locationTabActive : {}),
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      ...styles.locationTabText,
                      ...(index === 0 ? styles.locationTabTextActive : {}),
                    }}
                  >
                    {location}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainScrollView as React.CSSProperties}>
        <div style={styles.scrollContent}>{renderTabContent()}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  backgroundGradient: {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: "linear-gradient(180deg, #0f172a, #1e293b, #334155)",
    zIndex: -1,
  },
  header: {
    paddingTop: spacing(24),
    paddingBottom: spacing(16),
    paddingLeft: spacing(16),
    paddingRight: spacing(16),
    background:
      "linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(59, 130, 246, 0.2))",
  },
  headerContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(12),
  },
  logoContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(30, 58, 138, 0.3)",
    boxShadow: "0 0 25px rgba(59, 130, 246, 0.8)",
  },
  logoPlaceholder: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    display: "flex",
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
    display: "flex",
    alignItems: "flex-end",
    gap: spacing(4),
  },
  statValue: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#ffffff",
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  stickyTabsContainer: {
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.95)",
  },
  tabsScrollView: {
    overflowX: "auto",
    display: "flex",
  },
  tabsScrollContent: {
    display: "flex",
    flexDirection: "row",
    padding: `${spacing(12)}px ${spacing(16)}px`,
    gap: spacing(8),
    alignItems: "center",
  },
  horizontalTabButton: {
    borderRadius: scale(10),
    overflow: "hidden",
    minWidth: scale(100),
  },
  horizontalTabGradient: {
    padding: `${spacing(12)}px ${spacing(12)}px`,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    justifyContent: "center",
  },
  horizontalTabText: {
    fontSize: scale(11),
    fontWeight: "500",
  },
  locationTabs: {
    display: "flex",
    flexDirection: "row",
    gap: spacing(8),
    marginLeft: "500px",
  },
  locationTab: {
    background: "rgba(51, 65, 85, 0.5)",
    padding: `${spacing(6)}px ${spacing(12)}px`,
    borderRadius: scale(8),
    minWidth: scale(32),
    textAlign: "center",
  },
  locationTabActive: {
    background: "rgba(59, 130, 246, 0.9)",
  },
  locationTabText: {
    fontSize: scale(9.6),
    fontWeight: "600",
    color: "#94a3b8",
  },
  locationTabTextActive: {
    color: "#ffffff",
  },
  mainScrollView: {
    flex: 1,
    overflowY: "auto",
  },
  scrollContent: {
    padding: spacing(16),
    paddingBottom: spacing(32),
  },
  card: {
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))",
    borderRadius: scale(20),
    padding: spacing(24),
    border: "1px solid rgba(148, 163, 184, 0.2)",
    marginBottom: spacing(16),
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  },
  cardHeader: {
    display: "flex",
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
  liveStatusScrollView: {
    maxHeight: scale(500),
    overflowY: "auto",
  },
  mapContainer: {
    display: "flex",
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
  gridMapWithLegend: {
    height: scale(360),
    background: "rgba(15, 23, 42, 0.9)",
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  legendsBelow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(30),
    flexWrap: "wrap",
    marginLeft: 20,
  },
  legendItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
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
  mapBottomSection: {
    display: "flex",
    flexDirection: "row",
    gap: spacing(16),
    flexWrap: "wrap",
  },
  locationDetails: {
    flex: 1,
    minWidth: "250px",
    background: "rgba(51, 65, 85, 0.5)",
    padding: spacing(16),
    borderRadius: scale(12),
    display: "flex",
    flexDirection: "column",
    gap: spacing(8),
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  locationItem: {
    display: "flex",
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
    minWidth: "250px",
    background: "rgba(51, 65, 85, 0.5)",
    padding: spacing(16),
    borderRadius: scale(12),
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  progressHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing(8),
    gap: spacing(8),
  },
  progressInfo: {
    flex: 1,
  },
  progressMode: {
    fontSize: scale(9.6),
    fontWeight: "700",
    color: "#f1f5f9",
    display: "block",
  },
  progressType: {
    fontSize: scale(8),
    color: "#94a3b8",
    display: "block",
  },
  progressPercent: {
    fontSize: scale(11.2),
    fontWeight: "700",
    color: "#10b981",
  },
  progressBarContainer: {
    height: scale(4),
    background: "rgba(100, 116, 139, 0.3)",
    borderRadius: scale(2),
    overflow: "hidden",
    marginBottom: spacing(4),
  },
  progressBar: {
    height: "100%",
    background: "#00d4aa",
    borderRadius: scale(2),
    transition: "width 1s ease",
  },
  progressTime: {
    fontSize: scale(8),
    color: "#94a3b8",
    textAlign: "center",
    display: "block",
  },
  startMarker: {
    position: "absolute",
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: `translate(-${scale(14)}px, -${scale(14)}px)`,
    zIndex: 3,
  },
  startMarkerInner: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    background: "#8b5cf6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  completedMarker: {
    position: "absolute",
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: `translate(-${scale(12)}px, -${scale(12)}px)`,
    zIndex: 3,
  },
  completedMarkerInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    background: "#10b981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  failedMarker: {
    position: "absolute",
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: `translate(-${scale(12)}px, -${scale(12)}px)`,
    zIndex: 3,
  },
  failedMarkerInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    background: "#ef4444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  markerText: {
    fontSize: scale(8),
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  scheduleScrollView: {
    maxHeight: scale(400),
    overflowY: "auto",
  },
  scheduleList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing(12),
  },
  scheduleItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "rgba(51, 65, 85, 0.5)",
    padding: spacing(16),
    borderRadius: scale(12),
    gap: spacing(16),
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  scheduleTime: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    minWidth: scale(100),
  },
  scheduleTimeText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#e2e8f0",
  },
  scheduleDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  scheduleLocation: {
    fontSize: scale(11.2),
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: spacing(2),
    display: "block",
  },
  scheduleType: {
    fontSize: scale(9.6),
    color: "#94a3b8",
    display: "block",
  },
  scheduleBadge: {
    padding: `${spacing(4)}px ${spacing(8)}px`,
    borderRadius: scale(6),
  },
  scheduleBadgeText: {
    fontSize: scale(8),
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 5,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing(20),
    zIndex: 1000,
  },
  modalContainer: {
    width: "90%",
    maxWidth: scale(400),
    maxHeight: "80vh",

    borderRadius: scale(20),
    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.4)",
  },
  modalGradient: {
    background: "linear-gradient(135deg, #1e293b, #334155, #475569)",
    padding: spacing(24),
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing(16),
  },
  modalTitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(12),
  },
  modalIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
  },
  modalTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#f1f5f9",
  },
  modalCloseButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    background: "rgba(100, 116, 139, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
  },
  modalStatusContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing(24),
  },
  modalStatusBadge: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: `${spacing(8)}px ${spacing(16)}px`,
    borderRadius: scale(20),
    gap: spacing(8),
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },
  modalStatusText: {
    fontSize: scale(10),
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  modalDetailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: spacing(8),
    marginBottom: spacing(24),
  },
  modalDetailRow: {
    display: "flex",
    flexDirection: "row",
    height: scale(30),
    padding: `0 ${spacing(16)}px`,
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(51, 65, 85, 0.3)",
    borderRadius: scale(12),
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  modalDetailLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    flex: 1,
  },
  modalDetailLabelText: {
    fontSize: scale(10),
    fontWeight: "600",
    color: "#94a3b8",
  },
  modalDetailValue: {
    fontSize: scale(10),
    fontWeight: "600",
    color: "#f1f5f9",
    textAlign: "right",
    flex: 1,
  },
  modalActionsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: spacing(12),
  },
  modalSecondaryButton: {
    flex: 1,
    background: "rgba(100, 116, 139, 0.2)",
    borderRadius: scale(12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(148, 163, 184, 0.3)",
    height: scale(44),
    cursor: "pointer",
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
  modalSecondaryText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#94a3b8",
  },
};
