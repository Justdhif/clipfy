import ClipperInterface from '@/components/clipper-interface';
import { Scissors } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-slate-200 selection:bg-indigo-500/30 overflow-hidden flex flex-col relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        {/* Optional noise texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Clipify</span>
          </div>
          <div className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer">
            Made with Next.js & Express
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Clip YouTube Videos
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            in Seconds.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          The fastest, sleekest way to extract moments from any YouTube video. No watermark, no limits, just your clip.
        </p>
      </section>

      {/* Main Clipper Tool */}
      <section className="pb-24 relative z-10 flex-1 flex items-start justify-center">
        <ClipperInterface />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md py-8 mt-auto z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Clipify. Modern tools for modern creators.</p>
        </div>
      </footer>
    </main>
  );
}
