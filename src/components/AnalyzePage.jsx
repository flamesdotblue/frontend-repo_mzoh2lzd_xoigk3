import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';

export default function AnalyzePage({ onAnalyze, isLoading }) {
  const [text, setText] = useState('');

  const handleAnalyze = () => {
    onAnalyze(text);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8 items-stretch">
      <div className="relative min-h-[320px] md:min-h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-indigo-50 to-white border border-indigo-100">
        <Spline
          scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-white/20 to-transparent" />
      </div>

      <div className="flex flex-col rounded-2xl bg-white/80 backdrop-blur border border-gray-200 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">MindMirror</h1>
        <p className="mt-1 text-gray-600">Analyze your writing to discover your personality.</p>
        <textarea
          className="mt-4 min-h-[220px] w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Paste a few paragraphs of your writing here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isLoading ? 'Analyzing…' : 'Analyze My Text'}
        </button>
        <p className="mt-3 text-xs text-gray-500">We generate a personality snapshot using the Big Five model. No text is stored.</p>
      </div>
    </div>
  );
}
