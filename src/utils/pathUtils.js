// normalize JSON path like $.user.address.city or items[0].name -> returns array of steps
export function parsePathString(pathStr) {
  if (!pathStr) return [];
  // remove leading $
  let s = pathStr.trim();
  if (s.startsWith("$.")) s = s.slice(2);
  if (s.startsWith("$")) s = s.slice(1);
  // replace [index] with .index
  s = s.replace(/\[(\d+)\]/g, ".$1");
  // split by dot, filter empty
  const parts = s.split(".").filter(Boolean);
  return parts;
}
