"use client";

import React, { useMemo, useEffect, useState, useRef } from 'react';
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
    color?: string;
    viewMode?: string;
}

export interface ViewerRef {
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
    setView: (axis: 'X' | 'Y' | 'Z' | 'ISO') => void;
}

function Model({ url, fileName, color = "#3b82f6", viewMode = 'shaded', onError }: { url: string; fileName?: string | null; color?: string; viewMode?: string; onError: (err: any) => void }) {
    const ext = fileName?.split('.').pop()?.toLowerCase();

    const colorMap: { [key: string]: string } = {
        'ขาว': '#ffffff',
        'ขาวด้าน': '#f8f8f8',
        'ดำ': '#1a1a1a',
        'เทา': '#808080',
        'แดง': '#ff0000',
        'น้ำเงิน': '#0000ff',
        'เหลือง': '#ffff00',
        'เขียว': '#00ff00',
        'ใส': '#e0e0e0',
    };

    const finalColor = colorMap[color] || color || "#3b82f6";
    const isWireframe = viewMode === 'wireframe';
    const isThickness = viewMode === 'ความหนาผนัง';

    // Use useLoader but handle errors via Suspense & Error Boundary
    const object = useLoader(
        ext === '3mf' ? ThreeMFLoader : ext === 'obj' ? OBJLoader : STLLoader,
        url
    );

    useMemo(() => {
        if (!object) return;

        const material = isWireframe
            ? new THREE.MeshBasicMaterial({
                color: new THREE.Color('#2d3152'),
                wireframe: true,
            })
            : isThickness
            ? new THREE.MeshBasicMaterial({
                color: new THREE.Color('#3b82f6'),
            })
            : new THREE.MeshStandardMaterial({
                color: new THREE.Color(finalColor),
                roughness: 0.4,
                metalness: 0.1,
            });

        if (object instanceof THREE.BufferGeometry) {
            return;
        } else {
            object.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = !isWireframe && !isThickness;
                    child.receiveShadow = !isWireframe && !isThickness;
                    child.material = material;
                }
            });
        }
    }, [object, finalColor, isWireframe, isThickness]);

    if (!object) return null;

    if (object instanceof THREE.BufferGeometry) {
        return (
            <Center top>
                <mesh geometry={object} castShadow={!isWireframe && !isThickness} receiveShadow={!isWireframe && !isThickness}>
                    {isWireframe
                        ? <meshBasicMaterial color="#2d3152" wireframe />
                        : isThickness
                        ? <meshBasicMaterial color="#3b82f6" />
                        : <meshStandardMaterial color={finalColor} roughness={0.4} metalness={0.1} />
                    }
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

export const Viewer3D = React.forwardRef<ViewerRef, Viewer3DProps>(({ fileUrl, fileName, file, color, viewMode = 'shaded' }, ref) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const orbitRef = useRef<any>(null);

    React.useImperativeHandle(ref, () => ({
        zoomIn: () => {
            if (orbitRef.current) {
                const camera = orbitRef.current.object;
                camera.position.multiplyScalar(0.9);
                orbitRef.current.update();
            }
        },
        zoomOut: () => {
            if (orbitRef.current) {
                const camera = orbitRef.current.object;
                camera.position.multiplyScalar(1.1);
                orbitRef.current.update();
            }
        },
        resetView: () => {
            if (orbitRef.current) {
                orbitRef.current.reset();
            }
        },
        setView: (axis: 'X' | 'Y' | 'Z' | 'ISO') => {
            if (orbitRef.current) {
                const camera = orbitRef.current.object;
                const distance = camera.position.length();
                switch (axis) {
                    case 'X':
                        camera.position.set(distance, 0, 0);
                        break;
                    case 'Y':
                        camera.position.set(0, distance, 0);
                        break;
                    case 'Z':
                        camera.position.set(0, 0, distance);
                        break;
                    case 'ISO':
                        const iso = distance / Math.sqrt(3);
                        camera.position.set(iso, iso, iso);
                        break;
                }
                orbitRef.current.update();
            }
        }
    }));

    useEffect(() => {
        setError(null);
        const name = file?.name || fileName || "";
        const ext = name.split('.').pop()?.toLowerCase();

        // STEP/STP เป็น CAD format — ไม่มี Three.js loader รองรับ
        // STLLoader จะอ่านขยะเป็น triangle count แล้ว crash (RangeError)
        if (ext === "step" || ext === "stp") {
            setError("STEP_FORMAT");
            return;
        }

        if (file) {
            if (file.size > 100 * 1024 * 1024) {
                setError("ไฟล์มีขนาดใหญ่เกินกว่าจะแสดงผลพรีวิวได้ (Max 100MB)");
                return;
            }
            const url = URL.createObjectURL(file);
            setObjectUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        if (fileUrl) {
            const urlExt = fileUrl.split('.').pop()?.toLowerCase().split('?')[0];
            if (urlExt === "step" || urlExt === "stp") {
                setError("STEP_FORMAT");
                return;
            }
            setObjectUrl(fileUrl);
        }
    }, [file, fileUrl, fileName]);

    if (error === "STEP_FORMAT") {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <svg className="w-8 h-8 text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
                </svg>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STEP / CAD</p>
                <p className="text-[9px] text-slate-300 mt-0.5">Preview ไม่รองรับ</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Preview Error</p>
                <p className="text-[9px] text-slate-400 leading-tight">{error}</p>
            </div>
        );
    }

    if (!objectUrl) return null;

    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
                shadows={viewMode !== 'wireframe'}
                camera={{ position: [100, 100, 100], fov: 45 }}
                gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
                dpr={[1, 2]}
                onError={(e) => setError("ไม่สามารถประมวลผลโมเดล 3D ได้")}
            >
                <Stage intensity={viewMode === 'wireframe' ? 0 : 0.5} environment={viewMode === 'wireframe' ? undefined : "city"} shadows={viewMode === 'wireframe' ? false : "contact"} adjustCamera={1.2}>
                    <ErrorBoundary onError={(e) => setError("ไม่สามารถดึงข้อมูลโมเดล 3D ได้ (โครงสร้างไฟล์ซับซ้อนเกินไป)")}>  
                        <React.Suspense fallback={null}>
                            <Model url={objectUrl} fileName={file?.name || fileName} color={color} viewMode={viewMode} onError={(e) => setError("โครงสร้างไฟล์ 3D ไม่ถูกต้อง")} />
                        </React.Suspense>
                    </ErrorBoundary>
                </Stage>
                <OrbitControls ref={orbitRef} makeDefault />
                <AdaptiveDpr pixelated />
            </Canvas>
        </div>
    );
});

Viewer3D.displayName = 'Viewer3D';
