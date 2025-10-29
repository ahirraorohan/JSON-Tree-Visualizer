import React from "react";

export default function ControlsBar({
  onZoomIn,
  onZoomOut,
  onFitView,
  onClear,
  onCopyPathModeToggle,
  copyMode,
}) {
  return (
    <div className="flex gap-2 items-center">
      <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors">
        Zoom In
      </button>
      <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors">
        Zoom Out
      </button>
      <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors">
        Fit View
      </button>
      <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors">
        Clear
      </button>
      <button
        className={`px-3 py-1 border rounded text-sm transition-colors duration-300
    ${
      copyMode
        ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
        : "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
    }`}
        onClick={onCopyPathModeToggle}
      >
        {copyMode ? "Copy mode: ON" : "Copy path"}
      </button>
    </div>
  );
}
