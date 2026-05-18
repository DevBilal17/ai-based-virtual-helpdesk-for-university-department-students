import React, { useState } from "react";
import { ROOMS } from "../../data/constants";

export default function SidebarContent({
  startRoom,
  endRoom,
  setStartRoom,
  setEndRoom,
}) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const getRoomName = (id) => {
    return ROOMS.find((r) => r.id === id)?.name || "Select Room";
  };

  return (
    <div style={styles.container}>
      
      <h3 style={styles.title}>Navigation Panel</h3>

      {/* START */}
      <div style={styles.block}>
        <div style={styles.label}>START POINT</div>

        <div style={styles.selectBox} onClick={() => setOpenStart(!openStart)}>
          <span>{getRoomName(startRoom)}</span>
          <span style={styles.arrow}>⌄</span>
        </div>

        {openStart && (
          <div style={styles.dropdown}>
            {ROOMS.map((room) => (
              <div
                key={room.id}
                style={styles.item}
                onClick={() => {
                  setStartRoom(room.id);
                  setOpenStart(false);
                }}
              >
                {room.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* END */}
      <div style={styles.block}>
        <div style={styles.label}>DESTINATION</div>

        <div style={styles.selectBox} onClick={() => setOpenEnd(!openEnd)}>
          <span>{getRoomName(endRoom)}</span>
          <span style={styles.arrow}>⌄</span>
        </div>

        {openEnd && (
          <div style={styles.dropdown}>
            {ROOMS.map((room) => (
              <div
                key={room.id}
                style={styles.item}
                onClick={() => {
                  setEndRoom(room.id);
                  setOpenEnd(false);
                }}
              >
                {room.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLEAR */}
      {(startRoom || endRoom) && (
        <button
          style={styles.clearBtn}
          onClick={() => {
            setStartRoom(null);
            setEndRoom(null);
          }}
        >
          Clear Route
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    padding: 12,
    color: "white",
    fontFamily: "system-ui, sans-serif",
  },

  title: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 16,
    opacity: 0.9,
  },

  block: {
    marginBottom: 14,
  },

  label: {
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.6,
    marginBottom: 6,
  },

  selectBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 13,
    transition: "0.2s",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  arrow: {
    fontSize: 12,
    opacity: 0.7,
  },

  dropdown: {
    marginTop: 6,
    background: "#151A2E",
    borderRadius: 10,
    maxHeight: 180,
    overflowY: "auto",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  item: {
    padding: 10,
    fontSize: 13,
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },

  clearBtn: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    background: "#FF4A5A",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
};