import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { FaLock, FaTimes } from "react-icons/fa";
import logo from "../assets/images/logo2.png";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const glowControls = useAnimation();
  const shineControls = useAnimation();
  const logoControls = useAnimation();

  useEffect(() => {
    const loopGlow = async () => {
      while (true) {
        await glowControls.start({ opacity: 1, transition: { duration: 2.2 } });
        await glowControls.start({ opacity: 0.4, transition: { duration: 2.2 } });
      }
    };

    const loopShine = async () => {
      while (true) {
        await shineControls.start({
          x: "150%",
          opacity: [0, 0.8, 0],
          transition: { duration: 1.8, ease: "easeInOut" },
        });
        await new Promise((r) => setTimeout(r, 3000));
        shineControls.set({ x: "-150%" });
      }
    };

    loopGlow();
    loopShine();
  }, [glowControls, shineControls]);

  const handleEnterPress = () => {
    logoControls
      .start({
        scale: [1, 0.95, 1],
        transition: { duration: 0.2 },
      })
      .then(() => setShowPasswordModal(true));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length === 6) {
      if (value === "123456") {
        const success = login(value);
        if (success) {
          setShowPasswordModal(false);
          setPassword("");
          navigate("/control");
        }
      } else {
        alert("Incorrect password. Please try again.");
        setPassword("");
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155, #1e40af, #3b82f6)",
      }}
    >
      {/* Logo Section */}
      <motion.div
        onClick={handleEnterPress}
        animate={logoControls}
        style={{
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 160,
            height: 160,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.7)",
            background: "linear-gradient(145deg, #0f172a, #1e3a8a, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.img
            src={logo}
            alt="logo"
            animate={glowControls}
            style={{
              width: 130,
              height: 130,
              objectFit: "contain",
              filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))",
              zIndex: 2,
            }}
          />
          <motion.div
            animate={shineControls}
            initial={{ x: "-150%" }}
            style={{
              position: "absolute",
              top: "-50%",
              left: 0,
              width: 60,
              height: "200%",
              background: "rgba(255, 255, 255, 0.4)",
              transform: "rotate(25deg)",
            }}
          />
        </div>
      </motion.div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #334155)",
              borderRadius: 16,
              padding: 24,
              maxWidth: 350,
              width: "90%",
              color: "#f1f5f9",
              textAlign: "center",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  background: "rgba(100, 116, 139, 0.3)",
                  border: "none",
                  borderRadius: 6,
                  padding: 6,
                  cursor: "pointer",
                  color: "#9ca3af",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(145deg, #374151, #4b5563)",
                  borderRadius: "50%",
                  width: 64,
                  height: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaLock size={28} color="#3b82f6" />
              </div>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                Enter 6-digit password to access CleanBot Control
              </p>
              <input
                type="password"
                maxLength={6}
                value={password}
                onChange={handlePasswordChange}
                autoFocus
                style={{
                  background: "rgba(51, 65, 85, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 16,
                  color: "#f1f5f9",
                  textAlign: "center",
                  letterSpacing: 6,
                  width: "100%",
                  outline: "none",
                  marginTop: 4,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
