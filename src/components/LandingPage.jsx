import { Camera, MessageCircle, Dumbbell, ArrowRight, Zap, Shield, Target, Video } from "lucide-react";
import GlowOverlay from "./GlowOverlay";

const CTACard = ({ icon, title, description, onClick, badge }) => (
  <div onClick={onClick} className="glow-effect group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-600 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 overflow-hidden">
    <GlowOverlay />
    {badge && <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse z-10">{badge}</div>}
    <div className="relative z-10">
      <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex items-center text-red-500 font-semibold text-sm">Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="glow-effect group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-red-600/50 transition-all duration-300 overflow-hidden">
    <GlowOverlay />
    <div className="relative z-10">
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

export default function LandingPage({ setPage, onScanMachine }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/50 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-red-500" /><span className="text-sm font-semibold text-red-500">AI-Powered Training</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Your Personal AI<br />Fitness Coach</h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Get instant form analysis, equipment guidance, and 24/7 expert coaching powered by advanced AI</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <CTACard icon={<Camera className="w-8 h-8" />} title="Scan Machine" description="Identify equipment & learn proper usage" onClick={onScanMachine} />
            <CTACard icon={<Target className="w-8 h-8" />} title="Check My Form" description="Live posture & technique analysis" onClick={() => setPage("analysis")} badge="LIVE" />
            <CTACard icon={<MessageCircle className="w-8 h-8" />} title="Ask AI Coach" description="24/7 fitness guidance & workout plans" onClick={() => setPage("chat")} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Why Choose Our AI Coach?</h2><p className="text-gray-400">Professional training assistance, anytime, anywhere</p></div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard icon={<Shield className="w-12 h-12 text-red-500" />} title="Safety First" description="Prevent injuries with real-time form corrections and detailed safety tips" />
          <FeatureCard icon={<Video className="w-12 h-12 text-red-500" />} title="Live Analysis" description="Real-time posture correction using your webcam while you exercise" />
          <FeatureCard icon={<Target className="w-12 h-12 text-red-500" />} title="Personalized Guidance" description="Tailored advice for your fitness level and goals" />
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-900 to-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2><p className="text-gray-400 mb-16">Three simple steps to better workouts</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[["1", "Start Camera", "Enable your webcam for live form analysis"], ["2", "Exercise", "Perform your exercise while AI watches in real-time"], ["3", "Improve", "Follow instant corrections and coaching tips"]].map(([n, t, d]) => (
              <div key={n} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-red-600/50">{n}</div>
                <h3 className="text-xl font-bold mb-2">{t}</h3><p className="text-gray-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Exercise Library</h2>
        <p className="text-gray-400 mb-8">Comprehensive guides for all major exercises</p>
        <button onClick={() => setPage("library")} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 inline-flex items-center gap-2">
          Explore Library <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
