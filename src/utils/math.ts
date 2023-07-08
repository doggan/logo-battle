export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export function formatPercentage(ratio: number) {
  return `${(ratio * 100).toFixed(1)}`;
}
