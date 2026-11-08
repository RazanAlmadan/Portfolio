"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function Gateway() {
    const { portalShape, archCurve } = useMemo(() => {
        const shape = new THREE.Shape();

        // inner glowing opening
        shape.moveTo(-0.72, -1.45);
        shape.lineTo(-0.72, 0.15);
        shape.absarc(0, 0.15, 0.72, Math.PI, 0, true);
        shape.lineTo(0.72, -1.45);
        shape.closePath();

        const points: THREE.Vector3[] = [
            new THREE.Vector3(-0.82, -1.45, 0),
            new THREE.Vector3(-0.82, 0.15, 0),
        ];

        for (let i = 1; i <= 40; i++) {
            const angle = Math.PI - (Math.PI * i) / 40;

            points.push(
                new THREE.Vector3(
                    0.82 * Math.cos(angle),
                    0.15 + 0.82 * Math.sin(angle),
                    0
                )
            );
        }

        points.push(new THREE.Vector3(0.82, -1.45, 0));

        return {
            portalShape: shape,
            archCurve: new THREE.CatmullRomCurve3(points),
        };
    }, []);

    const archLayers = Array.from({ length: 6 }, (_, i) => {
        return {
            z: -i * 0.32,
            scale: 1 - i * 0.035,
            opacity: 1 - i * 0.09,
        };
    });

    return (
        <group position={[0, -0.1, 0]}>
            {/* soft background glow */}
            <mesh position={[0, -0.15, -1.4]}>
                <planeGeometry args={[5.2, 5.2]} />
                <meshBasicMaterial color="#6D28D9" transparent opacity={0.18} />
            </mesh>

            {/* repeated arch layers */}
            {archLayers.map((layer, index) => (
                <mesh
                    key={index}
                    position={[0, 0, layer.z]}
                    scale={[layer.scale, layer.scale, 1]}
                >
                    <tubeGeometry args={[archCurve, 100, 0.07, 20, false]} />
                    <meshStandardMaterial
                        color="#F1D8FF"
                        emissive="#D8B4FE"
                        emissiveIntensity={0.55}
                        transparent
                        opacity={layer.opacity}
                        metalness={0.15}
                        roughness={0.2}
                    />
                </mesh>
            ))}

            {/* bright interior opening */}
            <mesh position={[0, -0.1, -1.75]}>
                <shapeGeometry args={[portalShape]} />
                <meshBasicMaterial color="#FFF8FF" transparent opacity={0.92} />
            </mesh>

            {/* purple mist/glow inside */}
            <mesh position={[0, -0.08, -1.65]} scale={[1.08, 1.08, 1]}>
                <shapeGeometry args={[portalShape]} />
                <meshBasicMaterial color="#E9D5FF" transparent opacity={0.18} />
            </mesh>

            {/* floor glow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.44, 0.2]}>
                <planeGeometry args={[2.3, 4.4]} />
                <meshBasicMaterial color="#D8B4FE" transparent opacity={0.22} />
            </mesh>

            {/* stronger center floor light */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.43, 0.3]}>
                <planeGeometry args={[1.2, 3.8]} />
                <meshBasicMaterial color="#FFF4FF" transparent opacity={0.22} />
            </mesh>
        </group>
    );
}