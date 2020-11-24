import {quadtree} from "d3-quadtree";
function constant(x) {
  return function() {
    return x;
  };
}
function jiggle(random) {
  return (random() - 0.5) * 1e-6;
}

function x(d) {
  return d.x + d.vx;
}

function y(d) {
  return d.y + d.vy;
}

export default function(width, height) {
  var nodes,
      random,
      widths,
      heights,
      strength = 1,
      padding = 10,
      iterations = 1;

  if (typeof width !== "function") width = constant(width == null ? 20 : +width);
  if (typeof height !== "function") height = constant(height == null ? 20 : +height);

  function force() {
    let tree

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      nodes.forEach(node => {
        tree.visit((quad, x0, y0, x1, y1) => apply(quad, x0, y0, x1, y1, node))
      })
    }

    function apply(quad, x0, y0, x1, y1, b) {
      var a = quad.data
      let hasUpdated = false;

      if (a) {

        if (a && a !== b && a.index > b.index) {
          let dx = b.x - a.x - a.vx
          let dy = b.y - a.y - a.vy

          const absDx = Math.abs(dx)
          const absDy = Math.abs(dy)

          const xSpacing = padding + (a.width + b.width) / 2
          const ySpacing = padding + (a.height + b.height) / 2

          let width = a.width + b.width
          let height = a.height + b.height

          let l =  dx ** 2 + dy ** 2;
          let lx
          let ly

          if (l < width ** 2 || l < height ** 2) {

            if (dx === 0) {
              dx = jiggle(random)
              l += dx ** 2;
            }
            if (dy === 0) {
              dy = jiggle(random)
              l += dy ** 2;
            }

            lx = (width - (absDx - xSpacing)) / Math.sqrt(l) * strength;
            ly = (height - (absDy - ySpacing)) / Math.sqrt(l) * strength;
            // debugger

            // if (lx > ly && ly > 0) {
            //   lx = 0
            // } else if (ly > lx && lx > 0) {
            //   ly = 0
            // }

            dx *= lx
            dy *= ly
            b.vx += dx * (width = (a.width ** 2) / (b.width ** 2 + a.width ** 2))
            b.vy += dy * (height = (a.height ** 2) / (b.height ** 2 + a.height ** 2))
            a.vx -= dx * (1 - width)
            a.vy -= dy * (1 - height)

            hasUpdated = true;
          }
        }
        return
      }
      return hasUpdated
      // return x0 > b.x + width
      //   || x1 < b.x - width
      //   || y0 > b.y + height
      //   || y1 < b.y - height;
    }
  }

  function prepare(quad) {
    if (quad.data) {
      quad.width = widths[quad.data.index]
      quad.height = heights[quad.data.index]
    };
    for (var i = quad.width = 0; i < 4; ++i) {
      if (quad[i] && quad[i].width > quad.width) {
        quad.width = quad[i].width;
      }
    }
    for (var i = quad.height = 0; i < 4; ++i) {
      if (quad[i] && quad[i].height > quad.height) {
        quad.height = quad[i].height;
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i
    var n = nodes.length
    var node;
    widths = new Array(n);
    heights = new Array(n);
    for (i = 0; i < n; ++i) {
      node = nodes[i]
      widths[node.index] = +width(node, i, nodes)
      heights[node.index] = +height(node, i, nodes)
    }
  }

  force.initialize = function(_nodes) {
    nodes = _nodes;
    random = Math.random;
    initialize();
  };

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.width = function(_) {
    return arguments.length ? (width = typeof _ === "function" ? _ : constant(+_), initialize(), force) : width;
  };

  force.height = function(_) {
    return arguments.length ? (height = typeof _ === "function" ? _ : constant(+_), initialize(), force) : height;
  };

  force.padding = function(_) {
    return arguments.length ? (padding = +_, force) : padding;
  };

  return force;
}