import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api';
import { handleApiError, handleApiSuccess } from '../../utils/errorHandler';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== passwordConfirm) newErrors.password_confirm = 'Passwords do not match';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, uid, new_password: password });
      setSuccess(true);
      handleApiSuccess('Password reset successfully');
    } catch (err) {
      handleApiError(err, 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle={success ? 'Your password has been updated' : 'Enter your new password below'}
    >
      {success ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-sm text-slate-600">
            Your password has been reset successfully.
          </p>
          <Link to={ROUTES.LOGIN} className="mt-6 inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Sign in with new password
          </Link>
        </div>
      ) : !token ? (
        <div className="text-center">
          <p className="text-sm text-slate-600">
            This password reset link is invalid or missing required parameters.
          </p>
          <Link to={ROUTES.FORGOT_PASSWORD} className="mt-6 inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Request a new reset link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
            placeholder="Enter new password"
            icon={Lock}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            label="Confirm new password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
              setErrors((prev) => ({ ...prev, password_confirm: '' }));
            }}
            placeholder="Confirm new password"
            icon={Lock}
            error={errors.password_confirm}
            autoComplete="new-password"
          />

          <Button type="submit" className="w-full" loading={loading}>
            Reset password
          </Button>

          <Link
            to={ROUTES.LOGIN}
            className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
