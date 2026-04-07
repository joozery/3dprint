"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Box, FileBox, ExternalLink, Activity, CheckCircle2, XCircle } from "lucide-react";
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
            ref.current.rotation.x = 0.5;
        }
    });

    React.useEffect(() => {
        if (!object) return;
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#3b82f6"),
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
            className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm relative overflow-hidden group-hover:border-blue-200 transition-all duration-300"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {!hover ? (
                <div className="flex flex-col items-center justify-center pointer-events-none text-slate-300 group-hover:text-blue-500 transition-colors">
                    <Box size={20} />
                </div>
            ) : (
                <div className="absolute inset-0 w-full h-full bg-slate-50/50 animate-in fade-in duration-300">
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
// 3. Main Component
// ----------------------------------------------------
interface RecentOrdersTableProps {
    quotes: any[];
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "รอดำเนินการ", color: "text-amber-600 bg-amber-50 border-amber-200",   icon: Clock },
  ordered:   { label: "สั่งซื้อแล้ว", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "ยกเลิกแล้ว",  color: "text-red-500 bg-red-50 border-red-200",          icon: XCircle },
};

export function RecentOrdersTable({ quotes }: RecentOrdersTableProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                        <Activity size={14} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 leading-none">ใบเสนอราคาล่าสุด</h3>
                        <p className="text-slate-400 text-[11px] mt-1">แสดงรายการอัปโหลดและประเมินราคา 10 รายการล่าสุด</p>
                    </div>
                </div>
                {quotes.length > 0 && (
                    <Link href="/profile/quotes" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        ดูทั้งหมด
                    </Link>
                )}
            </div>
            
            {quotes.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <FileBox size={24} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-base mb-1">ยังไม่มีการสั่งซื้อ</h3>
                    <p className="text-slate-400 text-xs max-w-[280px]">อัปโหลดโมเดล 3 มิติ เพื่อรับการประเมินราคาได้ทันที</p>
                    <Link href="/quote" className="mt-6 font-semibold text-xs text-white bg-slate-900 px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-600 transition-all flex items-center gap-2">
                        <ArrowRight size={14} /> เริ่มต้นขอใบเสนอราคา
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col p-4 space-y-1">
                    {/* Header Row (Hidden on mobile) */}
                    <div className="hidden md:flex items-center px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-lg mb-2">
                        <div className="w-[40%]">รายการไฟล์</div>
                        <div className="w-[20%]">วันที่ส่งคำขอ</div>
                        <div className="w-[15%] text-center">ราคาประเมิน</div>
                        <div className="w-[15%] text-center">สถานะ</div>
                        <div className="w-[10%] text-right">เพิ่มเติม</div>
                    </div>

                    {/* Rows */}
                    {quotes.map((quote: any) => {
                        const status = statusMap[quote.status] || statusMap.pending;
                        const StatusIcon = status.icon;
                        
                        return (
                            <div key={quote._id} className="group relative bg-white hover:bg-blue-50/30 border border-slate-100 hover:border-blue-100 rounded-xl flex flex-col md:flex-row md:items-center px-4 py-4 md:py-3 transition-all duration-200">
                                
                                {/* 1. Model File */}
                                <div className="w-full md:w-[40%] flex items-center gap-3 mb-4 md:mb-0">
                                    <ModelThumbnail quote={quote} />
                                    <div className="flex flex-col min-w-0 pr-4">
                                        <div className="text-sm font-bold text-slate-800 truncate mb-0.5" title={quote.originalName || quote.fileName}>
                                            {quote.originalName || quote.fileName}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                                            <span>{quote.technology?.toUpperCase()} · {quote.material}</span>
                                            <span>•</span>
                                            <span className="text-slate-500">{quote.volumeCm3?.toFixed(2)} cm³</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Date */}
                                <div className="w-full md:w-[20%] mb-3 md:mb-0 md:flex flex-col justify-center hidden">
                                    <span className="text-[12px] font-semibold text-slate-600">
                                        {new Date(quote.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(quote.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                                    </span>
                                </div>

                                {/* 3. Price */}
                                <div className="w-full md:w-[15%] md:flex justify-center mb-3 md:mb-0 hidden">
                                    {quote.priceDetail?.totalPrice ? (
                                        <span className="text-[12px] font-bold text-slate-800">
                                            ฿{quote.priceDetail.totalPrice.toLocaleString()}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-semibold whitespace-nowrap">
                                            รอประเมิน
                                        </span>
                                    )}
                                </div>

                                {/* 4. Status */}
                                <div className="w-full md:w-[15%] flex justify-between md:justify-center items-center mb-0">
                                    <span className="md:hidden text-[11px] font-semibold text-slate-400">สถานะ:</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${status.color}`}>
                                        <StatusIcon size={10} />
                                        {status.label}
                                    </span>
                                </div>

                                {/* 5. Action */}
                                <div className="hidden w-full md:w-[10%] md:flex justify-end relative">
                                    <Link 
                                        href={`/viewer/${quote._id}`} 
                                        target="_blank" 
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <ExternalLink size={15} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
