import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, ContactShadows } from '@react-three/drei';
import { Box as BoxIcon, Move, RotateCw, ZoomIn } from 'lucide-react';

const FurnitureMesh: React.FC<{ type: string, color: string }> = ({ type, color }) => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if(meshRef.current) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05 + 0.5;
    }
  });

  if (type === 'sofa') {
     return (
        <group position={[0, 0, 0]}>
           <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
             <boxGeometry args={[2.5, 0.4, 1]} />
             <meshStandardMaterial color={color} />
           </mesh>
           <mesh position={[0, 1, -0.4]} castShadow receiveShadow>
             <boxGeometry args={[2.5, 0.8, 0.2]} />
             <meshStandardMaterial color={color} />
           </mesh>
            <mesh position={[-1.15, 0.7, 0.1]} castShadow receiveShadow>
             <boxGeometry args={[0.2, 0.6, 0.8]} />
             <meshStandardMaterial color={color} />
           </mesh>
           <mesh position={[1.15, 0.7, 0.1]} castShadow receiveShadow>
             <boxGeometry args={[0.2, 0.6, 0.8]} />
             <meshStandardMaterial color={color} />
           </mesh>
        </group>
     )
  }

  return (
    <group position={[0, 0.5, 0]}>
       <mesh position={[0, 0, 0]} castShadow>
         <boxGeometry args={[1, 0.1, 1]} />
         <meshStandardMaterial color={color} />
       </mesh>
       <mesh position={[0.4, -0.5, 0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#333" />
       </mesh>
       <mesh position={[-0.4, -0.5, 0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#333" />
       </mesh>
       <mesh position={[0.4, -0.5, -0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#333" />
       </mesh>
       <mesh position={[-0.4, -0.5, -0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#333" />
       </mesh>
       <mesh position={[0, 0.5, -0.45]}>
         <boxGeometry args={[1, 1, 0.1]} />
         <meshStandardMaterial color={color} />
       </mesh>
    </group>
  );
};

export const FurnitureAR: React.FC = () => {
  const [selectedType, setSelectedType] = useState('chair');
  const [color, setColor] = useState('#A78BFA');

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row">
      {/* 3D Viewport */}
      <div className="relative flex-1 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black h-1/2 md:h-full">
         <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
            <Suspense fallback={null}>
               <Stage environment="city" intensity={0.6}>
                 <FurnitureMesh type={selectedType} color={color} />
               </Stage>
               <ContactShadows opacity={0.5} scale={10} blur={2} far={4} resolution={256} color="#000000" />
            </Suspense>
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
         </Canvas>
         
         <div className="absolute top-4 right-4 bg-white border-2 border-black shadow-brutal p-2 text-xs font-bold uppercase">
            Drag to Rotate • Scroll to Zoom
         </div>
      </div>

      {/* Controls */}
      <div className="w-full md:w-80 bg-white p-6 flex flex-col h-1/2 md:h-full overflow-y-auto">
        <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
           <BoxIcon className="text-black" strokeWidth={3} /> Configurator
        </h2>

        <div className="space-y-6">
           <div>
             <label className="text-sm font-bold text-black mb-3 block uppercase">Furniture Type</label>
             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => setSelectedType('chair')}
                 className={`p-4 border-2 border-black transition-all font-bold uppercase ${selectedType === 'chair' ? 'bg-primary shadow-brutal -translate-y-1' : 'bg-white hover:bg-gray-50'}`}
               >
                 Chair
               </button>
               <button 
                 onClick={() => setSelectedType('sofa')}
                 className={`p-4 border-2 border-black transition-all font-bold uppercase ${selectedType === 'sofa' ? 'bg-primary shadow-brutal -translate-y-1' : 'bg-white hover:bg-gray-50'}`}
               >
                 Sofa
               </button>
             </div>
           </div>

           <div>
             <label className="text-sm font-bold text-black mb-3 block uppercase">Material Color</label>
             <div className="flex flex-wrap gap-3">
               {['#A78BFA', '#F472B6', '#FACC15', '#10b981', '#3b82f6', '#18181b'].map(c => (
                 <button
                   key={c}
                   onClick={() => setColor(c)}
                   className={`w-10 h-10 border-2 border-black transition-transform hover:scale-110 ${color === c ? 'shadow-brutal ring-2 ring-black ring-offset-2' : ''}`}
                   style={{ backgroundColor: c }}
                 />
               ))}
             </div>
           </div>
           
           <div className="pt-6 border-t-2 border-black mt-auto">
              <p className="text-xs font-mono bg-gray-100 p-2 border-2 border-black">
                AR MODE: REQUIRES COMPATIBLE DEVICE
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};