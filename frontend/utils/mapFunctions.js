// export const findPath = (start, end, connections) => {
//   const graph = {};

//   connections.forEach(([a, b]) => {
//     if (!graph[a]) graph[a] = [];
//     if (!graph[b]) graph[b] = [];
//     graph[a].push(b);
//     graph[b].push(a);
//   });

//   const queue = [[start]];
//   const visited = new Set();

//   while (queue.length) {
//     const path = queue.shift();
//     const node = path[path.length - 1];

//     if (node === end) return path;

//     if (!visited.has(node)) {
//       visited.add(node);

//       (graph[node] || []).forEach((neighbor) => {
//         queue.push([...path, neighbor]);
//       });
//     }
//   }

//   return [];
// };

export function findPath(start, end, graph) {
  const queue = [[start]];
  const visited = new Set();

  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) return path;

    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = graph[node] || [];

    for (let next of neighbors) {
      queue.push([...path, next]);
    }
  }

  return [];
}

export const getPathCoords = (path, rooms) => {
  return path
    .map((id) => rooms.find((r) => r.id === id))
    .filter(Boolean)
    .map((room) => ({
      x: room.x,
      y: room.y,
    }));
};


export const makeConnectionsBidirectional = (connections) => {
  const bidirectional = {};
  
  Object.keys(connections).forEach((source) => {
    if (!bidirectional[source]) bidirectional[source] = [];
    
    connections[source].forEach((target) => {
      const cleanTarget = target.trim(); // Kisi bhi extra space ko khatam karne k liye
      
      // Source se Target ka rasta
      if (!bidirectional[source].includes(cleanTarget)) {
        bidirectional[source].push(cleanTarget);
      }
      
      // Target se Source ka wapsi rasta (Fixes the Room-to-Room issue!)
      if (!bidirectional[cleanTarget]) bidirectional[cleanTarget] = [];
      if (!bidirectional[cleanTarget].includes(source)) {
        bidirectional[cleanTarget].push(source);
      }
    });
  });
  
  return bidirectional;
};