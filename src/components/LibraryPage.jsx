import { useState } from "react";
import { Dumbbell, Target, ArrowRight } from "lucide-react";
import GlowOverlay from "./GlowOverlay";

const exercises = [
  { name: "Push-ups", category: "Chest", level: "Beginner", muscles: "Chest, Triceps, Shoulders", sets: "3 x 10-12", animation: "pushup" },
  { name: "Squats", category: "Legs", level: "Beginner", muscles: "Quads, Glutes, Core", sets: "3 x 10-12", animation: "squat" },
  { name: "Plank", category: "Core", level: "Beginner", muscles: "Core, Shoulders, Back", sets: "3 x 20-30s", animation: "plank" },
  { name: "Lunges", category: "Legs", level: "Beginner", muscles: "Quads, Glutes, Hamstrings", sets: "2 x 10/leg", animation: "lunge" },
  { name: "Bench Press", category: "Chest", level: "Beginner", muscles: "Chest, Triceps, Shoulders", sets: "2 x 10-15", animation: "bench" },
  { name: "Bent-over Rows", category: "Back", level: "Beginner", muscles: "Lats, Rhomboids, Biceps", sets: "3 x 10", animation: "row" },
  { name: "Overhead Press", category: "Shoulders", level: "Beginner", muscles: "Shoulders, Triceps", sets: "2 x 8-12", animation: "press" },
  { name: "Deadlifts", category: "Back", level: "Beginner", muscles: "Back, Glutes, Hamstrings", sets: "2 x 10-12", animation: "deadlift" },
  { name: "Pull-ups", category: "Back", level: "Beginner", muscles: "Lats, Biceps, Core", sets: "2 x 8 (assisted)", animation: "pullup" },
  { name: "Dips", category: "Arms", level: "Beginner", muscles: "Triceps, Chest, Shoulders", sets: "2 x 8-10", animation: "dip" },
  { name: "Squats", category: "Legs", level: "Intermediate", muscles: "Quads, Glutes, Core", sets: "4 x 8-12", animation: "squat" },
  { name: "Deadlifts", category: "Back", level: "Intermediate", muscles: "Back, Glutes, Hamstrings, Core", sets: "3 x 8-10", animation: "deadlift" },
  { name: "Bench Press", category: "Chest", level: "Intermediate", muscles: "Chest, Triceps, Shoulders", sets: "3 x 8-12", animation: "bench" },
  { name: "Pull-ups", category: "Back", level: "Intermediate", muscles: "Lats, Biceps, Core", sets: "3 x 8-12", animation: "pullup" },
  { name: "Planks", category: "Core", level: "Intermediate", muscles: "Core, Shoulders", sets: "3 x 45-60s", animation: "plank" },
  { name: "Lunges", category: "Legs", level: "Intermediate", muscles: "Quads, Glutes, Hamstrings", sets: "3 x 10/leg", animation: "lunge" },
  { name: "Squats", category: "Legs", level: "Advanced", muscles: "Quads, Glutes, Core, Full Body", sets: "5 x 4-6", animation: "squat" },
  { name: "Deadlifts", category: "Back", level: "Advanced", muscles: "Back, Glutes, Hamstrings, Core", sets: "4 x 4-6", animation: "deadlift" },
  { name: "Bench Press", category: "Chest", level: "Advanced", muscles: "Chest, Triceps, Shoulders", sets: "5 x 4-8", animation: "bench" },
  { name: "Pull-ups", category: "Back", level: "Advanced", muscles: "Lats, Biceps, Core", sets: "4 x 6-10", animation: "pullup" },
  { name: "Overhead Press", category: "Shoulders", level: "Advanced", muscles: "Shoulders, Triceps, Core", sets: "4 x 6-8", animation: "press" },
  { name: "Planks", category: "Core", level: "Advanced", muscles: "Core, Full Body", sets: "4 x 90s+", animation: "plank" },
];

const Stickman = ({ animation }) => {
  const svgs = {
    squat: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="15" r="8" fill="#ef4444" className="animate-squat-head" /><line x1="50" y1="23" x2="50" y2="50" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="35" x2="35" y2="45" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="35" x2="65" y2="45" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="50" x2="35" y2="75" stroke="#ef4444" strokeWidth="3" className="animate-squat-leg-left" /><line x1="50" y1="50" x2="65" y2="75" stroke="#ef4444" strokeWidth="3" className="animate-squat-leg-right" /><line x1="35" y1="75" x2="30" y2="85" stroke="#ef4444" strokeWidth="3" /><line x1="65" y1="75" x2="70" y2="85" stroke="#ef4444" strokeWidth="3" /></svg>,
    deadlift: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="20" r="8" fill="#ef4444" className="animate-deadlift-head" /><line x1="50" y1="28" x2="50" y2="55" stroke="#ef4444" strokeWidth="3" className="animate-deadlift-body" /><line x1="50" y1="35" x2="30" y2="50" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="35" x2="70" y2="50" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="55" x2="40" y2="75" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="55" x2="60" y2="75" stroke="#ef4444" strokeWidth="3" /><rect x="25" y="48" width="10" height="4" fill="#666" /><rect x="65" y="48" width="10" height="4" fill="#666" /></svg>,
    bench: <svg viewBox="0 0 100 100" className="w-full h-full"><rect x="20" y="60" width="60" height="6" fill="#666" /><circle cx="50" cy="45" r="8" fill="#ef4444" /><line x1="50" y1="53" x2="50" y2="60" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="56" x2="35" y2="45" stroke="#ef4444" strokeWidth="3" className="animate-bench-arm-left" /><line x1="50" y1="56" x2="65" y2="45" stroke="#ef4444" strokeWidth="3" className="animate-bench-arm-right" /><line x1="50" y1="60" x2="40" y2="75" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="60" x2="60" y2="75" stroke="#ef4444" strokeWidth="3" /><line x1="30" y1="38" x2="70" y2="38" stroke="#666" strokeWidth="4" className="animate-bench-bar" /></svg>,
    pullup: <svg viewBox="0 0 100 100" className="w-full h-full"><line x1="20" y1="20" x2="80" y2="20" stroke="#666" strokeWidth="4" /><circle cx="50" cy="35" r="8" fill="#ef4444" className="animate-pullup-head" /><line x1="50" y1="43" x2="50" y2="60" stroke="#ef4444" strokeWidth="3" className="animate-pullup-body" /><line x1="50" y1="48" x2="35" y2="22" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="48" x2="65" y2="22" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="60" x2="45" y2="75" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="60" x2="55" y2="75" stroke="#ef4444" strokeWidth="3" /></svg>,
    pushup: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="30" cy="45" r="8" fill="#ef4444" className="animate-pushup-head" /><line x1="38" y1="45" x2="70" y2="45" stroke="#ef4444" strokeWidth="3" /><line x1="40" y1="45" x2="40" y2="65" stroke="#ef4444" strokeWidth="3" className="animate-pushup-arm-left" /><line x1="60" y1="45" x2="60" y2="65" stroke="#ef4444" strokeWidth="3" className="animate-pushup-arm-right" /><line x1="70" y1="45" x2="75" y2="60" stroke="#ef4444" strokeWidth="3" /><line x1="70" y1="45" x2="80" y2="60" stroke="#ef4444" strokeWidth="3" /></svg>,
    plank: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="30" cy="48" r="8" fill="#ef4444" /><line x1="38" y1="48" x2="75" y2="48" stroke="#ef4444" strokeWidth="3" className="animate-plank-body" /><line x1="40" y1="48" x2="40" y2="65" stroke="#ef4444" strokeWidth="3" /><line x1="60" y1="48" x2="60" y2="65" stroke="#ef4444" strokeWidth="3" /><line x1="75" y1="48" x2="75" y2="62" stroke="#ef4444" strokeWidth="3" /><line x1="75" y1="48" x2="82" y2="62" stroke="#ef4444" strokeWidth="3" /></svg>,
    lunge: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="20" r="8" fill="#ef4444" /><line x1="50" y1="28" x2="50" y2="50" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="35" x2="40" y2="45" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="35" x2="60" y2="45" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="50" x2="40" y2="75" stroke="#ef4444" strokeWidth="3" className="animate-lunge-leg-front" /><line x1="50" y1="50" x2="65" y2="65" stroke="#ef4444" strokeWidth="3" /><line x1="40" y1="75" x2="38" y2="85" stroke="#ef4444" strokeWidth="3" /></svg>,
    row: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="30" r="8" fill="#ef4444" /><line x1="50" y1="38" x2="50" y2="55" stroke="#ef4444" strokeWidth="3" className="animate-row-body" /><line x1="50" y1="42" x2="30" y2="50" stroke="#ef4444" strokeWidth="3" className="animate-row-arm-left" /><line x1="50" y1="42" x2="70" y2="50" stroke="#ef4444" strokeWidth="3" className="animate-row-arm-right" /><line x1="50" y1="55" x2="42" y2="75" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="55" x2="58" y2="75" stroke="#ef4444" strokeWidth="3" /><circle cx="25" cy="52" r="3" fill="#666" /></svg>,
    press: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="35" r="8" fill="#ef4444" /><line x1="50" y1="43" x2="50" y2="65" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="48" x2="35" y2="30" stroke="#ef4444" strokeWidth="3" className="animate-press-arm-left" /><line x1="50" y1="48" x2="65" y2="30" stroke="#ef4444" strokeWidth="3" className="animate-press-arm-right" /><line x1="50" y1="65" x2="43" y2="80" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="65" x2="57" y2="80" stroke="#ef4444" strokeWidth="3" /><line x1="30" y1="28" x2="70" y2="28" stroke="#666" strokeWidth="3" className="animate-press-bar" /></svg>,
    dip: <svg viewBox="0 0 100 100" className="w-full h-full"><line x1="30" y1="35" x2="30" y2="70" stroke="#666" strokeWidth="3" /><line x1="70" y1="35" x2="70" y2="70" stroke="#666" strokeWidth="3" /><circle cx="50" cy="40" r="8" fill="#ef4444" className="animate-dip-head" /><line x1="50" y1="48" x2="50" y2="60" stroke="#ef4444" strokeWidth="3" className="animate-dip-body" /><line x1="50" y1="52" x2="32" y2="45" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="52" x2="68" y2="45" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="60" x2="45" y2="72" stroke="#ef4444" strokeWidth="3" /><line x1="50" y1="60" x2="55" y2="72" stroke="#ef4444" strokeWidth="3" /></svg>,
  };
  return <div className="w-16 h-16">{svgs[animation] || svgs.squat}</div>;
};

export default function LibraryPage({ setPage }) {
  const [lvl, setLvl] = useState("All");
  const filtered = lvl === "All" ? exercises : exercises.filter(e => e.level === lvl);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setPage("landing")} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" />Back to Home
        </button>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Exercise Library</h1>
          <p className="text-gray-400 mb-8">Comprehensive guides for all fitness levels</p>
          <div className="flex justify-center gap-3 mb-8">
            {["All", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button key={l} onClick={() => setLvl(l)} className={`glow-effect group relative px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 overflow-hidden ${lvl === l ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                <GlowOverlay /><span className="relative z-10">{l}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ex, idx) => (
            <div key={idx} className="glow-effect group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-red-600 transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer">
              <GlowOverlay />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Stickman animation={ex.animation} />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ex.level === "Beginner" ? "bg-green-600/20 text-green-400" : ex.level === "Intermediate" ? "bg-yellow-600/20 text-yellow-400" : "bg-red-600/20 text-red-400"}`}>{ex.level}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{ex.name}</h3>
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg px-3 py-2 mb-3">
                  <div className="text-xs text-gray-400 mb-1">Recommended Volume</div>
                  <div className="text-red-400 font-bold">{ex.sets}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><Target className="w-4 h-4 text-red-500" /><span className="text-sm text-gray-400">{ex.category}</span></div>
                  <div className="flex items-start gap-2"><Dumbbell className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-xs text-gray-500">{ex.muscles}</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 text-gray-500">Showing {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}</div>
      </div>
    </div>
  );
}
