import React, { useEffect, useMemo, useRef, useState } from "react";


import { NODES, RAW_CONNECTIONS, ROOMS,CORRIDORS } from "../../data/constants";
import { findPath, makeConnectionsBidirectional } from "../../utils/mapFunctions";
import FloorMap from "../../assets/maps/floor_1.svg?react";
const MAP_SIZE = 1200;

export default function IndoorMap({
  startRoom,
  endRoom,
  setStartRoom,
  setEndRoom,
}) {
  const containerRef = useRef(null);

  const [viewport, setViewport] = useState({ width: 0, height: 0 });
const isDragging = useRef(false);
const [isPanning, setIsPanning] = useState(false);
const lastPos = useRef({ x: 0, y: 0 });
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  // ================= INITIAL CENTER =================
  const INITIAL = useMemo(() => {
    if (!viewport.width || !viewport.height) return { x: 0, y: 0 };

    return {
      x: viewport.width / 2 - MAP_SIZE / 2,
      y: viewport.height / 2 - MAP_SIZE / 2,
    };
  }, [viewport]);

  useEffect(() => {
    setTransform((t) => ({
      ...t,
      x: INITIAL.x,
      y: INITIAL.y,
    }));
  }, [INITIAL]);
  const CONNECTIONS = useMemo(() => {
    return makeConnectionsBidirectional(RAW_CONNECTIONS);
  }, []);
  // ================= ROUTE =================
  const route = useMemo(() => {
    if (!startRoom || !endRoom) return [];

    const start = ROOMS.find((r) => r.id === startRoom);
    const end = ROOMS.find((r) => r.id === endRoom);

    if (!start || !end) return [];

    return findPath(
      start.doorNodeId || start.id,
      end.doorNodeId || end.id,
      CONNECTIONS
    );
  }, [startRoom, endRoom]);

  const points = useMemo(() => {
    return route
      .map((id) => NODES.find((n) => n.id === id))
      .filter(Boolean)
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  }, [route]);

  // ================= ROOM FOCUS (SAME LOGIC) =================
  const focusRoom = (room) => {
    if (!viewport.width || !viewport.height) return;

    const targetScale = 2;

    const x = viewport.width / 2 - room.x * targetScale;
    const y = viewport.height / 2 - room.y * targetScale;

    setTransform({
      x,
      y,
      scale: targetScale,
    });
  };

  // ================= ROOM CLICK =================
  const handleRoomClick = (room) => {
    if (!startRoom) setStartRoom(room.id);
    else if (!endRoom) setEndRoom(room.id);
    else {
      setStartRoom(room.id);
      setEndRoom(null);
    }

    focusRoom(room);
  };

  // ================= VIEWPORT =================
  useEffect(() => {
    if (!containerRef.current) return;

    const resize = () => {
      setViewport({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  // ================= WHEEL ZOOM =================
 const handleWheel = (e) => {
  e.preventDefault();

  setTransform((t) => {
    const scaleFactor = 1 - e.deltaY * 0.001;
    const newScale = Math.min(4, Math.max(0.6, t.scale * scaleFactor));

    // mouse position relative to map
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // world position before zoom
    const worldX = (mouseX - t.x) / t.scale;
    const worldY = (mouseY - t.y) / t.scale;

    // new position after zoom
    const newX = mouseX - worldX * newScale;
    const newY = mouseY - worldY * newScale;

    return {
      scale: newScale,
      x: newX,
      y: newY,
    };
  });
};
const stopDrag = () => {
  isDragging.current = false;
  setIsPanning(false);
};
useEffect(() => {
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("mouseleave", stopDrag);

  return () => {
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("mouseleave", stopDrag);
  };
}, []);
  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
     onMouseDown={(e) => {
  isDragging.current = true;
  setIsPanning(true);
  lastPos.current = { x: e.clientX, y: e.clientY };
}}
onTouchStart={(e) => {
  const touch = e.touches[0];
  isDragging.current = true;
  setIsPanning(true);
  lastPos.current = { x: touch.clientX, y: touch.clientY };
}}
onTouchMove={(e) => {
  if (!isDragging.current) return;

  const touch = e.touches[0];

  const dx = touch.clientX - lastPos.current.x;
  const dy = touch.clientY - lastPos.current.y;

  lastPos.current = { x: touch.clientX, y: touch.clientY };

  setTransform((t) => ({
    ...t,
    x: t.x + dx,
    y: t.y + dy,
  }));
}}
onTouchEnd={() => stopDrag()}
 onMouseMove={(e) => {
  if (!isDragging.current) return;

  const dx = e.clientX - lastPos.current.x;
  const dy = e.clientY - lastPos.current.y;

  lastPos.current = { x: e.clientX, y: e.clientY };

  setTransform((t) => ({
    ...t,
    x: t.x + dx,
    y: t.y + dy,
  }));
}}

  style={{
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "#050816",
    position: "relative",cursor: isPanning ? "grabbing" : "grab",
  }}
    >
      {/* MAP WRAPPER */}
      <div
        style={{
          width: MAP_SIZE,
          height: MAP_SIZE,
          position: "absolute",
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
          transition: isPanning ? "none" : "0.25s ease",
        }}
      >
        {/* BASE MAP */}
       <FloorMap width={MAP_SIZE} height={MAP_SIZE} />
<svg
  width={MAP_SIZE}
  height={MAP_SIZE}
  style={{ position: "absolute", top: 0, left: 0 }}
>
  {CORRIDORS.map((c) => (
    <polyline
      key={c.id}
      points={c.points.map((p) => `${p.x},${p.y}`).join(" ")}
      stroke="#2A2F45"
      strokeWidth="4"
      fill="none"
    />
  ))}
</svg>
        {/* ROUTE */}
        {points && (
          <svg
            width={MAP_SIZE}
            height={MAP_SIZE}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <polyline
              points={points}
              stroke="#7C7CFF"
              strokeWidth="6"
              fill="none"
            />
          </svg>
        )}

        {/* ROOMS */}
        {ROOMS.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room)}
            style={{
              position: "absolute",
              left: room.x,
              top: room.y,
              padding: "4px",
              borderRadius: "6px",
              background: "#635BFF",
              color: "white",
              fontSize: "8px",
              cursor: "pointer",
            }}
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  );
}