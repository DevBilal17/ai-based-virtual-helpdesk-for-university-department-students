// import React, { useRef, useMemo, useEffect } from 'react';
// import * as THREE from 'three';
// import { Canvas, useFrame } from '@react-three/fiber/native';
// import { OrbitControls } from '@react-three/drei/native';
// import { View } from 'react-native';

// const SwarmSphere = ({ status }) => {
//   const meshRef = useRef();
//   const isSpeaking = status === 'speaking';
//   const isListening = status === 'listening';
//   const isMounted = useRef(true);
//   // Theme Colors
//   const color = isListening ? "#00ffcc" : isSpeaking ? "#ff00ff" : "#ffffff";
// useEffect(() => {
//   return () => {
//     isMounted.current = false;
//   };
// }, []);
//   const count = 300; 
//   const dummy = useMemo(() => new THREE.Object3D(), []);

//   const particles = useMemo(() => {
//     const temp = [];
//     for (let i = 0; i < count; i++) {
//       const phi = Math.acos(-1 + (2 * i) / count);
//       const theta = Math.sqrt(count * Math.PI) * phi;
//       temp.push({ phi, theta, factor: 0.1 + Math.random() * 0.4 });
//     }
//     return temp;
//   }, [count]);

//   useFrame((state) => {
//     if (!isMounted.current || !meshRef.current) return;
//     const time = state.clock.getElapsedTime();
    
//     // speed logic:
//     // Listening (User bol raha hai) -> 0 (Stop)
//     // Speaking or Idle -> 0.5 (Slow constant speed)
//     const rotationSpeed = isListening ? 0 : 0.5;

//     particles.forEach((particle, i) => {
//       let { phi, theta, factor } = particle;

//       // Agar isListening true hai, toh 'rotationSpeed' 0 hogi, yani angle freeze ho jayega
//       const angle = theta + (time * rotationSpeed * factor);

//       // Radius ko constant rakhte hain 3.0 par (no breathing effect while speaking)
//       const radius = 3.0;

//       const x = radius * Math.sin(phi) * Math.cos(angle);
//       const y = radius * Math.sin(phi) * Math.sin(angle);
//       const z = radius * Math.cos(phi);

//       dummy.position.set(x, y, z);
      
//       // Constant Size: 0.08 for all states
//       const s = 0.08; 
//       dummy.scale.set(s, s, s);
      
//       dummy.lookAt(0, 0, 0);

//       dummy.updateMatrix();
//       if (meshRef.current) {
//   meshRef.current.setMatrixAt(i, dummy.matrix);
// }
//     });

//     if (meshRef.current) {
//   meshRef.current.instanceMatrix.needsUpdate = true;
// }
    
//     // Overall assembly rotation stops when user is speaking
//     if (!isListening) {
//       meshRef.current.rotation.y += 0.005;
//     }
//   });

//   return (
//     <instancedMesh ref={meshRef} args={[null, null, count]}>
//       <boxGeometry args={[1, 1, 1]} /> 
//       <meshStandardMaterial 
//         color={color} 
//         emissive={color} 
//         emissiveIntensity={isSpeaking ? 5 : 1.5} 
//         metalness={1}
//         roughness={0}
//       />
//     </instancedMesh>
//   );
// };

// export default function VoiceRobot({ status }) {
//   return (
//     <View style={{ height: 360, width: '100%' }}>
//       <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} intensity={4} color="#00ffcc" />
//         <pointLight position={[-10, -10, 10]} intensity={4} color="#ff00ff" />
        
//         <SwarmSphere status={status} />
        
//         {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
//       </Canvas>
//     </View>
//   );
// }


import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { View } from 'react-native';

const SwarmSphere = ({ status }) => {
  const meshRef = useRef();
  const materialRef = useRef(); // Material ke liye ref banayi taake direct color update ho smooth bina crash ke
  
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  const isMounted = useRef(true);

  // Hex Colors ko pehle hi instanced kar lia taake baar baar string na bane
  const colors = useMemo(() => ({
    listening: new THREE.Color("#00ffcc"),
    speaking: new THREE.Color("#ff00ff"),
    idle: new THREE.Color("#ffffff")
  }), []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const count = 300; 
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
    if (!isMounted.current || !meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Dynamic Speed
    const rotationSpeed = isListening ? 0 : 0.5;

    // 1️⃣ SMOOTH COLOR & EMISSIVE TRANSITION WITHOUT RE-COMPILING SHADERS
    if (materialRef.current) {
      const targetColor = isListening ? colors.listening : isSpeaking ? colors.speaking : colors.idle;
      // .lerp se color jhatke ke bajaye smoothly change hoga aur crash nahi karega
      materialRef.current.color.lerp(targetColor, 0.1);
      materialRef.current.emissive.lerp(targetColor, 0.1);
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        isSpeaking ? 5.0 : 1.5,
        0.1
      );
    }

    // Particles Math
    particles.forEach((particle, i) => {
      let { phi, theta, factor } = particle;
      const angle = theta + (time * rotationSpeed * factor);
      const radius = 3.0;

      const x = radius * Math.sin(phi) * Math.cos(angle);
      const y = radius * Math.sin(phi) * Math.sin(angle);
      const z = radius * Math.cos(phi);

      dummy.position.set(x, y, z);
      
      const s = 0.08; 
      dummy.scale.set(s, s, s);
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
    // args me undefined pass karne se memory safe ho gayi
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} /> 
      <meshStandardMaterial 
        ref={materialRef}
        color="#ffffff" 
        emissive="#ffffff" 
        emissiveIntensity={1.5} 
        metalness={1.0}
        roughness={0.0}
      />
    </instancedMesh>
  );
};

export default function VoiceRobot({ status }) {
  return (
    <View style={{ height: 360, width: '100%' }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 40 }}
        // WebGL context loss errors ko handle karne k liye clear color target fix kia:
        onCreated={(state) => state.gl.setClearColor('#050816', 0)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={4} color="#00ffcc" />
        <pointLight position={[-10, -10, 10]} intensity={4} color="#ff00ff" />
        
        <SwarmSphere status={status} />
      </Canvas>
    </View>
  );
}