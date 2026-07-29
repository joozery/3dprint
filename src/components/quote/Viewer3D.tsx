"use client";

import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls, Stage, Center, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component<{ children: React.ReactNode; onError: (error: any) => void }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: any) { this.props.onError(error); }
    render() { return this.props.children; }
}

const colorMap: Record<string, string> = {
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

    const finalColor = colorMap[color] || color || "#3b82f6";
    const isWireframe = viewMode === 'wireframe';
    const isThickness = viewMode === 'ความหนาผนัง';

    const object = useLoader(
        ext === '3mf' ? ThreeMFLoader : ext === 'obj' ? OBJLoader : STLLoader,
        url
    );

    useMemo(() => {
        if (!object) return;

        const material = isWireframe
            ? new THREE.MeshBasicMaterial({ color: new THREE.Color('#2d3152'), wireframe: true })
            : isThickness
            ? new THREE.MeshBasicMaterial({ color: new THREE.Color('#3b82f6') })
            : new THREE.MeshStandardMaterial({ color: new THREE.Color(finalColor), roughness: 0.4, metalness: 0.1 });

        if (!(object instanceof THREE.BufferGeometry)) {
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

function StepMeshes({ geometries, color = "#3b82f6", viewMode = 'shaded' }: { geometries: THREE.BufferGeometry[]; color?: string; viewMode?: string }) {
    const finalColor = colorMap[color] || color || "#3b82f6";
    const isWireframe = viewMode === 'wireframe';

    return (
        <Center top>
            <group>
                {geometries.map((geo, i) => (
                    <mesh key={i} geometry={geo} castShadow={!isWireframe} receiveShadow={!isWireframe}>
                        {isWireframe
                            ? <meshBasicMaterial color="#2d3152" wireframe />
                            : <meshStandardMaterial color={finalColor} roughness={0.4} metalness={0.1} />
                        }
                    </mesh>
                ))}
            </group>
        </Center>
    );
}

async function parseStepFile(source: File | string): Promise<THREE.BufferGeometry[]> {
    let buffer: ArrayBuffer;
    if (source instanceof File) {
        buffer = await source.arrayBuffer();
    } else {
        const res = await fetch(source);
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
        buffer = await res.arrayBuffer();
    }

    const occtimportjs = (await import('occt-import-js')).default;
    const occt = await occtimportjs({
        locateFile: (name: string) => `/wasm/${name}`,
    });

    const result = occt.ReadStepFile(new Uint8Array(buffer), null);
    if (!result.success) throw new Error('STEP parse failed');

    return result.meshes.map((mesh: any) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(mesh.attributes.position.array, 3));
        if (mesh.attributes.normal) {
            geo.setAttribute('normal', new THREE.Float32BufferAttribute(mesh.attributes.normal.array, 3));
        } else {
            geo.computeVertexNormals();
        }
        if (mesh.index) {
            geo.setIndex(new THREE.BufferAttribute(new Uint32Array(mesh.index.array), 1));
        }
        return geo;
    });
}

export const Viewer3D = React.forwardRef<ViewerRef, Viewer3DProps>(({ fileUrl, fileName, file, color, viewMode = 'shaded' }, ref) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stepGeometries, setStepGeometries] = useState<THREE.BufferGeometry[] | null>(null);
    const [stepParsing, setStepParsing] = useState(false);
    const orbitRef = useRef<any>(null);

    React.useImperativeHandle(ref, () => ({
        zoomIn: () => {
            if (orbitRef.current) {
                orbitRef.current.object.position.multiplyScalar(0.9);
                orbitRef.current.update();
            }
        },
        zoomOut: () => {
            if (orbitRef.current) {
                orbitRef.current.object.position.multiplyScalar(1.1);
                orbitRef.current.update();
            }
        },
        resetView: () => {
            if (orbitRef.current) orbitRef.current.reset();
        },
        setView: (axis: 'X' | 'Y' | 'Z' | 'ISO') => {
            if (orbitRef.current) {
                const camera = orbitRef.current.object;
                const d = camera.position.length();
                if (axis === 'X') camera.position.set(d, 0, 0);
                else if (axis === 'Y') camera.position.set(0, d, 0);
                else if (axis === 'Z') camera.position.set(0, 0, d);
                else { const iso = d / Math.sqrt(3); camera.position.set(iso, iso, iso); }
                orbitRef.current.update();
            }
        },
    }));

    useEffect(() => {
        setError(null);
        setStepGeometries(null);
        setObjectUrl(null);
        setStepParsing(false);

        const source = file || (fileUrl ? fileUrl : null);
        const name = file?.name || fileName || fileUrl || "";
        const ext = name.split('.').pop()?.toLowerCase().split('?')[0];

        if (ext === "step" || ext === "stp") {
            if (!source) return;
            if (file && file.size > 200 * 1024 * 1024) {
                setError("ไฟล์ใหญ่เกิน 200MB ไม่สามารถแสดง Preview ได้");
                return;
            }
            setStepParsing(true);
            parseStepFile(source)
                .then((geos) => {
                    setStepGeometries(geos);
                })
                .catch(() => {
                    setError("ไม่สามารถอ่านไฟล์ STEP ได้ (ไฟล์อาจเสียหายหรือซับซ้อนเกินไป)");
                })
                .finally(() => setStepParsing(false));
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
            setObjectUrl(fileUrl);
        }
    }, [file, fileUrl, fileName]);

    // Dispose STEP geometries on unmount / change
    useEffect(() => {
        return () => {
            stepGeometries?.forEach((g) => g.dispose());
        };
    }, [stepGeometries]);

    // STEP parsing spinner
    if (stepParsing) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center">
                <svg className="w-6 h-6 text-blue-400 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">กำลังโหลด STEP…</p>
            </div>
        );
    }

    // STEP geometries ready — render in Canvas
    if (stepGeometries) {
        return (
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Canvas
                    shadows={viewMode !== 'wireframe'}
                    camera={{ position: [100, 100, 100], fov: 45 }}
                    gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
                    dpr={[1, 2]}
                >
                    <Stage intensity={viewMode === 'wireframe' ? 0 : 0.5} environment={viewMode === 'wireframe' ? undefined : "city"} shadows={viewMode === 'wireframe' ? false : "contact"} adjustCamera={1.2}>
                        <StepMeshes geometries={stepGeometries} color={color} viewMode={viewMode} />
                    </Stage>
                    <OrbitControls ref={orbitRef} makeDefault />
                    <AdaptiveDpr pixelated />
                </Canvas>
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
                onError={() => setError("ไม่สามารถประมวลผลโมเดล 3D ได้")}
            >
                <Stage intensity={viewMode === 'wireframe' ? 0 : 0.5} environment={viewMode === 'wireframe' ? undefined : "city"} shadows={viewMode === 'wireframe' ? false : "contact"} adjustCamera={1.2}>
                    <ErrorBoundary onError={() => setError("ไม่สามารถดึงข้อมูลโมเดล 3D ได้ (โครงสร้างไฟล์ซับซ้อนเกินไป)")}>
                        <React.Suspense fallback={null}>
                            <Model url={objectUrl} fileName={file?.name || fileName} color={color} viewMode={viewMode} onError={() => setError("โครงสร้างไฟล์ 3D ไม่ถูกต้อง")} />
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
