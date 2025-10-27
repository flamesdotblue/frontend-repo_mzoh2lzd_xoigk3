import React, { useCallback, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import AnalyzePage from './components/AnalyzePage.jsx';
import ReportPage from './components/ReportPage.jsx';
import ChatPage from './components/ChatPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('analyze');
  const [scores, setScores] = useState({
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  });
  const [report, setReport] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = '';
  const model = 'gemini-2.5-flash-preview-09-2025';
  const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const handleNavigate = (page) => setCurrentPage(page);

  const showError = (msg) => {
    setError(msg);
    setIsLoading(false);
  };

  const closeError = () => setError('');

  const randomScores = () => ({
    openness: Math.random(),
    conscientiousness: Math.random(),
    extraversion: Math.random(),
    agreeableness: Math.random(),
    neuroticism: Math.random(),
  });

  const analyzeText = (text) => {
    setIsLoading(true);
    const s = randomScores();
    setScores(s);
    generateReport(s);
  };

  const retryWithBackoff = async (fn, { retries = 3, baseDelay = 600 } = {}) => {
    let lastErr;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 100;
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw lastErr;
  };

  const generateReport = useCallback(async (s) => {
    const sysPrompt =
      "You are an expert psychologist and insightful analyst. Your task is to write a detailed, supportive, and actionable personality report based on a user's Big Five (OCEAN) scores. The scores are from 0 (low) to 1 (high). Address the user directly (using 'you'). Be encouraging and focus on potential strengths and growth areas. Format the report with Markdown (headings, lists). Do not sound like a robot. Be insightful and comprehensive.";

    const userPrompt = `Generate a full personality report for the following scores: Openness: ${s.openness.toFixed(2)}, Conscientiousness: ${s.conscientiousness.toFixed(2)}, Extraversion: ${s.extraversion.toFixed(2)}, Agreeableness: ${s.agreeableness.toFixed(2)}, Neuroticism: ${s.neuroticism.toFixed(2)}.`;

    try {
      const exec = async () => {
        const res = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { role: 'system', parts: [{ text: sysPrompt }] },
            contents: [
              {
                role: 'user',
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              topK: 40,
              maxOutputTokens: 1024,
            },
          }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Generation failed: ${res.status} ${t}`);
        }
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') || '';
        if (!text) throw new Error('Empty response from model');
        setReport(text);
        setIsLoading(false);
        setCurrentPage('report');
      };
      await retryWithBackoff(exec, { retries: 3, baseDelay: 700 });
    } catch (e) {
      showError(e.message || 'Something went wrong generating your report.');
    }
  }, []);

  const chatWithArjus = useCallback(async (message) => {
    const newHistory = [
      ...chatHistory,
      { role: 'user', parts: [{ text: message }] },
    ];
    setChatHistory(newHistory);
    setIsLoading(true);

    const sysPrompt = `You are Arjus, a friendly, supportive, and wise AI coach. Your purpose is to help a user understand their personality report. You must be conversational, patient, and insightful. The user's complete personality report is as follows: [${report}]. Base all your answers *only* on this report and your general knowledge of the Big Five model. Never reveal you are an AI model. Keep your answers concise and helpful.`;

    try {
      const exec = async () => {
        const res = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { role: 'system', parts: [{ text: sysPrompt }] },
            contents: newHistory,
            generationConfig: {
              temperature: 0.6,
              topP: 0.9,
              maxOutputTokens: 512,
            },
          }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Chat failed: ${res.status} ${t}`);
        }
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') || 'Sorry, I could not generate a response.';
        setChatHistory((h) => [...h, { role: 'model', parts: [{ text: reply }] }]);
        setIsLoading(false);
      };
      await retryWithBackoff(exec, { retries: 3, baseDelay: 700 });
    } catch (e) {
      setChatHistory((h) => [
        ...h,
        { role: 'model', parts: [{ text: 'Arjus encountered an error. Please try again in a moment.' }] },
      ]);
      setIsLoading(false);
    }
  }, [baseUrl, chatHistory, report]);

  const page = useMemo(() => {
    if (currentPage === 'analyze')
      return <AnalyzePage onAnalyze={analyzeText} isLoading={isLoading} />;
    if (currentPage === 'report')
      return <ReportPage scores={scores} report={report} isLoading={isLoading} />;
    return (
      <ChatPage
        report={report}
        chatHistory={chatHistory}
        onSend={chatWithArjus}
        isLoading={isLoading}
      />
    );
  }, [currentPage, scores, report, chatHistory, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-white text-gray-900">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="pb-16 pt-6">
        {page}
      </main>

      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">{error}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeError}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mx-auto max-w-6xl px-4 pb-6 text-center text-sm text-gray-500">
        Built with care • Big Five insights • Chat with Arjus
      </footer>
    </div>
  );
}

export default App;
