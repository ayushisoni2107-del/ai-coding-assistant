"use client";

import { HistoryItem, Tab } from "@/app/types";
import { useState } from "react";
import FeatureGrid from "./components/FeatureGrid";
import Header from "./components/Header";
import HistoryPanel from "./components/HistoryPanel";
import tabs from "./data/tabs";
import CodeDebugging from "./components/CodeDebugging";
import CodeExplanation from "./components/CodeExplaination";
import CodeGeneration from "./components/CodeGeneration";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab["id"]>("explain");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const addToHistory = (
    type: HistoryItem["type"],
    input: string,
    output: string
  ) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type,
      input,
      output,
      timestamp: new Date().toLocaleString(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
  };
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full"></div>
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-yellow-500 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full"></div>
        </div>
      </div>
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <Header />
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border">
              {/* TabNavigation */}
              <div className="flex border-b border-gray-700/50 bg-gray-900/50 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all 
                      ${activeTab === tab.id
                        ? `bg-linear-to-r ${tab.gradient} text-white shadow-lg`
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"}`}
                    onClick={() => setActiveTab(tab.id)}>
                    <span className="text-xl mr-2"> {tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "explain" && <CodeExplanation addToHistory={addToHistory} />}
                {activeTab === "debug" && <CodeDebugging addToHistory={addToHistory} />}
                {activeTab === "generate" && <CodeGeneration addToHistory={addToHistory} />}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <HistoryPanel history={history} />
        </div>
        {/* Features Grid */}
        <FeatureGrid />
      </main>
      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-gray-500">
        <p>Powered by Google Gemini AI. Built with Next.js & Typescript</p>
      </footer>
    </>
  );
}
