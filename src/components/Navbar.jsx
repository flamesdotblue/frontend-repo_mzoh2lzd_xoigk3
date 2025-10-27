import React from 'react';
import { Home, FileText, MessageSquare } from 'lucide-react';

export default function Navbar({ currentPage, onNavigate }) {
  const NavButton = ({ id, label, Icon }) => (
    <button
      onClick={() => onNavigate(id)}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 ${
        currentPage === id
          ? 'bg-indigo-600 text-white'
          : 'bg-white/70 text-gray-700 hover:bg-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-full sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/40 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 shadow-sm" />
          <span className="text-lg font-semibold text-gray-800">MindMirror</span>
        </div>
        <div className="flex items-center gap-2">
          <NavButton id="analyze" label="Analyze" Icon={Home} />
          <NavButton id="report" label="My Report" Icon={FileText} />
          <NavButton id="chat" label="Chat with Arjus" Icon={MessageSquare} />
        </div>
      </div>
    </div>
  );
}
