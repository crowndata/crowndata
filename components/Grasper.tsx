import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GrasperProps {
  objects: THREE.Object3D[]; // Array of objects in the scene
  onGrip: (object: THREE.Object3D | null) => void; // Callback when gripping an object
}

const Grasper: React.FC<GrasperProps> = ({ objects, onGrip }) => {
  const { scene } = useGLTF("/interactive/grasper-model.glb"); // Load the 3D grasper model
  const grasperRef = useRef<THREE.Group>(null);

  // State to control grasper position and grip
  const [position, setPosition] = useState({ x: 0, y: 1, z: 0 });
  const [isGripping, setIsGripping] = useState(false);
  const [heldObject, setHeldObject] = useState<THREE.Object3D | null>(null);

  // Handle keyboard input for grasper movement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
          setPosition((prev) => ({ ...prev, z: prev.z - 0.1 }));
          break;
        case "ArrowDown":
          setPosition((prev) => ({ ...prev, z: prev.z + 0.1 }));
          break;
        case "ArrowLeft":
          setPosition((prev) => ({ ...prev, x: prev.x - 0.1 }));
          break;
        case "ArrowRight":
          setPosition((prev) => ({ ...prev, x: prev.x + 0.1 }));
          break;
        case "KeyW": // Move up
          setPosition((prev) => ({ ...prev, y: prev.y + 0.1 }));
          break;
        case "KeyS": // Move down
          setPosition((prev) => ({ ...prev, y: prev.y - 0.1 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle mouse click for grasper grip
  useEffect(() => {
    const handleMouseClick = () => {
      setIsGripping((prev) => !prev); // Toggle the gripping state

      // If we are gripping and there's no held object, check for collisions
      if (!heldObject && grasperRef.current) {
        const grasperBoundingBox = new THREE.Box3().setFromObject(
          grasperRef.current,
        );
        let closestObject: THREE.Object3D | null = null;
        let closestDistance = Infinity;

        // Loop through the objects to find the closest one
        objects.forEach((object) => {
          const objectBoundingBox = new THREE.Box3().setFromObject(object);
          if (grasperBoundingBox.intersectsBox(objectBoundingBox)) {
            const distance = grasperRef.current!.position.distanceTo(
              object.position,
            );
            if (distance < closestDistance) {
              closestObject = object;
              closestDistance = distance;
            }
          }
        });

        // If we found an object, pick it up
        if (closestObject) {
          setHeldObject(closestObject);
          onGrip(closestObject); // Notify parent component of the gripped object
        }
      }

      // If we're releasing the object, drop it
      if (!isGripping && heldObject) {
        setHeldObject(null);
        onGrip(null); // Notify parent component of the released object
      }
    };

    window.addEventListener("mousedown", handleMouseClick);

    return () => {
      window.removeEventListener("mousedown", handleMouseClick);
    };
  }, [isGripping, heldObject, objects, onGrip]);

  // Animation loop for grasper movement and grip logic
  useFrame(() => {
    if (grasperRef.current) {
      // Update grasper position
      grasperRef.current.position.set(position.x, position.y, position.z);

      // Simple gripping logic: scale arms on Z axis to simulate gripping
      const gripScale = isGripping ? 0.6 : 1; // Reduce Z scale when gripping
      grasperRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.scale.set(1, 1, gripScale); // Adjust arm width (z-axis)
        }
      });

      // Move the held object along with the grasper
      if (heldObject) {
        heldObject.position.set(position.x, position.y, position.z + 1); // Adjust position
      }
    }
  });

  return (
    <primitive
      ref={grasperRef}
      object={scene}
      scale={[0.5, 0.5, 0.5]}
      castShadow
    />
  );
};

useGLTF.preload("/interactive/grasper-model.glb");

export default Grasper;
