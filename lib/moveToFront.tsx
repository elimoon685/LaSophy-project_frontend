
export function moveToFrontImmutable<T>(arr: T[], pred: (x: T) => boolean): T[] {
  const idx = arr.findIndex(pred);
  if (idx <= 0) return arr;
  return [arr[idx], ...arr.slice(0, idx), ...arr.slice(idx + 1)];
}