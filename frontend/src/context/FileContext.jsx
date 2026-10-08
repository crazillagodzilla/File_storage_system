import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { filesApi, foldersApi, storageApi, trashApi } from '../api';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

const FileContext = createContext(null);

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  return [];
};

export function FileProvider({ children }) {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [favoriteFiles, setFavoriteFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [storageUsage, setStorageUsage] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const loading = Object.values(loadingStates).some(Boolean);

  const setLoading = useCallback((key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  }, []);

  const fetchStorageUsage = useCallback(async () => {
    try {
      const { data } = await storageApi.getUsage();
      setStorageUsage(data);
    } catch (error) {
      handleApiError(error, 'Failed to load storage info');
    }
  }, []);

  const fetchRootContents = useCallback(async (params = {}) => {
    setLoading('root', true);
    try {
      const [filesRes, foldersRes] = await Promise.all([
        filesApi.list(params),
        foldersApi.list(params),
      ]);
      setFiles(asArray(filesRes.data));
      setFolders(asArray(foldersRes.data));
      setCurrentFolder(null);
      setBreadcrumb([]);
    } catch (error) {
      handleApiError(error, 'Failed to load files');
    } finally {
      setLoading('root', false);
    }
  }, [setLoading]);

  const fetchFolderContents = useCallback(async (folderId, params = {}) => {
    setLoading('folder', true);
    try {
      const [contentsRes, breadcrumbRes, folderRes] = await Promise.all([
        foldersApi.getContents(folderId, params),
        foldersApi.getBreadcrumb(folderId),
        foldersApi.getById(folderId),
      ]);

      const contents = contentsRes.data;
      setFiles(asArray(contents.files ?? contents.results?.filter((i) => !i.is_folder)));
      setFolders(asArray(contents.folders ?? contents.results?.filter((i) => i.is_folder)));
      setBreadcrumb(breadcrumbRes.data);
      setCurrentFolder(folderRes.data);
    } catch (error) {
      handleApiError(error, 'Failed to load folder');
    } finally {
      setLoading('folder', false);
    }
  }, [setLoading]);

  const fetchRecentFiles = useCallback(async (params = {}) => {
    setLoading('recent', true);
    try {
      const { data } = await filesApi.getRecent(params);
      setRecentFiles(asArray(data));
    } catch (error) {
      handleApiError(error, 'Failed to load recent files');
    } finally {
      setLoading('recent', false);
    }
  }, [setLoading]);

  const fetchFavoriteFiles = useCallback(async (params = {}) => {
    setLoading('favorites', true);
    try {
      const { data } = await filesApi.getFavorites(params);
      setFavoriteFiles(asArray(data));
    } catch (error) {
      handleApiError(error, 'Failed to load favorites');
    } finally {
      setLoading('favorites', false);
    }
  }, [setLoading]);

  const fetchSharedFiles = useCallback(async (params = {}) => {
    setLoading('shared', true);
    try {
      const { data } = await filesApi.getShared(params);
      setSharedFiles(asArray(data));
    } catch (error) {
      handleApiError(error, 'Failed to load shared files');
    } finally {
      setLoading('shared', false);
    }
  }, [setLoading]);

  const fetchTrash = useCallback(async (params = {}) => {
    setLoading('trash', true);
    try {
      const { data } = await trashApi.list(params);
      setTrashItems(asArray(data));
    } catch (error) {
      handleApiError(error, 'Failed to load trash');
    } finally {
      setLoading('trash', false);
    }
  }, [setLoading]);

  const searchFiles = useCallback(async (query, params = {}) => {
    setLoading('search', true);
    try {
      const { data } = await filesApi.search(query, params);
      const results = asArray(data);
      setFiles(results.filter((i) => !i.is_folder));
      setFolders(results.filter((i) => i.is_folder));
    } catch (error) {
      handleApiError(error, 'Search failed');
    } finally {
      setLoading('search', false);
    }
  }, [setLoading]);

  const uploadFiles = useCallback(async (fileList, folderId = null) => {
    const uploads = Array.from(fileList).map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folder', folderId);

      return filesApi.upload(formData, (event) => {
        if (event.total) {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
    });

    try {
      await Promise.all(uploads);
      handleApiSuccess(`${fileList.length} file(s) uploaded`);
      setUploadProgress(0);
      await fetchStorageUsage();
      return true;
    } catch (error) {
      handleApiError(error, 'Upload failed');
      setUploadProgress(0);
      return false;
    }
  }, [fetchStorageUsage]);

  const createFolder = useCallback(async (name, parentId = null) => {
    try {
      const payload = { name };
      if (parentId) payload.parent = parentId;
      await foldersApi.create(payload);
      handleApiSuccess('Folder created');
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to create folder');
      return false;
    }
  }, []);

  const renameItem = useCallback(async (item, newName) => {
    try {
      if (item.is_folder || item.type === 'folder') {
        await foldersApi.update(item.id, { name: newName });
      } else {
        await filesApi.update(item.id, { name: newName });
      }
      handleApiSuccess('Renamed successfully');
      return true;
    } catch (error) {
      handleApiError(error, 'Rename failed');
      return false;
    }
  }, []);

  const deleteItem = useCallback(async (item) => {
    try {
      if (item.is_folder || item.type === 'folder') {
        await foldersApi.delete(item.id);
      } else {
        await filesApi.delete(item.id);
      }
      handleApiSuccess('Moved to trash');
      await fetchStorageUsage();
      return true;
    } catch (error) {
      handleApiError(error, 'Delete failed');
      return false;
    }
  }, [fetchStorageUsage]);

  const toggleFavorite = useCallback(async (file) => {
    try {
      if (file.is_favorite) {
        await filesApi.removeFavorite(file.id);
      } else {
        await filesApi.toggleFavorite(file.id);
      }
      handleApiSuccess(file.is_favorite ? 'Removed from favorites' : 'Added to favorites');
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to update favorite');
      return false;
    }
  }, []);

  const restoreFromTrash = useCallback(async (id) => {
    try {
      await trashApi.restore(id);
      handleApiSuccess('Item restored');
      return true;
    } catch (error) {
      handleApiError(error, 'Restore failed');
      return false;
    }
  }, []);

  const permanentDelete = useCallback(async (id) => {
    try {
      await trashApi.permanentDelete(id);
      handleApiSuccess('Permanently deleted');
      await fetchStorageUsage();
      return true;
    } catch (error) {
      handleApiError(error, 'Delete failed');
      return false;
    }
  }, [fetchStorageUsage]);

  const emptyTrash = useCallback(async () => {
    try {
      await trashApi.emptyTrash();
      handleApiSuccess('Trash emptied');
      await fetchStorageUsage();
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to empty trash');
      return false;
    }
  }, [fetchStorageUsage]);

  const downloadFile = useCallback(async (file) => {
    try {
      const { data } = await filesApi.download(file.id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      handleApiError(error, 'Download failed');
    }
  }, []);

  const value = useMemo(() => ({
    files,
    folders,
    recentFiles,
    favoriteFiles,
    sharedFiles,
    trashItems,
    storageUsage,
    breadcrumb,
    currentFolder,
    loading,
    uploadProgress,
    fetchRootContents,
    fetchFolderContents,
    fetchRecentFiles,
    fetchFavoriteFiles,
    fetchSharedFiles,
    fetchTrash,
    fetchStorageUsage,
    searchFiles,
    uploadFiles,
    createFolder,
    renameItem,
    deleteItem,
    toggleFavorite,
    restoreFromTrash,
    permanentDelete,
    emptyTrash,
    downloadFile,
  }), [
    files, folders, recentFiles, favoriteFiles, sharedFiles, trashItems,
    storageUsage, breadcrumb, currentFolder, loading, uploadProgress,
    fetchRootContents, fetchFolderContents, fetchRecentFiles, fetchFavoriteFiles,
    fetchSharedFiles, fetchTrash, fetchStorageUsage, searchFiles, uploadFiles,
    createFolder, renameItem, deleteItem, toggleFavorite, restoreFromTrash,
    permanentDelete, emptyTrash, downloadFile,
  ]);

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFiles() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
}

export default FileContext;
