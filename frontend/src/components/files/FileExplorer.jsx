import { FILE_VIEW_MODES } from '../../constants/routes';
import FileCard from './FileCard';
import FolderCard from './FolderCard';
import FileListItem from './FileListItem';
import FolderListItem from './FolderListItem';
import { FileCardSkeleton, FileListSkeleton } from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';
import { FolderOpen } from 'lucide-react';

export default function FileExplorer({
  folders = [],
  files = [],
  viewMode = FILE_VIEW_MODES.GRID,
  loading = false,
  emptyTitle = 'No files yet',
  emptyDescription = 'Upload files or create folders to get started.',
  emptyActionLabel,
  onEmptyAction,
  onFolderOpen,
  onFileDownload,
  onRename,
  onDelete,
  onToggleFavorite,
}) {
  if (loading) {
    return viewMode === FILE_VIEW_MODES.GRID ? (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <FileCardSkeleton key={i} />
        ))}
      </div>
    ) : (
      <FileListSkeleton rows={8} />
    );
  }

  const isEmpty = folders.length === 0 && files.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon={FolderOpen}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  if (viewMode === FILE_VIEW_MODES.LIST) {
    return (
      <div className="space-y-2">
        {folders.map((folder) => (
          <FolderListItem
            key={`folder-${folder.id}`}
            folder={folder}
            onOpen={onFolderOpen}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
        {files.map((file) => (
          <FileListItem
            key={`file-${file.id}`}
            file={file}
            onDownload={onFileDownload}
            onRename={onRename}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {folders.map((folder) => (
        <FolderCard
          key={`folder-${folder.id}`}
          folder={folder}
          onOpen={onFolderOpen}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
      {files.map((file) => (
        <FileCard
          key={`file-${file.id}`}
          file={file}
          onDownload={onFileDownload}
          onRename={onRename}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
