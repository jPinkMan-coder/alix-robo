import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Map, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Outlet />

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(30, 41, 59, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "2rem",
          padding: "0.5rem",
          display: "flex",
          gap: "0.5rem",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          zIndex: 1000,
          height: "3.5rem",
          alignItems: "center",
          width: "20rem",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "0.75rem 1.25rem",
            borderRadius: "1.5rem",
            textDecoration: "none",
            background: "transparent",
            color: "#ef4444",
            transition: "all 0.2s",
            gap: "0.25rem",
            border: "none",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <Link
          to="/control"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            borderRadius: "1.5rem",
            textDecoration: "none",
            background:
              location.pathname === "/control"
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            color: location.pathname === "/control" ? "#3b82f6" : "#94a3b8",
            transition: "all 0.2s",
            gap: "0.25rem",
          }}
        >
          <Home size={20} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Control</span>
        </Link>
        <Link
          to="/map"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            borderRadius: "1.5rem",
            textDecoration: "none",
            background:
              location.pathname === "/map"
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            color: location.pathname === "/map" ? "#3b82f6" : "#94a3b8",
            transition: "all 0.2s",
            gap: "0.25rem",
          }}
        >
          <Map size={20} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Map</span>
        </Link>
      </nav>
    </div>
  );
}
