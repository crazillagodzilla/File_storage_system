import { useEffect, useState } from 'react';
import { useFiles, useUI } from '../../context';
import FileExplorer from '../../components/files/FileExplorer';
import FileToolbar from '../../components/files/FileToolbar';
import RenameModal from '../../components/files/RenameModal';

export default function SharedPage() {
  const {
    sharedFiles,
    loading,
    fetchSharedFiles,
    downloadFile,
    renameItem,
    deleteItem,
    toggleFavorite,
  } = useFiles();

  const { viewMode, setViewMode, sortBy, setSortBy } = useUI();
  const [renameItemState, setRenameItemState] = useState(null);

  useEffect(() => {
    fetchSharedFiles({ ordering: sortBy });
  }, [fetchSharedFiles, sortBy]);

  const handleRename = async (item, newName) => {
    const success = await renameItem(item, newName);
    if (success) fetchSharedFiles({ ordering: sortBy });
    return success;
  };

  const handleDelete = async (item) => {
    const success = await deleteItem(item);
    if (success) fetchSharedFiles({ ordering: sortBy });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Shared with me</h2>
        <p className="text-slate-500">Files and folders others have shared with you</p>
      </div>

      <FileToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showUpload={false}
        showCreateFolder={false}
      />

      <FileExplorer
        folders={[]}
        files={sharedFiles}
        viewMode={viewMode}
        loading={loading}
        emptyTitle="Nothing shared yet"
        emptyDescription="When someone shares files with you, they'll appear here."
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
