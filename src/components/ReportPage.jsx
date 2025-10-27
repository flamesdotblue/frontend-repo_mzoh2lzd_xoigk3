import React from 'react';

function ScoreBar({ label, value, color = 'indigo' }) {
  const pct = Math.round(value * 100);
  const colorMap = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    cyan: 'bg-cyan-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-600',
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportPage({ scores, report, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-gray-600">Generating your personalized report…</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-800">You haven't analyzed any text yet.</h2>
        <p className="mt-2 text-gray-600">Go to the "Analyze" page to get started.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-3 gap-8">
      <div className="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 p-6 shadow-sm lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Big Five Snapshot</h3>
        <div className="space-y-4">
          <ScoreBar label="Openness" value={scores.openness} color="indigo" />
          <ScoreBar label="Conscientiousness" value={scores.conscientiousness} color="blue" />
          <ScoreBar label="Extraversion" value={scores.extraversion} color="emerald" />
          <ScoreBar label="Agreeableness" value={scores.agreeableness} color="cyan" />
          <ScoreBar label="Neuroticism" value={scores.neuroticism} color="violet" />
        </div>
      </div>

      <div className="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 p-6 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Personalized Report</h3>
        <article className="prose prose-indigo max-w-none">
          {report.split('\n').map((line, idx) => (
            <p key={idx} className="whitespace-pre-wrap">{line}</p>
          ))}
        </article>
      </div>
    </div>
  );
}
