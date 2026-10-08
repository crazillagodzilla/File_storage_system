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

export default function FileCard({ file, onDownload, onRename, onDelete, onToggleFavorite }) {
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
    <div className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-200 hover:shadow-md">
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu
          trigger={
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          }
          items={menuItems}
        />
      </div>

      {file.is_favorite && (
        <Star className="absolute left-3 top-3 h-4 w-4 fill-amber-400 text-amber-400" />
      )}

      <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-7 w-7 ${color}`} />
      </div>

      <h3 className="truncate text-center text-sm font-medium text-slate-900" title={file.name}>
        {file.name}
      </h3>
      <p className="mt-1 text-center text-xs text-slate-500">
        {formatBytes(file.size)} · {formatDate(file.updated_at)}
      </p>
    </div>
  );
}
