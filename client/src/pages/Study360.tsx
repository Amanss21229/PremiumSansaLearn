import { motion } from "framer-motion";
import { useModels } from "@/hooks/use-models";
import { Link } from "wouter";
import { Search, Filter, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import Scene3D from "@/components/Scene3D";

export default function Study360() {
  const { data: models, isLoading } = useModels();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Mock data for initial render if API is empty (for demo purposes)
  const displayModels = models?.length ? models : [
    { id: 1, title: "Human Heart", category: "Biology", grade: "Class 10", type: "organ", isPremium: true },
    { id: 2, title: "Periodic Table", category: "Chemistry", grade: "Class 11", type: "molecule", isPremium: false },
    { id: 3, title: "Kidney Structure", category: "Biology", grade: "Class 10", type: "organ", isPremium: true },
    { id: 4, title: "DNA Helix", category: "Biology", grade: "Class 12", type: "molecule", isPremium: true },
    { id: 5, title: "Brain Anatomy", category: "Biology", grade: "Class 11", type: "organ", isPremium: true },
    { id: 6, title: "Atomic Structure", category: "Physics", grade: "Class 9", type: "physics", isPremium: false },
  ];

  const filteredModels = displayModels.filter(model => {
    const matchesSearch = model.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          model.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade ? model.grade === selectedGrade : true;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">Study-360° Library</h1>
            <p className="text-muted-foreground text-lg">Explore our premium collection of interactive 3D models.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search topics..." 
                className="pl-10 pr-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary w-full sm:w-64 text-foreground placeholder:text-muted-foreground/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select 
                className="pl-10 pr-8 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary appearance-none w-full sm:w-48 text-foreground cursor-pointer"
                onChange={(e) => setSelectedGrade(e.target.value || null)}
              >
                <option value="">All Grades</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredModels.map((model) => (
              <motion.div
                key={model.id}
                layoutId={`card-${model.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/model/${model.id}`} className="block h-full">
                  <div className="glass-panel h-full rounded-2xl overflow-hidden premium-card-hover group relative">
                    {/* 3D Preview (Small) */}
                    <div className="h-48 bg-black/40 relative overflow-hidden">
                      <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
                        <Scene3D type="model" modelType={model.type} className="w-full h-full" />
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${model.isPremium ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/10 text-white border-white/20'}`}>
                          {model.isPremium ? 'PREMIUM' : 'FREE'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-primary tracking-wider uppercase">{model.category}</span>
                        <span className="text-xs text-muted-foreground">{model.grade}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{model.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        Interactive 3D exploration of {model.title.toLowerCase()} for better conceptual understanding.
                      </p>
                      
                      <div className="flex items-center text-primary text-sm font-semibold group-hover:translate-x-2 transition-transform">
                        Explore Model <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                    
                    {/* Gold Border Highlight on Hover */}
                    <div className="absolute inset-0 border-2 border-primary/0 rounded-2xl group-hover:border-primary/50 transition-colors pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {filteredModels.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-2xl text-muted-foreground">No models found matching your criteria.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setSelectedGrade(null)}}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
