"use client";

import { useState, Suspense, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, Center } from "@react-three/drei";
import * as THREE from "three";
// @ts-ignore
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
// @ts-ignore
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader";
import JSZip from "jszip";
import { Loader2, AlertTriangle } from "lucide-react";

// Robust library injection for 3MFLoader
try {
  (ThreeMFLoader.prototype as any).addLibrary = (ThreeMFLoader.prototype as any).addLibrary || function(this: any, lib: any) { 
    this.library = lib; 
  };
} catch (e) {
  console.warn("Failed to patch 3MFLoader prototype", e);
}

function ModelRenderer({ url }: { url: string }) {
  const is3mf = url.toLowerCase().endsWith(".3mf");
  
  // Use a catch block or conditional to avoid crashing during load hook
  const result = useLoader(
    is3mf ? ThreeMFLoader as any : STLLoader as any, 
    url,
    (loader: any) => {
        if (is3mf) {
            // Check for both common setter names
            if (typeof loader.addLibrary === 'function') {
                loader.addLibrary(JSZip);
            } else if (typeof loader.setJSZip === 'function') {
                loader.setJSZip(JSZip);
            }
        }
    }
  );

  const group = useMemo(() => {
    if (is3mf && result) {
      return result as THREE.Group;
    } else if (result) {
      const geometry = result as THREE.BufferGeometry;
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry);
      const g = new THREE.Group();
      g.add(mesh);
      return g;
    }
    return new THREE.Group();
  }, [result, is3mf]);

  useMemo(() => {
    if (!group) return;
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: "#3b82f6",
          roughness: 0.3,
          metalness: 0.8,
        });
      }
    });
  }, [group]);

  return (
    <Center>
      <primitive object={group} />
    </Center>
  );
}

export default function ModelPreview({ url, name }: { url: string; name: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (!url) return null;

  if (hasError) {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertTriangle size={18} className="text-amber-500 mb-1" />
        <span className="text-[8px] font-bold text-slate-400 uppercase text-center">Format Error</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-50/50 flex items-center justify-center">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="text-[10px] font-black uppercase text-slate-400">Loading...</span>
        </div>
      }>
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 150], fov: 50 }} 
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          onError={() => setHasError(true)}
        >
          <color attach="background" args={["#f8faff"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stage environment="city" intensity={0.6} center={{}}>
             <ModelRenderer url={url} />
          </Stage>
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            autoRotate 
            autoRotateSpeed={2}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
