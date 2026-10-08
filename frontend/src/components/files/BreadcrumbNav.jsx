import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function BreadcrumbNav({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        to={ROUTES.MY_FILES}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">My Files</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-slate-300" />
            {isLast ? (
              <span className="truncate px-2 py-1 font-medium text-slate-900 max-w-[200px]">
                {item.name}
              </span>
            ) : (
              <Link
                to={`/files/folder/${item.id}`}
                className="truncate rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 max-w-[150px]"
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
