// Older phone browsers (iOS Safari before 15.4, Chrome before 97) lack these, and the router uses
// them; without them the app throws on start and the page stays blank.
/* eslint-disable no-extend-native */
const proto = Array.prototype as unknown as Record<string, unknown>;
if (!proto.findLast) {
  proto.findLast = function <T>(this: T[], fn: (x: T, i: number, a: T[]) => unknown) {
    for (let i = this.length - 1; i >= 0; i--) if (fn(this[i], i, this)) return this[i];
    return undefined;
  };
}
if (!proto.findLastIndex) {
  proto.findLastIndex = function <T>(this: T[], fn: (x: T, i: number, a: T[]) => unknown) {
    for (let i = this.length - 1; i >= 0; i--) if (fn(this[i], i, this)) return i;
    return -1;
  };
}
if (!proto.at) {
  proto.at = function <T>(this: T[], n: number) {
    const i = Math.trunc(n) || 0;
    return this[i < 0 ? this.length + i : i];
  };
}
export {};
