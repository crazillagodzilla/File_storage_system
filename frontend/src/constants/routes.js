export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/',
  MY_FILES: '/files',
  FOLDER: '/files/folder/:folderId',
  RECENT: '/recent',
  FAVORITES: '/favorites',
  SHARED: '/shared',
  TRASH: '/trash',
  SETTINGS: '/settings',
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'My Files', path: ROUTES.MY_FILES, icon: 'FolderOpen' },
  { label: 'Recent', path: ROUTES.RECENT, icon: 'Clock' },
  { label: 'Favorites', path: ROUTES.FAVORITES, icon: 'Star' },
  { label: 'Shared', path: ROUTES.SHARED, icon: 'Users' },
  { label: 'Trash', path: ROUTES.TRASH, icon: 'Trash2' },
];

export const FILE_VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: '-name', label: 'Name (Z-A)' },
  { value: '-updated_at', label: 'Date modified (newest)' },
  { value: 'updated_at', label: 'Date modified (oldest)' },
  { value: '-size', label: 'Size (largest)' },
  { value: 'size', label: 'Size (smallest)' },
];

export const STORAGE_LIMIT_BYTES = 15 * 1024 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = '*/*';

export const MAX_UPLOAD_SIZE_MB = 100;
