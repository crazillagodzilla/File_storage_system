import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import UploadModal from '../files/UploadModal';
import CreateFolderModal from '../files/CreateFolderModal';
import { useUI, useFiles } from '../../context';

export default function AppLayout({ title, subtitle }) {
  const {
    uploadModalOpen,
    closeUploadModal,
    createFolderModalOpen,
    closeCreateFolderModal,
    openCreateFolderModal,
  } = useUI();

  const {
    uploadFiles,
    uploadProgress,
    createFolder,
    currentFolder,
    fetchRootContents,
    fetchFolderContents,
  } = useFiles();

  const handleUpload = async (files) => {
    const folderId = currentFolder?.id ?? null;
    const success = await uploadFiles(files, folderId);
    if (success) {
      if (folderId) {
        await fetchFolderContents(folderId);
      } else {
        await fetchRootContents();
      }
    }
    return success;
  };

  const handleCreateFolder = async (name, parentIdFromModal = null) => {
    const parentId = parentIdFromModal ?? currentFolder?.id ?? null;
    const success = await createFolder(name, parentId);
    if (success) {
      if (parentId) {
        await fetchFolderContents(parentId);
      } else {
        await fetchRootContents();
      }
    }
    return success;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ openCreateFolderModal }} />
        </main>
      </div>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={closeUploadModal}
        onUpload={handleUpload}
        uploadProgress={uploadProgress}
        folderId={currentFolder?.id}
      />

      <CreateFolderModal
        isOpen={createFolderModalOpen}
        onClose={closeCreateFolderModal}
        onCreate={handleCreateFolder}
        parentId={currentFolder?.id}
      />
    </div>
  );
}
