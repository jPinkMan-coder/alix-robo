import React from "react";
import { Activity, Battery, Wifi } from "lucide-react";
import image from "../assets/images/logo2.png";

// Responsive breakpoints
const getResponsiveSize = () => {
  const width = window.innerWidth;
  if (width >= 1200) return "desktop";
  if (width >= 768) return "tablet";
  if (width >= 480) return "mobile-large";
  return "mobile";
};

const responsiveSize = getResponsiveSize();
const isDesktop = responsiveSize === "desktop";
const isTablet = responsiveSize === "tablet";

// Dynamic sizing functions
const scale = (size) => {
  if (isDesktop) return size * 1.3;
  if (isTablet) return size * 1.15;
  return size;
};

const spacing = (size) => {
  if (isDesktop) return size * 1.4;
  if (isTablet) return size * 1.2;
  return size;
};

const SharedHeader = ({
  title,
  batteryLevel,
  batteryTime,
  isRobotActive,
  connectionStatus,
}) => {
  const getBatteryColor = (level) => {
    if (level > 50) return "#00d4aa";
    if (level > 20) return "#fbbf24";
    return "#f87171";
  };

  const getConnectionColor = (status) => {
    return status === "connected" ? "#00d4aa" : "#f87171";
  };

  return (
    <div style={styles.header}>
      <div style={styles.headerContent as React.CSSProperties}>
        <div style={styles.logoContainer}>
          <div style={styles.logoPlaceholder}>
            {/* <div style={styles.logoImage}> */}
            <img
              src={image}
              alt="Floor Map"
              style={{
                width: "80%",
                height: "80%",
              }}
            />
            {/* </div> */}
          </div>
        </div>

        <div style={styles.headerText as React.CSSProperties}>
          <h1 style={styles.headerTitle as React.CSSProperties}>{title}</h1>
          <div style={styles.headerSubtitleContainer as React.CSSProperties}>
            <Wifi
              size={scale(14)}
              color={getConnectionColor(connectionStatus)}
            />
            <span style={styles.headerSubtitle}>
              {connectionStatus === "connected" ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div style={styles.headerStats as React.CSSProperties}>
          <div style={styles.statItem as React.CSSProperties}>
            <Battery size={scale(20)} color={getBatteryColor(batteryLevel)} />
            <div style={styles.statInfo as React.CSSProperties}>
              <span
                style={{
                  ...styles.statValue,
                  color: getBatteryColor(batteryLevel),
                }}
              >
                {batteryLevel}%
              </span>
              <span style={styles.statLabel}>{batteryTime}</span>
            </div>
          </div>

          <div style={styles.statItem as React.CSSProperties}>
            <Activity
              size={scale(20)}
              color={isRobotActive ? "#00d4aa" : "#64748b"}
            />
            <div style={styles.statInfo as React.CSSProperties}>
              <span
                style={{
                  ...styles.statValue,
                  color: isRobotActive ? "#00d4aa" : "#64748b",
                }}
              >
                {isRobotActive ? "ACTIVE" : "IDLE"}
              </span>
              <span style={styles.statLabel}>Status</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    background: "linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa)",
    paddingLeft: spacing(16),
    paddingRight: spacing(16),
    paddingTop: spacing(32),
    paddingBottom: spacing(12),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    height: spacing(80),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  headerContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(12),
    height: "100%",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholder: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  //   logoImage: {
  //     fontSize: scale(20),
  //     fontWeight: "700",
  //     color: "#1e40af",
  //     letterSpacing: "0.5px",
  //   },
  logoText: {
    fontSize: scale(16),
    fontWeight: "700",
    color: "#1e40af",
    letterSpacing: "0.5px",
  },
  headerText: {
    flex: isDesktop ? 1 : undefined,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: isDesktop ? 0 : spacing(6),
    minHeight: scale(40),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: spacing(3),
    margin: 0,
    textAlign: isDesktop ? "left" : "center",
    lineHeight: `${scale(24)}px`,
  },
  headerSubtitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing(6),
    minHeight: scale(16),
  },
  headerSubtitle: {
    fontSize: scale(12),
    color: "#dbeafe",
    fontWeight: "500",
    lineHeight: `${scale(16)}px`,
  },
  headerStats: {
    display: "flex",
    flexDirection: "row",
    gap: spacing(16),
    marginBottom: spacing(12),
    marginLeft: isDesktop ? spacing(370) : spacing(20),
    justifyContent: "center",
  },
  statItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingLeft: spacing(12),
    paddingRight: spacing(12),
    paddingTop: spacing(8),
    paddingBottom: spacing(8),
    borderRadius: scale(10),
    gap: spacing(8),
    minWidth: scale(80),
    minHeight: scale(36),
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: scale(40),
  },
  statValue: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: `${scale(16)}px`,
  },
  statLabel: {
    fontSize: scale(10),
    color: "#dbeafe",
    fontWeight: "500",
    lineHeight: `${scale(12)}px`,
  },
};

export default SharedHeader;
