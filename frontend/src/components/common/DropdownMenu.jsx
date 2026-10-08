import { useState, useRef, useEffect, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';

export default function DropdownMenu({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        close();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    const menuItems = menuRef.current?.querySelectorAll(
      'button:not([disabled])'
    );
    if (menuItems?.length) {
      menuItems[0].focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close]);

  const handleItemClick = (item) => {
    if (!item.disabled) {
      item.onClick?.();
      setOpen(false);
    }
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!open);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (e, index) => {
    const enabledItems = items.filter((item) => !item.divider && !item.disabled);
    const currentIndex = enabledItems.indexOf(items.filter((item) => !item.divider)[index]);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let nextIndex = index + 1;
      while (nextIndex < items.length && (items[nextIndex].divider || items[nextIndex].disabled)) {
        nextIndex++;
      }
      if (nextIndex < items.length) {
        menuRef.current?.querySelectorAll('button:not([disabled])')[getNextFocusableIndex(nextIndex)]?.focus();
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let prevIndex = index - 1;
      while (prevIndex >= 0 && (items[prevIndex].divider || items[prevIndex].disabled)) {
        prevIndex--;
      }
      if (prevIndex >= 0) {
        menuRef.current?.querySelectorAll('button:not([disabled])')[getNextFocusableIndex(prevIndex)]?.focus();
      }
    }
  };

  const getNextFocusableIndex = (index) => {
    let count = 0;
    for (let i = 0; i < index; i++) {
      if (!items[i].divider && !items[i].disabled) count++;
    }
    return count;
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger || (
          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div
          role="menu"
          className={`
            absolute z-20 mt-1 min-w-[160px] rounded-lg border border-slate-200
            bg-white py-1 shadow-lg
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {items.map((item, index) =>
            item.divider ? (
              <div key={`divider-${index}`} role="separator" className="my-1 border-t border-slate-100" />
            ) : (
              <button
                key={item.label}
                role="menuitem"
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleMenuKeyDown(e, index)}
                disabled={item.disabled}
                className={`
                  flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors
                  ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
