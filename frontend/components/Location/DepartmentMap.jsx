// import React, { useMemo, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber/native";
// import { OrbitControls, Line, Text } from "@react-three/drei/native";

// /**
//  * =========================
//  * TYPES
//  * =========================
//  */
// const NODE_TYPES = {
//   PATH: "path",
//   LECTURE: "lecture",
//   LAB: "lab",
//   OFFICE: "office",
// };

// /**
//  * =========================
//  * COLORS
//  * =========================
//  */
// const TYPE_COLORS = {
//   path: "#64748b",
//   lecture: "#3b82f6",
//   lab: "#00F5D4",
//   office: "#f59e0b",
// };

// /**
//  * =========================
//  * NODES (IMPROVED STRUCTURE)
//  * =========================
//  */
// const nodes = {
//   entrance: { pos: [0, 0, 0], type: "path", label: "Entrance" },

//   corridor1: { pos: [0, 0, 4], type: "path", label: "Corridor 1" },
//   corridor2: { pos: [0, 0, 8], type: "path", label: "Corridor 2" },

//   lecture1: { pos: [2, 0, 4], type: "lecture", label: "Lecture 1" },
//   lecture2: { pos: [2, 0, 8], type: "lecture", label: "Lecture 2" },

//   lab1: { pos: [-2, 0, 6], type: "lab", label: "Lab 1" },

//   office1: { pos: [4, 0, 8], type: "office", label: "Office 1" },
// };

// /**
//  * =========================
//  * EDGES (WALKABLE GRAPH)
//  * =========================
//  */
// const edges = {
//   entrance: ["corridor1"],

//   corridor1: ["entrance", "corridor2", "lecture1"],
//   corridor2: ["corridor1", "lecture2", "office1"],

//   lecture1: ["corridor1", "lab1"],
//   lecture2: ["corridor2"],

//   lab1: ["lecture1"],

//   office1: ["corridor2"],
// };

// /**
//  * =========================
//  * BFS SHORTEST PATH
//  * =========================
//  */
// function findPath(start, end) {
//   const queue = [[start]];
//   const visited = new Set();

//   while (queue.length) {
//     const path = queue.shift();
//     const node = path[path.length - 1];

//     if (node === end) return path;
//     if (visited.has(node)) continue;

//     visited.add(node);

//     for (let n of edges[node] || []) {
//       queue.push([...path, n]);
//     }
//   }

//   return [];
// }

// /**
//  * =========================
//  * USER MARKER (MOVEMENT)
//  * =========================
//  */
// function MovingMarker({ path }) {
//   const ref = useRef();
//   const progress = useRef(0);

//   const points = useMemo(
//     () => path.map((n) => nodes[n].pos),
//     [path]
//   );

//   useFrame(() => {
//     if (!ref.current || points.length < 2) return;

//     progress.current += 0.01;
//     if (progress.current > 1) progress.current = 1;

//     const total = points.length - 1;
//     const scaled = progress.current * total;

//     const i = Math.floor(scaled);
//     const t = scaled - i;

//     const a = points[i];
//     const b = points[Math.min(i + 1, points.length - 1)];

//     if (!a || !b) return;

//     ref.current.position.set(
//       a[0] + (b[0] - a[0]) * t,
//       0.2,
//       a[2] + (b[2] - a[2]) * t
//     );
//   });

//   return (
//     <mesh ref={ref}>
//       <sphereGeometry args={[0.15, 32, 32]} />
//       <meshStandardMaterial
//         color="#3b82f6"
//         emissive="#3b82f6"
//         emissiveIntensity={1}
//       />
//     </mesh>
//   );
// }

// /**
//  * =========================
//  * NODE LABEL (REAL 3D TEXT)
//  * =========================
//  */
// function NodeLabel({ position, label }) {
//   return (
//     <group position={[position[0], position[1] + 0.6, position[2]]}>
      
//       {/* BACK BOARD */}
//       <mesh>
//         <boxGeometry args={[1.2, 0.3, 0.05]} />
//         <meshStandardMaterial
//           color="#111827"
//           opacity={0.9}
//           transparent
//         />
//       </mesh>

//       {/* GLOW DOT (SIMPLER LABEL INDICATOR) */}
//       <mesh position={[0, 0, 0.06]}>
//         <sphereGeometry args={[0.05, 12, 12]} />
//         <meshStandardMaterial
//           color="#00F5D4"
//           emissive="#00F5D4"
//           emissiveIntensity={1}
//         />
//       </mesh>
//     </group>
//   );
// }

// /**
//  * =========================
//  * FLOOR + MAP
//  * =========================
//  */
// function Floor({ path }) {
//   const linePoints = useMemo(
//     () => path.map((n) => nodes[n].pos),
//     [path]
//   );

//   return (
//     <>
//       {/* FLOOR */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]}>
//         <planeGeometry args={[20, 20]} />
//         <meshStandardMaterial color="#0f172a" />
//       </mesh>

//       {/* GRID */}
//       <gridHelper args={[20, 20, "#334155", "#334155"]} />

//       {/* ROUTE LINE */}
//       {linePoints.length > 1 && (
//         <Line points={linePoints} color="#00F5D4" lineWidth={6} />
//       )}

//       {/* NODES */}
//       {Object.entries(nodes).map(([key, node]) => (
//         <group key={key}>
//           {/* ROOM BLOCK */}
//           <mesh position={node.pos}>
//             <boxGeometry args={[0.8, 0.8, 0.8]} />
//             <meshStandardMaterial color={TYPE_COLORS[node.type]} />
//           </mesh>

//           {/* LABEL */}
//           <NodeLabel position={node.pos} label={node.label} />
//         </group>
//       ))}

//       {/* START */}
//       {path[0] && (
//         <mesh position={nodes[path[0]].pos}>
//           <sphereGeometry args={[0.18]} />
//           <meshStandardMaterial color="#22c55e" emissive="#22c55e" />
//         </mesh>
//       )}

//       {/* END */}
//       {path[path.length - 1] && (
//         <mesh position={nodes[path[path.length - 1]].pos}>
//           <sphereGeometry args={[0.18]} />
//           <meshStandardMaterial color="#ef4444" emissive="#ef4444" />
//         </mesh>
//       )}

//       {/* USER */}
//       <MovingMarker path={path} />
//     </>
//   );
// }

// /**
//  * =========================
//  * MAIN COMPONENT
//  * =========================
//  */
// export default function DepartmentMap({ start, end }) {
//   const path = useMemo(() => findPath(start, end), [start, end]);

//   return (
//     <Canvas camera={{ position: [6, 6, 10], fov: 50 }}>
//       <ambientLight intensity={0.8} />
//       <directionalLight position={[10, 10, 5]} intensity={1} />

//       <Floor path={path} />

//       <OrbitControls enablePan enableZoom />
//     </Canvas>
//   );
// }

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, {
  Line as SvgLine,
  Circle,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import MapView, { MAP_TYPES, Polyline, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const DepartmentMap = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const [destination, setDestination] = useState(null);
  const mapRef = useRef(null);

  // Department/Room coordinates (predefined)
  const departments = [
    { id: 1, name: 'Electronics', x: 0.1, y: 0.2, coords: { latitude: 37.7749, longitude: -122.4194 } },
    { id: 2, name: 'Clothing', x: 0.3, y: 0.4, coords: { latitude: 37.7750, longitude: -122.4195 } },
    { id: 3, name: 'Home & Living', x: 0.6, y: 0.6, coords: { latitude: 37.7751, longitude: -122.4196 } },
    { id: 4, name: 'Sports', x: 0.8, y: 0.3, coords: { latitude: 37.7752, longitude: -122.4197 } },
    { id: 5, name: 'Checkout', x: 0.5, y: 0.8, coords: { latitude: 37.7753, longitude: -122.4198 } },
  ];

  // Pathfinding simulation (simplified waypoints)
  const getPathToDestination = (destinationCoords) => {
    // This would be replaced with actual pathfinding algorithm
    return [
      userLocation,
      { latitude: (userLocation.latitude + destinationCoords.latitude) / 2, 
        longitude: (userLocation.longitude + destinationCoords.longitude) / 2 + 0.0002 },
      destinationCoords,
    ];
  };

  const handleDepartmentSelect = (dept) => {
    setDestination(dept.coords);
    // Simulate path calculation
    const path = getPathToDestination(dept.coords);
    // Animate map to show the route
    mapRef.current?.animateToRegion({
      ...dept.coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header with neon glow effect */}
      <View style={styles.header}>
        <Text style={styles.title}>🏢 SMART MALL NAVIGATOR</Text>
        <View style={styles.statusBar}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Live Navigation Active</Text>
        </View>
      </View>

      {/* Map View with custom styling */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          mapType={MAP_TYPES.NONE} // Custom map style
          customMapStyle={darkMapStyle}
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* Department Markers with neon styling */}
          {departments.map((dept) => (
            <Marker
              key={dept.id}
              coordinate={dept.coords}
              onPress={() => handleDepartmentSelect(dept)}
            >
              <View style={styles.neonMarker}>
                <View style={styles.markerInner}>
                  <Text style={styles.markerText}>{dept.name[0]}</Text>
                </View>
                <Text style={styles.markerLabel}>{dept.name}</Text>
              </View>
            </Marker>
          ))}

          {/* Glowing Path (if destination selected) */}
          {destination && (
            <Polyline
              coordinates={getPathToDestination(destination)}
              strokeColor="#635BFF"
              strokeWidth={4}
              lineDashPattern={[0]}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Destination Marker */}
          {destination && (
            <Marker coordinate={destination}>
              <View style={styles.destinationMarker}>
                <View style={styles.pulseRing} />
                <View style={styles.destinationInner}>
                  <Text style={styles.destinationText}>🎯</Text>
                </View>
              </View>
            </Marker>
          )}
        </MapView>

        {/* Custom overlay for neon grid effect */}
        <View style={styles.gridOverlay} pointerEvents="none">
          <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#635BFF" stopOpacity="0.05" />
                <Stop offset="100%" stopColor="#00F5D4" stopOpacity="0.05" />
              </LinearGradient>
            </Defs>
            <Rect width={width} height={height} fill="url(#glow)" />
          </Svg>
        </View>
      </View>

      {/* Department List with neon styling */}
      <ScrollView style={styles.departmentList} horizontal showsHorizontalScrollIndicator={false}>
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept.id}
            style={[
              styles.departmentCard,
              destination === dept.coords && styles.activeCard,
            ]}
            onPress={() => handleDepartmentSelect(dept)}
          >
            <Text style={styles.cardIcon}>
              {dept.name === 'Electronics' ? '📱' : 
               dept.name === 'Clothing' ? '👕' :
               dept.name === 'Home & Living' ? '🏠' :
               dept.name === 'Sports' ? '⚽' : '💰'}
            </Text>
            <Text style={styles.cardTitle}>{dept.name}</Text>
            <View style={styles.cardGlow} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Instructions */}
      {destination && (
        <View style={styles.instructionPanel}>
          <Text style={styles.instructionText}>
            🚶 Follow the glowing path to your destination
          </Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => setDestination(null)}
          >
            <Text style={styles.resetText}>Cancel Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Custom dark map style for neon aesthetic
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#1a1a2e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8b8b9e" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#1a1a2e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#2d2d44" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#0d0d1a" }]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#0F0F1F',
    borderBottomWidth: 1,
    borderBottomColor: '#635BFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#635BFF',
    textShadowColor: '#635BFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00F5D4',
    marginRight: 8,
    shadowColor: '#00F5D4',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  statusText: {
    color: '#8B8B9E',
    fontSize: 12,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  neonMarker: {
    alignItems: 'center',
  },
  markerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F1F3F',
    borderWidth: 2,
    borderColor: '#635BFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#635BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  markerText: {
    color: '#635BFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  markerLabel: {
    color: '#E0E0FF',
    fontSize: 10,
    marginTop: 4,
    textShadowColor: '#635BFF',
    textShadowRadius: 5,
  },
  destinationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00F5D4',
    opacity: 0.3,
    transform: [{ scale: 1 }],
  },
  destinationInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00F5D4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00F5D4',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.8,
  },
  destinationText: {
    fontSize: 20,
  },
  departmentList: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  departmentCard: {
    backgroundColor: '#1F1F3F',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 8,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#2D2D4F',
    position: 'relative',
    overflow: 'hidden',
  },
  activeCard: {
    borderColor: '#635BFF',
    borderWidth: 2,
    shadowColor: '#635BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.5,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#E0E0FF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardGlow: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#635BFF',
    opacity: 0.1,
  },
  instructionPanel: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(31, 31, 63, 0.95)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#635BFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  instructionText: {
    color: '#00F5D4',
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#FF3366',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DepartmentMap;