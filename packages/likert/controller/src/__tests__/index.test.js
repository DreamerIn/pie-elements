import {
  buildDataPoints,
  getAmplitudeAndFreq,
  parabolaFromTwoPoints
} from '@pie-lib/graphing-utils';
import {
  equalPoint,
  equalSegment,
  equalVector,
  equalLine,
  equalRay,
  equalPolygon,
  equalCircle,
  equalSine,
  equalParabola,
  eliminateDuplicates,
  unMapMarks,
  dichotomous,
  partial,
  getScore,
  outcome,
  createCorrectResponseSession,
  model
} from '../index';

describe('controller', () => {
});

describe('equalPoint', () => {
  const assert = (pointA, pointB, expected) => {
    it(`${pointA.x},${pointA.y} & ${pointB.x},${pointB.y} ${
      expected ? 'are' : 'are not'
      } equal`, () => {
      const result = equalPoint(pointA, pointB);

      expect(result).toEqual(expected);
    });
  };

  assert({ x: 0, y: 0 }, { x: 0, y: 0 }, true);
  assert({ x: 0, y: 0 }, { x: 1, y: 0 }, false);
});

describe('equalSegment', () => {
  const assert = (s1, s2, expected) => {
    it(`[(${s1.from.x},${s1.from.y}), (${s1.to.x},${s1.to.y})], [(${
      s2.from.x
      },${s2.from.y}), (${s2.to.x},${s2.to.y})] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
      const result = equalSegment(s1, s2);

      expect(result).toEqual(expected);
    });
  };

  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 1, y: 0 }, to: { x: 0, y: 0 } },
    true
  );
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    true
  );
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 10, y: 0 }, to: { x: 1, y: 0 } },
    false
  );
});

describe('equalVector', () => {
  const assert = (v1, v2, expected) => {
    it(`[(${v1.from.x},${v1.from.y}), (${v1.to.x},${v1.to.y})], [(${
      v2.from.x
      },${v2.from.y}), (${v2.to.x},${v2.to.y})] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
      const result = equalVector(v1, v2);

      expect(result).toEqual(expected);
    });
  };

  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 1, y: 0 }, to: { x: 0, y: 0 } },
    false
  );
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    true
  );
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 10, y: 0 }, to: { x: 1, y: 0 } },
    false
  );
});

describe('equalLine', () => {
  const assert = (l1, l2, expected) => {
    it(`[(${l1.from.x},${l1.from.y}), (${l1.to.x},${l1.to.y})], [(${
      l2.from.x
      },${l2.from.y}), (${l2.to.x},${l2.to.y})] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
      const result = equalLine(l1, l2);

      expect(result).toEqual(expected);
    });
  };

  // Y axis 0
  // A(0, 0), B(1, 0); AB & BA
  // same segment, 2 points in common
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 1, y: 0 }, to: { x: 0, y: 0 } },
    true
  );
  // A(0, 0), B(1, 0), C(3, 0); AB & CB
  // same line, only one point in common
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 3, y: 0 }, to: { x: 1, y: 0 } },
    true
  );
  // A(0, 0), B(1, 0), C(30, 0), D(10, 0); AB & CD
  // same line, no point in common
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 30, y: 0 }, to: { x: 10, y: 0 } },
    true
  );
  // parallel lines on Y axis
  // A(-4, 0), B(1, 0), C(-1, -1), D(10, -1)
  assert(
    { from: { x: -4, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: -1, y: -1 }, to: { x: 10, y: -1 } },
    false
  );

  // X axis 0
  // A(0, 0), B(0, 1); AB & BA
  // same segment, 2 points in common
  assert(
    { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } },
    { from: { x: 0, y: 1 }, to: { x: 0, y: 0 } },
    true
  );
  // A(0, 0), B(0, 1), C(0, -10); AB & BC
  // same line, only one point in common
  assert(
    { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } },
    { from: { x: 0, y: 1 }, to: { x: 0, y: -10 } },
    true
  );
  // A(0, 0), B(0, 1), C(0, -20), D(0, -10); AB & CD
  // same line, no point in common
  assert(
    { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } },
    { from: { x: 0, y: -20 }, to: { x: 0, y: -10 } },
    true
  );
  // parallel lines on X axis
  // A(-1, 2), B(-1, -70), C(10, -10), D(10, 134)
  assert(
    { from: { x: -1, y: 2 }, to: { x: -1, y: 70 } },
    { from: { x: 10, y: -10 }, to: { x: 10, y: 134 } },
    false
  );


  // A(-10, -10), B(-6, 9), C(10, -10), D(10, 134)
  assert(
    { from: { x: -10, y: -10 }, to: { x: -6, y: 9 } },
    { from: { x: 10, y: -10 }, to: { x: 10, y: 134 } },
    false
  );

  // A(-10, -10), B(-6, 9), C(10, 10), D(6, -9)
  assert(
    { from: { x: -10, y: -10 }, to: { x: -6, y: 9 } },
    { from: { x: 10, y: 10 }, to: { x: 6, y: -9 } },
    false
  );

  // A(-10, -10), B(-6, 9), C(-6, 9), D(-2, 28)
  assert(
    { from: { x: -10, y: -10 }, to: { x: -6, y: 9 } },
    { from: { x: -6, y: 9 }, to: { x: -2, y: 28 } },
    true
  );

  // A(-10, -10), B(-6, 9), C(-4, 18.5), D(-2, 28)
  assert(
    { from: { x: -10, y: -10 }, to: { x: -6, y: 9 } },
    { from: { x: -4, y: 18.5 }, to: { x: -2, y: 28 } },
    true
  );

  // A(-10, -10), B(-6, 9), C(-4, 18.5), D(-2, 28)
  assert(
    { from: { x: -10, y: -10 }, to: { x: -6, y: 9 } },
    { from: { x: -2, y: 28 }, to: { x: -4, y: 18.5 } },
    true
  );


  // A(0, 0), B(1, 0), C(12, 0), D(12, 1); AB & AC
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 0, y: 0 }, to: { x: 12, y: 0 } },
    true
  );

  // A(0, 0), B(1, 0), C(12, 0), D(12, 1); AB & AD
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
    false
  );

  // A(0, 0), B(1, 0), C(12, 0), D(12, 1); AC & AD
  assert(
    { from: { x: 0, y: 0 }, to: { x: 12, y: 0 } },
    { from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
    false
  );

  // A(-10, -10), B(0, 0), C(20, 20), D(11, 11)
  assert(
    { from: { x: -10, y: -10 }, to: { x: 0, y: 0 } },
    { from: { x: 20, y: 20 }, to: { x: 11, y: 11 } },
    true
  );

  // A(-10, -10), B(0, 0), C(-1, -1), D(22, 22)
  assert(
    { from: { x: -10, y: -10 }, to: { x: 0, y: 0 } },
    { from: { x: -1, y: -1 }, to: { x: 22, y: 22 } },
    true
  );

  // A(-10, -10), B(0, 0), C(-1, -1), D(22, 22)
  assert(
    { from: { x: -10, y: -10 }, to: { x: 0, y: 0 } },
    { from: { x: -1, y: 0 }, to: { x: 22, y: 23 } },
    false
  );

  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 10, y: 10 }, to: { x: 1, y: 0 } },
    false
  );
});

describe('equalRay', () => {
  const assert = (r1, r2, expected) => {
    it(`[(${r1.from.x},${r1.from.y}), (${r1.to.x},${r1.to.y})], [(${
      r2.from.x
      },${r2.from.y}), (${r2.to.x},${r2.to.y})] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
      const result = equalRay(r1, r2);

      expect(result).toEqual(expected);
    });
  };

  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 0, y: 0 }, to: { x: 10, y: 0 } },
    true
  );
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 3, y: 0 }, to: { x: 1, y: 0 } },
    false
  );
  assert(
    { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
    { from: { x: 10, y: 10 }, to: { x: 1, y: 0 } },
    false
  );
});

describe('equalPolygon', () => {
  const assert = (pointsA, pointsB, expected) => {
    it(`[${pointsA.forEach(p => `(${p.x}, ${p.y})`)}], [${pointsB.forEach(
      p => `(${p.x}, ${p.y})`
    )}] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalPolygon(pointsA, pointsB);

      expect(result).toEqual(expected);
    });
  };

  assert(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ],
    [
      { x: 1, y: 1 },
      { x: 0, y: 0 },
      { x: 2, y: 2 }
    ],
    true
  );

  assert(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ],
    [
      { x: 1, y: 1 },
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 0 },
      { x: 2, y: 2 }
    ],
    true
  );

  assert(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ],
    [
      { x: 1, y: 1 },
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 3, y: 0 },
      { x: 2, y: 2 }
    ],
    false
  );
});

describe('equalCircle', () => {
  const assert = (c1, c2, expected) => {
    it(`[(${c1.root.x},${c1.root.y}), (${c1.edge.x},${c1.edge.y})], [(${
      c2.root.x
      },${c2.root.y}), (${c2.edge.x},${c2.edge.y})] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
      const result = equalCircle(c1, c2);

      expect(result).toEqual(expected);
    });
  };

  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
    { root: { x: 0, y: 0 }, edge: { x: -1, y: 0 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
    { root: { x: 0, y: 0 }, edge: { x: 0, y: -1 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
    { root: { x: 0, y: 0 }, edge: { x: 0, y: 1 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    false
  );
});

describe('equalSine', () => {
  const assert = (sine1, sine2, expected) => {
    it(`[(${sine1.root.x},${sine1.root.y}), (${sine1.edge.x},${
      sine1.edge.y
      })], [(${sine2.root.x},${sine2.root.y}), (${sine2.edge.x},${
      sine2.edge.y
      })] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalSine(sine1, sine2);

      expect(result).toEqual(expected);
    });
  };

  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 1, y: 0 }, edge: { x: 1, y: 1 } },
    false
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 20, y: 0 }, edge: { x: 21, y: 1 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 21, y: 0 }, edge: { x: 21, y: 1 } },
    false
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 0, y: 0 } },
    { root: { x: 21, y: 0 }, edge: { x: 21, y: 1 } },
    false
  );
  assert(
    { root: { x: 0, y: 1 }, edge: { x: 1, y: 1 } },
    { root: { x: 24, y: 1 }, edge: { x: 25, y: 1 } },
    true
  );

  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: -0.6, y: 0 }, edge: { x: -0.9, y: -1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: -2.4, y: 0 }, edge: { x: -2.7, y: 1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: -2.4, y: 0 }, edge: { x: -2.1, y: -1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 0, y: 0 }, edge: { x: -0.3, y: 1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 3, y: 0 }, edge: { x: 3.3, y: 1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 3, y: 0 }, edge: { x: 2.7, y: -1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 0.9, y: 1.2 }, edge: { x: 0.6, y: 0 } },
    false
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 0.6, y: 0 }, edge: { x: 0.6, y: 0 } },
    false
  );

  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: 2, y: 0 }, edge: { x: 3, y: -2 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: -10, y: 0 }, edge: { x: -11, y: 2 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: -10, y: 0 }, edge: { x: -9, y: 2 } },
    false
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: -10, y: 0 }, edge: { x: -9, y: -2 } },
    true
  );
});

describe('equalParabola', () => {
  const assert = (p1, p2, expected) => {
    it(`[(${p1.root.x},${p1.root.y}), (${p1.edge.x},${p1.edge.y})], [(${
      p2.root.x
      },${p2.root.y}), (${p2.edge.x},${p2.edge.y})] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
      const result = equalParabola(p1, p2);

      expect(result).toEqual(expected);
    });
  };

  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
    false
  );

  // a * x^2 + b * x + c

  // a = 8, b = 4, c = 2
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: -0.75, y: 3.5 } },
    true
  );
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: -1, y: 6 } },
    true
  );
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: 1, y: 14 } },
    true
  );
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: 1.25, y: -19.5 } },
    false
  );

  // a = -8, b = -4, c = -2
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: -0.75, y: -3.5 } },
    true
  );
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: -1, y: -6 } },
    true
  );
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: 1, y: -14 } },
    true
  );
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: 1.25, y: 19.5 } },
    false
  );

  // a = 10, b = 0, c = -2
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: -0.5, y: 0.5 } },
    true
  );
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: -1, y: 8 } },
    true
  );
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: 1, y: 8 } },
    true
  );
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: 3, y: 89 } },
    false
  );

  // a = 10, b = -10, c = 0
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: 1, y: 0 } },
    true
  );
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: -1, y: 20 } },
    true
  );
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: 1.25, y: 3.125 } },
    true
  );
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: 3, y: 0 } },
    false
  );

  // a = -4, b = 4, c = 0
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: 1, y: 0 } },
    true
  );
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: -0.5, y: -3 } },
    true
  );
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: 1.5, y: -3 } },
    true
  );
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: 3, y: 0 } },
    false
  );

  // a = -6, b = 4.5, c = 13.9
  assert(
    { root: { x: -3 / 8, y: 27 / 32 }, edge: { x: -0.75, y: 0 } },
    { root: { x: -3 / 8, y: 27 / 32 }, edge: { x: 0, y: 0 } },
    true
  );

  // a = -1, b = -9, c = 3
  assert(
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: -4.5 - (Math.sqrt(93) / 2), y: 0 } },
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: (Math.sqrt(93) / 2) - 4.5, y: 0 } },
    true
  );

  assert(
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: -4.5 - (Math.sqrt(93) / 2), y: 0 } },
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: -67.9, y: -3996.31 } },
    true
  );

  assert(
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: -4.5 - (Math.sqrt(93) / 2), y: 0 } },
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: -67.9, y: -3996.3000009 } },
    false
  );
});

describe('eliminateDuplicates', () => {
  const assert = (marks, expected, type) => {
    it(type, () => {
      const result = eliminateDuplicates(marks, expected);

      expect(result).toEqual(expected);
    });
  };

  assert(
    [
      { type: 'point', x: 0, y: 0 },
      { type: 'point', x: 0, y: 0 }
    ],
    {
      point: [{ type: 'point', x: 0, y: 0 }],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'point'
  );

  assert(
    [
      { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      {
        type: 'segment',
        to: { x: 0, y: 0 },
        from: { x: 1, y: 1 }
      }
    ],
    {
      point: [],
      segment: [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'segment'
  );

  assert(
    [
      { type: 'vector', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      { type: 'vector', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      { type: 'vector', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [
        { type: 'vector', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
        {
          type: 'vector',
          from: { x: 0, y: 0 },
          to: { x: 12, y: 1 }
        }
      ],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'vector'
  );

  assert(
    [
      // A = B, D = E = F, G = H => B, E, F, H are eliminated
      // A
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
      // B
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 0 } },
      // C
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
      // D
      { type: 'line', from: { x: 0, y: 1 }, to: { x: 12, y: 1 } },
      // E
      { type: 'line', from: { x: 20, y: 1 }, to: { x: 19, y: 1 } },
      // F
      { type: 'line', from: { x: -10, y: 1 }, to: { x: -12, y: 1 } },
      // G
      { type: 'line', from: { x: 0, y: -1 }, to: { x: 0, y: 1 } },
      // H
      { type: 'line', from: { x: 0, y: 10 }, to: { x: 0, y: 9 } },
      // I
      { type: 'line', from: { x: -1, y: 10 }, to: { x: -1, y: 9 } },
      // J
      { type: 'line', from: { x: -2, y: 10 }, to: { x: -2, y: 9 } },
    ],
    {
      point: [],
      segment: [],
      line: [
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
        { type: 'line', from: { x: 0, y: 1 }, to: { x: 12, y: 1 } },
        { type: 'line', from: { x: 0, y: -1 }, to: { x: 0, y: 1 } },
        { type: 'line', from: { x: -1, y: 10 }, to: { x: -1, y: 9 } },
        { type: 'line', from: { x: -2, y: 10 }, to: { x: -2, y: 9 } },
      ],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'line'
  );

  assert(
    [
      { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } },
      { type: 'ray', from: { x: 0, y: 0 }, to: { x: 12, y: 0 } },
      { type: 'ray', from: { x: 0, y: 0 }, to: { x: 2, y: 0 } }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [
        { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } },
        {
          type: 'ray',
          from: { x: 0, y: 0 },
          to: { x: 12, y: 0 }
        }
      ],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'ray'
  );

  assert(
    [
      {
        type: 'polygon',
        points: [
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 2 }
        ]
      },
      {
        type: 'polygon',
        points: [
          { x: 1, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 2 }
        ]
      },
      {
        type: 'polygon',
        points: [
          { x: 1, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 0 }
        ]
      }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [
        {
          type: 'polygon',
          points: [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 }
          ]
        },
        {
          type: 'polygon',
          points: [
            { x: 1, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 0 }
          ]
        }
      ],
      circle: [],
      sine: [],
      parabola: []
    },
    'polygon'
  );

  assert(
    [
      { type: 'circle', root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
      { type: 'circle', root: { x: 0, y: 0 }, edge: { x: 0, y: 1 } },
      { type: 'circle', root: { x: 0, y: 0 }, edge: { x: -1, y: 0 } }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [{ type: 'circle', root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }],
      sine: [],
      parabola: []
    },
    'circle'
  );

  assert(
    [
      { type: 'sine', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
      { type: 'sine', root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
      { type: 'sine', root: { x: 2, y: 0 }, edge: { x: 3, y: 1 } },
      { type: 'sine', root: { x: 1, y: 0 }, edge: { x: 1, y: 1 } },
      { type: 'sine', root: { x: 20, y: 0 }, edge: { x: 21, y: 1 } },
      { type: 'sine', root: { x: 21, y: 0 }, edge: { x: 21, y: 1 } },
      { type: 'sine', root: { x: 0, y: 0 }, edge: { x: 0, y: 0 } },
      { type: 'sine', root: { x: 0, y: 1 }, edge: { x: 1, y: 1 } },
      { type: 'sine', root: { x: 24, y: 1 }, edge: { x: 25, y: 1 } },

      { type: 'sine', root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
      { type: 'sine', root: { x: -0.6, y: 0 }, edge: { x: -0.9, y: -1.2 } },
      { type: 'sine', root: { x: -2.4, y: 0 }, edge: { x: -2.7, y: 1.2 } },
      { type: 'sine', root: { x: -2.4, y: 0 }, edge: { x: -2.1, y: -1.2 } },
      { type: 'sine', root: { x: 0, y: 0 }, edge: { x: -0.3, y: 1.2 } },
      { type: 'sine', root: { x: 3, y: 0 }, edge: { x: 3.3, y: 1.2 } },
      { type: 'sine', root: { x: 3, y: 0 }, edge: { x: 2.7, y: -1.2 } },
      { type: 'sine', root: { x: 0.9, y: 1.2 }, edge: { x: 0.6, y: 0 } },
      { type: 'sine', root: { x: 0.6, y: 0 }, edge: { x: 0.6, y: 0 } },

      { type: 'sine', root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
      { type: 'sine', root: { x: 2, y: 0 }, edge: { x: 3, y: -2 } },
      { type: 'sine', root: { x: -10, y: 0 }, edge: { x: -11, y: 2 } },
      { type: 'sine', root: { x: -10, y: 0 }, edge: { x: -9, y: -2 } },
      { type: 'sine', root: { x: -10, y: 0 }, edge: { x: -9, y: 2 } },
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [
        { type: 'sine', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
        { type: 'sine', root: { x: 2, y: 0 }, edge: { x: 3, y: 1 } },
        { type: 'sine', root: { x: 1, y: 0 }, edge: { x: 1, y: 1 } },
        { type: 'sine', root: { x: 21, y: 0 }, edge: { x: 21, y: 1 } },
        { type: 'sine', root: { x: 0, y: 0 }, edge: { x: 0, y: 0 } },
        { type: 'sine', root: { x: 0, y: 1 }, edge: { x: 1, y: 1 } },
        { type: 'sine', root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
        { type: 'sine', root: { x: 0.9, y: 1.2 }, edge: { x: 0.6, y: 0 } },
        { type: 'sine', root: { x: 0.6, y: 0 }, edge: { x: 0.6, y: 0 } },
        { type: 'sine', root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
        { type: 'sine', root: { x: -10, y: 0 }, edge: { x: -9, y: 2 } }
      ],
      parabola: []
    },
    'sine'
  );

  // TODO
  assert(
    [
      { type: 'parabola', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
      { type: 'parabola', root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
      // a = -1, b = 4, c = 3
      { type: 'parabola', root: { x: 2, y: 7 }, edge: { x: 2 + Math.sqrt(7), y: 0 } },
      { type: 'parabola', root: { x: 2, y: 7 }, edge: { x: 2 - Math.sqrt(7), y: 0 } },
      { type: 'parabola', root: { x: 2, y: 7 }, edge: { x: 2 - Math.sqrt(57), y: -50 } },
      { type: 'parabola', root: { x: 2, y: 7 }, edge: { x: 2 - Math.sqrt(57), y: -50 } },
      // a = 5, b = 5, c = 0
      { type: 'parabola', root: { x: -0.5, y: -1.25 }, edge: { x: 10, y: 550 } },
      { type: 'parabola', root: { x: -0.5, y: -1.25 }, edge: { x: -1, y: 0 } },
      { type: 'parabola', root: { x: -0.5, y: -1.25 }, edge: { x: 0, y: 0 } },
      { type: 'parabola', root: { x: -0.5, y: -1.25 }, edge: { x: -2, y: 10 } },
      { type: 'parabola', root: { x: -0.5, y: -1.25 }, edge: { x: 1, y: 10 } },
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: [
        { type: 'parabola', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
        { type: 'parabola', root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
        { type: 'parabola', root: { x: 2, y: 7 }, edge: { x: 2 + Math.sqrt(7), y: 0 } },
        { type: 'parabola', root: { x: -0.5, y: -1.25 }, edge: { x: 10, y: 550 } },
      ]
    },
    'parabola'
  );

  const assertInvalidMarks = marks => {
    it(`returns proper result if marks are ${JSON.stringify(marks)}`, () => {
      const result = eliminateDuplicates(undefined);

      expect(result).toEqual({
        point: [],
        segment: [],
        line: [],
        ray: [],
        vector: [],
        polygon: [],
        circle: [],
        sine: [],
        parabola: []
      });
    });
  };

  assertInvalidMarks(undefined);
  assertInvalidMarks(null);
  assertInvalidMarks({});

  it('removes the marks that don\'t have a valid type', () => {
    const result = eliminateDuplicates([
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
      { type: 'typeThatDoesNotExist' }
    ]);

    expect(result).toEqual({
      point: [],
      segment: [],
      line: [
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
        {
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 12, y: 1 }
        }
      ],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    });
  });

  it('removes the marks that don\'t have a type', () => {
    const result = eliminateDuplicates([
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
      { something: 'Something' }
    ]);

    expect(result).toEqual({
      point: [],
      segment: [],
      line: [
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } }
      ],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    });
  });

  // exceptions
  const assertMarks = mark => {
    it(`removes the ${JSON.stringify(mark)} marks`, () => {
      const result = eliminateDuplicates([
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
        mark,
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } }
      ]);

      expect(result).toEqual({
        point: [],
        segment: [],
        line: [
          { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
          {
            type: 'line',
            from: { x: 0, y: 0 },
            to: { x: 12, y: 1 }
          }
        ],
        ray: [],
        vector: [],
        polygon: [],
        circle: [],
        sine: [],
        parabola: []
      });
    });
  };

  assertMarks(undefined);
  assertMarks(null);
  assertMarks({});
});

describe('unMapMarks', () => {
  const assert = (marks, expected) => {
    it('unmapps object', () => {
      const result = unMapMarks(marks);

      expect(result).toEqual(expected);
    });
  };

  assert(
    {
      point: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' }
      ],
      segment: [{ type: 'segment', from: { x: 1, y: 1 }, to: { x: 1, y: 1 } }]
    },
    [
      { x: 1, y: 1, type: 'point' },
      { x: 2, y: 2, type: 'point' },
      {
        type: 'segment',
        from: { x: 1, y: 1 },
        to: { x: 1, y: 1 }
      }
    ]
  );
  assert(
    {
      point: [{ x: 1, y: 1, type: 'point' }],
      segment: []
    },
    [{ x: 1, y: 1, type: 'point' }]
  );
  assert(
    {
      point: [{ x: 1, y: 1, type: 'point' }],
      segment: [{ type: 'segment', from: { x: 1, y: 1 }, to: { x: 1, y: 1 } }]
    },
    [
      { x: 1, y: 1, type: 'point' },
      { type: 'segment', from: { x: 1, y: 1 }, to: { x: 1, y: 1 } }
    ]
  );

  const assertInvalidMarks = marks => {
    it(`return empty array if marks are ${JSON.stringify(marks)}`, () => {
      const result = unMapMarks(undefined);

      expect(result).toEqual([]);
    });
  };

  assertInvalidMarks(undefined);
  assertInvalidMarks(null);
  assertInvalidMarks({});
});

describe('dichotomous', () => {
  const assert = (answers, correctedMarks, expected) => {
    it('returns correct values', () => {
      const result = dichotomous(answers, correctedMarks);

      expect(result).toEqual(expected);
    });
  };

  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    }
  };

  assert(
    answers,
    {
      a1: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          {
            x: 3,
            y: 3,
            correctness: 'incorrect'
          }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        {
          from: {
            x: 1,
            y: 1
          },
          to: { x: 2, y: 2 },
          correctness: 'correct'
        }
      ],
      score: 1
    }
  );
  assert(
    answers,
    {
      a1: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      },
      a2: {
        point: [],
        segment: []
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { x: 3, y: 3, correctness: 'incorrect' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
      ],
      score: 0
    }
  );
  assert(
    answers,
    {
      a1: {
        point: [],
        segment: []
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      }
    },
    {
      correctMarks: [],
      score: 0
    }
  );

  const assertInvalidAnswers = answers => {
    it(`${JSON.stringify(answers)} answers`, () => {
      const result = dichotomous(answers, {
        correctAnswer: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }
          ],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        },
        alternate1: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }
          ],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 2, y: 20 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        }
      });

      expect(result).toEqual({
        correctMarks: [
          { type: 'point', x: 0, y: 0 },
          { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
          { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
        ],
        score: 0
      });
    });
  };

  assertInvalidAnswers(undefined);
  assertInvalidAnswers(null);
  assertInvalidAnswers({});

  const assertInvalidMarksWithCorrectnessValues = marks => {
    it(`${JSON.stringify(marks)} correctedMarks`, () => {
      const result = dichotomous(
        {
          correctAnswer: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Correct Answer'
          },
          alternateAnswer1: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Alternate Answer 1'
          }
        },
        marks
      );

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertInvalidMarksWithCorrectnessValues(undefined);
  assertInvalidMarksWithCorrectnessValues(null);
  assertInvalidMarksWithCorrectnessValues({});
});

describe('partial', () => {
  const assert = (answers, correctedMarks, expected) => {
    it('returns correct values', () => {
      const result = partial(answers, correctedMarks);

      expect(result).toEqual(expected);
    });
  };

  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    }
  };

  assert(
    answers,
    {
      a1: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
      ],
      score: 1
    }
  );

  assert(
    answers,
    {
      a1: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'correct' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { x: 3, y: 3, correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
      ],
      score: 1
    }
  );

  assert(
    answers,
    {
      a1: {
        point: [
          { x: 0, y: 0, correctness: 'incorrect' },
          { x: 4, y: 4, correctness: 'incorrect' },
          { x: 3, y: 3, correctness: 'incorrect' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 4, y: 4, correctness: 'incorrect' }
        ],
        segment: [
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
        ]
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { x: 4, y: 4, correctness: 'incorrect' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
      ],
      score: 0.75
    }
  );

  const assertInvalidAnswers = answers => {
    it(`${JSON.stringify(answers)} answers`, () => {
      const result = partial(answers, {
        correctAnswer: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }
          ],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        },
        alternate1: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }
          ],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 2, y: 20 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        }
      });

      expect(result).toEqual({
        correctMarks: [
          { type: 'point', x: 0, y: 0 },
          { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
          { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
        ],
        score: 0
      });
    });
  };

  assertInvalidAnswers(undefined);
  assertInvalidAnswers(null);
  assertInvalidAnswers({});

  const assertInvalidMarksWithCorrectnessValues = marks => {
    it(`${JSON.stringify(marks)} correctedMarks`, () => {
      const result = partial(
        {
          correctAnswer: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Correct Answer'
          },
          alternateAnswer1: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Alternate Answer 1'
          }
        },
        marks
      );

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertInvalidMarksWithCorrectnessValues(undefined);
  assertInvalidMarksWithCorrectnessValues(null);
  assertInvalidMarksWithCorrectnessValues({});

  it('correctedMarks has invalid format', () => {
    const result = partial(
      {
        correctAnswer: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Correct Answer'
        },
        alternateAnswer1: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Alternate Answer 1'
        }
      },
      {
        correctAnswer: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }
          ],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        }
      }
    );

    expect(result).toEqual({
      correctMarks: [
        { type: 'point', x: 0, y: 0 },
        { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
        { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
      ],
      score: 1
    });
  });

  const assertMarksSetInvalidFormat = set => {
    it(`correctedMarks correctAnswer has invalid format: ${JSON.stringify(
      set
    )}`, () => {
      const result = partial(
        {
          correctAnswer: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Correct Answer'
          },
          alternateAnswer1: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Alternate Answer 1'
          }
        },
        {
          correctAnswer: set
        }
      );

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertMarksSetInvalidFormat(undefined);
  assertMarksSetInvalidFormat(null);
  assertMarksSetInvalidFormat({});

  const assertMarksSetPropertyInvalidFormat = set => {
    it(`correctedMarks correctAnswer property has invalid format: ${JSON.stringify(
      set
    )}`, () => {
      const result = partial(
        {
          correctAnswer: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Correct Answer'
          },
          alternateAnswer1: {
            marks: [
              { type: 'point', x: 0, y: 0 },
              { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
              { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
            name: 'Alternate Answer 1'
          }
        },
        {
          correctAnswer: {
            point: set
          }
        }
      );

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertMarksSetPropertyInvalidFormat(undefined);
  assertMarksSetPropertyInvalidFormat(null);
  assertMarksSetPropertyInvalidFormat({});
});

describe('getScore partialScoring test', () => {
  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    }
  };
  const question = { answers };
  const assert = (message, extra, session, env, expected) => {
    it(message, () => {
      const result = getScore({ ...question, ...extra }, session, env);

      expect(result).toEqual(expect.objectContaining(expected));
    });
  };

  assert(
    'element.partialScoring = true',
    { ...question, scoringType: 'partial scoring' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    { mode: 'evaluate' },
    { score: 0.67 }
  );

  assert(
    'element.partialScoring = false',
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    { mode: 'evaluate' },
    { score: 0 }
  );

  assert(
    'element.partialScoring = false, env.partialScoring = true',
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    { mode: 'evaluate', partialScoring: true },
    { score: 0 }
  );

  assert(
    'element.partialScoring = true, env.partialScoring = false',
    { ...question, scoringType: 'partial scoring' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    { mode: 'evaluate', partialScoring: false },
    { score: 0 }
  );
});

describe('getScore', () => {
  const assert = (question, session, expected) => {
    it('returns correct values', () => {
      const result = getScore(question, session);

      expect(result).toEqual(expected);
    });
  };
  const assertSessionNotSet = (question, session) => {
    it(`returns score: 0 if session is ${JSON.stringify(session)}`, () => {
      const result = getScore(question, session);

      expect(result.score).toEqual(0);
    });
  };

  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    }
  };
  const question = { answers };

  assertSessionNotSet(question, undefined);
  assertSessionNotSet(question, null);
  assertSessionNotSet(question, {});

  assert(
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        {
          from: { x: 1, y: 1 },
          to: { x: 2, y: 2 },
          type: 'segment',
          correctness: 'correct'
        }
      ],
      score: 1
    }
  );
  assert(
    { ...question, scoringType: 'partial scoring' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        {
          from: { x: 1, y: 1 },
          to: { x: 2, y: 2 },
          type: 'segment',
          correctness: 'correct'
        }
      ],
      score: 1
    }
  );

  assert(
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        { x: 3, y: 3, type: 'point', correctness: 'correct' },
        {
          from: { x: 1, y: 1 },
          to: { x: 2, y: 2 },
          type: 'segment',
          correctness: 'correct'
        }
      ],
      score: 1
    }
  );
  assert(
    { ...question, scoringType: 'partial scoring' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        { x: 3, y: 3, type: 'point', correctness: 'correct' },
        {
          from: { x: 1, y: 1 },
          to: { x: 2, y: 2 },
          type: 'segment',
          correctness: 'correct'
        }
      ],
      score: 1
    }
  );

  assert(
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 4, y: 4, type: 'point', correctness: 'incorrect' },
        {
          from: { x: 1, y: 1 },
          to: { x: 2, y: 2 },
          type: 'segment',
          correctness: 'correct'
        }
      ],
      score: 0
    }
  );
  assert(
    { ...question, scoringType: 'partial scoring' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 4, y: 4, type: 'point', correctness: 'incorrect' },
        {
          from: { x: 1, y: 1 },
          to: { x: 2, y: 2 },
          type: 'segment',
          correctness: 'correct'
        }
      ],
      score: 0.67
    }
  );

  const assertInvalidQuestionAnswers = answers => {
    it(`question.answers = ${JSON.stringify(answers)}`, () => {
      const result = getScore({ answers }, {});

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertInvalidQuestionAnswers(undefined);
  assertInvalidQuestionAnswers(null);
  assertInvalidQuestionAnswers({});

  const assertInvalidQuestion = question => {
    it(`question = ${JSON.stringify(question)}`, () => {
      const result = getScore(question, {});

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertInvalidQuestion(undefined);
  assertInvalidQuestion(null);
  assertInvalidQuestion({});

  const assertInvalidFormatQuestionAnswers = answers => {
    it(`question.answers = ${JSON.stringify(answers)}`, () => {
      const result = getScore(
        { ...question, answers, scoringType: 'dichotomous' },
        {}
      );

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertInvalidFormatQuestionAnswers({
    correctAnswer: undefined
  });
});

describe('outcome', () => {
  // if model.scoringType = 'all or nothing'
  //    if env.partialScoring = false                                       => dichotomous
  //    else env.partialScoring = true || env.partialScoring = undefined    => dichotomous
  // else model.scoringType = 'partial scoring' || model.scoringType = undefined
  //    if env.partialScoring = false                                       => dichotomous
  //    else env.partialScoring = true || model.partialScoring = undefined  => partial-credit scoring

  it.each`
      mode          |       partialScoring        |   scoringType          |       expected
      ${'evaluate'} |       ${false}              |  ${'all or nothing'}   |       ${0}
      ${'evaluate'} |       ${true}               |  ${'all or nothing'}   |       ${0}
      ${'evaluate'} |       ${undefined}          |  ${'all or nothing'}   |       ${0}
      ${'evaluate'} |       ${false}              |  ${'partial scoring'}  |       ${0}
      ${'evaluate'} |       ${true}               |  ${'partial scoring'}  |       ${0.67}
      ${'evaluate'} |       ${undefined}          |  ${'partial scoring'}  |       ${0.67}
      ${'evaluate'} |       ${false}              |  ${undefined}          |       ${0}
      ${'evaluate'} |       ${true}               |  ${undefined}          |       ${0.67}
      ${'evaluate'} |       ${undefined}          |  ${undefined}          |       ${0.67}
      ${'gather'}   |       ${false}              |  ${'partial scoring'}  |       ${0}
      ${'gather'}   |       ${true}               |  ${'partial scoring'}  |       ${0}
      ${'gather'}   |       ${undefined}          |  ${'partial scoring'}  |       ${0}
    `('env.mode $mode, env.partialScoring $partialScoring, model.scoringType $scoringType => $expected', async ({ mode, partialScoring, scoringType, expected }) => {
    const env = { mode, partialScoring };
    const answers = {
      a1: {
        marks: [
          { x: 1, y: 1, type: 'point' },
          { x: 2, y: 2, type: 'point' },
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
        ]
      },
      a2: {
        marks: [
          { x: 1, y: 1, type: 'point' },
          { x: 2, y: 2, type: 'point' },
          { x: 3, y: 3, type: 'point' },
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
        ]
      }
    };
    const question = { answers, scoringType };
    const session = {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    };

    const mod = await model({
      ...question,
      scoringType
    }, session, env);

    const result = await outcome(mod, session, env);

    expect(result.score).toEqual(expected);
  });

  it.each`
      session
      ${undefined}
      ${null}
      ${{}}
    `('returns score: 0 and empty: true if session is $session', async ({ session, expected }) => {
    const o = await outcome({}, session, { mode: 'evaluate ' });

    expect(o).toEqual({ score: 0, empty: true });
  });

  it('Lines are correctly scored (ch3729)', async () => {
    const m = {
      element: "pie-element-likert",
      range: {
        labelStep: 50,
        step: 10,
        min: -220,
        axisLabel: "f(n)",
        max: 220
      },
      rationale: 'Rationale',
      prompt: 'Prompt',
      domain: {
        max: 220,
        labelStep: 50,
        step: 10,
        min: -220,
        axisLabel: "n"
      },
      id: "4028e4a24c574edc014c900663fb529d",
      graph: { height: 500, width: 500 },
      answers: {
        correctAnswer: {
          marks: [
            { from: { y: 60, x: 30 }, type: "line", to: { x: 110, y: 60 } },
            { type: "line", to: { x: 0, y: 160 }, from: { y: 190, x: 0 } }
          ]
        }
      },
      toolbarTools: ["line"]
    };
    const session = {
      answer: [
        { from: { x: -1, y: 60 }, to: { x: 1, y: 60 }, type: 'line' },
        { from: { x: 0, y: 50 }, to: { x: 0, y: 100 }, type: 'line' },
      ]
    };

    const mod = await model(m, session, {});
    const result = await outcome(mod, session, {});

    expect(result.score).toEqual(1);
  });

  it('Sines are correctly scored (ch4146)', async () => {
    const m = {
      rationale: "Rationale",
      prompt: "Prompt",
      domain: {
        min: -7,
        axisLabel: "<i>x</i>",
        max: 7,
        labelStep: 1,
        step: 0.5
      },
      id: "4028e4a24b9010f8014ba33810fd2c5c",
      graph: { width: 500, height: 500 },
      answers: {
        correctAnswer: {
          marks: [{ edge: { x: 0.5, y: 5 }, root: { y: 3, x: 0 }, type: "sine" }]
        }
      },
      toolbarTools: ['sine'],
      element: "pie-element-likert",
      range: {
        min: -7,
        axisLabel: "<i>f</i>(<i>x</i>)",
        max: 7,
        labelStep: 1,
        step: 1
      }
    };
    const session = {
      answer: [
        { edge: { x: -0.5, y: 1 }, root: { y: 3, x: 0 }, type: "sine" },
      ]
    };

    const mod = await model(m, session, {});
    const result = await outcome(mod, session, {});

    expect(result.score).toEqual(1);
  });

  it('Lines are correctly scored (ch4126)', async () => {
    const m = {
      id: "4028e4a24ca05186014cbae62f752be7",
      graph: {
        height: 500,
        width: 500
      },
      answers: {
        correctAnswer: {
          marks: [
            { type: "line", to: { x: 0, y: -4 }, from: { y: -6, x: 0 } },
            { from: { y: 0, x: -6 }, type: "line", to: { x: 4, y: 0 } },
            { from: { x: -4, y: -6 }, type: "line", to: { x: -4, y: -4 } }
          ]
        }
      },
      toolbarTools: ['line'],
      element: "pie-element-likert",
      range: {
        min: -11,
        axisLabel: "f(x)",
        max: 11,
        labelStep: 1,
        step: 1
      },
      title: "Electric Field as a Function of Location",
      rationale: "Rationale",
      prompt: "Prompt",
      labels: {},
      domain: {
        min: -11,
        axisLabel: "x",
        max: 11,
        labelStep: 1,
        step: 1
      }
    };
    const session = {
      answer: [
        { from: { x: 0, y: 1 }, type: "line", to: { x: 0, y: 3 } },
        { from: { x: 1, y: 0 }, type: "line", to: { x: 3, y: 0 } }
      ]
    };

    const mod = await model(m, session, {});
    const result = await outcome(mod, session, {});

    expect(result.score).toEqual(0.67);

    const session2 = {
      answer: [
        { from: { x: 0, y: 3 }, type: "line", to: { x: 0, y: 1 } },
        { from: { x: 3, y: 0 }, type: "line", to: { x: 1, y: 0 } }
      ]
    };

    expect((await outcome(await model(m, session2, {}), session2, {})).score).toEqual(0.67);

    const session3 = {
      answer: [
        { from: { x: 0, y: 3 }, type: "line", to: { x: 0, y: 1 } },
        { from: { x: 3, y: 0 }, type: "line", to: { x: 1, y: 0 } },
        { from: { x: -4, y: -8 }, type: "line", to: { x: -4, y: 4 } }
      ]
    };

    expect((await outcome(await model(m, session3, {}), session3, {})).score).toEqual(1);
  });
});

describe('createCorrectResponseSession', () => {
  const question = {
    toolbarTools: [
      'point',
      'circle',
      'polygon',
      'segment',
      'ray',
      'vector',
      'line',
      'sine',
      'parabola',
      'label'
    ],
    answers: {
      alternate1: {
        name: 'Alternate 1',
        marks: [
          {
            type: 'segment',
            from: { x: 0, y: 0 },
            to: { x: 1, y: 1 }
          },
          {
            type: 'point',
            x: 3,
            y: 3,
            label: 'Point',
            showLabel: true
          }
        ]
      },
      correctAnswer: {
        name: 'Correct Answer',
        marks: [
          {
            type: 'point',
            x: 0,
            y: 0
          }
        ]
      }
    },
    backgroundMarks: [],
    prompt: 'Here goes item stem!',
    rationale: 'Rationale goes here!',
    scoringType: 'partial scoring'
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor'
    });

    expect(sess).toEqual({
      answer: [
        {
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 }
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }
      ],
      id: '1'
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor'
    });

    expect(sess).toEqual({
      answer: [
        {
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 }
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }
      ],
      id: '1'
    });
  });

  it('returns null if mode is evaluate', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'evaluate',
      role: 'instructor'
    });

    expect(noResult).toBeNull();
  });

  it('returns null if role is student', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'student'
    });

    expect(noResult).toBeNull();
  });
});
