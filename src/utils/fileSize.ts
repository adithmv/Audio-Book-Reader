export function bytesToMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function bytesToReadable(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return bytesToMB(bytes);
}