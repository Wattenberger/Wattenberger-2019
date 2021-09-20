
// adapted from https://github.com/jasonwebb/morphogenesis-resources

var numeric = {};

numeric.dim = function dim(x) {
  var y, z;
  if (typeof x === "object") {
    y = x[0];
    if (typeof y === "object") {
      z = y[0];
      if (typeof z === "object") {
        return numeric._dim(x);
      }
      return [x.length, y.length];
    }
    return [x.length];
  }
  return [];
};

numeric._foreach2 = (function _foreach2(x, s, k, f) {
  if (k === s.length - 1) { return f(x); }
  var i, n = s[k], ret = Array(n);
  for (i = n - 1; i >= 0; i--) { ret[i] = _foreach2(x[i], s, k + 1, f); }
  return ret;
});

numeric.cloneV = function (x) {
  var _n = x.length;
  var i, ret = Array(_n);

  for (i = _n - 1; i !== -1; --i) {
    ret[i] = (x[i]);
  }
  return ret;
};

numeric.clone = function (x) {
  if (typeof x !== "object") return (x);
  var V = numeric.cloneV;
  var s = numeric.dim(x);
  return numeric._foreach2(x, s, 0, V);
};

numeric.diag = function diag(d) {
  var i, i1, j, n = d.length, A = Array(n), Ai;
  for (i = n - 1; i >= 0; i--) {
    Ai = Array(n);
    i1 = i + 2;
    for (j = n - 1; j >= i1; j -= 2) {
      Ai[j] = 0;
      Ai[j - 1] = 0;
    }
    if (j > i) { Ai[j] = 0; }
    Ai[i] = d[i];
    for (j = i - 1; j >= 1; j -= 2) {
      Ai[j] = 0;
      Ai[j - 1] = 0;
    }
    if (j === 0) { Ai[0] = 0; }
    A[i] = Ai;
  }
  return A;
};

numeric.rep = function rep(s, v, k) {
  if (typeof k === "undefined") { k = 0; }
  var n = s[k], ret = Array(n), i;
  if (k === s.length - 1) {
    for (i = n - 2; i >= 0; i -= 2) { ret[i + 1] = v; ret[i] = v; }
    if (i === -1) { ret[0] = v; }
    return ret;
  }
  for (i = n - 1; i >= 0; i--) { ret[i] = numeric.rep(s, v, k + 1); }
  return ret;
};

numeric.identity = function (n) { return numeric.diag(numeric.rep([n], 1)); };

numeric.inv = function inv(a) {
  var s = numeric.dim(a), abs = Math.abs, m = s[0], n = s[1];
  var A = numeric.clone(a), Ai, Aj;
  var I = numeric.identity(m), Ii, Ij;
  var i, j, k, x;
  for (j = 0; j < n; ++j) {
    var i0 = -1;
    var v0 = -1;
    for (i = j; i !== m; ++i) { k = abs(A[i][j]); if (k > v0) { i0 = i; v0 = k; } }
    Aj = A[i0]; A[i0] = A[j]; A[j] = Aj;
    Ij = I[i0]; I[i0] = I[j]; I[j] = Ij;
    x = Aj[j];
    for (k = j; k !== n; ++k)    Aj[k] /= x;
    for (k = n - 1; k !== -1; --k) Ij[k] /= x;
    for (i = m - 1; i !== -1; --i) {
      if (i !== j) {
        Ai = A[i];
        Ii = I[i];
        x = Ai[j];
        for (k = j + 1; k !== n; ++k)  Ai[k] -= Aj[k] * x;
        for (k = n - 1; k > 0; --k) { Ii[k] -= Ij[k] * x; --k; Ii[k] -= Ij[k] * x; }
        if (k === 0) Ii[0] -= Ij[0] * x;
      }
    }
  }
  return I;
};

numeric.dotMMsmall = function dotMMsmall(x, y) {
  var i, j, k, p, q, r, ret, foo, bar, woo, i0;
  p = x.length; q = y.length; r = y[0].length;
  ret = Array(p);
  for (i = p - 1; i >= 0; i--) {
    foo = Array(r);
    bar = x[i];
    for (k = r - 1; k >= 0; k--) {
      woo = bar[q - 1] * y[q - 1][k];
      for (j = q - 2; j >= 1; j -= 2) {
        i0 = j - 1;
        woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
      }
      if (j === 0) { woo += bar[0] * y[0][k]; }
      foo[k] = woo;
    }
    ret[i] = foo;
  }
  return ret;
};

numeric.dotMV = function dotMV(x, y) {
  var p = x.length, i;
  var ret = Array(p), dotVV = numeric.dotVV;
  for (i = p - 1; i >= 0; i--) { ret[i] = dotVV(x[i], y); }
  return ret;
};

numeric.dotVV = function dotVV(x, y) {
  var i, n = x.length, i1, ret = x[n - 1] * y[n - 1];
  for (i = n - 2; i >= 1; i -= 2) {
    i1 = i - 1;
    ret += x[i] * y[i] + x[i1] * y[i1];
  }
  if (i === 0) { ret += x[0] * y[0]; }
  return ret;
};

numeric.transpose = function transpose(x) {
  var i, j, m = x.length, n = x[0].length, ret = Array(n), A0, A1, Bj;
  for (j = 0; j < n; j++) ret[j] = Array(m);
  for (i = m - 1; i >= 1; i -= 2) {
    A1 = x[i];
    A0 = x[i - 1];
    for (j = n - 1; j >= 1; --j) {
      Bj = ret[j]; Bj[i] = A1[j]; Bj[i - 1] = A0[j];
      --j;
      Bj = ret[j]; Bj[i] = A1[j]; Bj[i - 1] = A0[j];
    }
    if (j === 0) {
      Bj = ret[0]; Bj[i] = A1[0]; Bj[i - 1] = A0[0];
    }
  }
  if (i === 0) {
    A0 = x[0];
    for (j = n - 1; j >= 1; --j) {
      ret[j][0] = A0[j];
      --j;
      ret[j][0] = A0[j];
    }
    if (j === 0) { ret[0][0] = A0[0]; }
  }
  return ret;
};



function round(num) {
  return Math.round(num * 10000000000) / 10000000000;
}

function getNormalizationCoefficients(srcPts, dstPts, isInverse) {
  if (isInverse) {
    var tmp = dstPts;
    dstPts = srcPts;
    srcPts = tmp;
  }
  var r1 = [srcPts[0], srcPts[1], 1, 0, 0, 0, -1 * dstPts[0] * srcPts[0], -1 * dstPts[0] * srcPts[1]];
  var r2 = [0, 0, 0, srcPts[0], srcPts[1], 1, -1 * dstPts[1] * srcPts[0], -1 * dstPts[1] * srcPts[1]];
  var r3 = [srcPts[2], srcPts[3], 1, 0, 0, 0, -1 * dstPts[2] * srcPts[2], -1 * dstPts[2] * srcPts[3]];
  var r4 = [0, 0, 0, srcPts[2], srcPts[3], 1, -1 * dstPts[3] * srcPts[2], -1 * dstPts[3] * srcPts[3]];
  var r5 = [srcPts[4], srcPts[5], 1, 0, 0, 0, -1 * dstPts[4] * srcPts[4], -1 * dstPts[4] * srcPts[5]];
  var r6 = [0, 0, 0, srcPts[4], srcPts[5], 1, -1 * dstPts[5] * srcPts[4], -1 * dstPts[5] * srcPts[5]];
  var r7 = [srcPts[6], srcPts[7], 1, 0, 0, 0, -1 * dstPts[6] * srcPts[6], -1 * dstPts[6] * srcPts[7]];
  var r8 = [0, 0, 0, srcPts[6], srcPts[7], 1, -1 * dstPts[7] * srcPts[6], -1 * dstPts[7] * srcPts[7]];

  var matA = [r1, r2, r3, r4, r5, r6, r7, r8];
  var matB = dstPts;
  var matC;

  try {
    matC = numeric.inv(numeric.dotMMsmall(numeric.transpose(matA), matA));
  } catch (e) {
    console.log(e);
    return [1, 0, 0, 0, 1, 0, 0, 0];
  }

  var matD = numeric.dotMMsmall(matC, numeric.transpose(matA));
  var matX = numeric.dotMV(matD, matB);
  for (var i = 0; i < matX.length; i++) {
    matX[i] = round(matX[i]);
  }
  matX[8] = 1;

  return matX;
}

function PerspT(srcPts, dstPts) {
  if ((typeof window !== 'undefined' && window === this) || this === undefined) {
    return new PerspT(srcPts, dstPts);
  }

  const coeffs = getNormalizationCoefficients(srcPts, dstPts, false);
  const coeffsInv = getNormalizationCoefficients(srcPts, dstPts, true);

  const transform = function (x, y) {
    var coordinates = [];
    coordinates[0] = (coeffs[0] * x + coeffs[1] * y + coeffs[2]) / (coeffs[6] * x + coeffs[7] * y + 1);
    coordinates[1] = (coeffs[3] * x + coeffs[4] * y + coeffs[5]) / (coeffs[6] * x + coeffs[7] * y + 1);
    return coordinates;
  }

  const transformInverse = function (x, y) {
    var coordinates = [];
    coordinates[0] = (coeffsInv[0] * x + coeffsInv[1] * y + coeffsInv[2]) / (coeffsInv[6] * x + coeffsInv[7] * y + 1);
    coordinates[1] = (coeffsInv[3] * x + coeffsInv[4] * y + coeffsInv[5]) / (coeffsInv[6] * x + coeffsInv[7] * y + 1);
    return coordinates;
  }
  return {
    transform,
    transformInverse
  }
};

export default PerspT;