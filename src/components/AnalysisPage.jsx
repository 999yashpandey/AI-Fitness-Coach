import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Video, Play, StopCircle, Upload, Zap, Target, CheckCircle, ArrowRight } from "lucide-react";
import GlowOverlay from "./GlowOverlay";
import { HEADERS, MODEL } from "../lib/api";

const statusColor = (s) =>
  s === "Excellent" ? "bg-green-600" :
  s === "Good" ? "bg-blue-600" :
  s === "Needs Correction" || s === "Needs Improvement" ? "bg-yellow-600" :
  "bg-red-600";

export default function AnalysisPage({ setPage, fileInputRef, triggerUpload }) {
  const [isRecording, setIsRecording] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analyzingRef = useRef(false);
  const lastTimeRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } } });
      streamRef.current = ms;
      if (videoRef.current) {
        videoRef.current.srcObject = ms;
        await videoRef.current.play();
      }
      setIsRecording(true);
      setStatusMsg("Camera started — analysing...");
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera: " + err.message);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsRecording(false);
    setLiveAnalysis(null);
    setStatusMsg("");
  };

  const captureAndAnalyze = useCallback(async () => {
    if (analyzingRef.current) return;
    if (!videoRef.current || !canvasRef.current) return;
    if (Date.now() - lastTimeRef.current < 2500) return;

    analyzingRef.current = true;
    lastTimeRef.current = Date.now();
    setStatusMsg("Analyzing...");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: `You are an expert personal trainer doing LIVE form analysis${selectedExercise ? ` for ${selectedExercise}` : ""}. Respond ONLY with valid JSON:\n{"exercise":"name","formStatus":"Excellent/Good/Needs Correction/Stop - Unsafe","quickFeedback":"one sentence","keyPoints":["point"],"score":85,"urgency":"low/medium/high"}` },
                  { inlineData: { mimeType: "image/jpeg", data: e.target.result.split(",")[1] } }
                ]
              }]
            })
          });
          const data = await res.json();
        
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          const m = text.match(/\{[\s\S]*\}/);
          if (m) setLiveAnalysis(JSON.parse(m[0]));
          setStatusMsg("Live — updating every 3s");
        } catch (err) {
          console.error("Analysis error:", err);
          setStatusMsg("Analysis failed — retrying...");
        } finally {
          analyzingRef.current = false;
        }
      };
      reader.readAsDataURL(blob);
    }, "image/jpeg", 0.8);
  }, [selectedExercise]);

  useEffect(() => {
    if (!isRecording) return;
    captureAndAnalyze();
    const id = setInterval(captureAndAnalyze, 3000);
    return () => clearInterval(id);
  }, [isRecording, captureAndAnalyze]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => { stopCamera(); setPage("landing"); }} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" />Back to Home
        </button>

        <div className="space-y-6">
          {!isRecording && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Select Your Exercise (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["Squats", "Deadlift", "Bench Press", "Shoulder Press", "Pull-ups", "Bicep Curls", "Tricep Extensions", "Lunges", "Plank", "Push-ups"].map(ex => (
                  <button key={ex} onClick={() => setSelectedExercise(ex)}
                    className={`glow-effect group relative p-3 rounded-lg border-2 transition-all overflow-hidden text-sm ${selectedExercise === ex ? "border-red-600 bg-red-600/20 text-white" : "border-gray-600 bg-gray-700 text-gray-300 hover:border-red-500"}`}>
                    <GlowOverlay /><span className="relative z-10">{ex}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Camera */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2"><Video className="w-6 h-6 text-red-500" />Live Camera Feed</h3>
                {isRecording && <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse"><div className="w-2 h-2 bg-white rounded-full" /><span className="text-sm font-bold">LIVE</span></div>}
              </div>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                {!isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center"><Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-400">Camera not started</p></div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-3">
                {!isRecording
                  ? <button onClick={startCamera} className="glow-effect group relative flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 overflow-hidden">
                      <GlowOverlay /><Play className="w-5 h-5 relative z-10" /><span className="relative z-10">Start Live Analysis</span>
                    </button>
                  : <button onClick={stopCamera} className="glow-effect group relative flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 overflow-hidden">
                      <GlowOverlay /><StopCircle className="w-5 h-5 relative z-10" /><span className="relative z-10">Stop Analysis</span>
                    </button>
                }
                <button onClick={triggerUpload} className="glow-effect group relative bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 overflow-hidden">
                  <GlowOverlay /><Upload className="w-5 h-5 relative z-10" /><span className="relative z-10">Upload</span>
                </button>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap className="w-6 h-6 text-red-500" />Real-Time Feedback</h3>
              {!isRecording
                ? <div className="flex flex-col items-center justify-center py-12 text-center"><Target className="w-16 h-16 text-gray-600 mb-4" /><p className="text-gray-400">Start the camera to begin live form feedback</p></div>
                : !liveAnalysis
                  ? <div className="flex flex-col items-center justify-center py-12"><div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" /><p className="text-gray-400">{statusMsg || "Starting analysis..."}</p></div>
                  : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{liveAnalysis.exercise}</h4>
                        <div className="flex items-center gap-4 mb-4">
                          <span className={`px-4 py-2 rounded-full font-bold text-sm ${statusColor(liveAnalysis.formStatus)} ${liveAnalysis.formStatus?.includes("Stop") ? "animate-pulse" : ""}`}>{liveAnalysis.formStatus}</span>
                          <div className="flex items-center gap-2"><span className="text-2xl font-bold text-red-500">{liveAnalysis.score}</span><span className="text-gray-400 text-sm">/ 100</span></div>
                        </div>
                      </div>
                      <div className={`rounded-lg p-4 border-2 ${liveAnalysis.urgency === "high" ? "bg-red-900/30 border-red-600 animate-pulse" : liveAnalysis.urgency === "medium" ? "bg-yellow-900/30 border-yellow-600" : "bg-green-900/30 border-green-600"}`}>
                        <h5 className="font-bold mb-2">Immediate Feedback</h5>
                        <p className="text-gray-200">{liveAnalysis.quickFeedback}</p>
                      </div>
                      {liveAnalysis.keyPoints?.length > 0 && (
                        <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
                          <h5 className="font-bold mb-2 flex items-center gap-2 text-blue-400"><CheckCircle className="w-5 h-5" />Key Focus Points</h5>
                          <ul className="space-y-2">{liveAnalysis.keyPoints.map((p, i) => <li key={i} className="text-sm text-gray-300 flex items-start gap-2"><span className="text-blue-400 font-bold">•</span>{p}</li>)}</ul>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 text-center">{statusMsg}</p>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
