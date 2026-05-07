"use client";

import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { useTheme } from 'next-themes';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export default function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  // Map our language string to CodeMirror extensions
  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'cpp': return langs.cpp();
      case 'java': return langs.java();
      case 'python': return langs.python();
      case 'javascript': return langs.javascript();
      case 'rust': return langs.rust();
      case 'json': return langs.json();
      case 'markdown': return langs.markdown();
      default: return langs.cpp();
    }
  };

  return (
    <div className="w-full h-full flex-grow overflow-auto text-sm font-mono border-t border-neutral-200 dark:border-neutral-800">
      <CodeMirror
        value={code}
        height="100%"
        theme={resolvedTheme === 'dark' ? githubDark : githubLight}
        extensions={[getLanguageExtension(language)]}
        onChange={(value) => onChange(value)}
        className="h-full"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
      />
    </div>
  );
}