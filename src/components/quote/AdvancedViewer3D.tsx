"use client";

import React, { useMemo, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls, Stage, Center, AdaptiveDpr, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Menu, Home, RotateCcw, Ruler, SlidersHorizontal, Hand, Scissors, Box, Move, PaintBucket, Info, Maximize, Settings, X, RefreshCw, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface QuoteData {
    _id: string;
    fileName: string;
    originalName: string;
    fileUrl: string;
    volumeCm3?: number;
    weightGrams?: number;
    dimensions?: { x?: number, y?: number, z?: number } | null;
}

function AdvancedModel({ url, fileName, displayColor = "#ffffff" }: { url: string; fileName: string; displayColor?: string; }) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const object = useLoader(
        ext === '3mf' ? ThreeMFLoader : ext === 'obj' ? OBJLoader : STLLoader,
        url
    );

    useMemo(() => {
        if (!object) return;

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(displayColor),
            roughness: 0.2, // Slightly glossy like polished resin
            metalness: 0.1,
            envMapIntensity: 1.0
        });

        if (object instanceof THREE.BufferGeometry) {
             object.computeVertexNormals();
        } else {
            object.traverse((child: any) => {
                if (child.isMesh) {
                    if (child.geometry) {
                        child.geometry.computeVertexNormals();
                    }
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
                    <meshStandardMaterial color={displayColor} roughness={0.2} metalness={0.1} envMapIntensity={1} />
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

const ToolbarItem = ({ icon: Icon, label, isActive }: { icon: any, label: string, isActive?: boolean }) => (
    <button className={cn(
        "flex flex-col items-center justify-center w-14 lg:w-16 gap-1.5 transition-colors cursor-pointer group hover:bg-slate-100 p-2 rounded-xl",
        isActive ? "text-blue-600" : "text-slate-500"
    )}>
        <Icon className={cn("w-4 h-4 lg:w-5 lg:h-5", isActive ? "text-blue-600" : "text-slate-600 group-hover:text-slate-900 group-hover:scale-110 transition-transform")} />
        <span className={cn("text-[9px] lg:text-[10px] font-medium leading-none whitespace-nowrap", isActive ? "font-bold text-blue-600" : "")}>{label}</span>
    </button>
);

export default function AdvancedViewer3D({ quote }: { quote: QuoteData }) {
    const [color, setColor] = useState("#f4f4f5"); // default white/gray shade
    const [showInfo, setShowInfo] = useState(true);
    const [mode, setMode] = useState<'rotate' | 'pan'>('rotate');

    return (
        <div className="w-full h-full relative font-sans flex flex-col">
            
            {/* Top Left Menu Button */}
            <div className="absolute top-6 left-6 z-10">
                <button className="w-10 h-10 bg-white rounded-full shadow-md shadow-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-100 text-slate-700">
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Top Right View Cube Icon (Mock) */}
            <div className="absolute top-6 right-6 z-10">
                <div className="w-12 h-12 bg-white/70 backdrop-blur-md rounded-lg shadow-sm flex items-center justify-center border border-white p-1 text-slate-300">
                    <Box className="w-8 h-8 opacity-50 stroke-[1.5]" />
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 w-full bg-[#EAECEE] cursor-move">
                <Canvas shadows camera={{ position: [0, 80, 150], fov: 40 }} gl={{ preserveDrawingBuffer: true, antialias: true }}>
                    <Environment preset="studio" environmentIntensity={0.8} />
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
                    <directionalLight position={[-10, 10, -10]} intensity={0.5} />
                    
                    <Stage environment="studio" intensity={0.5} adjustCamera={1.2}>
                        <React.Suspense fallback={null}>
                            <AdvancedModel url={quote.fileUrl} fileName={quote.originalName} displayColor={color} />
                        </React.Suspense>
                    </Stage>
                    
                    <ContactShadows resolution={1024} scale={100} blur={2} opacity={0.4} far={20} color="#000000" />
                    <OrbitControls 
                        makeDefault 
                        enablePan={true} 
                        enableZoom={true} 
                        mouseButtons={
                            mode === 'pan' 
                            ? { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }
                            : { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
                        }
                    />
                    <AdaptiveDpr pixelated />
                </Canvas>
            </div>

            {/* Bottom Left Info Panel */}
            {showInfo && (
                <div className="absolute bottom-28 left-6 z-10 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="px-4 py-3 flex justify-between items-center border-b border-slate-100">
                        <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Basic Information</h3>
                        <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Box className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium">Volume</span>
                            </div>
                            <span className="text-xs font-bold text-slate-800">{quote.volumeCm3?.toFixed(2) || "N/A"} mm³</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Layers className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium">Surface Area</span>
                            </div>
                            <span className="text-xs font-bold text-slate-800">{(quote.volumeCm3 ? (quote.volumeCm3 * 0.4).toFixed(2) : "N/A")} mm²</span>
                        </div>
                        <div className="flex justify-between items-start pt-1">
                            <div className="flex items-center gap-2 text-slate-500 shrink-0">
                                <Move className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium">Bounding Box</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-800 text-right leading-relaxed">
                                {quote.dimensions?.x?.toFixed(2) || "0"} × {quote.dimensions?.y?.toFixed(2) || "0"} × {quote.dimensions?.z?.toFixed(2) || "0"} mm
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar ด้านล่างถูกนำออกตามคำขอ */}
        </div>
    );
}
