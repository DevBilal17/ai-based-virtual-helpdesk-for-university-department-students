import React from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Text } from 'react-native';
import { BlurView } from 'expo-blur';

const GlobalLoader = ({ visible, message = "Please wait..." }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {/* Background Blur Effect */}
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#635BFF" />
          {message && <Text style={styles.text}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Halka sa dark overlay
  },
  loaderCard: {
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(28, 45, 71, 0.8)', // Aapki app ka navy blue color
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default GlobalLoader;