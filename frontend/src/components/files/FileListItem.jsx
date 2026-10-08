import {
  Download,
  Edit3,
  MoreVertical,
  Star,
  Trash2,
} from 'lucide-react';
import { formatBytes } from '../../utils/formatBytes';
import { formatDate } from '../../utils/formatDate';
import { getFileIconConfig } from '../../utils/getFileIcon';
import DropdownMenu from '../common/DropdownMenu';

export default function FileListItem({ file, onDownload, onRename, onDelete, onToggleFavorite }) {
  const { icon: Icon, color, bg } = getFileIconConfig(file);

  const menuItems = [
    { label: 'Download', icon: Download, onClick: () => onDownload?.(file) },
    { label: 'Rename', icon: Edit3, onClick: () => onRename?.(file) },
    {
      label: file.is_favorite ? 'Remove from favorites' : 'Add to favorites',
      icon: Star,
      onClick: () => onToggleFavorite?.(file),
    },
    { divider: true },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => onDelete?.(file) },
  ];

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
          {file.is_favorite && (
            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
          )}
        </div>
        <p className="text-xs text-slate-500">{formatDate(file.updated_at)}</p>
      </div>

      <span className="hidden text-sm text-slate-500 sm:block">{formatBytes(file.size)}</span>

      <DropdownMenu
        trigger={
          <button className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </button>
        }
        items={menuItems}
      />
    </div>
  );
}
