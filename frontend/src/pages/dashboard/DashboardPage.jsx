import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FolderOpen,
  HardDrive,
  Star,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { useFiles } from '../../context';
import { useUI } from '../../context';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import StorageUsageWidget from '../../components/common/StorageUsageWidget';
import FileCard from '../../components/files/FileCard';
import { formatBytes } from '../../utils/formatBytes';
import { ROUTES } from '../../constants/routes';

function StatCard({ icon: Icon, label, value, color, to }) {
  const content = (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

export default function DashboardPage() {
  const {
    files,
    folders,
    recentFiles,
    favoriteFiles,
    storageUsage,
    loading,
    fetchRootContents,
    fetchRecentFiles,
    fetchFavoriteFiles,
    fetchStorageUsage,
    downloadFile,
    toggleFavorite,
    deleteItem,
  } = useFiles();

  const { openUploadModal } = useUI();

  useEffect(() => {
    fetchStorageUsage();
    fetchRootContents({ page_size: 5 });
    fetchRecentFiles({ page_size: 6 });
    fetchFavoriteFiles({ page_size: 4 });
  }, [fetchStorageUsage, fetchRootContents, fetchRecentFiles, fetchFavoriteFiles]);

  if (loading && !storageUsage) {
    return <DashboardSkeleton />;
  }

  const totalFiles = storageUsage?.file_count ?? files.length;
  const totalFolders = storageUsage?.folder_count ?? folders.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Overview of your cloud storage</p>
        </div>
        <button
          onClick={openUploadModal}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total Files"
          value={totalFiles}
          color="bg-blue-50 text-blue-600"
          to={ROUTES.MY_FILES}
        />
        <StatCard
          icon={FolderOpen}
          label="Folders"
          value={totalFolders}
          color="bg-amber-50 text-amber-600"
          to={ROUTES.MY_FILES}
        />
        <StatCard
          icon={Star}
          label="Favorites"
          value={favoriteFiles.length}
          color="bg-purple-50 text-purple-600"
          to={ROUTES.FAVORITES}
        />
        <StatCard
          icon={HardDrive}
          label="Storage Used"
          value={formatBytes(storageUsage?.used_bytes ?? 0)}
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Files</h3>
              <Link
                to={ROUTES.RECENT}
                className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {recentFiles.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {recentFiles.slice(0, 6).map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDownload={downloadFile}
                    onDelete={deleteItem}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">
                No recent files. Upload something to get started.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Storage</h3>
            <StorageUsageWidget
              used={storageUsage?.used_bytes ?? 0}
              total={storageUsage?.total_bytes}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Favorites</h3>
              <Link to={ROUTES.FAVORITES} className="text-sm text-brand-600 hover:text-brand-700">
                View all
              </Link>
            </div>
            {favoriteFiles.length > 0 ? (
              <ul className="space-y-3">
                {favoriteFiles.slice(0, 4).map((file) => (
                  <li key={file.id} className="flex items-center gap-3 text-sm">
                    <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                    <span className="truncate text-slate-700">{file.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No favorites yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
