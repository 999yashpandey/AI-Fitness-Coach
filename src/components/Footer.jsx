import { Dumbbell } from "lucide-react";

export default function Footer({ setPage }) {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg"><Dumbbell className="w-5 h-5" /></div>
              <span className="text-lg font-black">AI FITNESS COACH</span>
            </div>
            <p className="text-gray-400 text-sm">Your 24/7 AI-powered personal trainer for safer, smarter workouts.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[["Home", "landing"], ["Exercise Library", "library"], ["AI Coach Chat", "chat"]].map(([l, p]) => (
                <button key={p} onClick={() => setPage(p)} className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Safety Disclaimer</h4>
            <p className="text-gray-400 text-sm">This AI tool provides guidance but is not a substitute for professional medical or fitness advice. Consult a healthcare provider before starting any new exercise program.</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          © 2026 AI Fitness Coach. Built with Claude AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
