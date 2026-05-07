"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/Header";
import CodeEditor from "@/components/CodeEditor";
import { encodePaste, decodePaste } from "@/lib/utils";

const BOILERPLATES: Record<string, string> = {
  cpp: `// Welcome to aarav-bin
// Paste your C++ code here. It's instantly compressed into the URL.

#include <iostream>

int main() {
    std::cout << "Ultra-low latency bin initialized." << std::endl;
    return 0;
}
`,
  python: `# Welcome to aarav-bin
# Paste your Python code here. It's instantly compressed into the URL.

def main():
    print("Ultra-low latency bin initialized.")

if __name__ == "__main__":
    main()
`,
  java: `// Welcome to aarav-bin
// Paste your Java code here. It's instantly compressed into the URL.

public class Main {
    public static void main(String[] args) {
        System.out.println("Ultra-low latency bin initialized.");
    }
}
`,
  javascript: `// Welcome to aarav-bin
// Paste your JavaScript code here. It's instantly compressed into the URL.

const initCode = () => {
  console.log("Ultra-low latency bin initialized.");
};

initCode();
`,
  rust: `// Welcome to aarav-bin
// Paste your Rust code here. It's instantly compressed into the URL.

fn main() {
    println!("Ultra-low latency bin initialized.");
}
`,
  json: `{
  "welcome": "to aarav-bin",
  "status": "Ultra-low latency bin initialized",
  "features": ["zero-database", "url-compressed", "aesthetic"]
}
`,
  markdown: `# Welcome to aarav-bin
> A minimalist, stateless pastebin.

## Features
- **Zero Latency**: Compresses code directly into the URL hash.
- **Aesthetic**: Built for developers who care about typography.
- **Stateless**: No database means absolute privacy.
`
};

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isLoaded, setIsLoaded] = useState(false);
  const [triggerShare, setTriggerShare] = useState(0); // Used to trigger UI feedback in Header
  
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Initialize from URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const data = decodePaste(hash);
      if (data) {
        setCode(data.code);
        setLanguage(data.language);
      }
    } else {
      setCode(BOILERPLATES["cpp"]);
    }
    setIsLoaded(true);
  }, []);

  const handleShare = () => {
    const hash = encodePaste({ code, language });
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    window.history.replaceState(null, "", url);
    navigator.clipboard.writeText(url);
    setTriggerShare(Date.now()); // Update timestamp to trigger animation in header
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const isCurrentCodeBoilerplate = Object.values(BOILERPLATES).includes(code);
    if (!code || isCurrentCodeBoilerplate) {
      setCode(BOILERPLATES[newLang]);
    }
  };

  // --- NEW: Global Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isModifier = e.metaKey || e.ctrlKey;

      if (isModifier && e.key.toLowerCase() === 's') {
        e.preventDefault(); // Stop browser from opening "Save As" menu
        handleShare();
      }

      if (isModifier && e.key === '/') {
        e.preventDefault();
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, resolvedTheme, setTheme]); 
  // --------------------------------------

  if (!isLoaded) return null;

  return (
    <main className="flex flex-col h-screen bg-white dark:bg-[#0d1117]">
      <Header 
        language={language} 
        setLanguage={handleLanguageChange} 
        onShare={handleShare}
        shareTrigger={triggerShare} 
      />
      <CodeEditor 
        code={code} 
        onChange={setCode} 
        language={language} 
      />
    </main>
  );
}