import { Dumbbell, Menu } from "lucide-react";
import GlowOverlay from "./GlowOverlay";

export default function Header({ setPage, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div onClick={() => setPage("landing")} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-xl font-black">AI FITNESS COACH</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[["Home", "landing"], ["Library", "library"], ["AI Coach", "chat"]].map(([l, p]) => (
              <button key={p} onClick={() => setPage(p)} className="text-gray-300 hover:text-white font-semibold transition-colors">{l}</button>
            ))}
            <button
              onClick={() => setPage("analysis")}
              className="glow-effect group relative bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 overflow-hidden"
            >
              <GlowOverlay /><span className="relative z-10">Live Form Check</span>
            </button>
          </nav>
          <button onClick={() => setMobileMenuOpen(v => !v)} className="md:hidden text-gray-300"><Menu className="w-6 h-6" /></button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-800">
            {[["Home", "landing"], ["Library", "library"], ["AI Coach", "chat"]].map(([l, p]) => (
              <button key={p} onClick={() => { setPage(p); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white font-semibold py-2">{l}</button>
            ))}
            <button onClick={() => { setPage("analysis"); setMobileMenuOpen(false); }} className="bg-red-600 px-6 py-2 rounded-lg font-semibold w-full">Live Form Check</button>
          </div>
        )}
      </div>
    </header>
  );
}
