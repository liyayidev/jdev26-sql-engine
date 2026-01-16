
import Link from 'next/link';
import { Database, Share2, Layers, Search, ArrowRight, LayoutGrid, Terminal, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointing-events-none"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="font-bold text-xl flex items-center gap-2 tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Database size={18} />
            </div>
            <span>DB-Architect</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <Link href="/explorer/schema-builder" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/demo" className="hover:text-white transition-colors">Demo App</Link>
            <a href="https://github.com" target="_blank" className="hover:text-white transition-colors">GitHub</a>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Pesapal Dev Challenge '26
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl">
            Master Database Internals. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Visually.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
            A comprehensive educational suite to deconstruct RDBMS concepts.
            Visualize B-Trees, simulate Joins, and inspect dual-persistence architectures in real-time.
          </p>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mt-12 text-left">
            {/* Explorer Card */}
            <Link href="/explorer/schema-builder" className="group relative p-1 rounded-2xl bg-gradient-to-b from-slate-700/50 to-slate-800/50 hover:from-indigo-500/50 hover:to-cyan-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative h-full bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col justify-between group-hover:border-transparent transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                    <LayoutGrid size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Concept Explorer</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Interactive playground to build schemas, visualize B-Tree indexing, and run simulated query execution plans.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300">
                  Start Exploring <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Demo Card */}
            <Link href="/demo" className="group relative p-1 rounded-2xl bg-gradient-to-b from-slate-700/50 to-slate-800/50 hover:from-emerald-500/50 hover:to-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative h-full bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col justify-between group-hover:border-transparent transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
                    <Share2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Dual-Persistence Demo</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Functional Book Tracker app validating the "Shadow Backend" concept. Syncs Supabase (Remote) & IndexedDB (Local) in real-time.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300">
                  Launch Demo <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-16 opacity-70">
            <FeaturePill icon={<Terminal size={14} />} text="Simulated Query Engine" />
            <FeaturePill icon={<Layers size={14} />} text="B-Tree Visualization" />
            <FeaturePill icon={<Cpu size={14} />} text="Postgres + IndexedDB Sync" />
            <FeaturePill icon={<Search size={14} />} text="Join Algorithms" />
          </div>
        </main>

        <footer className="py-8 text-center text-slate-600 text-sm">
          <p>Built with Next.js, Tailwind, & Supabase</p>
        </footer>
      </div>
    </div>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm">
      {icon}
      <span>{text}</span>
    </div>
  )
}
