import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls, Line, Text } from '@react-three/drei/native';

const FloorPlan = () => {
  // Example coordinates for the glowing path
  const points = useMemo(() => [
    [0, 0, 0], [0, 0, 2], [1.5, 0, 2], [1.5, 0, 4]
  ], []);

  return (
    <>
      {/* The Floor Grid / Department Layout */}
      <gridHelper args={[20, 20, "#1C2D47", "#1C2D47"]} position={[0, -0.1, 0]} />
      
      {/* The Glowing Navigation Path */}
      <Line
        points={points}
        color="#635BFF" 
        lineWidth={5}
        dashed={false}
      />

      {/* Destination Marker */}
      <mesh position={[1.5, 0.1, 4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#00F5D4" />
      </mesh>
    </>
  );
};

const DepartmentMap = () => {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#635BFF" />
      
      <FloorPlan />

      <OrbitControls 
        enablePan={true}
        maxPolarAngle={Math.PI / 2.5} // Prevents looking under the map
        minPolarAngle={Math.PI / 4}   // Keeps a nice isometric angle
      />
    </Canvas>
  );
};

export default DepartmentMap