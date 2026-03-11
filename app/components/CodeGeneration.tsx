import React, { useState } from 'react'
import { HistoryItem } from '../types'
import { samplePrompt } from '../data/example'
import { languages } from '../data/example'

interface CodeGenerationProps {
  addToHistory: (
    type: HistoryItem["type"],
    input: string,
    output: string
  ) => void;
}

const CodeGeneration = ({ addToHistory }: CodeGenerationProps) => {

  const [description, setDescription] = useState<string>("");
  const [language, setLanguage] = useState<string>("Javascript");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, language })
      });
      const data = await response.json();
      if (response.ok) {
        const codeText =
          data.data?.generateCode || "No code generation.";
        setGeneratedCode(codeText);
        addToHistory("generate", `${language}:${description}`, codeText);
      } else {
        setGeneratedCode(`Error: ${data.error}`);
      }
    } catch (error) {
      setGeneratedCode("Failed to generated code. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const insertSamplePrompt = (prompt: string) => {
    setDescription(prompt);
  }
  return (

    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Generate Code</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="language"
              className="block text-sm font-medium text-gray-300 mb-2">
              Programming Language
            </label>
            <select id="language"
              className="w-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100 backdrop-blur-sm transition-all duration-200"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang: string) => (
                <option key={lang} value={lang} className="bg-gray-900">
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex item-center justify-between mb-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2">
            Describe what you want to code
          </label>
          <span className="text-xs text-gray-500">
            {description.length} chars
          </span>
        </div>
        <textarea
          id="description"
          rows={5}
          className="w-full px-4 py-3 bg-gray-900/70 border border-gray-500 resize-none font-mono text-sm backdrop-blur-sm transition-all duration-200"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the code you want to generate. Be as specific as possible."
        />
      </div>
      {/*sample prompt*/}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Quick Prompts
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {samplePrompt.map((prompt, index) => (
            <button
              key={index}
              onClick={() => insertSamplePrompt(prompt)}
              className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 border border-gray-700/50 hover:border-green-500/30">
              {prompt}
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleGenerate}
        disabled={loading || !description.trim()}
        className="w-full px-6 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Code...</span>
          </>
        ) : (
          <>
            <span>⚡</span>
            <span>Generate Code</span>
          </>
        )}
      </button>

      {generatedCode && (
        <div className="mt-6 animate-fade-in">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-md ">
              <h3 className="text-xl font-semibold text-white">Generated Code</h3>
            </div>
          </div>
          <div className="bg-gray-900/70 border border-gray-600 rounded-xl p-4 font-mono text-sm text-gray-100 backdrop-blur-sm whitespace-pre-wrap">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg mb-4">
              <span className="text-sm font-medium text-gray-300">
                {language}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 border border-gray-700/50 hover:border-green-500/30">
                Copy
              </button>
            </div>
            <pre className="p-6 overflow-x-auto text-green-400 font-mono text-sm">
              {generatedCode}
            </pre>
          </div>
        </div>)}
    </>

  )
}

export default CodeGeneration