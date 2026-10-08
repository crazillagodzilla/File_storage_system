import { useEffect, useState } from 'react';
import { RotateCcw, Trash2, MoreVertical } from 'lucide-react';
import { useFiles, useUI } from '../../context';
import { formatDate } from '../../utils/formatDate';
import { formatBytes } from '../../utils/formatBytes';
import { getFileIconConfig } from '../../utils/getFileIcon';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { FileListSkeleton } from '../../components/common/LoadingSkeleton';
import DropdownMenu from '../../components/common/DropdownMenu';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function TrashPage() {
  const {
    trashItems,
    loading,
    fetchTrash,
    restoreFromTrash,
    permanentDelete,
    emptyTrash,
  } = useFiles();

  const { sortBy } = useUI();
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  useEffect(() => {
    fetchTrash({ ordering: sortBy });
  }, [fetchTrash, sortBy]);

  const handleRestore = async (id) => {
    const success = await restoreFromTrash(id);
    if (success) fetchTrash();
  };

  const handlePermanentDelete = async (id) => {
    setActionLoading(true);
    const success = await permanentDelete(id);
    setActionLoading(false);
    setConfirmDelete(null);
    if (success) fetchTrash();
  };

  const handleEmptyTrash = async () => {
    setActionLoading(true);
    const success = await emptyTrash();
    setActionLoading(false);
    setConfirmEmpty(false);
    if (success) fetchTrash();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Trash</h2>
          <p className="text-slate-500">Items in trash are permanently deleted after 30 days</p>
        </div>
        {trashItems.length > 0 && (
          <Button variant="danger" onClick={() => setConfirmEmpty(true)}>
            <Trash2 className="h-4 w-4" />
            Empty Trash
          </Button>
        )}
      </div>

      {loading ? (
        <FileListSkeleton rows={5} />
      ) : trashItems.length === 0 ? (
        <EmptyState
          icon={Trash2}
          title="Trash is empty"
          description="Deleted files and folders will appear here."
        />
      ) : (
        <div className="space-y-2">
          {trashItems.map((item) => {
            const { icon: Icon, color, bg } = getFileIconConfig(item);
            const menuItems = [
              {
                label: 'Restore',
                icon: RotateCcw,
                onClick: () => handleRestore(item.id),
              },
              { divider: true },
              {
                label: 'Delete permanently',
                icon: Trash2,
                danger: true,
                onClick: () => setConfirmDelete(item),
              },
            ];

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    Deleted {formatDate(item.deleted_at)} · {formatBytes(item.size)}
                  </p>
                </div>
                <DropdownMenu
                  trigger={
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  }
                  items={menuItems}
                />
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handlePermanentDelete(confirmDelete?.id)}
        title="Delete permanently?"
        message={`"${confirmDelete?.name}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete permanently"
        danger
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={confirmEmpty}
        onClose={() => setConfirmEmpty(false)}
        onConfirm={handleEmptyTrash}
        title="Empty trash?"
        message="All items in the trash will be permanently deleted. This action cannot be undone."
        confirmLabel="Empty trash"
        danger
        loading={actionLoading}
      />
    </div>
  );
}
