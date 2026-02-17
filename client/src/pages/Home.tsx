import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, BookOpen, Layers } from "lucide-react";
import Scene3D from "@/components/Scene3D";
import AimAiChat from "@/components/AimAiChat";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background Logo */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Scene3D type="logo" className="w-full h-full" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto backdrop-blur-sm bg-black/20 p-8 rounded-3xl border border-white/5 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wider">PREMIUM EDUCATION REDEFINED</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gold-gradient drop-shadow-lg">
              SANSA LEARN
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Experience science like never before. 
              Immersive <span className="text-primary font-semibold">3D models</span> for Class 9-12.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/study-360">
                <button className="px-8 py-4 rounded-xl bg-primary text-black font-bold text-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Enter Study-360°
                </button>
              </Link>
              
              <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 backdrop-blur-md transition-all duration-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                View Curriculum
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gold-gradient">Why Choose Sansa?</h2>
            <p className="text-muted-foreground text-lg">Revolutionizing education through immersive technology.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Interactive 3D",
                desc: "Rotate, zoom, and explore complex biological organs and chemical structures in real-time.",
                icon: Layers,
                color: "text-blue-400"
              },
              {
                title: "NCERT Aligned",
                desc: "Curriculum strictly mapped to Class 9-12 syllabus for maximum exam relevance.",
                icon: BookOpen,
                color: "text-green-400"
              },
              {
                title: "Premium Content",
                desc: "High-fidelity models and expert explanations designed for clarity and retention.",
                icon: Sparkles,
                color: "text-primary"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <AimAiChat />
    </div>
  );
}
