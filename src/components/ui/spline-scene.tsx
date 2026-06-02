"use client";
import { lazy, Suspense } from "react";

// Spline runtime is ~3 MB+ — React.lazy splits it into its own chunk.
// The IntersectionObserver gate in About3DCard ensures this only mounts
// (and WebGL initialises) once the card scrolls near the viewport, keeping
// it off the critical path for LCP.
const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
