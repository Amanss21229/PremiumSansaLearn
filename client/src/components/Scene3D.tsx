import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Environment, useGLTF, Html } from "@react-three/drei";
import { useRef, Suspense, useState } from "react";
import * as THREE from "three";

function Label({ position, text }: { position: [number, number, number], text: string }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Html position={position} distanceFactor={10}>
      <div 
        className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all duration-300 cursor-help
          ${hovered ? 'bg-primary text-black scale-110 shadow-lg shadow-primary/50' : 'bg-black/60 text-white border border-white/20'}`}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {text}
      </div>
    </Html>
  );
}

function ModelMesh({ url, modelType }: { url: string, modelType?: string }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Position labels based on model type
  const labels = modelType === "organ" ? [
    { pos: [0.5, 0.8, 0], text: "Superior Vena Cava" },
    { pos: [-0.6, 0.5, 0.2], text: "Aorta" },
    { pos: [0, -0.8, 0.3], text: "Apex" }
  ] : modelType === "molecule" ? [
    { pos: [0, 0.6, 0], text: "Nucleus" },
    { pos: [1, -0.5, 0], text: "Electrons" }
  ] : [];

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={2.5} rotation={[0, -Math.PI / 2, 0]} />
      {labels.map((label, i) => (
        <Label key={i} position={label.pos as [number, number, number]} text={label.text} />
      ))}
    </group>
  );
}

function SubjectMesh({ type, modelUrl }: { type: string, modelUrl?: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !modelUrl) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
    }
  });

  if (modelUrl) {
    return (
      <Suspense fallback={
        <mesh scale={2}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#666666" wireframe />
        </mesh>
      }>
        <ModelMesh url={modelUrl} modelType={type} />
      </Suspense>
    );
  }

  // Render different shapes based on the subject type (simulating complex models)
  if (type === "organ") {
    // Heart/Kidney representation - Red sphere with distortion
    return (
      <mesh ref={meshRef} scale={2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#ff4444" 
          roughness={0.3} 
          metalness={0.2}
          emissive="#500000"
          emissiveIntensity={0.2}
        />
      </mesh>
    );
  } 
  
  if (type === "molecule") {
    // Molecule representation - Connected spheres
    return (
      <group ref={meshRef as any} scale={1.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0.8, 0.8, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-0.8, 0.8, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Bonds */}
        <mesh position={[0.4, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.4, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    );
  }

  // Default / Periodic Table / Physics - Gold metallic shape
  return (
    <mesh ref={meshRef} scale={2}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#FFD700" 
        roughness={0.1} 
        metalness={0.8}
        wireframe={type === "physics"}
      />
    </mesh>
  );
}

interface SceneProps {
  type: "logo" | "model";
  modelType?: string;
  modelUrl?: string | null;
  className?: string;
}

export default function Scene3D({ type, modelType = "default", modelUrl, className }: SceneProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />
        
        {type === "logo" ? (
          <mesh scale={2.5}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        ) : (
          <SubjectMesh type={modelType} modelUrl={modelUrl} />
        )}
        
        <OrbitControls 
          enableZoom={type === "model"} 
          autoRotate={type === "logo"}
          autoRotateSpeed={2}
          enablePan={type === "model"}
        />
        
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
