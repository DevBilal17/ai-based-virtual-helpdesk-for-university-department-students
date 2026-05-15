import React from "react";
import { View, StyleSheet } from "react-native";

import Svg, {
  Rect,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

export default function IndoorMap({
  start,
  end,
  locations,
  isNavigating,
}) {
  const coords = {
    entrance: { x: 250, y: 470 },

    hod: { x: 90, y: 90 },

    lab: { x: 250, y: 90 },

    lecture1: { x: 90, y: 250 },

    lecture2: { x: 250, y: 250 },

    lecture3: { x: 410, y: 250 },

    library: { x: 90, y: 410 },

    washroom: { x: 410, y: 410 },
  };

  const startPos = coords[start];
  const endPos = coords[end];

  const path = `
    M ${startPos.x} ${startPos.y}
    L ${startPos.x} 330
    L ${endPos.x} 330
    L ${endPos.x} ${endPos.y}
  `;

  const Room = ({ x, y, w, h, title, color }) => (
    <>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="22"
        fill={color}
      />

      <Rect
        x={x + 4}
        y={y + 4}
        width={w - 8}
        height={h - 8}
        rx="18"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        fill="transparent"
      />

      <SvgText
        x={x + w / 2}
        y={y + h / 2 + 5}
        fill="white"
        fontSize="14"
        fontWeight="700"
        textAnchor="middle"
      >
        {title}
      </SvgText>
    </>
  );

  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 500 550"
      >
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#060816" />
            <Stop offset="1" stopColor="#0F172A" />
          </LinearGradient>

          <LinearGradient id="corridor" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#111827" />
            <Stop offset="1" stopColor="#1F2937" />
          </LinearGradient>
        </Defs>

        {/* BACKGROUND */}
        <Rect width="500" height="550" fill="url(#bg)" />

        {/* MAIN CORRIDOR */}
        <Rect
          x="40"
          y="305"
          width="420"
          height="50"
          rx="25"
          fill="url(#corridor)"
        />

        {/* VERTICAL CONNECTOR */}
        <Rect
          x="225"
          y="130"
          width="50"
          height="175"
          rx="20"
          fill="url(#corridor)"
        />

        {/* ENTRANCE */}
        <Rect
          x="190"
          y="470"
          width="120"
          height="45"
          rx="16"
          fill="#0F766E"
        />

        <SvgText
          x="250"
          y="498"
          fill="white"
          fontSize="14"
          fontWeight="700"
          textAnchor="middle"
        >
          MAIN ENTRANCE
        </SvgText>

        {/* TOP ROOMS */}
        <Room
          x={30}
          y={40}
          w={120}
          h={90}
          title="HOD OFFICE"
          color="#1E293B"
        />

        <Room
          x={190}
          y={40}
          w={120}
          h={90}
          title="COMPUTER LAB"
          color="#172554"
        />

        <Room
          x={350}
          y={40}
          w={120}
          h={90}
          title="OFFICE"
          color="#1E293B"
        />

        {/* MIDDLE ROOMS */}
        <Room
          x={30}
          y={200}
          w={120}
          h={90}
          title="LECTURE 1"
          color="#1E293B"
        />

        <Room
          x={190}
          y={200}
          w={120}
          h={90}
          title="LECTURE 2"
          color="#1E293B"
        />

        <Room
          x={350}
          y={200}
          w={120}
          h={90}
          title="LECTURE 3"
          color="#1E293B"
        />

        {/* BOTTOM ROOMS */}
        <Room
          x={30}
          y={380}
          w={140}
          h={90}
          title="LIBRARY"
          color="#312E81"
        />

        <Room
          x={330}
          y={380}
          w={140}
          h={90}
          title="WASHROOM"
          color="#4C1D95"
        />

        {/* NAVIGATION PATH */}
        {isNavigating && (
          <>
            {/* GLOW */}
            <Path
              d={path}
              stroke="#635BFF"
              strokeWidth="18"
              opacity="0.15"
              fill="none"
              strokeLinecap="round"
            />

            {/* MAIN PATH */}
            <Path
              d={path}
              stroke="#8B5CF6"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10 8"
            />
          </>
        )}

        {/* MARKERS */}
        {locations.map((loc) => {
          const point = coords[loc.id];

          if (!point) return null;

          const isStart = loc.id === start;
          const isEnd = loc.id === end;

          return (
            <React.Fragment key={loc.id}>
              {/* OUTER GLOW */}
              <Circle
                cx={point.x}
                cy={point.y}
                r={28}
                fill={
                  isStart
                    ? "rgba(0,245,212,0.15)"
                    : isEnd
                    ? "rgba(255,51,102,0.15)"
                    : "rgba(99,91,255,0.12)"
                }
              />

              {/* INNER */}
              <Circle
                cx={point.x}
                cy={point.y}
                r={12}
                fill={
                  isStart
                    ? "#00F5D4"
                    : isEnd
                    ? "#FF3366"
                    : "#635BFF"
                }
                stroke="white"
                strokeWidth="3"
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060816",
  },
});