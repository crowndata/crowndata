"use client";

import Head from "next/head";
import dynamic from "next/dynamic";

const ThreeDScene = dynamic(() => import("@/components/ThreeDScene"), {
  ssr: false,
});

const InteractivePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Interactive 3D Grasper Scene</title>
        <meta
          name="description"
          content="An interactive 3D scene with a robotic grasper"
        />
      </Head>
      <ThreeDScene />
    </>
  );
};

export default InteractivePage;
