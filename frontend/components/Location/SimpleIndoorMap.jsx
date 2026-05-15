import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Circle, Text as SvgText, Path, Defs, LinearGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const SimpleIndoorMap = ({ start, end, locations }) => {
  // Map coordinates for different locations (simplified grid layout)
  const getCoordinates = (locationId) => {
    const coordinates = {
      entrance: { x: 50, y: 450 },
      hod_office: { x: 80, y: 80 },
      prof_sharma: { x: 180, y: 80 },
      prof_verma: { x: 280, y: 80 },
      cs_lab: { x: 80, y: 200 },
      electronics_lab: { x: 220, y: 200 },
      girls_washroom: { x: 380, y: 200 },
      it_hall: { x: 100, y: 320 },
      lecture1: { x: 220, y: 320 },
      lecture2: { x: 340, y: 320 },
      lecture3: { x: 80, y: 400 },
      conference_room: { x: 220, y: 400 },
      library: { x: 340, y: 400 },
      cafeteria: { x: 420, y: 100 },
    };
    return coordinates[locationId] || { x: 250, y: 250 };
  };

  const getLocationName = (id) => {
    const loc = locations.find(l => l.id === id);
    return loc ? loc.name : id;
  };

  const startCoords = getCoordinates(start);
  const endCoords = getCoordinates(end);

  // Calculate path between start and end
  const getPath = () => {
    if (!startCoords || !endCoords) return "";
    return `M ${startCoords.x} ${startCoords.y} 
            L ${(startCoords.x + endCoords.x) / 2} ${startCoords.y}
            L ${(startCoords.x + endCoords.x) / 2} ${endCoords.y}
            L ${endCoords.x} ${endCoords.y}`;
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 500 500">
        {/* Background */}
        <Rect x="0" y="0" width="500" height="500" fill="#0A0A1A" />
        
        {/* Grid lines for reference */}
        {[...Array(10)].map((_, i) => (
          <React.Fragment key={i}>
            <Path
              d={`M ${i * 50} 0 L ${i * 50} 500`}
              stroke="#1a1a3a"
              strokeWidth="0.5"
            />
            <Path
              d={`M 0 ${i * 50} L 500 ${i * 50}`}
              stroke="#1a1a3a"
              strokeWidth="0.5"
            />
          </React.Fragment>
        ))}

        {/* Room blocks */}
        <Rect x="50" y="50" width="100" height="80" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="180" y="50" width="100" height="80" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="310" y="50" width="100" height="80" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="50" y="160" width="140" height="90" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="220" y="160" width="140" height="90" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="390" y="160" width="60" height="90" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="50" y="280" width="120" height="80" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="200" y="280" width="120" height="80" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        <Rect x="350" y="280" width="100" height="80" fill="#16213e" stroke="#2d2d4f" strokeWidth="1.5" rx="4" />
        
        {/* Corridors */}
        <Rect x="30" y="145" width="440" height="25" fill="#0f0f1f" stroke="#2d2d4f" strokeWidth="1" />
        <Rect x="30" y="265" width="440" height="25" fill="#0f0f1f" stroke="#2d2d4f" strokeWidth="1" />
        <Rect x="30" y="375" width="440" height="25" fill="#0f0f1f" stroke="#2d2d4f" strokeWidth="1" />

        {/* All Location Markers */}
        {locations.map((loc) => {
          const coords = getCoordinates(loc.id);
          const isStart = start === loc.id;
          const isEnd = end === loc.id;
          
          let markerColor = "#635BFF";
          if (isStart) markerColor = "#00F5D4";
          if (isEnd) markerColor = "#FF3366";
          
          return (
            <React.Fragment key={loc.id}>
              <Circle
                cx={coords.x}
                cy={coords.y}
                r={isStart || isEnd ? 20 : 12}
                fill={markerColor}
                opacity={0.3}
              />
              <Circle
                cx={coords.x}
                cy={coords.y}
                r={isStart || isEnd ? 12 : 8}
                fill={markerColor}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <SvgText
                x={coords.x}
                y={coords.y + 4}
                fill="#FFFFFF"
                fontSize={isStart || isEnd ? 16 : 12}
                textAnchor="middle"
                fontWeight="bold"
              >
                {loc.icon}
              </SvgText>
              <SvgText
                x={coords.x}
                y={coords.y - 12}
                fill="#E0E0FF"
                fontSize="8"
                textAnchor="middle"
              >
                {loc.name.length > 12 ? loc.name.substring(0, 10) + "..." : loc.name}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Navigation Path (if different locations) */}
        {start !== end && (
          <Path
            d={getPath()}
            stroke="#635BFF"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6,4"
          />
        )}

        {/* Start Label */}
        {start && (
          <SvgText x={startCoords.x} y={startCoords.y - 25} fill="#00F5D4" fontSize="10" textAnchor="middle" fontWeight="bold">
            🟢 START
          </SvgText>
        )}

        {/* End Label */}
        {end && end !== start && (
          <SvgText x={endCoords.x} y={endCoords.y - 25} fill="#FF3366" fontSize="10" textAnchor="middle" fontWeight="bold">
            🎯 DESTINATION
          </SvgText>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A1A",
  },
});

export default SimpleIndoorMap;