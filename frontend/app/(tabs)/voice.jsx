import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import VoiceRobot from '../../components/Chat/VoiceRobot';
import GlassmorphismCard from '../../components/GlassmorphismCard/GlassmorphismCard';

const VoiceScreen = () => {
  // Status: 'idle', 'listening', 'speaking'
  const [status, setStatus] = useState('idle');

  const toggleMic = () => {
    if (status === 'idle') setStatus('listening');
    else if (status === 'listening') setStatus('speaking');
    else setStatus('idle');
  };

  return (
    <ImageBackground source={require("../../assets/images/on-boarding-bg-1.png")} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Voice Assistant</Text>
        </View>

        {/* 3D Robot Area */}
        <View style={styles.robotContainer}>
          <VoiceRobot status={status} />
          <Text style={[styles.statusText, { color: status === 'listening' ? '#00ffcc' : status === 'speaking' ? '#ff00ff' : '#fff' }]}>
            {status === 'listening' ? "I'm Listening..." : status === 'speaking' ? "AI is Speaking" : "Tap to Start"}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={toggleMic} activeOpacity={0.8}>
            <GlassmorphismCard style={styles.micButton} gradientStyle={styles.micGradient}>
              <Ionicons 
                name={status === 'listening' ? "mic" : "mic-outline"} 
                size={40} 
                color={status === 'listening' ? "#00ffcc" : "#fff"} 
              />
            </GlassmorphismCard>
          </TouchableOpacity>
          
          <Text style={styles.hintText}>
            {status === 'idle' ? "Speak to your assistant" : "Tap to stop"}
          </Text>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  header: { alignItems: 'center', marginTop: 10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', opacity: 0.8 },
  robotContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { fontSize: 22, fontWeight: '700', marginTop: 20, textTransform: 'uppercase', letterSpacing: 1 },
  controlsContainer: { alignItems: 'center', marginBottom: 40 },
  micButton: { height: 90, width: 90, borderRadius: 45, borderBottomLeftRadius: 45 },
  micGradient: { height: 90, width: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  hintText: { color: 'rgba(255,255,255,0.4)', marginTop: 15, fontSize: 14 }
});

export default VoiceScreen;