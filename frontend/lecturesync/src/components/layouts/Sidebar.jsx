import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  CalendarCheck,
  X,
} from "lucide-react";

const Sidebar = ({ role, isOpen, onClose }) => {
  const links = [
    {
      label: "Dashboard",
      to: role === "admin" ? "/admin/dashboard" : "/instructor/dashboard",
      icon: LayoutDashboard,
    },
  ];

  if (role === "admin") {
    links.push(
      { label: "Courses", to: "/admin/courses", icon: ClipboardList },
      {
        label: "Assign Lecture",
        to: "/admin/assign-lecture",
        icon: CalendarCheck,
      },
      { label: "Instructors", to: "/admin/instructors", icon: Users },
    );
  }

  const panelLabel = role === "admin" ? "Admin panel" : "Instructor panel";

  return (
    <>
      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Sidebar panel ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-8 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600">
              <CalendarCheck className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              LectureSync
            </span>
          </div>

          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1" role="navigation" aria-label="Sidebar">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 transition ${
                        isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                      }`}
                    />
                    {link.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer label */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {panelLabel}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
