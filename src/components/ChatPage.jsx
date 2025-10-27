import React, { useState, useRef, useEffect } from 'react';

export default function ChatPage({ report, chatHistory, onSend, isLoading }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Please generate a report first.</h2>
        <p className="mt-2 text-gray-600">Your chat with Arjus is based on your personalized report.</p>
      </div>
    );
  }

  const handleSend = () => {
    const message = input.trim();
    if (!message || isLoading) return;
    onSend(message);
    setInput('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              } max-w-[80%] rounded-2xl px-4 py-3 shadow-sm`}
              >
                {m.parts?.map((p, i) => (
                  <p key={i} className="whitespace-pre-wrap leading-relaxed">{p.text}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-500" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-400" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-300" />
              <span className="text-sm">Arjus is thinking…</span>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="border-t border-gray-200 p-3 flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Ask Arjus about your report…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
