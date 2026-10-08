# CloudVault — Cloud File Storage Frontend

A production-quality React frontend for a cloud file storage system, inspired by Google Drive, Dropbox, and OneDrive.

## Tech Stack

- **React 19** + **Vite 6**
- **Tailwind CSS 4**
- **React Router 7**
- **Axios** — HTTP client with JWT refresh
- **Lucide React** — Icons
- **React Toastify** — Notifications
- **Context API** — State management

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start dev server
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies `/api` requests to `http://localhost:8000`.

## Project Structure

```
src/
├── api/              # Axios instance & Django REST API services
├── components/
│   ├── auth/         # ProtectedRoute, GuestRoute, AuthLayout
│   ├── common/       # Button, Input, Modal, Skeletons, etc.
│   ├── files/        # FileCard, UploadModal, FileExplorer, etc.
│   └── layout/       # Sidebar, TopBar, AppLayout
├── constants/        # Routes, file types, config
├── context/          # AuthContext, FileContext, UIContext
├── hooks/            # useDebounce, useLocalStorage
├── pages/            # Route pages (auth, dashboard, files, trash, settings)
└── utils/            # formatBytes, formatDate, errorHandler, getFileIcon
```

## Django REST Backend Integration

Set `VITE_API_BASE_URL` in `.env` to your Django API base URL.

### Expected API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login/` | Login (returns `access`, `refresh`, `user`) |
| POST | `/auth/register/` | Register |
| POST | `/auth/logout/` | Logout |
| GET | `/auth/me/` | Current user |
| POST | `/auth/token/refresh/` | Refresh JWT |
| GET | `/files/` | List files |
| POST | `/files/upload/` | Upload file (multipart) |
| GET/PATCH/DELETE | `/files/:id/` | File CRUD |
| GET | `/files/recent/` | Recent files |
| GET | `/files/favorites/` | Favorite files |
| POST/DELETE | `/files/:id/favorite/` | Toggle favorite |
| GET | `/folders/` | List folders |
| POST | `/folders/` | Create folder |
| GET | `/folders/:id/contents/` | Folder contents |
| GET | `/folders/:id/breadcrumb/` | Breadcrumb trail |
| GET | `/storage/` | Storage usage |
| GET | `/trash/` | Trash items |
| POST | `/trash/:id/restore/` | Restore item |
| DELETE | `/trash/:id/permanent/` | Permanent delete |

### Expected Response Shapes

**User:** `{ id, email, full_name, avatar }`

**File:** `{ id, name, size, mime_type, updated_at, is_favorite, is_folder }`

**Folder:** `{ id, name, item_count, updated_at, is_folder: true }`

**Storage:** `{ used_bytes, total_bytes, file_count, folder_count }`

**Paginated lists:** `{ results: [...], count, next, previous }` (or plain array)

## Features

- Collapsible sidebar with mobile responsive navigation
- Top search bar with debounced file search
- Dashboard with stats, recent files, favorites, storage widget
- Grid and list view modes
- Upload modal with drag-and-drop
- Create folder, rename, delete, download, favorites
- Trash with restore and permanent delete
- Settings (profile, security, notifications, storage)
- Loading skeletons and empty states
- JWT auth with automatic token refresh

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```
