import { formatBytes, formatStoragePercentage } from '../../utils/formatBytes';
import { STORAGE_LIMIT_BYTES } from '../../constants/routes';

export default function StorageUsageWidget({
  used = 0,
  total = STORAGE_LIMIT_BYTES,
  collapsed = false,
  className = '',
}) {
  const percentage = formatStoragePercentage(used, total);

  const getBarColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-brand-500';
  };

  const getStrokeColor = () => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#6366f1';
  };

  if (collapsed) {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`} title={`${formatBytes(used)} of ${formatBytes(total)} used`}>
        <div className="relative h-10 w-10">
          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="3"
              strokeDasharray={`${percentage} 100`}
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-slate-50 p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Storage</span>
        <span className="text-slate-500">{percentage}% used</span>
      </div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">
        {formatBytes(used)} of {formatBytes(total)} used
      </p>
    </div>
  );
}
