const MAX_LENGTH = 10000;

type Segment = {
  index: number;
  from: number;
  to: number;
};

export default class SegmentList {
  _defaultSegmentSize: number;
  _segments: Map<number, Segment>;

  constructor(defaultSegmentSize: number) {
    this._defaultSegmentSize = defaultSegmentSize;
    this._segments = new Map();
  }

  peekAt(index: number): Segment {
    const seg = this._segments.get(index);
    if (seg) {
      return seg;
    }
    const defaultSegmentSize = this._defaultSegmentSize;
    let from = index * defaultSegmentSize;
    for (const [ii, seg] of this._segments) {
      if (seg.index < index) {
        const segSize = seg.to - seg.from;
        from += segSize - defaultSegmentSize;
      } else {
        break;
      }
    }
    return {
      index,
      from,
      to: from + defaultSegmentSize,
    };
  }

  setSize(index: number, size: number): SegmentList {
    const defaultSegmentSize = this._defaultSegmentSize;
    const seg = this.peekAt(index);

    this._segments.set(index, {
      from: seg.from,
      to: seg.from + size,
      index,
    });

    const deltaSize = size - defaultSegmentSize;

    for (const [ii, seg] of this._segments) {
      if (seg.index > index) {
        this._segments.set(index, {
          from: seg.from + deltaSize,
          to: seg.to + deltaSize,
          index,
        });
      }
    }

    return this;
  }

  // View within range.
  view(from: number, to: number): Segment[] {
    const result: Segment[] = [];
    const size = this._defaultSegmentSize;
    let upperBound = 0;
    for (let ii = 0; ii < MAX_LENGTH; ii++) {
      const seg = this._segments.get(ii) || {
        index: ii,
        from: upperBound,
        to: upperBound + size,
      };
      upperBound = seg.to;
      if (seg.to < from) {
        continue;
      }
      if (
        (seg.from >= from && seg.from <= to) ||
        (seg.to <= to && seg.to >= from)
      ) {
        result.push(seg);
      }
      if (seg.from > to) {
        break;
      }
    }
    return result;
  }

  //  at point.
  point(pos: number): Segment | null {
    let left = 0;
    let right = MAX_LENGTH;
    while (true) {
      const middle = ((left + right) / 2) | 0;
      const seg = this.peekAt(middle);
      if (pos >= seg.from && pos <= seg.to) {
        return seg;
      }
      // console.log(pos, seg, left, right, middle);
      if (pos <= seg.from) {
        right = middle;
      }
      if (pos >= seg.to) {
        left = middle;
      }
      if (left === right) {
        return null;
      }
    }
  }
}
