import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lighting from "@/components/Lighting";
import Grasper from "@/components/Grasper";
import Objects from "@/components/Objects";
import * as THREE from "three";

const ThreeDScene: React.FC = () => {
  const [pickedObject, setPickedObject] = useState<THREE.Object3D | null>(null);
  const objectRefs = useRef<THREE.Object3D[]>([]); // Track the objects in the scene

  // Callback when the grasper grips an object
  const handleGrip = (object: THREE.Object3D | null) => {
    if (object) {
      setPickedObject(object); // Track the picked object
    } else {
      setPickedObject(null); // Release the object
    }
  };

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 75 }}>
      <Lighting />
      <Grasper objects={objectRefs.current} onGrip={handleGrip} />
      <Objects ref={objectRefs} pickedObject={pickedObject} />
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeDScene;
