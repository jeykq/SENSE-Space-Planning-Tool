import React, { Suspense, useRef } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const ObjPreview = ({ objUrl, mtlUrl }) => {
  return (
    <Canvas style={{ height: '70px' }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} /> {/* Directional light */}
      <pointLight position={[10, 10, 10]} intensity={0.5} /> {/* Point light */}
      <OrbitControls />
      <Suspense fallback={null}>
        <ObjModel objUrl={objUrl} mtlUrl={mtlUrl} />
      </Suspense>
    </Canvas>
  );
};

const ObjModel = ({ objUrl, mtlUrl }) => {
  const group = useRef();
  const { camera } = useThree();

  const { scene } = useThree(); // Accessing the scene from the Canvas

  const mtl = useLoader(MTLLoader, mtlUrl);
  mtl.preload();

  const obj = useLoader(OBJLoader, objUrl, loader => {
    loader.setMaterials(mtl);
  });

  // Adjusting camera position and rotation for a specific angle
  camera.position.set(3, 5, 3); // Adjust position
  camera.lookAt(2.5, 2, 0); // Look at the center of the scene


  return (
    <group ref={group} position={[0, 0, 0]}>
      {obj && obj.children.map(child => {
        scene.add(child);
        return null;
      })}
    </group>
  );
};

export default ObjPreview;
