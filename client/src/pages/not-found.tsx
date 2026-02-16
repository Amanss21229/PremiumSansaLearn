import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import Scene3D from "@/components/Scene3D";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Scene3D type="logo" className="w-full h-full blur-sm" />
      </div>

      <div className="glass-panel max-w-md w-full p-8 rounded-2xl text-center relative z-10 border border-primary/20 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-muted-foreground mb-4">Page Not Found</h2>
        
        <p className="text-sm text-gray-400 mb-8">
          The educational resource you are looking for might have been moved or doesn't exist.
        </p>

        <Link href="/">
          <button className="w-full py-3 px-4 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
