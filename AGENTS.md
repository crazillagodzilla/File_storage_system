# AGENTS.md

## Project overview
This repository contains a full-stack file storage application with:
- Frontend: React + Vite in `frontend/`
- Backend: Django REST Framework in `backend/`

The app is a cloud-style file manager similar to Google Drive, with auth, folders, uploaded files, favorites, trash, and storage usage tracking.

## Important directories
- `frontend/src/api/` — API clients and Axios configuration
- `frontend/src/context/` — auth and app state providers
- `frontend/src/components/files/` — upload, browsing, and file UI
- `backend/storage/` — file model, serializer, and upload endpoints
- `backend/folders/` — folder model and APIs
- `backend/accounts/` — authentication and user operations
- `backend/config/` — Django settings and URL routing

## Critical upload bug context
This project previously failed file uploads because the shared Axios client globally forced `Content-Type: application/json` on all requests. File uploads from the frontend send `FormData`, and the backend expects multipart form data for the `file` field.

The fix is in `frontend/src/api/axios.js`:
- remove the default JSON header from the axios instance
- when `config.data instanceof FormData`, delete `Content-Type` so the browser sets the correct multipart boundary automatically
- keep `application/json` for normal API requests

This is the root cause behind the 400 Bad Request seen at `/api/files/upload/`.

## Critical folder creation bug context
A later regression caused folder creation to fail because the backend route for folders was mounted incorrectly. The app was effectively hitting a duplicate or mismatched route prefix, which caused creation requests to resolve incorrectly instead of hitting the `FolderViewSet`.

The fix is in `backend/config/urls.py`:
- mount `folders.urls` under `path("api/", include("folders.urls"))`
- avoid repeating a nested `/api/folders/` include pattern that breaks the router binding

This is the root cause behind failed POSTs to `/api/folders/`.

Another UI bug occurred in the modal: the close button at the top of the dialog was stealing focus from the name input, making it impossible to type. The fix was in `frontend/src/components/common/Modal.jsx`:
- prefer form inputs (`input`, `textarea`, `select`) before the close button when determining the initial focus target

## Backend upload contract
The backend upload endpoint is registered in `backend/storage/urls.py` and handled by `StoredFileViewSet.upload()` in `backend/storage/views.py`.

The serializer in `backend/storage/serializers.py` expects:
- `file` as a `FileField`
- optional `folder` as a primary key for folder placement

The model in `backend/storage/models.py` stores:
- `owner`
- `folder`
- `file`
- `original_name`
- `content_type`
- `size`

## Frontend upload flow
The upload call is initiated in `frontend/src/context/FileContext.jsx`:
- creates a `FormData`
- appends `file`
- appends `folder` when a folder is selected
- calls `filesApi.upload(formData, onUploadProgress)`

The request helper is in `frontend/src/api/files.api.js`:
- `POST /files/upload/`
- passes progress callback to axios upload progress handler

## Development commands
From the frontend:
```bash
cd frontend
npm install
npm run dev
```

From the backend:
```bash
cd backend
python manage.py migrate
python manage.py runserver
```

## Verification
The frontend was verified with:
```bash
cd frontend && npm run build
```
This completed successfully after the upload fix.

The backend folder creation route was also verified with a real authenticated request, which returned HTTP 201 for a valid payload to `/api/folders/` after the routing fix.

## Working conventions
- Prefer minimal, targeted changes over broad rewrites.
- Preserve JWT auth flow and refresh behavior.
- Keep JSON requests JSON; keep multipart uploads as `FormData`.
- Do not add new global request headers that override browser-generated multipart headers.
- Validate with the most focused command available, such as `npm run build` for frontend changes and a real API request when checking routes or auth flows.
- For modal issues, prefer focusing actual form fields over dialog chrome controls.

## Files to inspect first for related issues
- `frontend/src/api/axios.js`
- `frontend/src/context/FileContext.jsx`
- `frontend/src/api/files.api.js`
- `frontend/src/components/common/Modal.jsx`
- `backend/config/urls.py`
- `backend/folders/urls.py`
- `backend/storage/serializers.py`
- `backend/storage/views.py`
- `backend/storage/models.py`
