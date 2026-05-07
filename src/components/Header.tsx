"use client";

import { Moon, Sun, Link as LinkIcon, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  onShare: () => void;
  shareTrigger?: number; // Tells header that a share was triggered via keyboard
}

const LANGUAGES = [
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'rust', name: 'Rust' },
  { id: 'json', name: 'JSON' },
  { id: 'markdown', name: 'Markdown' },
];

export default function Header({ language, setLanguage, onShare, shareTrigger }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is on Mac to show ⌘ instead of Ctrl
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Listen for keyboard triggers from parent
  useEffect(() => {
    if (shareTrigger && shareTrigger > 0) {
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [shareTrigger]);

  const handleShareClick = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0d1117] border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center">
        <h1 className="font-mono font-bold text-lg tracking-tight text-neutral-800 dark:text-neutral-100">
          aarav-bin
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleShareClick}
          className="group flex items-center gap-2 bg-neutral-800 dark:bg-white hover:bg-neutral-900 dark:hover:bg-neutral-200 text-white dark:text-black text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
        >
          {copied ? <Check size={16} /> : <LinkIcon size={16} />}
          {copied ? "Copied URL!" : "Share"}
          {/* Keyboard shortcut hint */}
          {!copied && (
            <kbd className="hidden sm:inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 text-[10px] font-sans font-semibold text-neutral-400 dark:text-neutral-500 bg-neutral-700 dark:bg-neutral-200 rounded border border-neutral-600 dark:border-neutral-300">
              {isMac ? '⌘S' : 'Ctrl S'}
            </kbd>
          )}
        </button>

        {mounted && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Theme"
              title={`Toggle Theme (${isMac ? '⌘/' : 'Ctrl+/'})`}
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}