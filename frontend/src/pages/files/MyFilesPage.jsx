import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFiles, useUI } from '../../context';
import { useDebounce } from '../../hooks/useDebounce';
import FileExplorer from '../../components/files/FileExplorer';
import FileToolbar from '../../components/files/FileToolbar';
import RenameModal from '../../components/files/RenameModal';

export default function MyFilesPage() {
  const navigate = useNavigate();
  const {
    files,
    folders,
    loading,
    fetchRootContents,
    downloadFile,
    renameItem,
    deleteItem,
    toggleFavorite,
    searchFiles,
  } = useFiles();

  const {
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    openUploadModal,
    openCreateFolderModal,
  } = useUI();

  const [renameItemState, setRenameItemState] = useState(null);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const loadContents = useCallback(() => {
    fetchRootContents({ ordering: sortBy });
  }, [fetchRootContents, sortBy]);

  useEffect(() => {
    if (debouncedSearch) {
      searchFiles(debouncedSearch, { ordering: sortBy });
    } else {
      loadContents();
    }
  }, [debouncedSearch, sortBy, loadContents, searchFiles]);

  const handleFolderOpen = (folder) => {
    navigate(`/files/folder/${folder.id}`);
  };

  const handleRename = async (item, newName) => {
    const success = await renameItem(item, newName);
    if (success) loadContents();
    return success;
  };

  const handleDelete = async (item) => {
    const success = await deleteItem(item);
    if (success) loadContents();
  };

  const handleToggleFavorite = async (file) => {
    const success = await toggleFavorite(file);
    if (success) loadContents();
  };

  return (
    <div>
      <FileToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onUpload={openUploadModal}
        onCreateFolder={openCreateFolderModal}
      />

      <FileExplorer
        folders={folders}
        files={files}
        viewMode={viewMode}
        loading={loading}
        onFolderOpen={handleFolderOpen}
        onFileDownload={downloadFile}
        onRename={setRenameItemState}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        emptyActionLabel="Upload Files"
        onEmptyAction={openUploadModal}
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
