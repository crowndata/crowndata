import React, { forwardRef } from "react";
import * as THREE from "three";

interface ObjectsProps {
  pickedObject: THREE.Object3D | null; // Track if an object is picked up
}

const Objects = forwardRef<THREE.Object3D[], ObjectsProps>(
  ({ pickedObject }, ref) => {
    const objectRefs = React.useRef<THREE.Mesh[]>([]);

    // Track objects for reference by the grasper
    React.useImperativeHandle(ref, () => objectRefs.current);

    return (
      <>
        {/* Example object (a simple red cube) */}
        <mesh
          ref={(el) => {
            if (el) objectRefs.current[0] = el; // Track reference to the cube
          }}
          position={[2, 0.5, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={pickedObject === objectRefs.current[0] ? 0xffff00 : 0xff0000}
          />
        </mesh>

        {/* Plane (Floor) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={0x808080} />
        </mesh>
      </>
    );
  },
);

// Assign a display name to the component to resolve ESLint error
Objects.displayName = "Objects";

export default Objects;
