import { FolderOpen } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import DropdownMenu from '../common/DropdownMenu';
import { Edit3, MoreVertical, Trash2 } from 'lucide-react';

export default function FolderListItem({ folder, onOpen, onRename, onDelete }) {
  const menuItems = [
    { label: 'Open', icon: FolderOpen, onClick: () => onOpen?.(folder) },
    { label: 'Rename', icon: Edit3, onClick: () => onRename?.(folder) },
    { divider: true },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => onDelete?.(folder) },
  ];

  return (
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50"
      onClick={() => onOpen?.(folder)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen?.(folder)}
      role="button"
      tabIndex={0}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
        <FolderOpen className="h-5 w-5 text-amber-500" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{folder.name}</p>
        <p className="text-xs text-slate-500">
          {folder.item_count ?? 0} items · {formatDate(folder.updated_at)}
        </p>
      </div>

      <DropdownMenu
        trigger={
          <button
            className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        }
        items={menuItems}
      />
    </div>
  );
}
