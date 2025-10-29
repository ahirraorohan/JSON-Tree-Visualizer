let idCounter = 1;
function nextId() {
  return String(idCounter++);
}

/**
 * Build nodes and edges for React Flow.
 * We'll do a simple horizontal layout per depth/position.
 */
export function jsonToFlow(json) {
  idCounter = 1;
  const nodes = [];
  const edges = [];

  // layout helpers
  const levels = {}; // track x index per depth

  function getPos(depth) {
    if (!levels[depth]) levels[depth] = 0;
    const x = levels[depth] * 220;
    const y = depth * 120;
    levels[depth] += 1;
    return { x, y };
  }

  function walk(value, key, parentId, depth, path) {
    const id = nextId();
    const currentPath =
      path === ""
        ? key !== null
          ? key
          : ""
        : key !== null
        ? `${path}.${key}`
        : path;

    // determine node type
    let type = "primitive";
    if (value !== null && typeof value === "object") {
      if (Array.isArray(value)) type = "array";
      else type = "object";
    }

    // label to display
    let label = "";
    if (type === "object") label = key ? `${key} {}` : "{root}";
    else if (type === "array") label = key ? `${key} [ ]` : "[root]";
    else {
      // primitive: show key and value
      const pretty = JSON.stringify(value);
      label = key ? `${key}: ${pretty}` : `${pretty}`;
    }

    const pos = getPos(depth);

    nodes.push({
      id,
      position: pos,
      data: {
        label,
        rawKey: key,
        value,
        type,
        path: currentPath.startsWith(".") ? currentPath.slice(1) : currentPath,
      },
      style: nodeStyleForType(type),
      sourcePosition: "right",
      targetPosition: "left",
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        animated: false,
        style: { stroke: "#94a3b8" },
      });
    }

    // if object/array, walk children
    if (type === "object") {
      for (const k of Object.keys(value)) {
        walk(value[k], k, id, depth + 1, currentPath);
      }
    } else if (type === "array") {
      for (let i = 0; i < value.length; i++) {
        walk(value[i], String(i), id, depth + 1, currentPath);
      }
    }

    return id;
  }

  // root
  walk(json, null, null, 0, "");

  return { nodes, edges };
}

function nodeStyleForType(t) {
  if (t === "object") {
    return {
      background: "linear-gradient(90deg,#7c3aed,#4f46e5)",
      color: "white",
      padding: 8,
      borderRadius: 8,
      minWidth: 120,
    };
  }
  if (t === "array") {
    return {
      background: "linear-gradient(90deg,#10b981,#059669)",
      color: "white",
      padding: 8,
      borderRadius: 8,
      minWidth: 120,
    };
  }
  return {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "white",
    padding: 8,
    borderRadius: 8,
    minWidth: 140,
  };
}
