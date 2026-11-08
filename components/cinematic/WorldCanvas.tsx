"use client";

import { Canvas } from "@react-three/fiber";
import Gateway from "./Gateway";

export default function WorldCanvas() {
  return (
      <div className="gateway-canvas">
        <Canvas
            camera={{
              position: [0, 0.05, 5.4],
              fov: 36,
            }}
            dpr={[1, 1.5]}
        >
          <color attach="background" args={["#1A0630"]} />

          <ambientLight intensity={0.55} />

          <pointLight
              position={[0, 0.2, 2]}
              color="#F5DFFF"
              intensity={18}
              distance={8}
          />

          <pointLight
              position={[0, -1.1, 2.4]}
              color="#C084FC"
              intensity={20}
              distance={8}
          />

          <pointLight
              position={[0, 1.7, 1.8]}
              color="#E9D5FF"
              intensity={8}
              distance={6}
          />

          <Gateway />
        </Canvas>
      </div>
  );
}