import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, FileProvider, UIProvider } from './context';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import AppLayout from './components/layout/AppLayout';
import { ROUTES } from './constants/routes';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MyFilesPage from './pages/files/MyFilesPage';
import FolderPage from './pages/files/FolderPage';
import RecentPage from './pages/files/RecentPage';
import FavoritesPage from './pages/files/FavoritesPage';
import SharedPage from './pages/files/SharedPage';
import TrashPage from './pages/trash/TrashPage';
import SettingsPage from './pages/settings/SettingsPage';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-300">404</p>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
        <a
          href={ROUTES.DASHBOARD}
          className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FileProvider>
          <UIProvider>
            <Routes>
              <Route
                path={ROUTES.LOGIN}
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path={ROUTES.REGISTER}
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />
              <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={
                  <GuestRoute>
                    <ForgotPasswordPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <GuestRoute>
                    <ResetPasswordPage />
                  </GuestRoute>
                }
              />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                  <Route path={ROUTES.MY_FILES} element={<MyFilesPage />} />
                  <Route path={ROUTES.FOLDER} element={<FolderPage />} />
                  <Route path={ROUTES.RECENT} element={<RecentPage />} />
                  <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
                  <Route path={ROUTES.SHARED} element={<SharedPage />} />
                  <Route path={ROUTES.TRASH} element={<TrashPage />} />
                  <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <ToastContainer
              position="bottom-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              theme="light"
            />
          </UIProvider>
        </FileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
