import { createContext, useContext, useState } from 'react';
import { FILE_VIEW_MODES } from '../constants/routes';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar_collapsed', false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage('file_view_mode', FILE_VIEW_MODES.GRID);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-updated_at');

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => setUploadModalOpen(false);

  const openCreateFolderModal = () => setCreateFolderModalOpen(true);
  const closeCreateFolderModal = () => setCreateFolderModalOpen(false);

  const clearSearch = () => setSearchQuery('');

  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    toggleSidebar,
    viewMode,
    setViewMode,
    uploadModalOpen,
    openUploadModal,
    closeUploadModal,
    createFolderModalOpen,
    openCreateFolderModal,
    closeCreateFolderModal,
    searchQuery,
    setSearchQuery,
    clearSearch,
    sortBy,
    setSortBy,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export default UIContext;
