import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import "@/styles/globals.css";

// Define the types for the CameraSetup props
interface CameraSetupProps {
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

export default function CameraSetup({
  fov,
  aspectRatio,
  near,
  far,
  positionX,
  positionY,
  positionZ,
  lookAtX,
  lookAtY,
  lookAtZ,
}: CameraSetupProps) {
  const { camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = new THREE.PerspectiveCamera(
      fov,
      aspectRatio,
      near,
      far,
    );
    perspectiveCamera.position.set(positionX, positionY, positionZ);
    perspectiveCamera.lookAt(lookAtX, lookAtY, lookAtZ);

    // Update the default camera to match the PerspectiveCamera settings
    camera.copy(perspectiveCamera);
  }, [
    camera,
    fov,
    aspectRatio,
    near,
    far,
    positionX,
    positionY,
    positionZ,
    lookAtX,
    lookAtY,
    lookAtZ,
  ]);

  return null;
}
