export function formatBytes(bytes, decimals = 1) {
  if (bytes == null || bytes < 0 || isNaN(bytes)) return '0 B';
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatStoragePercentage(used, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}
