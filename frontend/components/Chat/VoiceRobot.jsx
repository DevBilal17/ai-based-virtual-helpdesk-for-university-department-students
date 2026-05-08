import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import { View } from 'react-native';

const SwarmSphere = ({ status }) => {
  const meshRef = useRef();
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  
  // Theme Colors
  const color = isListening ? "#00ffcc" : isSpeaking ? "#ff00ff" : "#ffffff";

  const count = 400; 
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      temp.push({ phi, theta, factor: 0.1 + Math.random() * 0.4 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // speed logic:
    // Listening (User bol raha hai) -> 0 (Stop)
    // Speaking or Idle -> 0.5 (Slow constant speed)
    const rotationSpeed = isListening ? 0 : 0.5;

    particles.forEach((particle, i) => {
      let { phi, theta, factor } = particle;

      // Agar isListening true hai, toh 'rotationSpeed' 0 hogi, yani angle freeze ho jayega
      const angle = theta + (time * rotationSpeed * factor);

      // Radius ko constant rakhte hain 3.0 par (no breathing effect while speaking)
      const radius = 3.0;

      const x = radius * Math.sin(phi) * Math.cos(angle);
      const y = radius * Math.sin(phi) * Math.sin(angle);
      const z = radius * Math.cos(phi);

      dummy.position.set(x, y, z);
      
      // Constant Size: 0.08 for all states
      const s = 0.08; 
      dummy.scale.set(s, s, s);
      
      dummy.lookAt(0, 0, 0);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Overall assembly rotation stops when user is speaking
    if (!isListening) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} /> 
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={isSpeaking ? 5 : 1.5} 
        metalness={1}
        roughness={0}
      />
    </instancedMesh>
  );
};

export default function VoiceRobot({ status }) {
  return (
    <View style={{ height: 380, width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={4} color="#00ffcc" />
        <pointLight position={[-10, -10, 10]} intensity={4} color="#ff00ff" />
        
        <SwarmSphere status={status} />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </View>
  );
}