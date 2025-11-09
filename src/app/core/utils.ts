export function anyToString(val: unknown): string {
  if (typeof val === 'string') {
    return val;
  }
  if (val === undefined) {
    return 'undefined';
  }
  return JSON.stringify(val);
}
