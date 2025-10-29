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
      <button className="px-2 py-1 border rounded text-sm" onClick={onZoomIn}>
        Zoom In
      </button>
      <button className="px-2 py-1 border rounded text-sm" onClick={onZoomOut}>
        Zoom Out
      </button>
      <button className="px-2 py-1 border rounded text-sm" onClick={onFitView}>
        Fit View
      </button>
      <button className="px-2 py-1 border rounded text-sm" onClick={onClear}>
        Clear
      </button>
      <button
        className={`px-2 py-1 border rounded text-sm ${
          copyMode ? "bg-indigo-600 text-white" : ""
        }`}
        onClick={onCopyPathModeToggle}
      >
        {copyMode ? "Copy mode: ON" : "Copy path"}
      </button>
    </div>
  );
}
