import { Edit3, FolderOpen, MoreVertical, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import DropdownMenu from '../common/DropdownMenu';

export default function FolderCard({ folder, onOpen, onRename, onDelete }) {
  const menuItems = [
    { label: 'Open', icon: FolderOpen, onClick: () => onOpen?.(folder) },
    { label: 'Rename', icon: Edit3, onClick: () => onRename?.(folder) },
    { divider: true },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => onDelete?.(folder) },
  ];

  return (
    <div
      className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-amber-200 hover:shadow-md"
      onClick={() => onOpen?.(folder)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen?.(folder)}
      role="button"
      tabIndex={0}
    >
      <div
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu
          trigger={
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          }
          items={menuItems}
        />
      </div>

      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50">
        <FolderOpen className="h-7 w-7 text-amber-500" />
      </div>

      <h3 className="truncate text-center text-sm font-medium text-slate-900" title={folder.name}>
        {folder.name}
      </h3>
      <p className="mt-1 text-center text-xs text-slate-500">
        {folder.item_count ?? 0} items · {formatDate(folder.updated_at)}
      </p>
    </div>
  );
}
