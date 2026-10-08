import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  LayoutDashboard,
  FolderOpen,
  Clock,
  Star,
  Users,
  Trash2,
  Settings,
  LogOut,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useUI, useFiles } from '../../context';
import { ROUTES, NAV_ITEMS } from '../../constants/routes';
import StorageUsageWidget from '../common/StorageUsageWidget';
import Avatar from '../common/Avatar';

const ICON_MAP = {
  LayoutDashboard,
  FolderOpen,
  Clock,
  Star,
  Users,
  Trash2,
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUI();
  const { storageUsage } = useFiles();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="truncate text-lg font-bold text-slate-900">CloudVault</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:block"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DASHBOARD}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${sidebarCollapsed ? 'justify-center' : ''}`
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 space-y-3">
        <StorageUsageWidget
          used={storageUsage?.used_bytes ?? 0}
          total={storageUsage?.total_bytes}
          collapsed={sidebarCollapsed}
        />

        <NavLink
          to={ROUTES.SETTINGS}
          onClick={() => setMobileSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>

        <div className={`rounded-lg px-3 py-2 ${sidebarCollapsed ? '' : ''}`}>
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar
              name={user?.full_name || user?.email}
              src={user?.avatar}
              size="sm"
            />
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {user?.full_name || 'User'}
                </p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-600 ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Logout"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white
          transition-all duration-300
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
