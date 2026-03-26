import React, { useState } from 'react'
import { HistoryItem } from '../types';
import { sampleBuggyCode, sampleCode } from '../data/example';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CodeDebuggingProps {
  addToHistory: (
    type: HistoryItem["type"],
    input: string,
    output: string
  ) => void;
}
const CodeDebugging = ({ addToHistory }: CodeDebuggingProps) => {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [debugging, setDebugging] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleDebug = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, error })
      });
      const data = await response.json();
      if (response.ok) {
        const debuggingText =
          data.data?.debugging || "No debugging suggestion generation.";
        setDebugging(debuggingText);
        addToHistory("debug", `code: ${code}, error: ${error}`, debuggingText);
      } else {
        setDebugging(`Error: ${data.error}`);
      }
    } catch (error) {
      setDebugging("Failed to fetch debugging suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const insertSample = () => {
    setCode(sampleBuggyCode);
    setError("TypeError: Cannot read properties of undefined.");
  }
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Debug Code</h2>
          <button
            onClick={insertSample}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200 text-sm">
            Try Sample
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
              Code with Issues
            </label>
            <div className="relative">
              <textarea
                id="debug-code"
                rows={12}
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-500 resize-none font-mono text-sm backdrop-blur-sm transition-all duration-200"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your buggy code here.."
              />
              <div className="absolute top-3 right-3 text-xs text-gray-500">
                {code.length}chars
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="error" className="block text-sm font-medium text-gray-300 mb-2">
              Error Message(Optional)
            </label>
            <div className="relative">
              <textarea
                id="error"
                rows={3}
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-500 resize-none font-mono text-sm backdrop-blur-sm transition-all duration-200"
                value={error}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Describe or paste the error here..."
              />
            </div>
          </div>
          <button onClick={handleDebug}
            disabled={loading || !code.trim()}
            className="w-full px-6 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Debugging Code...</span>
              </>
            ) : (
              <>
                <span>🐝</span>
                <span>Debug Code</span>
              </>
            )}
          </button>
        </div>
        {debugging && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-md ">
                <h3 className="text-xl font-semibold text-white">Debugging solutions</h3>
              </div>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-md px-4 py-2">
              <div className="prose prose-invert max-w-none">
                <pre className="text-gray-100 whitespace-pre-wrap leading-relaxed text-sm rounded-md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {debugging}
                  </ReactMarkdown>
                </pre>
              </div>
            </div>

          </div>)}
      </div>
    </>
  )
}

export default CodeDebugging
