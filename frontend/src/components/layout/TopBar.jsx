import { Menu, Bell, Upload } from 'lucide-react';
import { useUI } from '../../context';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context';
import { handleApiSuccess } from '../../utils/errorHandler';

export default function TopBar({ title, subtitle }) {
  const { user } = useAuth();
  const {
    setMobileSidebarOpen,
    searchQuery,
    setSearchQuery,
    openUploadModal,
  } = useUI();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          {title && (
            <div>
              <h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1>
              {subtitle && (
                <p className="truncate text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="hidden flex-1 max-w-md md:block">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openUploadModal} className="hidden sm:inline-flex">
            <Upload className="h-4 w-4" />
            Upload
          </Button>

          <button
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            onClick={() => handleApiSuccess('No new notifications')}
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <Avatar
            name={user?.full_name || user?.email}
            src={user?.avatar}
            size="sm"
            className="md:hidden"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 pb-3 md:hidden">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>
    </header>
  );
}
