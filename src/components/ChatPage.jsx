import { useState, useRef, useEffect } from "react";
import { Send, ArrowRight } from "lucide-react";
import GlowOverlay from "./GlowOverlay";

export default function ChatPage({ setPage }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey there! 💪 I'm your AI Fitness Coach. What are your fitness goals today?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const msg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("Missing API Key in .env file");
      }

      // 🧠 Prepare chat history
      const cleanHistory = [];
      let lastRole = null;

      messages.forEach((m, i) => {
        if (i === 0) return;

        const role = m.role === "assistant" ? "model" : "user";

        if (role !== lastRole) {
          cleanHistory.push({
            role,
            parts: [{ text: m.content }]
          });
          lastRole = role;
        } else {
          cleanHistory[cleanHistory.length - 1].parts[0].text +=
            "\n" + m.content;
        }
      });

      // Add latest message
      cleanHistory.push({
        role: "user",
        parts: [{ text: msg }]
      });

      // 🚀 Gemini API call (PRO MODEL)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: "You are an AI fitness coach. Give safe, concise, motivating fitness advice."
                  }
                ]
              },
              ...cleanHistory
            ]
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "API Error");
      }

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `🚨 ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12">
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setPage("landing")}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back
          </button>
          <h2 className="text-2xl font-bold">AI Fitness Coach</h2>
          <div className="w-20" />
        </div>

        {/* Chat */}
        <div className="flex-1 bg-gray-800 rounded-2xl border border-gray-700 p-6 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user"
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-100"
                  }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-2xl p-4">
                <div className="flex gap-2">
                  {[0, 150, 300].map((d) => (
                    <div
                      key={d}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about workouts, diet, form tips..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
          />

          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 p-3 rounded-lg"
          >
            <GlowOverlay />
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}