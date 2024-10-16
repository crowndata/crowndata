import { useMemo, useRef } from "react";

// Type definition for a 3D point [x, y, z]
type Point3D = [number, number, number];

// Custom comparison function that checks if two arrays of points are equal within a given tolerance
export function areArraysEqualWithTolerance(
  arr1: Point3D[],
  arr2: Point3D[],
  tolerance: number = 1e-4,
): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every(
    (point, index) =>
      point.length === arr2[index].length &&
      point.every((value, i) => Math.abs(value - arr2[index][i]) < tolerance),
  );
}

// Custom hook for deep compare with tolerance
export function useDeepCompareMemoWithTolerance<T>(
  factory: () => T,
  dependencies: [Point3D[]], // Expecting an array of 3D points
  tolerance: number = 1e-4,
): T {
  const ref = useRef<[Point3D[]]>(dependencies); // Initialize with dependencies

  // Check if the dependencies have changed
  const dependenciesChanged = !areArraysEqualWithTolerance(
    dependencies[0],
    ref.current[0],
    tolerance,
  );

  // Update ref only if dependencies have changed
  if (dependenciesChanged) {
    ref.current = dependencies;
  }

  // Memoize the factory and ensure it's re-created only when dependencies change
  return useMemo(factory, [
    factory,
    dependenciesChanged ? ref.current : dependencies,
  ]);
}
