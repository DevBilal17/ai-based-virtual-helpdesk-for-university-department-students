import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import GlassmorphismCard from '../../components/GlassmorphismCard/GlassmorphismCard';
// Canvas and 3D imports (Assuming you have @react-three/fiber and expo-gl setup)
// If not, you can replace the Canvas view with a placeholder Image for now.
import { Canvas } from '@react-three/fiber/native';
import DepartmentMap from "../../components/Location/DepartmentMap"
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const Location = () => {
  
  return (
    <View style={styles.mainContainer}>

      {/* --- 3D MAP LAYER (BACKGROUND) --- */}
      <View style={styles.mapContainer}>
        <DepartmentMap />
      </View>

     <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.subTitleText}>IN-BUILDING NAV</Text>
            <Text style={styles.titleText}>Lab 402, 4th Floor</Text>
          </View>

          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        {/* --- SIDE CONTROLS (Zoom/GPS) --- */}
        <View style={styles.sideControls}>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlBtn, styles.gpsBtn]}>
            <MaterialCommunityIcons name="target" size={20} color="#00F5D4" />
          </TouchableOpacity>
        </View>

        {/* --- NAVIGATION CARD (Bottom) --- */}
        <View style={styles.bottomCardContainer}>
          <GlassmorphismCard style={styles.navCard} gradientStyle={styles.navGradient}>
            <View style={styles.navContent}>
              {/* Turn Icon */}
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="arrow-u-left-top" size={30} color="white" />
              </View>

              {/* Instructions */}
              <View style={styles.instructionTextContainer}>
                <Text style={styles.nextStepText}>NEXT STEP • 10M</Text>
                <Text style={styles.mainInstruction}>Turn left towards IT Wing</Text>
                <Text style={styles.arrivalText}>Est. Arrival: 2 mins</Text>
              </View>

              {/* Sound Toggle */}
              <TouchableOpacity style={styles.soundToggle}>
                <Ionicons name="volume-medium" size={20} color="#00F5D4" />
                <Text style={styles.soundStatus}>ON</Text>
              </TouchableOpacity>
            </View>
          </GlassmorphismCard>
        </View>
      </SafeAreaView>
    </View>
  );
};





const styles = StyleSheet.create({
 mainContainer: { flex: 1, backgroundColor: '#080B12' },
  // Map ko poori screen par phelane ke liye
  mapContainer: { 
    ...StyleSheet.absoluteFillObject, 
    zIndex: 0 
  },
  overlayContainer: { flex: 1, paddingHorizontal: 20,zIndex: 1 },
  
  // Header Styles
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  headerTitleContainer: { alignItems: 'center' },
  subTitleText: { color: '#635BFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  titleText: { color: 'white', fontSize: 18, fontWeight: '700' },
  
  // Side Controls
  sideControls: { position: 'absolute', left: 20, top: '25%', gap: 10 },
  controlBtn: { 
    width: 44, height: 44, 
    backgroundColor: 'rgba(28, 45, 71, 0.8)', 
    borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  gpsBtn: { marginTop: 10 },

  // Bottom Nav Card
  bottomCardContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  navCard: { borderRadius: 28, width: '100%' },
  navGradient: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  navContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  
  iconContainer: { 
    width: 60, height: 60, 
    backgroundColor: '#635BFF', 
    borderRadius: 18, 
    justifyContent: 'center', alignItems: 'center' 
  },
  
  instructionTextContainer: { flex: 1, marginLeft: 15 },
  nextStepText: { color: '#635BFF', fontSize: 11, fontWeight: '800' },
  mainInstruction: { color: 'white', fontSize: 18, fontWeight: '700', marginVertical: 2 },
  arrivalText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },

  soundToggle: { alignItems: 'center', paddingLeft: 15, borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)' },
  soundStatus: { color: '#00F5D4', fontSize: 10, fontWeight: '800', marginTop: 4 },

  // Temporary Path for visualization
  neonPath: {
    position: 'absolute',
    width: 200, height: 2,
    backgroundColor: '#635BFF',
    shadowColor: '#635BFF',
    shadowRadius: 10, shadowOpacity: 1,
    transform: [{ rotate: '-45deg' }]
  }
});

export default Location;