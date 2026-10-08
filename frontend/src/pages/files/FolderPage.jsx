import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFiles, useUI } from '../../context';
import { useDebounce } from '../../hooks/useDebounce';
import FileExplorer from '../../components/files/FileExplorer';
import FileToolbar from '../../components/files/FileToolbar';
import BreadcrumbNav from '../../components/files/BreadcrumbNav';
import RenameModal from '../../components/files/RenameModal';

export default function FolderPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const {
    files,
    folders,
    breadcrumb,
    currentFolder,
    loading,
    fetchFolderContents,
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
    if (folderId) {
      fetchFolderContents(folderId, { ordering: sortBy });
    }
  }, [folderId, fetchFolderContents, sortBy]);

  useEffect(() => {
    if (debouncedSearch) {
      searchFiles(debouncedSearch, { folder: folderId, ordering: sortBy });
    } else {
      loadContents();
    }
  }, [folderId, debouncedSearch, sortBy, loadContents, searchFiles]);

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
      <div className="mb-4">
        <BreadcrumbNav items={breadcrumb} />
        {currentFolder && (
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{currentFolder.name}</h2>
        )}
      </div>

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
        emptyTitle="This folder is empty"
        emptyDescription="Upload files or create subfolders to organize your content."
        emptyActionLabel="Upload Files"
        onEmptyAction={openUploadModal}
        onFolderOpen={handleFolderOpen}
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
