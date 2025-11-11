import { useState } from "react";
import { MapPin, Clock } from "lucide-react";

export default function Map() {
  const [activeTab, setActiveTab] = useState("Live Status");
  const [robotStatus] = useState({
    batteryTime: "4h 20m",
    isActive: true,
    connectionStatus: "connected" as const,
    currentLocation: "Main Bathroom - Toilet Area",
    nextLocation: "Main Bathroom - Sink Area",
    progress: 68,
    timeRemaining: "12:45",
    cleaningMode: "Deep Clean",
  });

  const tabs = ["Live Status", "History", "Schedule"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Live Status":
        return (
          <div className="card">
            <div className="map-container">
              <div className="map-placeholder">
                <p className="map-placeholder-text">
                  Interactive map visualization
                </p>
              </div>

              <div className="legend-container">
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#00a181' }}></div>
                  <span className="legend-text">Robot Position</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: 'black' }}></div>
                  <span className="legend-text">Completed Path</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#3B82F6', borderRadius: 0, border: '3px solid #3B82F6' }}></div>
                  <span className="legend-text">Next Target</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#239c65' }}></div>
                  <span className="legend-text">Cleaned</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#cd7d49' }}></div>
                  <span className="legend-text">Pending</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#d71b24' }}></div>
                  <span className="legend-text">Failed</span>
                </div>
              </div>

              <div className="status-grid" style={{ marginTop: '1.5rem' }}>
                <div className="status-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} color="#10b981" />
                    <span className="status-label">Current Location</span>
                  </div>
                  <span className="status-value">Grid 2,3 - {robotStatus.currentLocation}</span>
                </div>
                <div className="status-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} color="#3b82f6" />
                    <span className="status-label">Target Location</span>
                  </div>
                  <span className="status-value">Grid 4,2 - {robotStatus.nextLocation}</span>
                </div>
              </div>

              <div className="progress-section" style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div className="status-dot" style={{ background: robotStatus.isActive ? '#10b981' : '#6b7280' }}></div>
                  <span className="progress-label">
                    {robotStatus.isActive ? 'CLEANING' : 'STANDBY'} - {robotStatus.cleaningMode}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>
                    {robotStatus.progress}%
                  </span>
                </div>
                <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
                  <div className="progress-fill" style={{ width: `${robotStatus.progress}%` }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', display: 'block' }}>
                  {robotStatus.timeRemaining} remaining
                </span>
              </div>
            </div>
          </div>
        );

      case "History":
        return (
          <div className="card">
            <h3 className="section-title">Cleaning History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { id: 1, location: "Main Bathroom With Sink - L1 Floor", status: "completed", duration: "25m", areas: 2 },
                { id: 2, location: "Toilet - L1 Floor", status: "completed", duration: "30m", areas: 1 },
                { id: 3, location: "Toilet - L1 Floor", status: "failed", duration: "30m", areas: 1 },
              ].map((session) => (
                <div key={session.id} className="status-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="status-value">{session.location}</span>
                    <span className={`connection-badge ${session.status}`}>
                      {session.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>Duration: {session.duration}</span>
                    <span>Areas: {session.areas}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Schedule":
        return (
          <div className="card">
            <h3 className="section-title">Cleaning Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { time: "08:00 AM", location: "Main Bathroom", type: "Daily Deep Clean", status: "Active", color: "#3b82f6" },
                { time: "02:00 PM", location: "Guest Bathroom", type: "Quick Clean", status: "Scheduled", color: "#10b981" },
                { time: "06:30 PM", location: "Main Bathroom", type: "Evening Touch-up", status: "Pending", color: "#f59e0b" },
                { time: "10:00 PM", location: "Both Bathrooms", type: "Night Maintenance", status: "Scheduled", color: "#8b5cf6" },
              ].map((item, index) => (
                <div key={index} className="status-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '100px' }}>
                    <Clock size={16} color={item.color} />
                    <span className="status-value" style={{ fontSize: '0.875rem' }}>{item.time}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="status-value" style={{ marginBottom: '0.25rem' }}>{item.location}</div>
                    <div className="status-label">{item.type}</div>
                  </div>
                  <span className="connection-badge" style={{ background: item.color + '33', color: item.color }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">CleanBot Map</h1>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Battery</span>
              <span className="stat-value">85%</span>
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

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="main-content" style={{ gridTemplateColumns: '1fr' }}>
        {renderTabContent ()}
      </div>
    </div>
  );
}
