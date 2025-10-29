import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { jsonToFlow } from "../utils/jsonToFlow";
import { parsePathString } from "../utils/pathUtils";
import ControlsBar from "./ControlsBar";

export default function TreeVisualizer({ jsonData, theme }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [copyMode, setCopyMode] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  // convert JSON to nodes/edges when jsonData changes
  useEffect(() => {
    if (!jsonData) {
      setNodes([]);
      setEdges([]);
      setMessage("No tree to show");
      return;
    }
    const { nodes: n, edges: e } = jsonToFlow(jsonData);
    // attach ids
    setNodes(n);
    setEdges(e);
    setMessage(`Tree generated — ${n.length} nodes`);
    setHighlightedNodeId(null);
  }, [jsonData]);

  // when nodes change, reset highlight
  useEffect(() => {
    if (!highlightedNodeId) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === highlightedNodeId) {
          return {
            ...n,
            style: {
              ...(n.style || {}),
              boxShadow: "0 8px 30px rgba(59,130,246,0.25)",
              border: "3px solid #fff3",
            },
          };
        }
        // remove previous boxShadow if any
        if (n.style && n.style.boxShadow) {
          const newStyle = { ...n.style };
          delete newStyle.boxShadow;
          delete newStyle.border;
          return { ...n, style: newStyle };
        }
        return n;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedNodeId]);

  // handle node clicks (copy path if copyMode)
  const onNodeClick = useCallback(
    (event, node) => {
      if (copyMode) {
        const path = node.data?.path || "";
        navigator.clipboard?.writeText(path);
        setMessage(`Copied path: ${path}`);
        setCopyMode(false);
      }
    },
    [copyMode]
  );

  // search by path string
  const handleSearch = useCallback(() => {
    setMessage("");
    if (!search) {
      setMessage("Please enter a path");
      return;
    }
    // parse the path, but nodes have path as dot-separated without $.
    const parts = parsePathString(search);
    // convert parts into possible path strings to match node.data.path
    // Some nodes have paths like "user.address.city" or "items.0.name"
    // We'll find nodes whose path endsWith the path (exact match or . + lastPart)
    const target = parts.join(".");
    const matches = nodes.filter((n) => {
      const p = n.data?.path || "";
      return p === target || p.endsWith(`.${target}`);
    });

    if (!matches || matches.length === 0) {
      setHighlightedNodeId(null);
      setMessage("No match found");
      return;
    }

    const nodeToFocus = matches[0];
    setHighlightedNodeId(nodeToFocus.id);
    setMessage(`Match found: ${nodeToFocus.data.path}`);

    // pan / center to node
    if (rfInstance) {
      // compute center — using setViewport
      const nodePos = nodeToFocus.position;
      // set viewport so node is centered
      const viewport = {
        x: nodePos.x - window.innerWidth / 4,
        y: nodePos.y - 100,
        zoom: 1.3,
      };
      try {
        rfInstance.setViewport(viewport, { duration: 400 });
      } catch (err) {
        // fallback: fitView
        rfInstance.fitView({ padding: 0.2 });
      }
    }
  }, [nodes, search, rfInstance]);

  // reactflow instance set
  const onLoad = useCallback((instance) => {
    setRfInstance(instance);
  }, []);

  // zoom / fit / clear
  const zoomIn = () => rfInstance?.zoomIn();
  const zoomOut = () => rfInstance?.zoomOut();
  const fitView = () => rfInstance?.fitView();
  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setMessage("Cleared");
  };

  return (
    <div className="h-full flex flex-col flex-1">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex gap-2 items-center">
          <input
            className="px-2 py-1 border rounded w-72 text-sm bg-white dark:bg-slate-700 dark:text-slate-100"
            placeholder="Search path (e.g. $.user.address.city or items[0].name)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
            Search
          </button>
        </div>

        <div className="flex items-center gap-2">
          <ControlsBar
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFitView={fitView}
            onClear={handleClear}
            onCopyPathModeToggle={() => setCopyMode((s) => !s)}
            copyMode={copyMode}
          />
        </div>
      </div>

      <div
        className="flex-1 border rounded overflow-hidden"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) =>
            setNodes((nds) => applyNodeChanges(changes, nds))
          }
          onEdgesChange={(changes) =>
            setEdges((eds) => applyEdgeChanges(changes, eds))
          }
          onInit={onLoad}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
          style={{ width: "100%", height: "100%" }}
        >
          <Background />
          <MiniMap
            nodeStrokeColor={(n) =>
              n.data?.type === "object"
                ? "#7c3aed"
                : n.data?.type === "array"
                ? "#10b981"
                : "#f97316"
            }
          />
          <Controls />
        </ReactFlow>
      </div>

      <div className="mt-2 text-sm text-slate-500">{message}</div>
    </div>
  );
}
