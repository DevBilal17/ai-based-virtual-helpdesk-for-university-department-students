import React from "react";
import SidebarContent from "./SidebarContent";

export default function MobileBottomSheet(props) {
  return (
    <div style={styles.sheet}>
      <div style={styles.handle} />

      <SidebarContent {...props} isMobile />
    </div>
  );
}

const styles = {
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#0F1424",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 12,
    zIndex: 999,
    marginBottom: 20,
  },

  handle: {
    width: 40,
    height: 4,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    margin: "0 auto 10px",
  },
};
