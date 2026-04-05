import { useState, useRef, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ChatPage from "./components/ChatPage";
import AnalysisPage from "./components/AnalysisPage";
import LibraryPage from "./components/LibraryPage";
import { HEADERS, MODEL } from "./lib/api";
import { AlertCircle, CheckCircle, Shield, Target, X, Zap, ArrowRight } from "lucide-react";

// Mouse glow effect
function useMouseGlow() {
  useEffect(() => {
    const handler = (e) => {
      document.querySelectorAll(".glow-effect").forEach((el) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
}

// Upload-based still-image analysis page
function ImageAnalysisPage({ setPage, uploadedImage, analysisType, analyzing, analysisResult }) {
  const statusColor = (s) =>
    s === "Excellent" ? "bg-green-600" : s === "Good" ? "bg-blue-600" :
    s === "Needs Correction" || s === "Needs Improvement" ? "bg-yellow-600" : "bg-red-600";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setPage("landing")} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" />Back to Home
        </button>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Uploaded Image</h3>
            {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="w-full h-auto rounded-lg border border-gray-600" />}
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap className="w-6 h-6 text-red-500" />AI Analysis</h3>
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400">Analyzing your {analysisType === "machine" ? "equipment" : "form"}...</p>
              </div>
            ) : analysisResult?.error ? (
              <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <p className="text-gray-300">{analysisResult.message}</p>
              </div>
            ) : analysisResult && analysisType === "machine" ? (
              <div className="space-y-4">
                <div><h4 className="text-2xl font-bold text-red-500 mb-2">{analysisResult.equipment}</h4><span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">{analysisResult.difficulty}</span></div>
                <div><h5 className="font-bold text-lg mb-2">Primary Muscles</h5><div className="flex flex-wrap gap-2">{analysisResult.muscles?.map((m, i) => <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm">{m}</span>)}</div></div>
                {analysisResult.secondaryMuscles?.length > 0 && <div><h5 className="font-bold mb-2">Secondary Muscles</h5><div className="flex flex-wrap gap-2">{analysisResult.secondaryMuscles.map((m, i) => <span key={i} className="bg-gray-700/50 px-3 py-1 rounded-full text-sm">{m}</span>)}</div></div>}
                <div><h5 className="font-bold mb-2">How to Use</h5><p className="text-gray-300 text-sm leading-relaxed">{analysisResult.usage}</p></div>
                <div><h5 className="font-bold mb-2">Recommended Volume</h5><p className="text-gray-300 text-sm">{analysisResult.repsAndSets}</p></div>
                <div><h5 className="font-bold mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-red-500" />Safety Tips</h5><ul className="space-y-2">{analysisResult.safetyTips?.map((t, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{t}</li>)}</ul></div>
                <div><h5 className="font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-yellow-500" />Common Mistakes</h5><ul className="space-y-2">{analysisResult.commonMistakes?.map((m, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />{m}</li>)}</ul></div>
              </div>
            ) : analysisResult && analysisType === "posture" ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold mb-2">{analysisResult.exercise}</h4>
                  <div className="flex items-center gap-4"><span className={`px-4 py-2 rounded-full font-bold ${statusColor(analysisResult.overallForm)}`}>{analysisResult.overallForm}</span><div className="flex items-center gap-2"><span className="text-3xl font-bold text-red-500">{analysisResult.score}</span><span className="text-gray-400 text-sm">/ 100</span></div></div>
                </div>
                {analysisResult.correctAspects?.length > 0 && <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-4"><h5 className="font-bold mb-2 flex items-center gap-2 text-green-400"><CheckCircle className="w-5 h-5" />What You're Doing Right</h5><ul className="space-y-1">{analysisResult.correctAspects.map((a, i) => <li key={i} className="text-sm text-gray-300">✓ {a}</li>)}</ul></div>}
                {analysisResult.issues?.length > 0 && <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4"><h5 className="font-bold mb-2 flex items-center gap-2 text-yellow-400"><AlertCircle className="w-5 h-5" />Areas to Improve</h5><ul className="space-y-1">{analysisResult.issues.map((x, i) => <li key={i} className="text-sm text-gray-300">• {x}</li>)}</ul></div>}
                {analysisResult.corrections?.length > 0 && <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4"><h5 className="font-bold mb-2 flex items-center gap-2 text-blue-400"><Target className="w-5 h-5" />Specific Corrections</h5><ul className="space-y-2">{analysisResult.corrections.map((c, i) => <li key={i} className="text-sm text-gray-300 leading-relaxed">→ {c}</li>)}</ul></div>}
                {analysisResult.injuryRisks?.length > 0 && <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4"><h5 className="font-bold mb-2 flex items-center gap-2 text-red-400"><Shield className="w-5 h-5" />Injury Prevention</h5><ul className="space-y-1">{analysisResult.injuryRisks.map((r, i) => <li key={i} className="text-sm text-gray-300">⚠ {r}</li>)}</ul></div>}
                {analysisResult.motivationalTip && <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 border border-red-600/50 rounded-lg p-4"><p className="text-gray-300 italic">💪 {analysisResult.motivationalTip}</p></div>}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useMouseGlow();

  const [page, setPage] = useState("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Upload / image-analysis state (kept here so it survives page transitions)
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisType, setAnalysisType] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const analyzeImage = async (file, type) => {
    setAnalyzing(true);
    setAnalysisType(type);
    setAnalysisResult(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const prompt = type === "machine"
          ? `You are an expert fitness coach. Analyze this gym equipment image and respond ONLY with valid JSON:\n{"equipment":"name","muscles":["m1"],"secondaryMuscles":["m1"],"usage":"step-by-step","repsAndSets":"recommended","safetyTips":["tip"],"commonMistakes":["mistake"],"difficulty":"Beginner/Intermediate/Advanced"}`
          : `You are an expert personal trainer. Analyze this exercise form and respond ONLY with valid JSON:\n{"exercise":"name","overallForm":"Excellent/Good/Needs Improvement/Poor","correctAspects":["c"],"issues":["i"],"corrections":["c"],"injuryRisks":["r"],"score":85,"motivationalTip":"message"}`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inlineData: { mimeType: file.type, data: e.target.result.split(",")[1] } }
              ]
            }]
          })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const m = text.match(/\{[\s\S]*\}/);
        if (m) setAnalysisResult(JSON.parse(m[0]));
        else throw new Error("No JSON in response");
      } catch {
        setAnalysisResult({ error: true, message: "Could not analyze the image. Please try a clearer photo with good lighting." });
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // Reset so same file can be re-selected
    e.target.value = "";
    if (!file) return;
    setUploadedImage(URL.createObjectURL(file));
    setPage("imageAnalysis");
    analyzeImage(file, analysisType || "machine");
  };

  const triggerScanMachine = () => {
    setAnalysisType("machine");
    fileInputRef.current?.click();
  };

  const triggerUploadPosture = () => {
    setAnalysisType("posture");
    fileInputRef.current?.click();
  };

  const showFooter = page === "landing" || page === "library";
  const navigateTo = useCallback((p) => setPage(p), []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header setPage={navigateTo} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="pt-16">
        {page === "landing"       && <LandingPage setPage={navigateTo} onScanMachine={triggerScanMachine} />}
        {page === "analysis"      && <AnalysisPage setPage={navigateTo} fileInputRef={fileInputRef} triggerUpload={triggerUploadPosture} />}
        {page === "imageAnalysis" && <ImageAnalysisPage setPage={navigateTo} uploadedImage={uploadedImage} analysisType={analysisType} analyzing={analyzing} analysisResult={analysisResult} />}
        {page === "chat"          && <ChatPage setPage={navigateTo} />}
        {page === "library"       && <LibraryPage setPage={navigateTo} />}
      </div>
      {showFooter && <Footer setPage={navigateTo} />}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
