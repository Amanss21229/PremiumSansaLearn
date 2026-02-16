import { useRoute, Link } from "wouter";
import { useModel } from "@/hooks/use-models";
import { ArrowLeft, Maximize2, Info, Share2, Layers } from "lucide-react";
import Scene3D from "@/components/Scene3D";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ModelViewer() {
  const [, params] = useRoute("/model/:id");
  const id = parseInt(params?.id || "0");
  const { data: apiModel, isLoading } = useModel(id);
  const [showInfo, setShowInfo] = useState(true);

  // Fallback if API fails or is empty (for demo)
  const model = apiModel || {
    id,
    title: "Detailed Model View",
    description: "This represents a high-fidelity 3D model that allows students to explore the structure from every angle. Use touch or mouse to rotate, pinch or scroll to zoom.",
    category: "Science",
    grade: "Class 10",
    type: id % 2 === 0 ? "molecule" : "organ",
    isPremium: true
  };

  if (isLoading && !apiModel) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-primary animate-pulse text-xl font-display">Loading Experience...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative flex flex-col">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <Link href="/study-360">
          <button className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:text-primary transition-all border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>

        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`p-3 rounded-full backdrop-blur-md transition-all border ${showInfo ? 'bg-primary text-black border-primary' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
          >
            <Info className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all border border-white/10 text-white">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport - 9:16 aspect ratio container centered */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center bg-[#050505]">
        <div className="w-full h-full max-w-lg aspect-[9/16] relative border-x border-white/5 shadow-2xl">
           <Scene3D type="model" modelType={model.type} className="w-full h-full" />
           
           {/* Mobile Interaction Hint */}
           <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/30 text-xs pointer-events-none animate-pulse">
             Swipe to Rotate • Pinch to Zoom
           </div>
        </div>
      </div>

      {/* Bottom Info Sheet */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-secondary/90 backdrop-blur-xl border-t border-primary/20 rounded-t-3xl max-w-3xl mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="p-6 md:p-8">
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                      {model.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground border border-white/10 px-2 py-0.5 rounded">
                      {model.grade}
                    </span>
                  </div>
                  <h1 className="text-3xl font-display font-bold text-white mb-1">{model.title}</h1>
                </div>
                {model.isPremium && (
                  <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg">
                    <Layers className="w-6 h-6 text-black" />
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6 font-light">
                {model.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 px-4 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20">
                  Start Quiz
                </button>
                <button className="py-3 px-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                  View Notes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
