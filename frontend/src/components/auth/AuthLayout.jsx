import { Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Cloud className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">CloudVault</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Your files, everywhere you need them.
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Secure cloud storage with seamless access across all your devices.
            Store, share, and collaborate with ease.
          </p>
        </div>

        <p className="text-sm text-brand-200">
          Trusted by teams worldwide for secure file management.
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold text-slate-900">
              CloudVault
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
