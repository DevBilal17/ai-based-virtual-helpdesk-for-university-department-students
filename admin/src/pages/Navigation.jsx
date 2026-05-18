import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import IndoorMap from "../components/map/IndoorMap";
import { ROOMS } from "../data/constants";
import SidebarContent from "../components/map/SidebarContent";


export default function Navigation() {
  const [searchParams] = useSearchParams();
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  const nodeId = searchParams.get("nodeId");
  const intent = searchParams.get("intent");

  const [startRoom, setStartRoom] = useState(null);
  const [endRoom, setEndRoom] = useState(null);

  const getRoomInfo = (doorNodeId) => {
    const room = ROOMS.find((r) => r.doorNodeId === doorNodeId);

    return {
      exists: !!room,
      roomId: room?.id,
      name: room?.name,
    };
  };

  useEffect(() => {
    if (!nodeId) return;

    const roomInfo = getRoomInfo(nodeId);

    if (!roomInfo.exists) return;

    if (intent === "from") {
      setStartRoom(roomInfo.roomId);
    } else {
      setEndRoom(roomInfo.roomId);
    }
  }, [nodeId, intent]);

return (
  <div style={styles.page}>
    
    {/* HEADER */}
    <div style={styles.header}>
      <div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Department Navigation
        </div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          IT Dept • Yousaf Block • 2nd Floor
        </div>
      </div>
    </div>

    {/* MAP AREA */}
    <div style={styles.mapArea}>
      
      <IndoorMap
        startRoom={startRoom}
        endRoom={endRoom}
        setStartRoom={setStartRoom}
        setEndRoom={setEndRoom}
      />

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <div style={styles.sidebar}>
          <SidebarContent
            startRoom={startRoom}
            endRoom={endRoom}
            setStartRoom={setStartRoom}
            setEndRoom={setEndRoom}
          />
        </div>
      )}

      {/* MOBILE BOTTOM SHEET */}
      {isMobile && (
        <div style={styles.mobileSheet}>
          <SidebarContent
            startRoom={startRoom}
            endRoom={endRoom}
            setStartRoom={setStartRoom}
            setEndRoom={setEndRoom}
          />
        </div>
      )}

    </div>
  </div>
);
}
const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#050816",
    color: "white",
    overflow: "hidden",
  },

  header: {
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: "rgba(5,8,22,0.8)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    zIndex: 10,
  },

  mapArea: {
    flex: 1,
    position: "relative",
  },

  // desktop sidebar overlay (IMPORTANT FIX)
  sidebar: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 280,
    height: "calc(100% - 40px)",
    background: "rgba(10,12,30,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 12,
    overflowY: "auto",
    backdropFilter: "blur(10px)",
  },

  // mobile bottom sheet style
  mobileSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "45vh",
    background: "rgba(10,12,30,0.98)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 12,
    overflowY: "auto",
    boxShadow: "0 -10px 30px rgba(0,0,0,0.4)",
  },
};