"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls, Stage, Center, AdaptiveDpr, Environment } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component<{ children: React.ReactNode; onError: (error: any) => void }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: any) { this.props.onError(error); }
    render() { return this.props.children; }
}

interface Viewer3DProps {
    fileUrl: string | null;
    fileName?: string | null;
    file?: File | null;
    displayColor?: string;
}

function Model({ url, fileName, displayColor = "#3b82f6", onError }: { url: string; fileName?: string | null; displayColor?: string; onError: (err: any) => void }) {
    const ext = fileName?.split('.').pop()?.toLowerCase();

    // Use useLoader but handle errors via Suspense & Error Boundary
    const object = useLoader(
        ext === '3mf' ? ThreeMFLoader : ext === 'obj' ? OBJLoader : STLLoader,
        url
    );

    useMemo(() => {
        if (!object) return;

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(displayColor),
            roughness: 0.4,
            metalness: 0.1
        });

        if (object instanceof THREE.BufferGeometry) {
            // STL returns geometry
            return;
        } else {
            // 3MF/OBJ returns Group/Object3D
            object.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = material;
                }
            });
        }
    }, [object, displayColor]);

    if (!object) return null;

    if (object instanceof THREE.BufferGeometry) {
        return (
            <Center top>
                <mesh geometry={object} castShadow receiveShadow>
                    <meshStandardMaterial color={displayColor} roughness={0.4} metalness={0.1} />
                </mesh>
            </Center>
        );
    }

    return (
        <Center top>
            <primitive object={object} />
        </Center>
    );
}

export function Viewer3D({ fileUrl, fileName, file, displayColor }: Viewer3DProps) {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
        if (file) {
            // Validate file size/type before loading
            if (file.size > 100 * 1024 * 1024) {
                setError("ไฟล์มีขนาดใหญ่เกินกว่าจะแสดงผลพรีวิวได้ (Max 100MB)");
                return;
            }
            const url = URL.createObjectURL(file);
            setObjectUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        if (fileUrl) {
            setObjectUrl(fileUrl);
        }
    }, [file, fileUrl]);

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50">
                <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Preview Error</p>
                <p className="text-[9px] text-slate-400 leading-tight">{error}</p>
            </div>
        );
    }

    if (!objectUrl) return null;

    return (
        <div className="w-full h-full bg-slate-50 cursor-grab active:cursor-grabbing">
            <Canvas
                shadows
                camera={{ position: [100, 100, 100], fov: 45 }}
                gl={{ antialias: true, preserveDrawingBuffer: true }}
                dpr={[1, 2]}
                onError={(e) => setError("ไม่สามารถประมวลผลโมเดล 3D ได้")}
            >
                <Stage intensity={0.5} environment="city" shadows="contact" adjustCamera={1.2}>
                    <ErrorBoundary onError={(e) => setError("ไม่สามารถดึงข้อมูลโมเดล 3D ได้ (โครงสร้างไฟล์ซับซ้อนเกินไป)")}>
                        <React.Suspense fallback={null}>
                            <Model url={objectUrl} fileName={file?.name || fileName} displayColor={displayColor} onError={(e) => setError("โครงสร้างไฟล์ 3D ไม่ถูกต้อง")} />
                        </React.Suspense>
                    </ErrorBoundary>
                </Stage>
                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                <AdaptiveDpr pixelated />
            </Canvas>
        </div>
    );
}
