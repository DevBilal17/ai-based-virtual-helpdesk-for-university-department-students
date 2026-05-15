import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, {
  Rect,
  Path,
  Text as SvgText,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Define all indoor locations/POIs
const indoorLocations = [
  // Floor 1
  { id: 'hod', name: 'HOD Office', type: 'office', floor: 1, x: 50, y: 100, icon: '👔' },
  { id: 'prof1', name: 'Prof. Sharma', type: 'professor', floor: 1, x: 150, y: 100, icon: '👨‍🏫' },
  { id: 'prof2', name: 'Prof. Verma', type: 'professor', floor: 1, x: 250, y: 100, icon: '👩‍🏫' },
  { id: 'office1', name: 'Admin Office', type: 'office', floor: 1, x: 350, y: 100, icon: '📋' },
  { id: 'cs_lab', name: 'Computer Science Lab', type: 'lab', floor: 1, x: 50, y: 250, icon: '💻' },
  { id: 'electronics_lab', name: 'Electronics Lab', type: 'lab', floor: 1, x: 200, y: 250, icon: '🔌' },
  { id: 'washroom_w', name: 'Girls Washroom', type: 'washroom', floor: 1, x: 350, y: 250, icon: '🚺' },
  { id: 'cafeteria', name: 'Cafeteria', type: 'common', floor: 1, x: 450, y: 400, icon: '☕' },
  
  // Floor 2
  { id: 'it_hall', name: 'IT Seminar Hall', type: 'hall', floor: 2, x: 100, y: 100, icon: '🎓' },
  { id: 'lecture1', name: 'Lecture Hall 101', type: 'hall', floor: 2, x: 250, y: 100, icon: '📚' },
  { id: 'lecture2', name: 'Lecture Hall 102', type: 'hall', floor: 2, x: 400, y: 100, icon: '📖' },
  { id: 'research_lab', name: 'Research Lab', type: 'lab', floor: 2, x: 100, y: 250, icon: '🔬' },
  { id: 'ai_lab', name: 'AI/ML Lab', type: 'lab', floor: 2, x: 250, y: 250, icon: '🤖' },
  { id: 'conf_room', name: 'Conference Room', type: 'office', floor: 2, x: 400, y: 250, icon: '👥' },
  { id: 'library', name: 'Department Library', type: 'common', floor: 2, x: 250, y: 400, icon: '📖' },
];

// Room/Wall layout for floor plan
const floor1Layout = [
  // Outer walls
  { type: 'wall', x: 20, y: 50, width: 460, height: 400, fill: '#1a1a2e', stroke: '#635BFF', strokeWidth: 2 },
  // Internal walls and rooms
  { type: 'room', x: 40, y: 80, width: 100, height: 80, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'HOD Office' },
  { type: 'room', x: 160, y: 80, width: 100, height: 80, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Professor Cabin' },
  { type: 'room', x: 280, y: 80, width: 100, height: 80, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Admin Office' },
  { type: 'room', x: 40, y: 200, width: 150, height: 100, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'CS Lab' },
  { type: 'room', x: 210, y: 200, width: 150, height: 100, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Electronics Lab' },
  { type: 'room', x: 380, y: 200, width: 80, height: 100, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Washroom' },
  { type: 'corridor', x: 20, y: 170, width: 460, height: 40, fill: '#0f0f1f', stroke: '#2d2d4f', strokeWidth: 1 },
  { type: 'corridor', x: 20, y: 320, width: 460, height: 40, fill: '#0f0f1f', stroke: '#2d2d4f', strokeWidth: 1 },
];

const floor2Layout = [
  { type: 'wall', x: 20, y: 50, width: 460, height: 400, fill: '#1a1a2e', stroke: '#635BFF', strokeWidth: 2 },
  { type: 'room', x: 40, y: 80, width: 120, height: 80, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'IT Seminar Hall' },
  { type: 'room', x: 180, y: 80, width: 120, height: 80, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Lecture Hall' },
  { type: 'room', x: 320, y: 80, width: 120, height: 80, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Lecture Hall' },
  { type: 'room', x: 40, y: 200, width: 150, height: 100, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Research Lab' },
  { type: 'room', x: 210, y: 200, width: 150, height: 100, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'AI/ML Lab' },
  { type: 'room', x: 380, y: 200, width: 80, height: 100, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Conference Room' },
  { type: 'room', x: 180, y: 330, width: 150, height: 80, fill: '#16213e', stroke: '#2d2d4f', strokeWidth: 1, label: 'Library' },
  { type: 'corridor', x: 20, y: 170, width: 460, height: 40, fill: '#0f0f1f', stroke: '#2d2d4f', strokeWidth: 1 },
  { type: 'corridor', x: 20, y: 320, width: 460, height: 40, fill: '#0f0f1f', stroke: '#2d2d4f', strokeWidth: 1 },
];

// Pathfinding function - Dijkstra-like simplified
const findPath = (startLocation, endLocation, locations) => {
  // Simplified path - in real implementation, you'd use a graph of connected nodes
  // For demo, returning waypoints between start and end
  if (!startLocation || !endLocation) return [];
  
  return [
    { x: startLocation.x, y: startLocation.y },
    { x: (startLocation.x + endLocation.x) / 2, y: startLocation.y },
    { x: (startLocation.x + endLocation.x) / 2, y: endLocation.y },
    { x: endLocation.x, y: endLocation.y },
  ];
};

const IndoorNavigationMap = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [userLocation, setUserLocation] = useState({ x: 50, y: 400 }); // Mock user location (e.g., entrance)

  const currentLayout = selectedFloor === 1 ? floor1Layout : floor2Layout;
  const currentLocations = indoorLocations.filter(loc => loc.floor === selectedFloor);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setDestination(location);
  };

  const startNavigation = () => {
    if (!destination) {
      Alert.alert('Select Destination', 'Please tap on a location to navigate to');
      return;
    }
    const path = findPath(userLocation, destination, currentLocations);
    // Draw path on map (you'll implement this)
    Alert.alert('Navigation Started', `Navigating to ${destination.name}`);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'office': return '#FF6B6B';
      case 'professor': return '#4ECDC4';
      case 'lab': return '#45B7D1';
      case 'hall': return '#96CEB4';
      case 'washroom': return '#FFB347';
      case 'common': return '#A8E6CF';
      default: return '#635BFF';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏛️ DEPARTMENT NAVIGATOR</Text>
        <Text style={styles.subtitle}>Computer Science & Engineering</Text>
        <View style={styles.statusBar}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Indoor Navigation Active</Text>
        </View>
      </View>

      {/* Floor Selector */}
      <View style={styles.floorSelector}>
        <TouchableOpacity
          style={[styles.floorButton, selectedFloor === 1 && styles.activeFloor]}
          onPress={() => setSelectedFloor(1)}
        >
          <Text style={[styles.floorText, selectedFloor === 1 && styles.activeFloorText]}>Floor 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floorButton, selectedFloor === 2 && styles.activeFloor]}
          onPress={() => setSelectedFloor(2)}
        >
          <Text style={[styles.floorText, selectedFloor === 2 && styles.activeFloorText]}>Floor 2</Text>
        </TouchableOpacity>
      </View>

      {/* SVG Map */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mapScrollContainer}
      >
        <View style={styles.mapContainer}>
          <Svg width={500} height={500} viewBox="0 0 500 500">
            {/* Background */}
            <Rect x="0" y="0" width="500" height="500" fill="#0A0A1A" />
            
            {/* Floor Layout */}
            {currentLayout.map((item, index) => (
              <Rect
                key={index}
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fill={item.fill}
                stroke={item.stroke}
                strokeWidth={item.strokeWidth || 1}
                rx={4}
              />
            ))}

            {/* Location Markers */}
            {currentLocations.map((loc) => (
              <G key={loc.id}>
                <Circle
                  cx={loc.x}
                  cy={loc.y}
                  r={15}
                  fill={getTypeColor(loc.type)}
                  opacity={0.8}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
                <Circle
                  cx={loc.x}
                  cy={loc.y}
                  r={20}
                  fill={getTypeColor(loc.type)}
                  opacity={0.2}
                />
                <SvgText
                  x={loc.x}
                  y={loc.y + 5}
                  fill="#FFFFFF"
                  fontSize="14"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {loc.icon}
                </SvgText>
                <SvgText
                  x={loc.x}
                  y={loc.y - 12}
                  fill="#E0E0FF"
                  fontSize="8"
                  textAnchor="middle"
                >
                  {loc.name.length > 12 ? loc.name.substring(0, 10) + '...' : loc.name}
                </SvgText>
              </G>
            ))}

            {/* User Location Marker */}
            <Circle cx={userLocation.x} cy={userLocation.y} r={8} fill="#00F5D4" />
            <Circle cx={userLocation.x} cy={userLocation.y} r={16} fill="#00F5D4" opacity={0.3}>
              <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
            </Circle>
            <SvgText x={userLocation.x} y={userLocation.y - 12} fill="#00F5D4" fontSize="10" textAnchor="middle">
              You are here
            </SvgText>

            {/* Navigation Path */}
            {destination && (
              <Path
                d={`M ${userLocation.x} ${userLocation.y} 
                    L ${(userLocation.x + destination.x) / 2} ${userLocation.y}
                    L ${(userLocation.x + destination.x) / 2} ${destination.y}
                    L ${destination.x} ${destination.y}`}
                stroke="#635BFF"
                strokeWidth={3}
                fill="none"
                strokeDasharray="5,5"
              />
            )}

            {/* Destination Marker */}
            {destination && (
              <G>
                <Circle cx={destination.x} cy={destination.y} r={18} fill="#FF3366" opacity={0.6} />
                <Circle cx={destination.x} cy={destination.y} r={10} fill="#FF3366" />
                <SvgText x={destination.x} y={destination.y - 18} fill="#FF3366" fontSize="10" textAnchor="middle">
                  Destination
                </SvgText>
              </G>
            )}
          </Svg>
        </View>
      </ScrollView>

      {/* Location Categories Quick Access */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        <TouchableOpacity style={styles.categoryChip} onPress={() => {}}>
          <Text style={styles.categoryChipText}>👔 All Offices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryChip} onPress={() => {}}>
          <Text style={styles.categoryChipText}>🔬 Labs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryChip} onPress={() => {}}>
          <Text style={styles.categoryChipText}>🎓 Lecture Halls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryChip} onPress={() => {}}>
          <Text style={styles.categoryChipText}>🚺 Washrooms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryChip} onPress={() => {}}>
          <Text style={styles.categoryChipText}>📚 Library</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Location List */}
      <ScrollView style={styles.locationList}>
        <Text style={styles.sectionTitle}>📍 All Locations</Text>
        {currentLocations.map((loc) => (
          <TouchableOpacity
            key={loc.id}
            style={[
              styles.locationCard,
              selectedLocation?.id === loc.id && styles.selectedCard,
              destination?.id === loc.id && styles.destinationCard,
            ]}
            onPress={() => handleLocationSelect(loc)}
          >
            <View style={[styles.locationIcon, { backgroundColor: getTypeColor(loc.type) }]}>
              <Text style={styles.locationIconText}>{loc.icon}</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{loc.name}</Text>
              <Text style={styles.locationType}>
                {loc.type === 'office' ? 'Office' : 
                 loc.type === 'professor' ? 'Professor Cabin' :
                 loc.type === 'lab' ? 'Laboratory' :
                 loc.type === 'hall' ? 'Lecture Hall' :
                 loc.type === 'washroom' ? 'Washroom' : 'Common Area'}
              </Text>
            </View>
            {destination?.id === loc.id && (
              <View style={styles.destinationBadge}>
                <Text style={styles.destinationBadgeText}>🎯</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Button */}
      <TouchableOpacity style={styles.navButton} onPress={startNavigation}>
        <Text style={styles.navButtonText}>
          {destination ? `Navigate to ${destination.name}` : 'Select a Destination'}
        </Text>
      </TouchableOpacity>

      {/* Navigation Instructions Panel */}
      {destination && (
        <View style={styles.instructionPanel}>
          <Text style={styles.instructionTitle}>🚶 Navigation Instructions</Text>
          <Text style={styles.instructionStep}>1. Follow the dashed purple path on the map</Text>
          <Text style={styles.instructionStep}>2. The destination is marked with a red pulse</Text>
          <Text style={styles.instructionStep}>3. Your current location is shown with a cyan dot</Text>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setDestination(null)}
          >
            <Text style={styles.cancelButtonText}>Cancel Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(15, 15, 31, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#635BFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#635BFF',
    textShadowColor: '#635BFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#8B8B9E',
    marginTop: 4,
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
  floorSelector: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#0F0F1F',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F3F',
  },
  floorButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#1F1F3F',
  },
  activeFloor: {
    backgroundColor: '#635BFF',
  },
  floorText: {
    color: '#8B8B9E',
    fontWeight: '600',
  },
  activeFloorText: {
    color: '#FFFFFF',
  },
  mapScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mapContainer: {
    padding: 10,
    alignItems: 'center',
  },
  categoryScroll: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 50,
  },
  categoryChip: {
    backgroundColor: '#1F1F3F',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2D2D4F',
  },
  categoryChipText: {
    color: '#E0E0FF',
    fontSize: 12,
  },
  locationList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    color: '#E0E0FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F3F',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D2D4F',
  },
  selectedCard: {
    borderColor: '#635BFF',
    backgroundColor: 'rgba(99, 91, 255, 0.1)',
  },
  destinationCard: {
    borderColor: '#FF3366',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
  },
  locationIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconText: {
    fontSize: 22,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  locationType: {
    color: '#8B8B9E',
    fontSize: 12,
    marginTop: 2,
  },
  destinationBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationBadgeText: {
    fontSize: 16,
  },
  navButton: {
    backgroundColor: '#635BFF',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionPanel: {
    position: 'absolute',
    bottom: 80,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(15, 15, 31, 0.95)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#635BFF',
    backdropFilter: 'blur(10px)',
  },
  instructionTitle: {
    color: '#00F5D4',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionStep: {
    color: '#E0E0FF',
    fontSize: 12,
    marginVertical: 2,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#FF3366',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default IndoorNavigationMap;