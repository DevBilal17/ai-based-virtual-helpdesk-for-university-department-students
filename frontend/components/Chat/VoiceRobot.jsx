import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { View } from 'react-native';

const SwarmSphere = ({ status }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  const isMounted = useRef(true);

  const colors = useMemo(() => ({
    listening: new THREE.Color("#00ffcc"),
    speaking: new THREE.Color("#ff00ff"),
    idle: new THREE.Color("#ffffff")
  }), []);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const count = 300; 
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Geometry aur Material ko memoize kar lia taake re-render par 'trim' error na aaye
  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

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
    if (!isMounted.current || !meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    const rotationSpeed = isListening ? 0 : 0.5;

    // Color Lerp
    const targetColor = isListening ? colors.listening : isSpeaking ? colors.speaking : colors.idle;
    materialRef.current.color.lerp(targetColor, 0.1);
    materialRef.current.emissive.lerp(targetColor, 0.1);
    materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      materialRef.current.emissiveIntensity,
      isSpeaking ? 5.0 : 1.5,
      0.1
    );

    // Instances Update
    particles.forEach((particle, i) => {
      const { phi, theta, factor } = particle;
      const angle = theta + (time * rotationSpeed * factor);
      const radius = 3.0;

      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(angle),
        radius * Math.sin(phi) * Math.sin(angle),
        radius * Math.cos(phi)
      );
      
      dummy.scale.set(0.08, 0.08, 0.08);
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    
    if (!isListening) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    // FIX: args me [geometry, material, count] pass karna sabse safe hai
    <instancedMesh ref={meshRef} args={[boxGeo, null, count]}>
      <meshStandardMaterial 
        ref={materialRef}
        color="#ffffff" 
        emissive="#ffffff" 
        emissiveIntensity={1.5} 
        metalness={1.0}
        roughness={0.0}
        // Isse shader recompilation avoid hoti hai:
        name="SphereMaterial" 
      />
    </instancedMesh>
  );
};

export default function VoiceRobot({ status }) {
  return (
    <View style={{ height: 360, width: '100%' }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 40 }}
        // GPU acceleration ke liye 'frameloop' ko control kar sakte hain
        onCreated={(state) => {
          const gl = state.gl;
          gl.setClearColor('#050816', 0);
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={4} color="#00ffcc" />
        <pointLight position={[-10, -10, 10]} intensity={4} color="#ff00ff" />
        <SwarmSphere status={status} />
      </Canvas>
    </View>
  );
}