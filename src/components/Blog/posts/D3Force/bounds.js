export default function() {
  let nodes = []
  let strength = 1
  let padding = 0
  let minX = -100
  let maxX = 100
  let minY = -100
  let maxY = 100

  function force() {
    nodes.forEach(node => {
      node.x = Math.max(node.x, minX + padding)
      node.x = Math.min(node.x, maxX - padding)
      node.y = Math.max(node.y, minY + padding)
      node.y = Math.min(node.y, maxY - padding)
    })
  }

  force.initialize = function(_nodes) {
    nodes = _nodes;
  };

  force.padding = function(_) {
    return arguments.length ? (padding = +_, force) : padding;
  };

  force.minX = function(_) {
    return arguments.length ? (minX = +_, force) : minX;
  };

  force.maxX = function(_) {
    return arguments.length ? (maxX = +_, force) : maxX;
  };

  force.minY = function(_) {
    return arguments.length ? (minY = +_, force) : minY;
  };

  force.maxY = function(_) {
    return arguments.length ? (maxY = +_, force) : maxY;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  return force;
}