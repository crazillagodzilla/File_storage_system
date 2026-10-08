import { useEffect, useState } from 'react';
import { useFiles, useUI } from '../../context';
import FileExplorer from '../../components/files/FileExplorer';
import FileToolbar from '../../components/files/FileToolbar';
import RenameModal from '../../components/files/RenameModal';

export default function RecentPage() {
  const {
    recentFiles,
    loading,
    fetchRecentFiles,
    downloadFile,
    renameItem,
    deleteItem,
    toggleFavorite,
  } = useFiles();

  const { viewMode, setViewMode, sortBy, setSortBy, openUploadModal } = useUI();
  const [renameItemState, setRenameItemState] = useState(null);

  useEffect(() => {
    fetchRecentFiles({ ordering: sortBy });
  }, [fetchRecentFiles, sortBy]);

  const handleRename = async (item, newName) => {
    const success = await renameItem(item, newName);
    if (success) fetchRecentFiles({ ordering: sortBy });
    return success;
  };

  const handleDelete = async (item) => {
    const success = await deleteItem(item);
    if (success) fetchRecentFiles({ ordering: sortBy });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Recent Files</h2>
        <p className="text-slate-500">Files you&apos;ve accessed recently</p>
      </div>

      <FileToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onUpload={openUploadModal}
        onCreateFolder={() => {}}
        showSort
      />

      <FileExplorer
        folders={[]}
        files={recentFiles}
        viewMode={viewMode}
        loading={loading}
        emptyTitle="No recent files"
        emptyDescription="Files you open or modify will appear here."
        emptyActionLabel="Upload Files"
        onEmptyAction={openUploadModal}
        onFileDownload={downloadFile}
        onRename={setRenameItemState}
        onDelete={handleDelete}
        onToggleFavorite={toggleFavorite}
      />

      <RenameModal
        isOpen={!!renameItemState}
        onClose={() => setRenameItemState(null)}
        item={renameItemState}
        onRename={handleRename}
      />
    </div>
  );
}
