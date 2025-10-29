import React, { useState } from "react";

export default function JsonInput({ rawJson, setRawJson, onVisualize }) {
  const [error, setError] = useState(null);

  const handleVisualize = () => {
    setError(null);
    try {
      const parsed = JSON.parse(rawJson);
      onVisualize(parsed);
    } catch (e) {
      setError(e.message);
      onVisualize(null);
    }
  };

  const handleClear = () => {
    setRawJson("");
    setError(null);
    onVisualize(null);
  };

  const handleSample = () => {
    const sample = `{
  "user": { "id": 1, "name": "Rohan", "address": { "city": "Pune", "zip": 411001 }, "phones": ["9999999999", "8888888888"] },
  "items": [{ "name": "pen", "price": 10 }, { "name": "book", "price": 200 }],
  "active": true
}`;
    setRawJson(sample);
  };

  return (
    <div className="flex flex-col h-full">
      <label className="mb-2 font-medium">JSON Input</label>
      <textarea
        value={rawJson}
        onChange={(e) => setRawJson(e.target.value)}
        className="flex-1 w-full p-2 border rounded resize-none bg-white dark:bg-slate-700 dark:text-slate-100"
        rows={18}
        placeholder="Paste JSON here..."
      />
      {error && (
        <div className="text-red-500 text-sm mt-2">Invalid JSON: {error}</div>
      )}

      <div className="flex gap-2 mt-3">
        <button
          className="px-3 py-2 bg-indigo-600 text-white rounded"
          onClick={handleVisualize}
        >
          Visualize
        </button>
        <button className="px-3 py-2 border rounded" onClick={handleSample}>
          Sample JSON
        </button>
        <button className="px-3 py-2 border rounded" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
