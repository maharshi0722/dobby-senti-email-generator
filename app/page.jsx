"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function DobbyEmail() {
  const [form, setForm] = useState({ points: "", tone: "professional" });
  const [rawOutput, setRawOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // SSR-safe

  useEffect(() => setMounted(true), []);

  const handleGenerate = async () => {
    if (!form.points.trim()) return alert("Please enter key points!");

    setLoading(true);
    setRawOutput("");

    try {
      const res = await axios.post("/api/generateEmail", form);

      const emailClean = (res.data.email || "").trim();

      setRawOutput(emailClean);
    } catch (err) {
      setRawOutput("❌ " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!rawOutput) return;
    try {
      await navigator.clipboard.writeText(rawOutput);
      alert("✅ Email copied to clipboard!");
    } catch {
      alert("❌ Failed to copy.");
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 max-w-2xl w-full flex flex-col gap-4 ">
        <div className="flex flex-col gap-2 items-center">
          <img
            src={`https://pbs.twimg.com/profile_images/1859727094789660672/h7RM1LNu_400x400.jpg`}
            alt={" "}
            className="w-16 h-16 rounded-full shadow-xl border-4 border-white dark:border-gray-600 animate-[pulse_2s_ease-in-out_infinite]"
          />{" "}
          <h1 className="text-xl md:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
            Dobby Email Generator
          </h1>
        </div>

        <label className="font-semibold text-gray-800 dark:text-gray-200 text-[18px]">
          Key Points:
        </label>
        <textarea
          rows={5}
          placeholder="Enter bullet points for email..."
          value={form.points}
          onChange={(e) => setForm({ ...form, points: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
        />

        <label className="font-semibold text-gray-800 dark:text-gray-200 text-[18px]">
          Tone:
        </label>
        <select
          value={form.tone}
          onChange={(e) => setForm({ ...form, tone: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors md:text-[18px]"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="marketing">Marketing</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "✨ Generate Email"}
        </button>

        {rawOutput && (
          <>
            <div className="mt-4 p-4 border-l-4 border-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded whitespace-pre-wrap transition-colors">
              {rawOutput}
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                📝 {rawOutput.length} characters
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition"
              >
                📋 Copy Email
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
