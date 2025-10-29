import React, { useState, useCallback } from "react";
import JsonInput from "./components/JsonInput";
import TreeVisualizer from "./components/TreeVisualizer";
import useLocalStorage from "./hooks/useLocalStorage";
import useDarkMode from "./hooks/useDarkMode";

export default function App() {
  const [theme, toggleTheme] = useDarkMode();

  const [rawJson, setRawJson] = useLocalStorage(
    "jsonInput",
    `{
  "user": {
    "id": 1,
    "name": "Rohan",
    "address": {
      "city": "Pune",
      "zip": 411001
    },
    "phones": ["9999999999", "8888888888"]
  },
  "items": [
    { "name": "pen", "price": 10 },
    { "name": "book", "price": 200 }
  ]
}`
  );

  const [treeData, setTreeData] = useState(null);

  const handleVisualize = useCallback((parsed) => {
    setTreeData(parsed);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-6xl mx-auto p-4">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">JSON Tree Visualizer</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Built with React + React Flow + Tailwind
            </p>
          </div>

          {/* 🌗 Dark/Light mode toggle */}
          {/* 🌗 Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-md border border-slate-400 dark:border-slate-500
             hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <JsonInput
              rawJson={rawJson}
              setRawJson={setRawJson}
              onVisualize={handleVisualize}
            />
          </div>

          <div className="md:col-span-2 h-[80vh] bg-white dark:bg-slate-800 shadow rounded p-2 flex flex-col transition-colors duration-500">
            <TreeVisualizer jsonData={treeData} theme={theme} />
          </div>
        </div>

        <footer className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          Tip: Search using dot/bracket paths like{" "}
          <code>$.user.address.city</code> or <code>items[0].name</code>.
        </footer>
      </div>
    </div>
  );
}
