import { useEffect, useState } from 'react';
import { useFiles, useUI } from '../../context';
import FileExplorer from '../../components/files/FileExplorer';
import FileToolbar from '../../components/files/FileToolbar';
import RenameModal from '../../components/files/RenameModal';

export default function FavoritesPage() {
  const {
    favoriteFiles,
    loading,
    fetchFavoriteFiles,
    downloadFile,
    renameItem,
    deleteItem,
    toggleFavorite,
  } = useFiles();

  const { viewMode, setViewMode, sortBy, setSortBy, openUploadModal } = useUI();
  const [renameItemState, setRenameItemState] = useState(null);

  useEffect(() => {
    fetchFavoriteFiles({ ordering: sortBy });
  }, [fetchFavoriteFiles, sortBy]);

  const handleRename = async (item, newName) => {
    const success = await renameItem(item, newName);
    if (success) fetchFavoriteFiles({ ordering: sortBy });
    return success;
  };

  const handleDelete = async (item) => {
    const success = await deleteItem(item);
    if (success) fetchFavoriteFiles({ ordering: sortBy });
  };

  const handleToggleFavorite = async (file) => {
    const success = await toggleFavorite(file);
    if (success) fetchFavoriteFiles({ ordering: sortBy });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Favorites</h2>
        <p className="text-slate-500">Your starred files for quick access</p>
      </div>

      <FileToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onUpload={openUploadModal}
        onCreateFolder={() => {}}
      />

      <FileExplorer
        folders={[]}
        files={favoriteFiles}
        viewMode={viewMode}
        loading={loading}
        emptyTitle="No favorites yet"
        emptyDescription="Star files to add them to your favorites for quick access."
        onFileDownload={downloadFile}
        onRename={setRenameItemState}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
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
