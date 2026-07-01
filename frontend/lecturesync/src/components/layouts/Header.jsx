import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { LogOut, Menu, UserCircle2 } from "lucide-react";

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-sm sm:px-6">
      <div className="flex items-center justify-between gap-3">
        {/* Left: hamburger + page label */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <p className="hidden text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
            LectureSync
          </p>
        </div>

        {/* Right: user pill + logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 shadow-sm">
            <UserCircle2 className="h-4 w-4 flex-shrink-0 text-slate-500" />
            <span className="hidden max-w-[120px] truncate font-medium sm:inline">
              {user?.name || "Guest"}
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold capitalize text-blue-700">
              {user?.role || "—"}
            </span>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 sm:px-4"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
