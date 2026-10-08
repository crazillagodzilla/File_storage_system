import { Grid3X3, LayoutGrid, List, SortAsc, Upload } from 'lucide-react';
import Button from '../common/Button';
import { FILE_VIEW_MODES, SORT_OPTIONS } from '../../constants/routes';

export default function FileToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onUpload,
  onCreateFolder,
  showSort = true,
  showUpload = true,
  showCreateFolder = true,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {showUpload && (
          <Button size="sm" onClick={onUpload}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        )}
        {showCreateFolder && (
          <Button size="sm" variant="secondary" onClick={onCreateFolder}>
            <Grid3X3 className="h-4 w-4" />
            New Folder
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showSort && (
          <div className="relative">
            <SortAsc className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-8 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex rounded-lg border border-slate-300 bg-white p-0.5">
          <button
            onClick={() => onViewModeChange(FILE_VIEW_MODES.GRID)}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === FILE_VIEW_MODES.GRID
                ? 'bg-brand-100 text-brand-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange(FILE_VIEW_MODES.LIST)}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === FILE_VIEW_MODES.LIST
                ? 'bg-brand-100 text-brand-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
