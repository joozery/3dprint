"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Box, FileBox, ExternalLink, Activity } from "lucide-react";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. 3D Model Component for Miniature Preview
// ----------------------------------------------------
function MiniModel({ url, fileName }: { url: string; fileName: string; }) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const object = useLoader(
        ext === '3mf' ? ThreeMFLoader : ext === 'obj' ? OBJLoader : STLLoader,
        url
    );
    const ref = useRef<any>(null);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.02;
            ref.current.rotation.x = 0.5; // slight top-down angle
        }
    });

    React.useEffect(() => {
        if (!object) return;
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#3b82f6"), // blue-500
            roughness: 0.3,
            metalness: 0.2,
        });

        if (object instanceof THREE.BufferGeometry) {
             object.computeVertexNormals();
        } else {
            object.traverse((child: any) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.computeVertexNormals();
                    child.material = material;
                }
            });
        }
    }, [object]);

    if (!object) return null;

    if (object instanceof THREE.BufferGeometry) {
        return (
            <group ref={ref}>
                <Center>
                    <mesh geometry={object}>
                        <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.2} />
                    </mesh>
                </Center>
            </group>
        );
    }

    return (
        <group ref={ref}>
            <Center><primitive object={object} /></Center>
        </group>
    );
}

// ----------------------------------------------------
// 2. Thumbnail Component (Hover to Load 3D)
// ----------------------------------------------------
function ModelThumbnail({ quote }: { quote: any }) {
    const [hover, setHover] = useState(false);

    return (
        <div 
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] bg-indigo-50/50 border border-indigo-100/60 flex items-center justify-center flex-shrink-0 shadow-sm relative overflow-hidden group-hover:border-blue-300 transition-all duration-300 group-hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {!hover ? (
                <div className="flex flex-col items-center justify-center pointer-events-none">
                    <Box size={24} className="text-indigo-400/80 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-300 mb-0.5" />
                    <span className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Preview</span>
                </div>
            ) : (
                <div className="absolute inset-0 w-full h-full bg-indigo-50 animate-in fade-in duration-300">
                    <Canvas camera={{ position: [0, 0, 150], fov: 40 }} gl={{ preserveDrawingBuffer: false, antialias: false }}>
                        <ambientLight intensity={1} />
                        <directionalLight position={[10, 10, 10]} intensity={1.5} />
                        <React.Suspense fallback={null}>
                            {quote.fileUrl && <MiniModel url={quote.fileUrl} fileName={quote.originalName} />}
                        </React.Suspense>
                    </Canvas>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 3. Main Table Component
// ----------------------------------------------------
interface RecentOrdersTableProps {
    quotes: any[];
}

export function RecentOrdersTable({ quotes }: RecentOrdersTableProps) {
    return (
        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-200/50 flex justify-between items-center bg-transparent">
                <h3 className="text-[14px] font-black tracking-widest text-slate-800 uppercase flex items-center gap-2">
                    <Activity size={18} className="text-blue-600" /> กิจกรรมล่าสุด
                </h3>
            </div>
            
            {quotes.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center bg-slate-50/50">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 border border-slate-200 shadow-sm hover:scale-105 transition-transform">
                        <FileBox size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-black text-xl mb-2 tracking-tight">ยังไม่มีการสั่งซื้อ</h3>
                    <p className="text-slate-500 font-medium text-sm max-w-[280px]">คุณยังไม่ได้อัปโหลดโมเดล 3 มิติใดๆ เริ่มต้นโปรเจกต์งานพิมพ์ของคุณได้ที่นี่</p>
                    <Link href="/quote" className="mt-8 font-bold text-[13px] tracking-wide text-white bg-blue-600 px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                        อัปโหลดโมเดลแรกของคุณ
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col p-4 space-y-2">
                    {/* Header Row (Hidden on mobile) */}
                    <div className="hidden md:flex items-center px-4 py-2 text-[11px] font-black justify-between text-slate-400 uppercase tracking-widest mb-1">
                        <div className="w-[35%]">ไฟล์โมเดล</div>
                        <div className="w-[20%]">วันที่อัปโหลด</div>
                        <div className="w-[25%]">รายละเอียด & ราคาประเมิน</div>
                        <div className="w-[15%]">สถานะงาน</div>
                        <div className="w-[5%] text-right">จัดการ</div>
                    </div>

                    {/* Order Rows */}
                    {quotes.map((quote: any) => (
                        <div key={quote._id} className="group relative bg-transparent hover:bg-white/80 border border-transparent hover:border-slate-200/60 rounded-2xl flex flex-col md:flex-row md:items-center px-4 py-4 md:py-3 transition-all duration-300 cursor-default hover:shadow-sm">
                            
                            {/* 1. Model File */}
                            <div className="w-full md:w-[35%] flex items-center gap-4 mb-4 md:mb-0">
                                <ModelThumbnail quote={quote} />
                                <div className="flex flex-col">
                                    <Link href={`/viewer/${quote._id}`} target="_blank" className="text-[15px] font-black text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5 transition-colors line-clamp-1 break-all pr-4">
                                        {quote.originalName || "Unnamed_File.stl"} 
                                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                                    </Link>
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">#{quote._id.toString().slice(-8).toUpperCase()}</span>
                                </div>
                            </div>

                            {/* 2. Date */}
                            <div className="w-full md:w-[20%] mb-3 md:mb-0 hidden md:block">
                                <span className="text-[13px] text-slate-600 font-bold">
                                    {new Date(quote.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>

                            {/* 3. Detail & Price */}
                            <div className="w-full md:w-[25%] flex justify-between md:flex-col mb-3 md:mb-0">
                                <span className="text-[14px] font-black text-slate-900">{quote.volumeCm3?.toFixed(2) || "0"} <span className="text-[11px] text-slate-400 font-bold">cm³</span></span>
                                <span className="text-[13px] sm:text-[11px] font-bold text-blue-600 mt-0.5 md:mt-1 bg-blue-50/50 px-2.5 py-1 rounded-lg md:w-fit border border-blue-100 flex items-center gap-1.5 shadow-sm">
                                    {quote.totalPrice ? (
                                        <>฿{quote.totalPrice.toLocaleString()}</>
                                    ) : (
                                        <>
                                            <Clock size={12} className="text-blue-500 animate-spin-slow" />
                                            กำลังประเมินราคา
                                        </>
                                    )}
                                </span>
                            </div>

                            {/* 4. Status */}
                            <div className="w-full md:w-[15%] flex items-center justify-between md:justify-start mb-3 md:mb-0 border-t border-slate-100 pt-3 md:pt-0 md:border-t-0">
                                <span className="md:hidden text-[11px] font-bold text-slate-400">สถานะ:</span>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/60 shadow-sm relative overflow-hidden group-hover:border-amber-300 transition-colors">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite] pointer-events-none"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse relative z-10"></div>
                                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest relative z-10">วิเคราะห์ข้อมูล</span>
                                </div>
                            </div>

                            {/* 5. Action */}
                            <div className="w-full md:w-[5%] flex justify-end md:justify-end">
                                <Link 
                                    href={`/viewer/${quote._id}`} 
                                    target="_blank" 
                                    className="inline-flex items-center justify-center w-full md:w-10 md:h-10 py-2 md:py-0 rounded-xl text-slate-500 bg-slate-50 border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-700 transition-all shadow-sm hover:shadow-md hover:scale-105"
                                >
                                    <span className="md:hidden text-[13px] font-bold mr-2">ดูรายละเอียด</span>
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
