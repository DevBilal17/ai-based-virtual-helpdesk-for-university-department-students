import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { MeshDistortMaterial, Sphere, Float, OrbitControls } from '@react-three/drei/native';

const AnimatedSphere = ({ isTyping }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation logic
      meshRef.current.rotation.x += 0.005 * (isTyping ? 3.0 : 1.0);
      meshRef.current.rotation.y += 0.008 * (isTyping ? 2.0 : 1.0);
    }
  });

  return (
    <Float speed={isTyping ? 4 : 2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={1.5}>
        <MeshDistortMaterial
          // Base color is a lighter version of your purple to ensure visibility
          color={isTyping ? "#635BFF" : "#8B84FF"} 
          speed={isTyping ? 5 : 1.5}
          distort={isTyping ? 0.6 : 0.2}
          radius={1}
          metalness={1} 
          roughness={0.1}
          // The "Magic" part: Emissive makes it look like it's glowing from inside
          emissive={"#635BFF"} 
          emissiveIntensity={1.2}
        />
      </Sphere>
    </Float>
  );
};

const AIVisualizer = ({ isTyping }) => {
  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        {/* Soft fill light */}
        <ambientLight intensity={1.2} />
        
        {/* Key Light: Bright white light to create a 'glass' reflection */}
        <pointLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
        
        {/* Rim Light: Purple light from the back to separate it from the dark background */}
        <pointLight position={[-5, -5, -2]} intensity={5} color="#635BFF" />
        
        {/* Fill Light: Soft blue to blend with your navy dashboard */}
        <spotLight position={[0, -10, 0]} intensity={2} color="#1C2D47" />
        
        <AnimatedSphere isTyping={true} />

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          dampingFactor={0.1}
          rotateSpeed={2}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280, // Slightly taller for better presence
    width: '100%',
    backgroundColor: 'transparent', 
  },
});

export default AIVisualizer;